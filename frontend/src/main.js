import './style.css';
import { StorageService } from './db/storage.js';
import { AuthService } from './services/authService.js';
import { Navbar } from './components/Navbar.js';
import { HomeView } from './views/HomeView.js';
import { AuthView } from './views/AuthView.js';
import { ProfileSetupView } from './views/ProfileSetupView.js';
import { DonorView } from './views/DonorView.js';
import { NGOView } from './views/NGOView.js';
import { AdminView } from './views/AdminView.js';
import { getTimeBasedGreeting } from './utils/greeting.js';

// Global error handler
window.addEventListener('error', function (event) {
  console.error('Global error:', event.message, 'at', event.filename + ':' + event.lineno);
});

// Initialize StorageService
StorageService.init();

// ─── App State ───────────────────────────────────────────────────────────────
window.currentUser = null;
let currentView = 'welcome';

// DOM containers
let appContainer;
let navContainer;

// ─── Route Mapping ───────────────────────────────────────────────────────────
const viewToPath = {
  welcome: '/',
  login: '/login',
  register: '/register',
  'profile-setup': '/profile-setup',
  donor: '/donor',
  ngo: '/ngo',
  admin: '/admin',
  menu: '/dashboard'
};

function getRouteFromPath(pathname) {
  const path = pathname.toLowerCase().replace(/\/$/, '') || '/';
  if (path === '/login') return 'login';
  if (path === '/register') return 'register';
  if (path === '/profile-setup') return 'profile-setup';
  if (path === '/admin') return 'admin';
  return 'welcome';
}

function isProfileIncomplete(user) {
  return !user || !user.name || !user.age || !user.city;
}

// ─── Navigation ──────────────────────────────────────────────────────────────
export function navigate(view, push = true) {
  // Guard check: incomplete profile redirect
  if (window.currentUser && isProfileIncomplete(window.currentUser) && view !== 'profile-setup' && view !== 'login') {
    view = 'profile-setup';
  }

  // Guard check: protected routes
  const protectedViews = ['profile-setup', 'admin'];
  if (protectedViews.includes(view) && !window.currentUser) {
    view = 'login';
  }

  // If already completed profile and trying to visit profile-setup or legacy views, go to welcome (Manus UI)
  if (window.currentUser && !isProfileIncomplete(window.currentUser)) {
    if (view === 'profile-setup' || view === 'donor' || view === 'ngo') {
      view = 'welcome';
    }
  }

  currentView = view;

  // Synchronize browser history
  const targetPath = viewToPath[view] || '/';
  if (push && window.location.pathname !== targetPath) {
    window.history.pushState({ view }, '', targetPath);
  }

  renderApp();
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function renderNavbar() {
  // HomeView (welcome) has its own sidebar and topbar; auth screens have their own headers.
  const customHeaderScreens = ['login', 'register', 'profile-setup', 'welcome'];
  if (customHeaderScreens.includes(currentView)) {
    navContainer.innerHTML = '';
  } else {
    navContainer.innerHTML = Navbar.render();
    Navbar.attachEvents(navigate);
  }
}

// ─── Main Render ─────────────────────────────────────────────────────────────
async function renderApp() {
  if (!appContainer) return;
  appContainer.innerHTML = '';
  renderNavbar();

  try {
    if (currentView === 'login') {
      AuthView.setScreen('login');
      appContainer.innerHTML = AuthView.render();
      AuthView.attachEvents(navigate, renderApp);
    } else if (currentView === 'register') {
      AuthView.setScreen('register');
      appContainer.innerHTML = AuthView.render();
      AuthView.attachEvents(navigate, renderApp);
    } else if (currentView === 'profile-setup') {
      appContainer.innerHTML = ProfileSetupView.render();
      ProfileSetupView.attachEvents(navigate);
    } else if (currentView === 'admin' && window.currentUser && window.currentUser.role === 'admin') {
      appContainer.innerHTML = await AdminView.render();
      AdminView.attachEvents(navigate, renderApp);
    } else {
      // Default view for both guests and authenticated users is the Manus UI (HomeView)
      currentView = 'welcome';
      appContainer.innerHTML = HomeView.render();
      HomeView.attachEvents(navigate, renderApp);
    }
  } catch (e) {
    appContainer.innerHTML = `
      <div style="padding:60px;text-align:center;">
        <h2 style="color:var(--ink);">Oops, something went wrong.</h2>
        <p style="color:var(--muted-ink);margin:10px 0 20px;">${e.message}</p>
        <button class="btn btn-primary" onclick="window.location.reload()">Reload Page</button>
      </div>`;
    console.error(e);
  }
}

// ─── Role Menu ───────────────────────────────────────────────────────────────
function renderRoleMenu() {
  const role = window.currentUser.role;
  const greeting = getTimeBasedGreeting(window.currentUser.name);
  let menuItems = '';

  if (role === 'donor') {
    menuItems = `
      <div class="menu-card glass-panel" id="menu-donate">
        <span class="menu-card-icon">🎁</span>
        <h3>Donate something</h3>
        <p>Add new items to donate to NGOs and community members.</p>
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
        <p>Check the status of your community requests.</p>
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
        <h3>Admin dashboard</h3>
        <p>Platform statistics and matching overview.</p>
      </div>
    `;
  }

  appContainer.innerHTML = `
    <div class="view-header" style="text-align:center;margin-top:40px;">
      <span class="auth-badge">Workspace Menu</span>
      <h2 class="font-display">${greeting} <span class="wave">✦</span></h2>
      <p>What would you like to do today?</p>
    </div>
    <div class="role-menu-grid">
      ${menuItems}
    </div>
  `;

  if (role === 'donor') {
    document.getElementById('menu-donate')?.addEventListener('click', () => navigate('donor'));
    document.getElementById('menu-view-donor')?.addEventListener('click', () => navigate('donor'));
  } else if (role === 'ngo') {
    document.getElementById('menu-request')?.addEventListener('click', () => navigate('ngo'));
    document.getElementById('menu-view-ngo')?.addEventListener('click', () => navigate('ngo'));
  } else if (role === 'admin') {
    document.getElementById('menu-match')?.addEventListener('click', () => navigate('admin'));
    document.getElementById('menu-view-admin')?.addEventListener('click', () => navigate('admin'));
  }
}

// ─── Browser History Listener ────────────────────────────────────────────────
window.addEventListener('popstate', (e) => {
  const targetView = (e.state && e.state.view) || getRouteFromPath(window.location.pathname);
  navigate(targetView, false);
});

// ─── Bootstrap ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  appContainer = document.getElementById('app-container');
  navContainer = document.getElementById('top-nav-container');

  const initialRoute = getRouteFromPath(window.location.pathname);

  // Restore session from server
  try {
    const user = await AuthService.getMe();
    if (user) {
      window.currentUser = user;

      if (isProfileIncomplete(user)) {
        navigate('profile-setup', false);
        return;
      }

      // Returning user with completed profile
      if (initialRoute === 'welcome' || initialRoute === 'login' || initialRoute === 'register' || initialRoute === 'donor' || initialRoute === 'ngo') {
        navigate('welcome', false);
        return;
      }

      navigate(initialRoute, false);
      return;
    }
  } catch {
    // No session -> guest
  }

  // Not logged in
  if (['admin', 'profile-setup'].includes(initialRoute)) {
    navigate('login', false);
  } else {
    navigate(initialRoute, false);
  }
});
