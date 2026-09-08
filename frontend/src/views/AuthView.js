import { StorageService } from '../db/storage.js';
import { AuthService } from '../services/authService.js';
import { Toast } from '../components/Toast.js';

// Track which screen is active
// screen: 'login' | 'register' | 'otp'
let _screen = 'login';
let _pendingEmail = '';   // email waiting for OTP
let _pendingName  = '';
let _otpTimer = null;

function getStatesOptions() {
  return StorageService.getStates()
    .map(s => `<option value="${s}">${s}</option>`)
    .join('');
}

function renderLogin() {
  return `
    <div class="auth-screen" id="screen-login">
      <div class="auth-form-header">
        <h2>Welcome back</h2>
        <p>Sign in to your KindSwap account</p>
      </div>
      <form id="login-form" novalidate>
        <div class="form-group">
          <label for="login-email">Email Address</label>
          <input type="email" id="login-email" required autocomplete="email"
                 placeholder="you@example.com">
        </div>
        <div class="form-group">
          <label for="login-password">Password</label>
          <div class="input-password-wrap">
            <input type="password" id="login-password" required autocomplete="current-password"
                   placeholder="Enter your password">
            <button type="button" class="toggle-pw" data-target="login-password" aria-label="Show password">👁</button>
          </div>
        </div>
        <div class="form-error" id="login-error"></div>
        <button type="submit" class="btn btn-primary btn-block" id="login-submit">Sign In</button>
      </form>
      <div class="auth-toggle">
        Don't have an account? <a href="#" id="go-register">Create one</a>
      </div>
    </div>
  `;
}

function renderRegister() {
  return `
    <div class="auth-screen" id="screen-register">
      <div class="auth-form-header">
        <h2>Join KindSwap</h2>
        <p>Create your account and start making an impact</p>
      </div>
      <form id="register-form" novalidate>
        <div class="form-group">
          <label for="reg-name">Full Name</label>
          <input type="text" id="reg-name" required autocomplete="name"
                 placeholder="Your name">
        </div>
        <div class="form-group">
          <label for="reg-email">Email Address</label>
          <input type="email" id="reg-email" required autocomplete="email"
                 placeholder="you@example.com">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="reg-password">Password</label>
            <div class="input-password-wrap">
              <input type="password" id="reg-password" required autocomplete="new-password"
                     placeholder="Min. 8 characters">
              <button type="button" class="toggle-pw" data-target="reg-password" aria-label="Show password">👁</button>
            </div>
          </div>
          <div class="form-group">
            <label for="reg-confirm">Confirm Password</label>
            <div class="input-password-wrap">
              <input type="password" id="reg-confirm" required autocomplete="new-password"
                     placeholder="Repeat password">
              <button type="button" class="toggle-pw" data-target="reg-confirm" aria-label="Show password">👁</button>
            </div>
          </div>
        </div>
        <p class="pw-hint">Min 8 chars · 1 uppercase · 1 lowercase · 1 number</p>
        <div class="form-group">
          <label for="reg-state">Location (State)</label>
          <select id="reg-state" required>
            <option value="" disabled selected>Select your state</option>
            ${getStatesOptions()}
          </select>
        </div>
        <div class="form-group">
          <label>Your role in the community</label>
          <div class="role-options">
            <div class="role-card">
              <input type="radio" id="role-donor" name="reg-role" value="donor" checked>
              <label for="role-donor">
                <span class="role-icon">🎁</span>
                <span class="role-title">Donor</span>
                <span class="role-desc">I want to share items</span>
              </label>
            </div>
            <div class="role-card">
              <input type="radio" id="role-ngo" name="reg-role" value="ngo">
              <label for="role-ngo">
                <span class="role-icon">🤝</span>
                <span class="role-title">NGO / Volunteer</span>
                <span class="role-desc">I need items for community</span>
              </label>
            </div>
            <div class="role-card">
              <input type="radio" id="role-admin" name="reg-role" value="admin">
              <label for="role-admin">
                <span class="role-icon">🛠️</span>
                <span class="role-title">Admin</span>
                <span class="role-desc">I manage assignments</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Admin code field — shown only when Admin is selected -->
        <div class="form-group" id="admin-code-wrap" style="display:none;">
          <label for="reg-admin-code">Admin Registration Code</label>
          <input type="password" id="reg-admin-code" placeholder="Enter admin code"
                 autocomplete="off">
        </div>

        <div class="form-error" id="register-error"></div>
        <button type="submit" class="btn btn-primary btn-block" id="register-submit">Create Account</button>
      </form>
      <div class="auth-toggle">
        Already have an account? <a href="#" id="go-login">Sign In</a>
      </div>
    </div>
  `;
}

function renderOTP() {
  const maskedEmail = _pendingEmail.replace(/(.{2}).+(@.+)/, '$1***$2');
  return `
    <div class="auth-screen" id="screen-otp">
      <div class="auth-form-header">
        <div class="otp-icon">📧</div>
        <h2>Verify your email</h2>
        <p>We sent a 6-digit code to<br><strong>${maskedEmail}</strong></p>
      </div>

      <div class="otp-inputs-wrap">
        <div class="otp-inputs" id="otp-inputs">
          <input type="text" class="otp-digit" maxlength="1" inputmode="numeric" pattern="[0-9]" autocomplete="one-time-code" id="otp-0">
          <input type="text" class="otp-digit" maxlength="1" inputmode="numeric" pattern="[0-9]" id="otp-1">
          <input type="text" class="otp-digit" maxlength="1" inputmode="numeric" pattern="[0-9]" id="otp-2">
          <span class="otp-sep">—</span>
          <input type="text" class="otp-digit" maxlength="1" inputmode="numeric" pattern="[0-9]" id="otp-3">
          <input type="text" class="otp-digit" maxlength="1" inputmode="numeric" pattern="[0-9]" id="otp-4">
          <input type="text" class="otp-digit" maxlength="1" inputmode="numeric" pattern="[0-9]" id="otp-5">
        </div>
      </div>

      <div class="otp-timer" id="otp-timer">Code expires in <span id="otp-countdown">10:00</span></div>
      <div class="form-error" id="otp-error"></div>

      <button class="btn btn-primary btn-block" id="otp-submit">Verify Code</button>

      <div class="otp-resend">
        <span id="otp-resend-text">Didn't receive the code?</span>
        <button id="otp-resend-btn" class="link-btn" disabled>Resend code</button>
        <span id="otp-resend-cooldown" class="resend-cooldown"></span>
      </div>

      <div class="auth-toggle">
        <a href="#" id="otp-back">← Back to login</a>
      </div>
    </div>
  `;
}

export const AuthView = {
  render() {
    const panels = {
      login:    renderLogin(),
      register: renderRegister(),
      otp:      renderOTP()
    };
    return `
      <div class="auth-page">
        <!-- Left: Illustration panel -->
        <div class="auth-illustration">
          <div class="auth-brand">
            <div class="logo-icon">💬🔄</div>
            <h1>Kind<span>Swap</span></h1>
          </div>
          <div class="illustration-content">
            <div class="illustration-image">
              <div class="illus-circle illus-yellow"></div>
              <div class="illus-circle illus-lavender"></div>
              <div class="illus-person person-left">
                <div class="person-body">🧍</div>
                <div class="person-item item-give">📦</div>
              </div>
              <div class="illus-arrows">
                <div class="arrow arrow-right">→</div>
                <div class="arrow arrow-left">←</div>
              </div>
              <div class="illus-person person-right">
                <div class="person-body">🧍</div>
                <div class="person-item item-receive">📚</div>
              </div>
            </div>
            <div class="illus-bubbles">
              <div class="illus-bubble b1">📍 Maharashtra</div>
              <div class="illus-bubble b2">💛 Sharing</div>
              <div class="illus-bubble b3">🌱 Community</div>
            </div>
          </div>
          <p class="auth-tagline">Give what you can.<br>Get what you need.</p>
        </div>

        <!-- Right: Form panel -->
        <div class="auth-form-panel">
          <div class="auth-card glass-panel">
            ${panels[_screen]}
          </div>
        </div>
      </div>
    `;
  },

  attachEvents(navigate, reRender) {
    // ── Toggle password visibility ──────────────────────────────────────────
    document.querySelectorAll('.toggle-pw').forEach(btn => {
      btn.addEventListener('click', () => {
        const inp = document.getElementById(btn.dataset.target);
        if (!inp) return;
        inp.type = inp.type === 'password' ? 'text' : 'password';
        btn.textContent = inp.type === 'password' ? '👁' : '🙈';
      });
    });

    if (_screen === 'login') this._attachLoginEvents(navigate);
    if (_screen === 'register') this._attachRegisterEvents(reRender);
    if (_screen === 'otp') this._attachOTPEvents(navigate, reRender);
  },

  _attachLoginEvents(navigate) {
    document.getElementById('go-register')?.addEventListener('click', e => {
      e.preventDefault();
      _screen = 'register';
      // Re-render without full app re-render (just the auth card)
      this._rerenderCard(navigate, () => {});
    });

    document.getElementById('login-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const email    = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const errEl    = document.getElementById('login-error');
      const btn      = document.getElementById('login-submit');

      errEl.textContent = '';
      btn.disabled = true;
      btn.textContent = 'Signing in…';

      try {
        const user = await AuthService.login(email, password);
        window.currentUser = user;
        Toast.show('Signed in successfully!', 'success');
        navigate('menu');
      } catch (err) {
        if (err.requiresVerification) {
          _pendingEmail = email;
          _screen = 'otp';
          this._rerenderCard(navigate, () => {});
          Toast.show('Please verify your email first.', 'error');
        } else {
          errEl.textContent = err.message;
        }
        btn.disabled = false;
        btn.textContent = 'Sign In';
      }
    });
  },

  _attachRegisterEvents(reRender) {
    // Show/hide admin code field
    document.querySelectorAll('input[name="reg-role"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const wrap = document.getElementById('admin-code-wrap');
        if (wrap) wrap.style.display = radio.value === 'admin' ? 'block' : 'none';
      });
    });

    document.getElementById('go-login')?.addEventListener('click', e => {
      e.preventDefault();
      _screen = 'login';
      this._rerenderCard(null, reRender);
    });

    document.getElementById('register-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const name          = document.getElementById('reg-name').value.trim();
      const email         = document.getElementById('reg-email').value.trim();
      const password      = document.getElementById('reg-password').value;
      const confirmPw     = document.getElementById('reg-confirm').value;
      const state         = document.getElementById('reg-state').value;
      const role          = document.querySelector('input[name="reg-role"]:checked')?.value;
      const adminCode     = document.getElementById('reg-admin-code')?.value || '';
      const errEl         = document.getElementById('register-error');
      const btn           = document.getElementById('register-submit');

      errEl.textContent = '';

      // Client-side quick checks (server validates again)
      if (!name)  { errEl.textContent = 'Please enter your name.'; return; }
      if (!state) { errEl.textContent = 'Please select your state.'; return; }

      btn.disabled = true;
      btn.textContent = 'Creating account…';

      try {
        await AuthService.register(email, password, confirmPw, name, role, state, adminCode);
        _pendingEmail = email;
        _pendingName  = name;
        _screen = 'otp';
        this._rerenderCard(null, reRender);
        Toast.show('Account created! Check your email for the verification code.', 'success');
      } catch (err) {
        errEl.textContent = err.message;
        btn.disabled = false;
        btn.textContent = 'Create Account';
      }
    });
  },

  _attachOTPEvents(navigate, reRender) {
    // ── OTP digit inputs — auto-focus, backspace, paste ──────────────────────
    const digits = document.querySelectorAll('.otp-digit');

    digits.forEach((inp, idx) => {
      inp.addEventListener('input', () => {
        inp.value = inp.value.replace(/\D/, '');
        if (inp.value && idx < digits.length - 1) {
          digits[idx + 1].focus();
        }
      });
      inp.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !inp.value && idx > 0) {
          digits[idx - 1].focus();
        }
      });
    });

    // Paste handling
    document.getElementById('otp-inputs')?.addEventListener('paste', e => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
      digits.forEach((inp, i) => { inp.value = text[i] || ''; });
      digits[Math.min(text.length, digits.length - 1)].focus();
    });

    // Focus first digit
    setTimeout(() => digits[0]?.focus(), 50);

    // ── Countdown timer ───────────────────────────────────────────────────────
    if (_otpTimer) clearInterval(_otpTimer);
    const expiryMinutes = 10;
    let secsLeft = expiryMinutes * 60;

    const countdownEl = document.getElementById('otp-countdown');
    const timerEl     = document.getElementById('otp-timer');
    const resendBtn   = document.getElementById('otp-resend-btn');
    const cooldownEl  = document.getElementById('otp-resend-cooldown');
    const cooldownSecs = 60;
    let resendCountdown = cooldownSecs;

    // Enable resend after cooldown
    let resendInterval = setInterval(() => {
      resendCountdown--;
      if (cooldownEl) cooldownEl.textContent = resendCountdown > 0 ? `(${resendCountdown}s)` : '';
      if (resendCountdown <= 0) {
        clearInterval(resendInterval);
        if (resendBtn) resendBtn.disabled = false;
        if (cooldownEl) cooldownEl.textContent = '';
      }
    }, 1000);

    _otpTimer = setInterval(() => {
      secsLeft--;
      const m = Math.floor(secsLeft / 60);
      const s = secsLeft % 60;
      if (countdownEl) countdownEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
      if (secsLeft <= 0) {
        clearInterval(_otpTimer);
        if (timerEl) timerEl.textContent = 'Code has expired. Please request a new one.';
        const submitBtn = document.getElementById('otp-submit');
        if (submitBtn) submitBtn.disabled = true;
      }
    }, 1000);

    // ── Verify OTP ────────────────────────────────────────────────────────────
    document.getElementById('otp-submit')?.addEventListener('click', async () => {
      const otp    = Array.from(digits).map(d => d.value).join('');
      const errEl  = document.getElementById('otp-error');
      const btn    = document.getElementById('otp-submit');

      errEl.textContent = '';

      if (otp.length < 6) {
        errEl.textContent = 'Please enter all 6 digits.';
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Verifying…';

      try {
        const result = await AuthService.verifyOTP(_pendingEmail, otp);
        clearInterval(_otpTimer);
        window.currentUser = result.user;
        Toast.show('Email verified! Welcome to KindSwap 🎉', 'success');
        _screen = 'login';
        navigate('menu');
      } catch (err) {
        errEl.textContent = err.message;
        // Shake animation
        document.querySelector('.otp-inputs')?.classList.add('otp-shake');
        setTimeout(() => document.querySelector('.otp-inputs')?.classList.remove('otp-shake'), 500);
        digits.forEach(d => d.value = '');
        digits[0]?.focus();
        btn.disabled = false;
        btn.textContent = 'Verify Code';
      }
    });

    // ── Resend OTP ────────────────────────────────────────────────────────────
    resendBtn?.addEventListener('click', async () => {
      const errEl = document.getElementById('otp-error');
      errEl.textContent = '';
      resendBtn.disabled = true;
      resendBtn.textContent = 'Sending…';

      try {
        await AuthService.resendOTP(_pendingEmail);
        Toast.show('New code sent! Check your email.', 'success');
        // Reset countdown
        secsLeft = expiryMinutes * 60;
        resendCountdown = cooldownSecs;
        if (cooldownEl) cooldownEl.textContent = `(${cooldownSecs}s)`;
        resendBtn.textContent = 'Resend code';
        resendInterval = setInterval(() => {
          resendCountdown--;
          if (cooldownEl) cooldownEl.textContent = resendCountdown > 0 ? `(${resendCountdown}s)` : '';
          if (resendCountdown <= 0) {
            clearInterval(resendInterval);
            resendBtn.disabled = false;
            if (cooldownEl) cooldownEl.textContent = '';
          }
        }, 1000);
      } catch (err) {
        errEl.textContent = err.message;
        resendBtn.disabled = false;
        resendBtn.textContent = 'Resend code';
      }
    });

    // ── Back link ─────────────────────────────────────────────────────────────
    document.getElementById('otp-back')?.addEventListener('click', e => {
      e.preventDefault();
      clearInterval(_otpTimer);
      _screen = 'login';
      this._rerenderCard(navigate, reRender);
    });
  },

  // Re-render just the auth card content without a full app re-render
  _rerenderCard(navigate, reRender) {
    const card = document.querySelector('.auth-card');
    if (!card) { reRender && reRender(); return; }

    const screens = {
      login:    renderLogin(),
      register: renderRegister(),
      otp:      renderOTP()
    };
    card.innerHTML = screens[_screen];
    this.attachEvents(navigate, reRender);
  }
};
