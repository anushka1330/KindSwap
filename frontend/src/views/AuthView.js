import { AuthService } from '../services/authService.js';
import { Toast } from '../components/Toast.js';

let _screen = 'login'; // 'login' | 'register'
let _idCheckTimeout = null;
let _isIdAvailable = null;

function renderLogin() {
  return `
    <div class="auth-screen" id="screen-login">
      <div class="auth-form-header">
        <span class="auth-badge">Welcome back</span>
        <h2>Sign in to KindSwap</h2>
        <p>Connect with your community circle to share and receive resources.</p>
      </div>

      <form id="login-form" novalidate>
        <div class="form-group">
          <label for="login-kindswap-id">KindSwap ID</label>
          <div class="id-input-wrap">
            <span class="input-icon" style="z-index:2;">@</span>
            <input
              type="text"
              id="login-kindswap-id"
              class="form-input has-icon"
              required
              autocomplete="username"
              placeholder="e.g. Anushka123"
            />
            <span class="id-suffix-badge">@ KindSwap</span>
          </div>
          <span class="input-hint">Your unique ID — e.g. <strong>Anushka123 @ KindSwap</strong></span>
        </div>

        <div class="form-group">
          <div class="form-label-row">
            <label for="login-password">Password</label>
          </div>
          <div class="input-password-wrap">
            <span class="input-icon">🔒</span>
            <input
              type="password"
              id="login-password"
              class="form-input has-icon"
              required
              autocomplete="current-password"
              placeholder="Enter your password"
            />
            <button type="button" class="toggle-pw" data-target="login-password" aria-label="Toggle password visibility">👁</button>
          </div>
        </div>

        <div class="form-error" id="login-error" style="display:none;"></div>

        <button type="submit" class="btn btn-primary btn-block" id="login-submit" style="margin-top: 10px;">
          <span>Sign In</span>
          <span class="btn-arrow">→</span>
        </button>
      </form>

      <div class="auth-toggle">
        Don't have a KindSwap ID? <a href="/register" id="go-register">Create your KindSwap ID</a>
      </div>
    </div>
  `;
}

function renderRegister() {
  return `
    <div class="auth-screen" id="screen-register">
      <div class="auth-form-header">
        <span class="auth-badge">Step 1 of 2: Your Account</span>
        <h2>Create your KindSwap ID</h2>
        <p>Choose a unique ID and a password to join your neighborhood circle.</p>
      </div>

      <form id="register-form" novalidate>
        <!-- KindSwap ID with Suffix Badge and Live Availability -->
        <div class="form-group">
          <label for="reg-kindswap-id">Choose your KindSwap ID *</label>
          <div class="id-input-wrap">
            <span class="input-icon" style="z-index:2;">@</span>
            <input
              type="text"
              id="reg-kindswap-id"
              class="form-input has-icon"
              required
              autocomplete="username"
              placeholder="e.g. Anushka123"
              maxlength="30"
            />
            <span class="id-suffix-badge">@ KindSwap</span>
          </div>
          <div class="id-availability-box" id="id-availability-msg">
            <span style="color:var(--muted-ink);">3–30 characters. Letters, numbers, and underscores.</span>
          </div>
        </div>

        <!-- Password with Reveal Toggle and Requirements -->
        <div class="form-row">
          <div class="form-group">
            <label for="reg-password">Set Password *</label>
            <div class="input-password-wrap">
              <input
                type="password"
                id="reg-password"
                class="form-input"
                required
                autocomplete="new-password"
                placeholder="Min. 8 chars"
              />
              <button type="button" class="toggle-pw" data-target="reg-password" aria-label="Show password">👁</button>
            </div>
          </div>
          <div class="form-group">
            <label for="reg-confirm">Confirm Password *</label>
            <div class="input-password-wrap">
              <input
                type="password"
                id="reg-confirm"
                class="form-input"
                required
                autocomplete="new-password"
                placeholder="Repeat password"
              />
              <button type="button" class="toggle-pw" data-target="reg-confirm" aria-label="Show password">👁</button>
            </div>
          </div>
        </div>

        <!-- Password live checklist -->
        <div class="pw-checklist" id="pw-checklist">
          <div class="pw-req-item" id="req-length">
            <span class="req-icon">○</span> At least 8 characters
          </div>
          <div class="pw-req-item" id="req-char">
            <span class="req-icon">○</span> At least 1 number or special character
          </div>
        </div>

        <!-- Role Selector -->
        <div class="form-group">
          <label>Your Role in KindSwap</label>
          <div class="role-options">
            <div class="role-card">
              <input type="radio" id="role-donor" name="reg-role" value="donor" checked />
              <label for="role-donor">
                <span class="role-icon">🎁</span>
                <span class="role-title">Donor</span>
                <span class="role-desc">Share items</span>
              </label>
            </div>
            <div class="role-card">
              <input type="radio" id="role-ngo" name="reg-role" value="ngo" />
              <label for="role-ngo">
                <span class="role-icon">🤝</span>
                <span class="role-title">NGO / Volunteer</span>
                <span class="role-desc">Help community</span>
              </label>
            </div>
            <div class="role-card">
              <input type="radio" id="role-admin" name="reg-role" value="admin" />
              <label for="role-admin">
                <span class="role-icon">🛠️</span>
                <span class="role-title">Admin</span>
                <span class="role-desc">Platform</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Admin code field — shown only when Admin role is selected -->
        <div class="form-group" id="admin-code-wrap" style="display:none;">
          <label for="reg-admin-code">Admin Passkey</label>
          <div class="input-wrap">
            <span class="input-icon">🔑</span>
            <input
              type="password"
              id="reg-admin-code"
              class="form-input has-icon"
              placeholder="Enter administrator passkey"
              autocomplete="off"
            />
          </div>
        </div>

        <div class="form-error" id="register-error" style="display:none;"></div>

        <button type="submit" class="btn btn-primary btn-block" id="register-submit" style="margin-top: 14px;">
          <span>Next: Tell us about yourself</span>
          <span class="btn-arrow">→</span>
        </button>
      </form>

      <div class="auth-toggle">
        Already have a KindSwap ID? <a href="/login" id="go-login">Sign in here</a>
      </div>
    </div>
  `;
}

function handleAuthSuccess(user, navigate) {
  window.currentUser = user;

  // Check if profile details (name, age, city) are incomplete
  if (!user.name || !user.age || !user.city) {
    navigate('profile-setup');
  } else {
    // Returning user with completed profile -> direct to Manus dashboard
    navigate('welcome');
  }
}

export const AuthView = {
  setScreen(scr) {
    _screen = scr === 'register' ? 'register' : 'login';
  },

  render() {
    const panels = {
      login: renderLogin(),
      register: renderRegister()
    };

    return `
      <div class="auth-page">
        <!-- Left: Brand & Community Showcase Panel -->
        <div class="auth-illustration">
          <div class="auth-brand">
            <div class="logo-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>
              </svg>
            </div>
            <h1>Kind<span>Swap</span></h1>
          </div>

          <div class="illustration-content">
            <h3 class="illus-tagline">Small swaps make a big difference in India.</h3>
            <p class="illus-subtext">Join neighbors, volunteers, and NGOs sharing books, warm clothing, household essentials, and pantry staples with care.</p>

            <div class="illus-cards-showcase">
              <div class="illus-pill p1">
                <span class="pill-icon">📚</span>
                <div>
                  <strong>Books & Supplies</strong>
                  <small>For students in need</small>
                </div>
              </div>
              <div class="illus-pill p2">
                <span class="pill-icon">👕</span>
                <div>
                  <strong>Warm Clothing</strong>
                  <small>Clean & rehomed gently</small>
                </div>
              </div>
              <div class="illus-pill p3">
                <span class="pill-icon">🍲</span>
                <div>
                  <strong>Pantry Staples</strong>
                  <small>Zero food waste circle</small>
                </div>
              </div>
            </div>

            <div class="illus-quote-card">
              <div class="quote-stars">★★★★★</div>
              <p>"KindSwap connects people who want to help directly with those who need it most, with zero friction."</p>
              <div class="quote-author">
                <div class="quote-avatar">IN</div>
                <div>
                  <strong>Pan-India Community Circle</strong>
                  <small>Verified Exchange Network</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Dynamic Auth Form Card Panel -->
        <div class="auth-form-panel">
          <div class="auth-card glass-panel">
            ${panels[_screen] || panels.login}
          </div>
        </div>
      </div>
    `;
  },

  attachEvents(navigate, reRender) {
    // Password visibility toggle
    document.querySelectorAll('.toggle-pw').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const inp = document.getElementById(targetId);
        if (!inp) return;
        inp.type = inp.type === 'password' ? 'text' : 'password';
        btn.textContent = inp.type === 'password' ? '👁' : '🙈';
      });
    });

    if (_screen === 'login') {
      this._attachLoginEvents(navigate, reRender);
    } else {
      this._attachRegisterEvents(navigate, reRender);
    }
  },

  _attachLoginEvents(navigate, reRender) {
    document.getElementById('go-register')?.addEventListener('click', (e) => {
      e.preventDefault();
      _screen = 'register';
      this._rerenderCard(navigate, reRender);
    });

    const form = document.getElementById('login-form');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const kindswapId = document.getElementById('login-kindswap-id')?.value.trim();
      const password = document.getElementById('login-password')?.value;
      const errEl = document.getElementById('login-error');
      const btn = document.getElementById('login-submit');

      if (errEl) {
        errEl.textContent = '';
        errEl.style.display = 'none';
      }

      if (!kindswapId || !password) {
        showError(errEl, 'Please enter both your KindSwap ID and password.');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-dot"></span><span>Signing in…</span>`;

      try {
        const user = await AuthService.login(kindswapId, password);
        Toast.show('Signed in successfully!', `Welcome back, ${user.name || user.kindswapId}!`);
        handleAuthSuccess(user, navigate);
      } catch (err) {
        showError(errEl, err.message || 'Incorrect KindSwap ID or password.');
        btn.disabled = false;
        btn.innerHTML = `<span>Sign In</span><span class="btn-arrow">→</span>`;
      }
    });
  },

  _attachRegisterEvents(navigate, reRender) {
    // Show/hide admin code input based on role radio
    document.querySelectorAll('input[name="reg-role"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const wrap = document.getElementById('admin-code-wrap');
        if (wrap) wrap.style.display = radio.value === 'admin' ? 'block' : 'none';
      });
    });

    document.getElementById('go-login')?.addEventListener('click', (e) => {
      e.preventDefault();
      _screen = 'login';
      this._rerenderCard(navigate, reRender);
    });

    const idInput = document.getElementById('reg-kindswap-id');
    const idMsgEl = document.getElementById('id-availability-msg');
    const pwInput = document.getElementById('reg-password');
    const reqLen = document.getElementById('req-length');
    const reqChar = document.getElementById('req-char');

    // Live password checklist
    pwInput?.addEventListener('input', () => {
      const val = pwInput.value;
      const isLenValid = val.length >= 8;
      const hasNumOrSpecial = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val);

      if (reqLen) {
        reqLen.classList.toggle('met', isLenValid);
        reqLen.querySelector('.req-icon').textContent = isLenValid ? '✓' : '○';
      }
      if (reqChar) {
        reqChar.classList.toggle('met', hasNumOrSpecial);
        reqChar.querySelector('.req-icon').textContent = hasNumOrSpecial ? '✓' : '○';
      }
    });

    // Real-time debounced KindSwap ID availability checker
    idInput?.addEventListener('input', () => {
      if (_idCheckTimeout) clearTimeout(_idCheckTimeout);

      const val = idInput.value.trim();
      if (!val) {
        _isIdAvailable = null;
        if (idMsgEl) {
          idMsgEl.innerHTML = `<span style="color:var(--muted-ink);">3–30 characters. Letters, numbers, and underscores.</span>`;
        }
        return;
      }

      if (val.length < 3) {
        _isIdAvailable = false;
        if (idMsgEl) {
          idMsgEl.innerHTML = `<span class="id-status-taken">ID must be at least 3 characters.</span>`;
        }
        return;
      }

      if (!/^[a-zA-Z0-9_.-]+$/.test(val)) {
        _isIdAvailable = false;
        if (idMsgEl) {
          idMsgEl.innerHTML = `<span class="id-status-taken">Only letters, numbers, hyphens, and underscores allowed.</span>`;
        }
        return;
      }

      if (idMsgEl) {
        idMsgEl.innerHTML = `<span class="id-status-checking"><span class="spinner-dot" style="border-color:#b5975a;border-top-color:transparent;"></span> Checking availability…</span>`;
      }

      _idCheckTimeout = setTimeout(async () => {
        try {
          const res = await AuthService.checkKindswapId(val);
          if (res.available) {
            _isIdAvailable = true;
            if (idMsgEl) {
              idMsgEl.innerHTML = `<span class="id-status-available">✓ KindSwap ID is available</span>`;
            }
          } else {
            _isIdAvailable = false;
            if (idMsgEl) {
              idMsgEl.innerHTML = `<span class="id-status-taken">✕ This KindSwap ID is already taken. Please choose another one.</span>`;
            }
          }
        } catch {
          // If network error, don't hard block
          _isIdAvailable = null;
        }
      }, 350);
    });

    const form = document.getElementById('register-form');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const kindswapId = idInput?.value.trim();
      const password = pwInput?.value;
      const confirmPw = document.getElementById('reg-confirm')?.value;
      const role = document.querySelector('input[name="reg-role"]:checked')?.value || 'donor';
      const adminCode = document.getElementById('reg-admin-code')?.value || '';
      const errEl = document.getElementById('register-error');
      const btn = document.getElementById('register-submit');

      if (errEl) {
        errEl.textContent = '';
        errEl.style.display = 'none';
      }

      // Validations
      if (!kindswapId || kindswapId.length < 3) {
        showError(errEl, 'Please choose a KindSwap ID with at least 3 characters.');
        idInput?.focus();
        return;
      }

      if (_isIdAvailable === false) {
        showError(errEl, 'This KindSwap ID is already taken. Please choose another one.');
        idInput?.focus();
        return;
      }

      if (!password || password.length < 8) {
        showError(errEl, 'Password must be at least 8 characters long.');
        pwInput?.focus();
        return;
      }

      if (password !== confirmPw) {
        showError(errEl, 'Passwords do not match. Please re-check.');
        document.getElementById('reg-confirm')?.focus();
        return;
      }

      if (role === 'admin' && !adminCode) {
        showError(errEl, 'Admin registration requires the administrator passkey.');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-dot"></span><span>Creating your ID…</span>`;

      try {
        const user = await AuthService.register({ kindswapId, password, confirmPassword: confirmPw, role, adminCode });
        Toast.show('KindSwap ID created! 🎉', 'Now tell us a little about yourself.');
        // Seamlessly progress to Page 2 (Profile Setup)
        handleAuthSuccess(user, navigate);
      } catch (err) {
        showError(errEl, err.message || 'Registration failed.');
        btn.disabled = false;
        btn.innerHTML = `<span>Next: Tell us about yourself</span><span class="btn-arrow">→</span>`;
      }
    });
  },

  _rerenderCard(navigate, reRender) {
    const card = document.querySelector('.auth-card');
    if (!card) {
      if (typeof reRender === 'function') reRender();
      return;
    }

    const panels = {
      login: renderLogin(),
      register: renderRegister()
    };
    card.innerHTML = panels[_screen] || panels.login;
    this.attachEvents(navigate, reRender);
  }
};

function showError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
  el.classList.remove('form-shake');
  void el.offsetWidth;
  el.classList.add('form-shake');
}
