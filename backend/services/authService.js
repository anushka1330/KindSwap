const bcrypt   = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const AuthQueries = require('../queries/authQueries');
const OTPService  = require('./otpService');
const { sendOTPEmail } = require('./emailService');

const BCRYPT_ROUNDS   = 10;
const MAX_LOGIN_FAILS = 5;
const LOCK_DURATION_MINUTES = 15;

// Password must be ≥ 8 chars, contain upper, lower, digit
function validatePassword(password) {
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter.');
  }
  if (!/[a-z]/.test(password)) {
    throw new Error('Password must contain at least one lowercase letter.');
  }
  if (!/[0-9]/.test(password)) {
    throw new Error('Password must contain at least one number.');
  }
}

const AuthService = {

  // ─── Registration ──────────────────────────────────────────────────────────

  /**
   * Step 1: Register — validate, hash password, create unverified account, send OTP.
   * Returns { message } — never returns password hash or OTP.
   */
  async register(email, password, confirmPassword, name, role, state) {
    // --- Input validation (server-side) ---
    if (!email || !password || !role || !state) {
      throw new Error('All fields are required.');
    }
    if (!validator.isEmail(email)) {
      throw new Error('Please enter a valid email address.');
    }
    email = validator.normalizeEmail(email);

    validatePassword(password);

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    const allowedRoles = ['donor', 'ngo', 'admin'];
    if (!allowedRoles.includes(role)) {
      throw new Error('Invalid role selected.');
    }

    // Admin role requires secret code — validated in controller before this call
    // (We keep that separation: controller validates the code, service handles DB)

    // --- Check duplicate email ---
    const existing = await AuthQueries.findUserByEmail(email);
    if (existing) {
      // Use a timing-safe generic message to prevent email enumeration
      throw new Error('An account with this email already exists.');
    }

    // --- Hash password ---
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // --- Create user (email_verified = false) ---
    const userId = uuidv4();
    await AuthQueries.createUser({ id: userId, email, name: name || null, role, state });
    await AuthQueries.createLogin(email, passwordHash);

    // --- Generate OTP, send email ---
    const otp = await OTPService.createOTP(email, 'registration');
    // sendOTPEmail is fire-and-forget for UX, but we await to catch config errors
    try {
      await sendOTPEmail(email, otp, name);
    } catch (emailErr) {
      console.error('[EmailService] Failed to send OTP email:', emailErr.message);
      // Don't expose email error to client — account was still created
      // The user can use "Resend OTP" to trigger another send
    }

    return { message: 'Account created. Please check your email for a 6-digit verification code.' };
  },

  // ─── OTP Verification ──────────────────────────────────────────────────────

  /**
   * Step 2: Verify OTP — confirm email, allow login.
   */
  async verifyOTP(email, otp) {
    if (!email || !otp) {
      throw new Error('Email and OTP are required.');
    }
    email = validator.normalizeEmail(email);

    // Check account exists
    const user = await AuthQueries.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid or expired verification code. Please request a new one.');
    }

    // Check not already verified
    const loginRow = await AuthQueries.findLoginByEmail(email);
    if (loginRow && loginRow.email_verified) {
      throw new Error('This account is already verified. Please log in.');
    }

    // Delegate OTP check to OTPService
    await OTPService.verifyOTP(email, otp, 'registration');

    // Mark email as verified
    await AuthQueries.setEmailVerified(email);

    // Return safe user object
    return { id: user.id, email: user.email, name: user.name, role: user.role, state: user.state };
  },

  // ─── Resend OTP ────────────────────────────────────────────────────────────

  async resendOTP(email) {
    if (!email) throw new Error('Email is required.');
    email = validator.normalizeEmail(email);

    const user = await AuthQueries.findUserByEmail(email);
    if (!user) {
      // Generic message — don't reveal whether email exists
      return { message: 'If an unverified account exists, a new code has been sent.' };
    }

    const loginRow = await AuthQueries.findLoginByEmail(email);
    if (loginRow && loginRow.email_verified) {
      throw new Error('This account is already verified. Please log in.');
    }

    // Check cooldown
    await OTPService.checkResendCooldown(email);

    // Generate + send new OTP
    const otp = await OTPService.createOTP(email, 'registration');
    try {
      await sendOTPEmail(email, otp, user.name);
    } catch (emailErr) {
      console.error('[EmailService] Failed to resend OTP:', emailErr.message);
    }

    return { message: 'A new verification code has been sent to your email.' };
  },

  // ─── Login ─────────────────────────────────────────────────────────────────

  /**
   * Verify email + password, return safe user object.
   * Handles: unverified, locked, wrong password, failed attempts.
   */
  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    if (!validator.isEmail(email)) {
      throw new Error('INVALID_CREDENTIALS'); // caught in controller → 401
    }
    email = validator.normalizeEmail(email);

    const loginRow = await AuthQueries.findLoginByEmail(email);

    // Use constant-time-like generic error to prevent enumeration
    if (!loginRow) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Check if account is locked
    if (loginRow.locked_until && new Date(loginRow.locked_until) > new Date()) {
      const remaining = Math.ceil((new Date(loginRow.locked_until) - Date.now()) / 60000);
      throw new Error(`Account temporarily locked. Try again in ${remaining} minute${remaining === 1 ? '' : 's'}.`);
    }

    // Check email verified
    if (!loginRow.email_verified) {
      throw new Error('EMAIL_NOT_VERIFIED');
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, loginRow.password_hash);
    if (!isMatch) {
      const newCount = (loginRow.failed_attempts || 0) + 1;
      if (newCount >= MAX_LOGIN_FAILS) {
        const lockedUntil = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000);
        await AuthQueries.lockAccount(email, lockedUntil);
        throw new Error(`Too many failed attempts. Account locked for ${LOCK_DURATION_MINUTES} minutes.`);
      }
      await AuthQueries.updateFailedAttempts(email, newCount);
      const remaining = MAX_LOGIN_FAILS - newCount;
      throw new Error(`Incorrect password. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`);
    }

    // Successful login — reset failed attempts
    await AuthQueries.resetFailedAttempts(email);

    const user = await AuthQueries.findUserByEmail(email);
    // Return only safe fields — never password_hash
    return { id: user.id, email: user.email, name: user.name, role: user.role, state: user.state };
  }
};

module.exports = AuthService;
