import './style.css';
import { StorageService } from './db/storage.js';
import { ResourceService } from './services/resourceService.js';
import { MatchingService } from './services/matchingService.js';

window.addEventListener('error', function(event) {
  alert('Global error: ' + event.message + ' at ' + event.filename + ':' + event.lineno);
});

// Initialize DB
StorageService.init();

// App State
let currentUser = null; // null means not logged in

// DOM Elements
const appContainer = document.getElementById('app-container');
const topNav = document.getElementById('top-nav');

// Main Render Logic
function renderApp() {
  appContainer.innerHTML = '';
  
  if (!currentUser) {
    // Show login if no user
    topNav.innerHTML = '';
    renderLoginView();
  } else {
    // Logged in UI navigation
    topNav.innerHTML = `
      <div style="display:flex; align-items:center; gap:15px">
        <span style="color:var(--text-secondary); font-size:14px;">Logged in as: <strong>${currentUser.role}</strong> (${currentUser.email})</span>
        <button id="logout-btn" class="btn btn-secondary btn-small">Logout</button>
      </div>
    `;
    document.getElementById('logout-btn').addEventListener('click', () => {
      currentUser = null;
      renderApp();
    });

    try {
      if (currentUser.role === 'donor') renderDonorView();
      else if (currentUser.role === 'ngo') renderNgoView();
      else appContainer.innerHTML = `<h1 style="color:red">ERROR: Role not recognized (${currentUser.role})</h1>`;
    } catch (e) {
      appContainer.innerHTML = `<h1 style="color:red">ERROR inside render: ${e.message}</h1>`;
    }
  }
}

function getBadgeClass(status) {
  if (status === 'Available') return 'badge-available';
  if (status === 'Assigned') return 'badge-assigned';
  return 'badge-delivered';
}

function getSidebarHTML() {
  if (!currentUser) return '';
  return `
    <aside class="sidebar-profile">
      <div class="glass-panel">
        <div class="profile-avatar">${currentUser.email.charAt(0).toUpperCase()}</div>
        <h3 style="margin-bottom:15px; font-size:20px;">Profile Details</h3>
        <div class="profile-detail">
          <span>Email Address</span>
          <strong>${currentUser.email}</strong>
        </div>
        <div class="profile-detail">
          <span>Role</span>
          <strong style="text-transform: capitalize;">${currentUser.role}</strong>
        </div>
        <div class="profile-detail">
          <span>Location</span>
          <strong>${currentUser.state}</strong>
        </div>
      </div>
    </aside>
  `;
}

// -------------------------------------------------------------
// LOGIN VIEW
// -------------------------------------------------------------
function renderLoginView() {
  const statesOptions = StorageService.getStates().map(s => `<option value="${s}">${s}</option>`).join('');

  appContainer.innerHTML = `
    <div class="auth-container">
      <div class="glass-panel auth-card">
        <div class="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to continue connecting and sharing.</p>
        </div>
        <form id="login-form">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="login-email" required placeholder="you@example.com">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="login-password" required placeholder="Enter your password">
          </div>
          <div class="form-group">
            <label>Location (State)</label>
            <select id="login-state" class="state-dropdown">${statesOptions}</select>
          </div>
          <div class="form-group" style="margin-bottom:30px;">
            <label>I am a:</label>
            <div class="role-options">
              <div class="role-option">
                <input type="radio" id="role-donor" name="login-role" value="donor" checked>
                <label for="role-donor">Donor</label>
              </div>
              <div class="role-option">
                <input type="radio" id="role-ngo" name="login-role" value="ngo">
                <label for="role-ngo">NGO / Volunteer</label>
              </div>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%; padding:15px; font-size:16px;">Sign In</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const role = document.querySelector('input[name="login-role"]:checked').value;
    const state = document.getElementById('login-state').value;
    
    // Mock login functionality
    currentUser = {
      id: email, // Use email as mock ID
      email: email,
      role: role,
      state: state
    };
    
    renderApp();
  });
}


// -------------------------------------------------------------
// DONOR VIEW
// -------------------------------------------------------------
function renderDonorView() {
  const donations = ResourceService.getDonationsByDonor(currentUser.id);
  
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
            <div class="card-grid" id="donor-list"></div>
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
  document.getElementById('add-donation-form').addEventListener('submit', (e) => {
    e.preventDefault();
    ResourceService.addDonation({
      title: document.getElementById('d-title').value,
      category: document.getElementById('d-category').value,
      quantity: parseInt(document.getElementById('d-quantity').value),
      state: document.getElementById('d-state').value,
      donorId: currentUser.id
    });
    renderApp();
  });

  document.querySelectorAll('.deliver-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      MatchingService.markDelivered(e.target.dataset.id);
      renderApp();
    });
  });
}

// -------------------------------------------------------------
// NGO/VOLUNTEER VIEW
// -------------------------------------------------------------
function renderNgoView() {
  const availableMatches = MatchingService.getMatchesForNGO(currentUser.state);

  appContainer.innerHTML = `
    <div class="app-layout">
      ${getSidebarHTML()}
      <div class="main-content">
        <div class="view-header">
          <h2>NGO / Volunteer Dashboard</h2>
          <p>Find resources available near you (Base State: <strong>${currentUser.state}</strong>).</p>
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
    btn.addEventListener('click', (e) => {
      MatchingService.matchDonation(e.target.dataset.id);
      renderApp();
    });
  });
}

// Initial render
renderApp();
