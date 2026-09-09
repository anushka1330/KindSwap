import { AuthService } from '../services/authService.js';
import { getFirstName } from '../utils/greeting.js';

export const Navbar = {
  render() {
    let navLinks = '';
    if (window.currentUser) {
      const firstName = getFirstName(window.currentUser.name) || 'Friend';
      const roleLabel = window.currentUser.role === 'ngo' ? 'NGO' : (window.currentUser.role === 'admin' ? 'Admin' : 'Donor');

      navLinks = `
        <div class="nav-auth-state">
          <span class="nav-user-info">
            <span class="nav-avatar-dot"></span>
            Hi, <strong>${firstName}</strong>
            <span class="nav-role-badge">${roleLabel}</span>
          </span>
          <button id="nav-dash-btn" class="btn btn-secondary btn-small">Dashboard</button>
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
          <div class="logo-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>
            </svg>
          </div>
          <h1>Kind<span>Swap</span></h1>
        </div>
        <nav id="top-nav" class="desktop-nav">
          ${!window.currentUser ? `
            <a href="#" class="nav-link" id="nav-link-how">How It Works</a>
            <a href="#" class="nav-link" id="nav-link-impact">Our Impact</a>
          ` : ''}
          ${navLinks}
        </nav>
      </header>
    `;
  },

  attachEvents(navigate) {
    document.getElementById('nav-logo')?.addEventListener('click', () => {
      navigate(window.currentUser ? (window.currentUser.role || 'welcome') : 'welcome');
    });

    document.getElementById('logout-btn')?.addEventListener('click', async () => {
      try {
        await AuthService.logout();
      } catch { /* ignore */ }
      window.currentUser = null;
      navigate('login');
    });

    document.getElementById('nav-dash-btn')?.addEventListener('click', () => {
      if (!window.currentUser) {
        navigate('login');
        return;
      }
      if (!window.currentUser.name || !window.currentUser.age) {
        navigate('profile-setup');
        return;
      }
      navigate(window.currentUser.role || 'welcome');
    });

    document.getElementById('nav-login-btn')?.addEventListener('click', () => navigate('login'));
    document.getElementById('nav-signup-btn')?.addEventListener('click', () => navigate('register'));

    document.getElementById('nav-link-how')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('nav-link-impact')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.impact-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
};
