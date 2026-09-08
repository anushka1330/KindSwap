export const WelcomeView = {
  render() {
    return `
      <div class="welcome-container">
        <!-- Hero Section -->
        <section class="hero-section">
          <div class="hero-content">
            <h1 class="hero-title">Give What You Can.<br>Get What You Need.</h1>
            <p class="hero-subtitle">Share More. Waste Less. Help Together. KindSwap connects donors, NGOs, volunteers, and communities so useful resources reach the people who need them most.</p>
            <div class="hero-actions">
              <button id="hero-get-started" class="btn btn-primary">Get Started</button>
              <button class="btn btn-secondary" onclick="document.getElementById('how-it-works').scrollIntoView({behavior: 'smooth'})">How It Works</button>
            </div>
          </div>
          <div class="hero-visual">
            <div class="visual-circle">
              <div class="floating-card c1">📚 Books</div>
              <div class="floating-card c2">👕 Clothes</div>
              <div class="floating-card c3">🍱 Food</div>
              <div class="floating-card c4">🏠 Household</div>
            </div>
          </div>
        </section>

        <!-- How KindSwap Works -->
        <section id="how-it-works" class="how-it-works-section">
          <h2>How KindSwap Works</h2>
          <div class="steps-grid">
            <div class="step-card">
              <div class="step-number">01</div>
              <h3>Give</h3>
              <p>A donor lists a useful resource they want to share.</p>
            </div>
            <div class="step-connector"></div>
            <div class="step-card">
              <div class="step-number">02</div>
              <h3>Match</h3>
              <p>KindSwap helps connect available resources with relevant community needs.</p>
            </div>
            <div class="step-connector"></div>
            <div class="step-card">
              <div class="step-number">03</div>
              <h3>Connect</h3>
              <p>An NGO or appropriate community member requests the resource.</p>
            </div>
            <div class="step-connector"></div>
            <div class="step-card">
              <div class="step-number">04</div>
              <h3>Impact</h3>
              <p>The resource reaches someone who can use it instead of going to waste.</p>
            </div>
          </div>
        </section>

        <!-- Give / Get Exchange Section -->
        <section class="exchange-section">
          <div class="exchange-container">
            <div class="exchange-side give-side">
              <h2>I have something useful to share.</h2>
              <button class="btn btn-primary" id="btn-give">Give Items</button>
            </div>
            <div class="exchange-divider">
              <div class="exchange-icon">↔</div>
            </div>
            <div class="exchange-side get-side">
              <h2>I need something for my community.</h2>
              <button class="btn btn-secondary" id="btn-get">Get Items</button>
            </div>
          </div>
        </section>

        <!-- Who KindSwap Is For -->
        <section class="who-section">
          <h2>Who KindSwap Is For</h2>
          <div class="who-grid">
            <div class="who-card">
              <div class="who-icon">👤</div>
              <h3>Donors</h3>
              <p>Turn unused resources into meaningful help. List useful items and help them reach people who need them.</p>
            </div>
            <div class="who-card">
              <div class="who-icon">🧑‍🤝‍🧑</div>
              <h3>NGOs / Volunteers</h3>
              <p>Find resources that can support your community. Discover and request relevant resources nearby.</p>
            </div>
            <div class="who-card">
              <div class="who-icon">🛠️</div>
              <h3>Administrators</h3>
              <p>Coordinate the resource-sharing process. Manage requests and ensure fair assignments.</p>
            </div>
          </div>
        </section>

        <!-- Impact Section -->
        <section class="impact-section">
          <h2>Our Growing Community Impact</h2>
          <div class="impact-grid">
            <div class="impact-stat">
              <div class="stat-number">Growing</div>
              <div class="stat-label">Total Donations</div>
            </div>
            <div class="impact-stat">
              <div class="stat-number">Active</div>
              <div class="stat-label">Community Network</div>
            </div>
            <div class="impact-stat">
              <div class="stat-number">Expanding</div>
              <div class="stat-label">NGOs Connected</div>
            </div>
          </div>
          <p style="text-align:center; margin-top: 20px; color: var(--text-secondary);">We are building the UI for live metrics. Join us and make an impact!</p>
        </section>
      </div>
    `;
  },
  attachEvents(navigate) {
    document.getElementById('hero-get-started')?.addEventListener('click', () => navigate('login'));
    document.getElementById('btn-give')?.addEventListener('click', () => navigate('login'));
    document.getElementById('btn-get')?.addEventListener('click', () => navigate('login'));
  }
};
