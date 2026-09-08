import './style.css';
import { StorageService } from './db/storage.js';
import { AuthService } from './services/authService.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { HomeView } from './views/HomeView.js';
import { WelcomeView } from './views/WelcomeView.js';
import { AuthView } from './views/AuthView.js';
import { DonorView } from './views/DonorView.js';
import { NGOView } from './views/NGOView.js';
import { AdminView } from './views/AdminView.js';

// Global error handler
window.addEventListener('error', function(event) {
  console.error('Global error:', event.message, 'at', event.filename + ':' + event.lineno);
});

// Initialize StorageService (states/categories used by dropdowns)
StorageService.init();

// ─── App State ───────────────────────────────────────────────────────────────
window.currentUser = null;
let currentView = 'welcome';

// DOM containers — assigned once DOMContentLoaded fires
let appContainer;
let navContainer;

// ─── Navigation ──────────────────────────────────────────────────────────────
function navigate(view) {
  currentView = view;
  renderApp();
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
// Always writes to the single #top-nav-container — never creates a new one.
function renderNavbar() {
  if (currentView === 'welcome' || currentView === 'login') {
    navContainer.innerHTML = '';
  } else {
    navContainer.innerHTML = Navbar.render();
    Navbar.attachEvents(navigate);
  }
}

// ─── Main Render ─────────────────────────────────────────────────────────────
async function renderApp() {
  // 1. Clear content area
  appContainer.innerHTML = '';
  // 2. Refresh navbar
  renderNavbar();

  try {
    if (currentView === 'login') {
      appContainer.innerHTML = AuthView.render();
      AuthView.attachEvents(navigate, renderApp);
    } else if (currentView === 'welcome') {
      appContainer.innerHTML = HomeView.render();
      HomeView.attachEvents(navigate, renderApp);
    } else if (!window.currentUser) {
      currentView = 'welcome';
      appContainer.innerHTML = HomeView.render();
      HomeView.attachEvents(navigate, renderApp);
    } else {
      // Authenticated — role-based routing (server enforces auth)
      if (currentView === 'menu') {
        renderRoleMenu();
      } else if (currentView === 'donor' && window.currentUser.role === 'donor') {
        appContainer.innerHTML = await DonorView.render();
        DonorView.attachEvents(navigate, renderApp);
      } else if (currentView === 'ngo' && window.currentUser.role === 'ngo') {
        appContainer.innerHTML = await NGOView.render();
        NGOView.attachEvents(navigate, renderApp);
      } else if (currentView === 'admin' && window.currentUser.role === 'admin') {
        appContainer.innerHTML = await AdminView.render();
        AdminView.attachEvents(navigate, renderApp);
      } else {
        currentView = 'welcome';
        appContainer.innerHTML = HomeView.render();
        HomeView.attachEvents(navigate, renderApp);
      }
    }
  } catch (e) {
    appContainer.innerHTML = `
      <div style="padding:60px;text-align:center;">
        <h2 style="color:var(--warning)">Oops, something went wrong.</h2>
        <p style="color:var(--text-secondary)">${e.message}</p>
        <button class="btn btn-primary" onclick="window.location.reload()">Reload Page</button>
      </div>`;
    console.error(e);
  }
}

// ─── Role Menu ───────────────────────────────────────────────────────────────
function renderRoleMenu() {
  const role = window.currentUser.role;
  const displayName = window.currentUser.name || window.currentUser.email;
  let menuItems = '';

  if (role === 'donor') {
    menuItems = `
      <div class="menu-card glass-panel" id="menu-donate">
        <span class="menu-card-icon">🎁</span>
        <h3>Donate something</h3>
        <p>Add new items to donate to NGOs.</p>
      </div>
      <div class="menu-card glass-panel" id="menu-view-donor">
        <span class="menu-card-icon">📊</span>
        <h3>View dashboard</h3>
        <p>See the status of your past donations.</p>
      </div>
    `;
  } else if (role === 'ngo') {
    menuItems = `
      <div class="menu-card glass-panel" id="menu-request">
        <span class="menu-card-icon">🤝</span>
        <h3>Request help</h3>
        <p>Browse available resources and request a match.</p>
      </div>
      <div class="menu-card glass-panel" id="menu-view-ngo">
        <span class="menu-card-icon">📋</span>
        <h3>View dashboard</h3>
        <p>Check the status of your requests.</p>
      </div>
    `;
  } else if (role === 'admin') {
    menuItems = `
      <div class="menu-card glass-panel" id="menu-match">
        <span class="menu-card-icon">⚡</span>
        <h3>Match resources</h3>
        <p>Review requests from NGOs and assign items.</p>
      </div>
      <div class="menu-card glass-panel" id="menu-view-admin">
        <span class="menu-card-icon">📈</span>
        <h3>View dashboard</h3>
        <p>Platform statistics and overview.</p>
      </div>
    `;
  }

  appContainer.innerHTML = `
    <div class="view-header" style="text-align:center;margin-top:40px;">
      <h2>Hello, ${displayName}!</h2>
      <p>What would you like to do today?</p>
    </div>
    <div class="role-menu-grid">
      ${menuItems}
    </div>
  `;

  if (role === 'donor') {
    document.getElementById('menu-donate')?.addEventListener('click',     () => navigate('donor'));
    document.getElementById('menu-view-donor')?.addEventListener('click', () => navigate('donor'));
  } else if (role === 'ngo') {
    document.getElementById('menu-request')?.addEventListener('click',    () => navigate('ngo'));
    document.getElementById('menu-view-ngo')?.addEventListener('click',   () => navigate('ngo'));
  } else if (role === 'admin') {
    document.getElementById('menu-match')?.addEventListener('click',      () => navigate('admin'));
    document.getElementById('menu-view-admin')?.addEventListener('click', () => navigate('admin'));
  }
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  appContainer = document.getElementById('app-container');
  navContainer = document.getElementById('top-nav-container');

  // Restore session from server (fixes lost-on-refresh bug)
  try {
    const user = await AuthService.getMe();
    if (user) {
      window.currentUser = user;
      currentView = 'menu';
    }
  } catch {
    // No session — start as guest
  }

  renderApp();
});
