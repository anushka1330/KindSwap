import { AuthService } from '../services/authService.js';
import { Toast } from '../components/Toast.js';
import { getFirstName } from '../utils/greeting.js';

export const ProfileSetupView = {
  render() {
    const user = window.currentUser || {};
    const defaultName = user.name || '';
    const defaultAge = user.age || '';
    const defaultCity = user.city || '';

    return `
      <div class="auth-page">
        <!-- Left: Onboarding Brand & Neighborhood Showcase -->
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
            <span class="auth-badge" style="margin-bottom:14px;">Step 2 of 2: Your Profile</span>
            <h3 class="illus-tagline">Welcome to your neighborhood circle.</h3>
            <p class="illus-subtext">Connecting you directly with neighbors, verified NGOs, and community volunteers nearby to give preloved items a second home.</p>

            <div class="illus-cards-showcase">
              <div class="illus-pill p1">
                <span class="pill-icon">📍</span>
                <div>
                  <strong>Hyperlocal Circles</strong>
                  <small>Jaipur, Delhi NCR, Mumbai & beyond</small>
                </div>
              </div>
              <div class="illus-pill p2">
                <span class="pill-icon">🌱</span>
                <div>
                  <strong>Zero-Waste Exchanges</strong>
                  <small>100% community-driven giving</small>
                </div>
              </div>
              <div class="illus-pill p3">
                <span class="pill-icon">🤝</span>
                <div>
                  <strong>Verified Neighbors</strong>
                  <small>Safe, friendly local handoffs</small>
                </div>
              </div>
            </div>

            <div class="illus-quote-card">
              <div class="quote-stars">✦ ✦ ✦ ✦ ✦</div>
              <p>"Sharing within our city made our neighborhood feel warm, supportive, and connected."</p>
              <div class="quote-author">
                <div class="quote-avatar">KS</div>
                <div>
                  <strong>Pan-India Community Circle</strong>
                  <small>Verified Exchange Network</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Profile Setup Card Form -->
        <div class="auth-form-panel">
          <div class="auth-card profile-setup-card glass-panel">
            <div class="auth-form-header">
              <span class="auth-badge">Almost Done</span>
              <h2>Tell us about yourself</h2>
              <p>Personalize your experience so neighbors know who they are exchanging with.</p>
            </div>

            <form id="profile-setup-form" novalidate>
              <div class="form-group">
                <label for="setup-fullname">Full Name *</label>
                <div class="input-wrap">
                  <span class="input-icon">👤</span>
                  <input
                    type="text"
                    id="setup-fullname"
                    class="form-input has-icon"
                    required
                    autocomplete="name"
                    placeholder="e.g. Anushka Sharma"
                    value="${defaultName}"
                  />
                </div>
                <span class="input-hint">We'll use your first name for warm greetings.</span>
              </div>

              <div class="form-group" style="margin-top: 14px;">
                <label for="setup-age">Age *</label>
                <div class="input-wrap">
                  <span class="input-icon">🎂</span>
                  <input
                    type="number"
                    id="setup-age"
                    class="form-input has-icon"
                    required
                    min="5"
                    max="120"
                    step="1"
                    placeholder="e.g. 24"
                    value="${defaultAge}"
                  />
                </div>
                <span class="input-hint">Must be between 5 and 120 years.</span>
              </div>

              <div class="form-group" style="margin-top: 14px;">
                <label for="setup-city">Where are you from? (City / Location) *</label>
                <div class="input-wrap">
                  <span class="input-icon">📍</span>
                  <input
                    type="text"
                    id="setup-city"
                    class="form-input has-icon"
                    required
                    autocomplete="address-level2"
                    placeholder="e.g. Jaipur, Rajasthan"
                    value="${defaultCity}"
                  />
                </div>
                <span class="input-hint">Connects you with nearby exchanges and pickup hubs.</span>
              </div>

              <div class="form-error" id="setup-error" style="display:none;"></div>

              <button type="submit" class="btn btn-primary btn-block" id="setup-submit-btn" style="margin-top: 24px;">
                <span>Finish & Enter KindSwap</span>
                <span class="btn-arrow">→</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents(navigate) {
    const form = document.getElementById('profile-setup-form');
    const nameInput = document.getElementById('setup-fullname');
    const ageInput = document.getElementById('setup-age');
    const cityInput = document.getElementById('setup-city');
    const errorEl = document.getElementById('setup-error');
    const submitBtn = document.getElementById('setup-submit-btn');

    // Auto-focus name field
    setTimeout(() => nameInput?.focus(), 80);

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }

      const fullName = nameInput?.value?.trim() || '';
      const ageVal = ageInput?.value?.trim() || '';
      const city = cityInput?.value?.trim() || '';

      // Client-side validation
      if (!fullName) {
        showError('Please enter your full name.');
        nameInput?.focus();
        return;
      }

      if (fullName.length < 2) {
        showError('Full name must be at least 2 characters long.');
        nameInput?.focus();
        return;
      }

      if (!ageVal) {
        showError('Please enter your age.');
        ageInput?.focus();
        return;
      }

      const ageNum = parseInt(ageVal, 10);
      if (isNaN(ageNum) || ageNum < 5 || ageNum > 120) {
        showError('Please enter a valid reasonable age (between 5 and 120).');
        ageInput?.focus();
        return;
      }

      if (!city || city.length < 2) {
        showError('Please specify where you are from (city/location).');
        cityInput?.focus();
        return;
      }

      // Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner-dot"></span>
        <span>Saving profile…</span>
      `;

      try {
        const updatedUser = await AuthService.updateProfile({ name: fullName, age: ageNum, city: city });
        window.currentUser = updatedUser;

        const firstName = getFirstName(updatedUser.name);
        Toast.show(`Welcome aboard, ${firstName}! 🎉`, 'Profile setup complete.');

        // Route directly to Manus UI
        navigate('welcome');
      } catch (err) {
        showError(err.message || 'Failed to save profile. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Finish & Enter KindSwap</span><span class="btn-arrow">→</span>`;
      }
    });

    function showError(msg) {
      if (!errorEl) return;
      errorEl.textContent = msg;
      errorEl.style.display = 'block';
      errorEl.classList.remove('form-shake');
      void errorEl.offsetWidth; // re-flow to trigger animation
      errorEl.classList.add('form-shake');
    }
  }
};
