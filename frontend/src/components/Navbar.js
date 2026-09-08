import { AuthService } from '../services/authService.js';

export const Navbar = {
  render() {
    let navLinks = '';
    if (window.currentUser) {
      const displayName = window.currentUser.name || window.currentUser.email;
      navLinks = `
        <div class="nav-auth-state">
          <span class="nav-user-info">Hi, ${displayName}</span>
          <button id="nav-menu-btn" class="btn btn-secondary btn-small">Dashboard</button>
          <button id="logout-btn" class="btn btn-outline btn-small">Logout</button>
        </div>
      `;
    } else {
      navLinks = `
        <button id="nav-login-btn" class="btn btn-secondary btn-small">Login</button>
        <button id="nav-signup-btn" class="btn btn-primary btn-small">Get Started</button>
      `;
    }

    return `
      <header class="app-header">
        <div class="logo" id="nav-logo">
          <div class="logo-icon">💬🔄</div>
          <h1>Kind<span>Swap</span></h1>
        </div>
        <nav id="top-nav" class="desktop-nav">
          ${!window.currentUser ? `
            <a href="#" class="nav-link" onclick="document.getElementById('how-it-works')?.scrollIntoView({behavior:'smooth'})">How It Works</a>
            <a href="#" class="nav-link" onclick="document.querySelector('.impact-section')?.scrollIntoView({behavior:'smooth'})">Our Impact</a>
          ` : ''}
          ${navLinks}
        </nav>
      </header>
    `;
  },

  attachEvents(navigate) {
    document.getElementById('nav-logo')?.addEventListener('click', () => {
      navigate(window.currentUser ? 'menu' : 'welcome');
    });

    document.getElementById('logout-btn')?.addEventListener('click', async () => {
      try {
        await AuthService.logout();
      } catch { /* ignore */ }
      window.currentUser = null;
      navigate('welcome');
    });

    document.getElementById('nav-menu-btn')?.addEventListener('click', () => navigate('menu'));
    document.getElementById('nav-login-btn')?.addEventListener('click', () => navigate('login'));
    document.getElementById('nav-signup-btn')?.addEventListener('click', () => navigate('login'));
  }
};
