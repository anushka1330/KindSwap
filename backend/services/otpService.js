const crypto = require('crypto');
const bcrypt = require('bcrypt');
const AuthQueries = require('../queries/authQueries');

const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;
const OTP_MAX_ATTEMPTS   = parseInt(process.env.OTP_MAX_ATTEMPTS)   || 5;
const BCRYPT_ROUNDS = 10;

const OTPService = {
  /**
   * Generate a cryptographically secure 6-digit OTP string.
   * Uses crypto.randomInt — NOT Math.random().
   */
  generateOTP() {
    const n = crypto.randomInt(0, 1_000_000); // [0, 999999]
    return n.toString().padStart(6, '0');      // zero-pad to 6 digits
  },

  /**
   * Create a new OTP record for an email:
   *  1. Invalidate any previous active OTPs.
   *  2. Hash the OTP with bcrypt.
   *  3. Insert the record.
   *  4. Update last_otp_sent_at on the login row.
   * Returns the plain-text OTP (used only to send the email — never stored raw).
   */
  async createOTP(email, purpose = 'registration') {
    // Invalidate all previous active OTPs for this email + purpose
    await AuthQueries.invalidateOTPsByEmail(email, purpose);

    const otp = this.generateOTP();
    const otpHash = await bcrypt.hash(otp, BCRYPT_ROUNDS);

    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await AuthQueries.createOTP({
      email,
      otpHash,
      purpose,
      expiresAt,
      maxAttempts: OTP_MAX_ATTEMPTS
    });

    // Record when we last sent an OTP (for resend cooldown)
    await AuthQueries.updateLastOTPSentAt(email, new Date());

    // Return the plain OTP — caller passes it to emailService only
    return otp;
  },

  /**
   * Verify a submitted OTP.
   * Returns { success: true } or throws with a user-safe message.
   */
  async verifyOTP(email, submittedOTP, purpose = 'registration') {
    const record = await AuthQueries.findActiveOTP(email, purpose);

    if (!record) {
      // Don't reveal whether email exists; use generic message
      throw new Error('Invalid or expired verification code. Please request a new one.');
    }

    // Check attempt limit BEFORE comparing (prevents timing leak)
    if (record.attempts >= record.max_attempts) {
      await AuthQueries.invalidateOTPsByEmail(email, purpose);
      throw new Error('Too many incorrect attempts. Please request a new verification code.');
    }

    // Increment attempts first
    await AuthQueries.incrementOTPAttempts(record.id);

    const isMatch = await bcrypt.compare(submittedOTP, record.otp_hash);
    if (!isMatch) {
      const remaining = record.max_attempts - record.attempts - 1;
      if (remaining <= 0) {
        await AuthQueries.invalidateOTPsByEmail(email, purpose);
        throw new Error('Too many incorrect attempts. Please request a new verification code.');
      }
      throw new Error(`Incorrect code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`);
    }

    // Valid — mark as used
    await AuthQueries.markOTPUsed(record.id);
    return { success: true };
  },

  /**
   * Check whether a resend is allowed (enforces cooldown).
   * Returns { allowed: true } or throws with seconds remaining.
   */
  async checkResendCooldown(email) {
    const loginRow = await AuthQueries.findLoginByEmail(email);
    if (!loginRow || !loginRow.last_otp_sent_at) {
      return { allowed: true };
    }

    const cooldownSec = parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS) || 60;
    const elapsed = (Date.now() - new Date(loginRow.last_otp_sent_at).getTime()) / 1000;

    if (elapsed < cooldownSec) {
      const wait = Math.ceil(cooldownSec - elapsed);
      throw new Error(`Please wait ${wait} second${wait === 1 ? '' : 's'} before requesting a new code.`);
    }

    return { allowed: true };
  }
};

module.exports = OTPService;
