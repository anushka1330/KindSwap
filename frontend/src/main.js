import './style.css';
import { StorageService } from './db/storage.js';
import { ResourceService } from './services/resourceService.js';
import { MatchingService } from './services/matchingService.js';

window.addEventListener('error', function(event) {
  alert('Global error: ' + event.message + ' at ' + event.filename + ':' + event.lineno);
});

// Initialize DB (Local config)
StorageService.init();

// App State
window.currentUser = null;
let currentView = 'welcome'; // welcome | login | menu | donor | ngo | admin

// DOM Elements
const appContainer = document.getElementById('app-container');
const topNav = document.getElementById('top-nav');

// Main Render Logic
async function renderApp() {
  appContainer.innerHTML = '';
  
  if (!window.currentUser) {
    topNav.innerHTML = '';
    if (currentView === 'welcome') {
      renderWelcomeView();
    } else {
      renderLoginView();
    }
  } else {
    // Logged in UI navigation
    topNav.innerHTML = `
      <div style="display:flex; align-items:center; gap:15px">
        <span style="color:var(--text-secondary); font-size:14px;">Logged in as: <strong>${window.currentUser.role}</strong> (${window.currentUser.email})</span>
        <button id="nav-menu-btn" class="btn btn-primary btn-small">Dashboard Menu</button>
        <button id="logout-btn" class="btn btn-secondary btn-small">Logout</button>
      </div>
    `;
    
    document.getElementById('logout-btn').addEventListener('click', () => {
      window.currentUser = null;
      currentView = 'welcome';
      renderApp();
    });

    document.getElementById('nav-menu-btn').addEventListener('click', () => {
      currentView = 'menu';
      renderApp();
    });

    try {
      if (currentView === 'menu') {
        renderRoleMenu();
      } else if (currentView === 'donor' && window.currentUser.role === 'donor') {
        await renderDonorView();
      } else if (currentView === 'ngo' && window.currentUser.role === 'ngo') {
        await renderNgoView();
      } else if (currentView === 'admin' && window.currentUser.role === 'admin') {
        await renderAdminView();
      } else {
        // Fallback to menu
        currentView = 'menu';
        renderRoleMenu();
      }
    } catch (e) {
      appContainer.innerHTML = `<h1 style="color:red">ERROR inside render: ${e.message}</h1>`;
    }
  }
}

function getBadgeClass(status) {
  if (status === 'Available') return 'badge-available';
  if (status === 'Assigned') return 'badge-assigned';
  if (status === 'Requested') return 'badge-assigned'; // Same color as assigned for now
  return 'badge-delivered';
}

function getSidebarHTML() {
  if (!window.currentUser) return '';
  return `
    <aside class="sidebar-profile">
      <div class="glass-panel">
        <div class="profile-avatar">${window.currentUser.email.charAt(0).toUpperCase()}</div>
        <h3 style="margin-bottom:15px; font-size:20px;">Profile Details</h3>
        <div class="profile-detail">
          <span>Name/Email Address</span>
          <strong>${window.currentUser.email}</strong>
        </div>
        <div class="profile-detail">
          <span>Role</span>
          <strong style="text-transform: capitalize;">${window.currentUser.role}</strong>
        </div>
        <div class="profile-detail">
          <span>Location</span>
          <strong>${window.currentUser.state}</strong>
        </div>
      </div>
    </aside>
  `;
}

// -------------------------------------------------------------
// WELCOME VIEW
// -------------------------------------------------------------
function renderWelcomeView() {
  appContainer.innerHTML = `
    <div class="welcome-container">
      <div class="glass-panel welcome-card">
        <h2>Welcome to KindSwap</h2>
        <p>Your community platform for connecting and sharing resources. Whether you want to donate items, request help for your NGO, or manage resource matching, you're in the right place!</p>
        <button id="get-started-btn" class="btn btn-primary" style="font-size: 18px; padding: 15px 30px;">Get Started</button>
      </div>
    </div>
  `;

  document.getElementById('get-started-btn').addEventListener('click', () => {
    currentView = 'login';
    renderApp();
  });
}


// -------------------------------------------------------------
// LOGIN / SIGNUP VIEW
// -------------------------------------------------------------
function renderLoginView() {
  let isSignUp = false;

  const renderForm = () => {
    const statesOptions = StorageService.getStates().map(s => `<option value="${s}">${s}</option>`).join('');
    
    appContainer.innerHTML = `
      <div class="auth-container">
        <div class="glass-panel auth-card">
          <div class="auth-header">
            <h2>${isSignUp ? 'Create Account' : 'Sign In'}</h2>
            <p>${isSignUp ? 'Join our community of sharing.' : 'Login to continue connecting and sharing.'}</p>
          </div>
          <form id="login-form">
            <div class="form-group">
              <label>Name or Email Address</label>
              <input type="text" id="login-email" required placeholder="Enter your name or email">
            </div>
            
            <div class="form-group">
              <label>Password</label>
              <input type="password" id="login-password" required placeholder="Enter your password">
            </div>

            ${isSignUp ? `
              <div class="form-group">
                <label>Location (State)</label>
                <select id="login-state" class="state-dropdown">${statesOptions}</select>
              </div>
              <div class="form-group" style="margin-bottom:20px;">
                <label>I am a:</label>
                <div class="role-options">
                  <div class="role-option">
                    <input type="radio" id="role-donor" name="login-role" value="donor" checked>
                    <label for="role-donor">Donor</label>
                  </div>
                  <div class="role-option">
                    <input type="radio" id="role-ngo" name="login-role" value="ngo">
                    <label for="role-ngo">NGO</label>
                  </div>
                  <div class="role-option">
                    <input type="radio" id="role-admin" name="login-role" value="admin">
                    <label for="role-admin">Admin</label>
                  </div>
                </div>
              </div>
            ` : ''}
            
            <button type="submit" class="btn btn-primary" style="width:100%; padding:15px; font-size:16px; margin-bottom: 15px;">
              ${isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
            
            <div style="text-align: center; color: var(--text-secondary); font-size: 14px;">
              ${isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <a href="#" id="toggle-signup" style="color: var(--accent-cyan); text-decoration: none; font-weight: bold;">
                ${isSignUp ? 'Sign In' : 'Sign Up'}
              </a>
            </div>
          </form>
        </div>
      </div>
    `;

    document.getElementById('toggle-signup').addEventListener('click', (e) => {
      e.preventDefault();
      isSignUp = !isSignUp;
      renderForm();
    });

    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      let role = null;
      let state = null;

      if (isSignUp) {
        role = document.querySelector('input[name="login-role"]:checked').value;
        state = document.getElementById('login-state').value;
      }
      
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, role, state, password })
        });
        
        if (response.status === 401) {
          alert('Incorrect password. Please try again.');
          return;
        }
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Login failed');
        }
        
        window.currentUser = data;
        currentView = 'menu';
        renderApp();
      } catch (err) {
        alert(err.message || 'Error logging in. Ensure the backend server is running on port 5000.');
        console.error(err);
      }
    });
  };

  renderForm();
}

// -------------------------------------------------------------
// ROLE MENU VIEW
// -------------------------------------------------------------
function renderRoleMenu() {
  const role = window.currentUser.role;
  let menuItems = '';

  if (role === 'donor') {
    menuItems = `
      <div class="menu-card" id="menu-donate">
        <span class="menu-card-icon">🎁</span>
        <h3>Donate something</h3>
        <p>Add new items to donate to NGOs.</p>
      </div>
      <div class="menu-card" id="menu-view-donor">
        <span class="menu-card-icon">📊</span>
        <h3>View dashboard</h3>
        <p>See the status of your past donations.</p>
      </div>
    `;
  } else if (role === 'ngo') {
    menuItems = `
      <div class="menu-card" id="menu-request">
        <span class="menu-card-icon">🤝</span>
        <h3>Request help</h3>
        <p>Browse available resources and request a match.</p>
      </div>
      <div class="menu-card" id="menu-view-ngo">
        <span class="menu-card-icon">📋</span>
        <h3>View dashboard</h3>
        <p>Check the status of your requests.</p>
      </div>
    `;
  } else if (role === 'admin') {
    menuItems = `
      <div class="menu-card" id="menu-match">
        <span class="menu-card-icon">⚡</span>
        <h3>Match resources</h3>
        <p>Review requests from NGOs and assign items.</p>
      </div>
      <div class="menu-card" id="menu-view-admin">
        <span class="menu-card-icon">📈</span>
        <h3>View dashboard</h3>
        <p>Platform statistics and overview.</p>
      </div>
    `;
  }

  appContainer.innerHTML = `
    <div class="view-header" style="text-align: center; margin-top: 20px;">
      <h2>Hello, ${window.currentUser.email}!</h2>
      <p>What would you like to do today?</p>
    </div>
    <div class="role-menu-grid">
      ${menuItems}
    </div>
  `;

  // Attach listeners dynamically
  if (role === 'donor') {
    document.getElementById('menu-donate').addEventListener('click', () => { currentView = 'donor'; renderApp(); });
    document.getElementById('menu-view-donor').addEventListener('click', () => { currentView = 'donor'; renderApp(); });
  } else if (role === 'ngo') {
    document.getElementById('menu-request').addEventListener('click', () => { currentView = 'ngo'; renderApp(); });
    document.getElementById('menu-view-ngo').addEventListener('click', () => { currentView = 'ngo'; renderApp(); });
  } else if (role === 'admin') {
    document.getElementById('menu-match').addEventListener('click', () => { currentView = 'admin'; renderApp(); });
    document.getElementById('menu-view-admin').addEventListener('click', () => { currentView = 'admin'; renderApp(); });
  }
}

// -------------------------------------------------------------
// DONOR VIEW
// -------------------------------------------------------------
async function renderDonorView() {
  const donations = await ResourceService.getDonationsByDonor(window.currentUser.id);
  
  const statesOptions = StorageService.getStates().map(s => `<option value="${s}">${s}</option>`).join('');
  const catOptions = StorageService.getCategories().map(c => `<option value="${c}">${c}</option>`).join('');

  appContainer.innerHTML = `
    <div class="app-layout">
      ${getSidebarHTML()}
      <div class="main-content">
        <div class="view-header">
          <h2>Donor Dashboard</h2>
          <p>Manage your donations and help your community.</p>
        </div>
        
        <div class="dashboard-split">
          <div class="glass-panel">
            <h3 class="section-title" style="margin-top:0;">New Donation</h3>
            <form id="add-donation-form">
              <div class="form-group">
                <label>Item Description</label>
                <input type="text" id="d-title" required placeholder="E.g., Winter Coats">
              </div>
              <div class="form-group">
                <label>Category</label>
                <select id="d-category">${catOptions}</select>
              </div>
              <div class="form-group">
                <label>Quantity</label>
                <input type="number" id="d-quantity" required min="1" value="1">
              </div>
              <div class="form-group">
                <label>Location (State)</label>
                <select id="d-state" class="state-dropdown">${statesOptions}</select>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%">Add Donation</button>
            </form>
          </div>
          
          <div>
            <h3 class="section-title" style="margin-top:0;">My Donations</h3>
            <div class="card-grid" id="donor-list" style="grid-template-columns: 1fr;"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  const listContainer = document.getElementById('donor-list');
  if (donations.length === 0) {
    listContainer.innerHTML = '<div class="empty-state">No donations yet. Start giving!</div>';
  } else {
    listContainer.innerHTML = donations.map(d => `
      <div class="glass-panel resource-card">
        <div class="card-header">
          <div class="card-title">${d.title}</div>
          <span class="badge ${getBadgeClass(d.status)}">${d.status}</span>
        </div>
        <div class="card-body">
          <p><span>Category:</span> ${d.category}</p>
          <p><span>Quantity:</span> ${d.quantity || 1}</p>
          <p><span>State:</span> ${d.state}</p>
          <p><span>Date:</span> ${new Date(d.date).toLocaleDateString()}</p>
          ${d.status === 'Assigned' ? `<button class="btn btn-secondary mt-10 deliver-btn" data-id="${d.id}" style="margin-top:10px; padding: 5px 10px; font-size:12px;">Mark Delivered</button>` : ''}
        </div>
      </div>
    `).join('');
  }

  // Event Listeners
  document.getElementById('add-donation-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await ResourceService.addDonation({
      title: document.getElementById('d-title').value,
      category: document.getElementById('d-category').value,
      quantity: parseInt(document.getElementById('d-quantity').value),
      state: document.getElementById('d-state').value,
      donorId: window.currentUser.id
    });
    renderApp();
  });

  document.querySelectorAll('.deliver-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      await MatchingService.markDelivered(e.target.dataset.id);
      renderApp();
    });
  });
}

// -------------------------------------------------------------
// NGO/VOLUNTEER VIEW
// -------------------------------------------------------------
async function renderNgoView() {
  const availableMatches = await MatchingService.getMatchesForNGO(window.currentUser.state);

  appContainer.innerHTML = `
    <div class="app-layout">
      ${getSidebarHTML()}
      <div class="main-content">
        <div class="view-header">
          <h2>NGO / Volunteer Dashboard</h2>
          <p>Find resources available near you (Base State: <strong>${window.currentUser.state}</strong>).</p>
        </div>
        
        <div class="glass-panel">
          <h3 class="section-title" style="margin-top:0;">Available Matches</h3>
          <div class="card-grid" id="ngo-list"></div>
        </div>
      </div>
    </div>
  `;

  const listContainer = document.getElementById('ngo-list');
  if (availableMatches.length === 0) {
    listContainer.innerHTML = '<div class="empty-state">No available donations found. Check back later!</div>';
  } else {
    listContainer.innerHTML = availableMatches.map(d => `
      <div class="glass-panel resource-card">
        <div class="card-header">
          <div class="card-title">${d.title}</div>
          <span class="badge ${getBadgeClass(d.status)}">${d.status}</span>
        </div>
        <div class="card-body">
          <p><span>Category:</span> ${d.category}</p>
          <p><span>Quantity:</span> ${d.quantity || 1}</p>
          <p><span>State:</span> ${d.state}</p>
          <div class="match-score">${d.matchScore}</div>
          <div style="margin-top:15px;">
            <button class="btn btn-primary accept-btn" data-id="${d.id}">Request Match</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  document.querySelectorAll('.accept-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      await MatchingService.requestMatch(e.target.dataset.id, window.currentUser.id);
      renderApp();
    });
  });
}

// -------------------------------------------------------------
// ADMIN VIEW
// -------------------------------------------------------------
async function renderAdminView() {
  const requestedItems = await MatchingService.getRequestedDonations();

  appContainer.innerHTML = `
    <div class="app-layout">
      ${getSidebarHTML()}
      <div class="main-content">
        <div class="view-header">
          <h2>Admin Match Dashboard</h2>
          <p>Review requests from NGOs and assign items to fulfill them.</p>
        </div>
        
        <div class="glass-panel">
          <h3 class="section-title" style="margin-top:0;">Pending Requests</h3>
          <div class="card-grid" id="admin-list"></div>
        </div>
      </div>
    </div>
  `;

  const listContainer = document.getElementById('admin-list');
  if (requestedItems.length === 0) {
    listContainer.innerHTML = '<div class="empty-state">No pending requests at the moment.</div>';
  } else {
    listContainer.innerHTML = requestedItems.map(d => `
      <div class="glass-panel resource-card" style="border-color: var(--warning)">
        <div class="card-header">
          <div class="card-title">${d.title}</div>
          <span class="badge ${getBadgeClass(d.status)}">${d.status}</span>
        </div>
        <div class="card-body">
          <p><span>Category:</span> ${d.category}</p>
          <p><span>Quantity:</span> ${d.quantity || 1}</p>
          <p><span>State:</span> ${d.state}</p>
          <p><span>Requested By (NGO ID):</span> ${d.requestedBy}</p>
          <div style="margin-top:15px; display: flex; gap: 10px;">
            <button class="btn btn-primary match-btn" data-id="${d.id}">Run Admin Match (Assign)</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  document.querySelectorAll('.match-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      await MatchingService.adminMatchDonation(e.target.dataset.id);
      renderApp();
    });
  });
}

// Initial render
renderApp();
