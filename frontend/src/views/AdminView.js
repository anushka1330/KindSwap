import { MatchingService } from '../services/matchingService.js';
import { Toast } from '../components/Toast.js';
import { getTimeBasedGreeting, getFirstName } from '../utils/greeting.js';

function getBadgeClass(status) {
  if (status === 'Available') return 'badge-available';
  if (status === 'Assigned' || status === 'Requested') return 'badge-assigned';
  return 'badge-delivered';
}

function getSidebarHTML() {
  if (!window.currentUser) return '';
  const firstName = getFirstName(window.currentUser.name) || 'Admin';
  const initial = firstName.charAt(0).toUpperCase();

  return `
    <aside class="sidebar-profile">
      <div class="glass-panel profile-card">
        <div class="profile-header">
          <div class="profile-avatar" style="background:#fce8be;color:#856108;">${initial}</div>
          <h3 class="profile-name">${window.currentUser.name || window.currentUser.email}</h3>
          <span class="profile-role-badge" style="background:#fce8be;color:#856108;">Platform Admin</span>
        </div>
        <div class="profile-stats">
          <div class="profile-detail">
            <span>Location</span>
            <strong>${window.currentUser.state}</strong>
          </div>
          ${window.currentUser.age ? `
            <div class="profile-detail" style="margin-top:8px;">
              <span>Age</span>
              <strong>${window.currentUser.age}</strong>
            </div>
          ` : ''}
          <div class="profile-detail" style="margin-top:8px;">
            <span>Privileges</span>
            <strong style="color:#856108;">Full Match Admin</strong>
          </div>
        </div>
      </div>
    </aside>
  `;
}

export const AdminView = {
  async render() {
    const requestedItems = await MatchingService.getRequestedDonations();
    const greeting = getTimeBasedGreeting(window.currentUser.name);
    
    let listHtml = '';
    if (requestedItems.length === 0) {
      listHtml = `
        <div class="empty-state">
          <div class="empty-icon">✅</div>
          <p>No pending requests at the moment. Everything is matched up!</p>
        </div>
      `;
    } else {
      listHtml = requestedItems.map(d => `
        <div class="glass-panel resource-card admin-card">
          <div class="card-header">
            <div class="card-title">${d.title}</div>
            <span class="badge ${getBadgeClass(d.status)}">${d.status}</span>
          </div>
          <div class="card-body">
            <div class="card-detail"><span class="icon">🏷️</span> ${d.category}</div>
            <div class="card-detail"><span class="icon">📦</span> Quantity: ${d.quantity || 1}</div>
            <div class="card-detail"><span class="icon">📍</span> ${d.state}</div>
            <div class="card-detail"><span class="icon">🧑‍🤝‍🧑</span> Requested By: NGO ID ${d.requestedBy}</div>
            
            <div class="admin-workflow">
              <div class="workflow-step done">Resource</div>
              <div class="workflow-step done">Request</div>
              <div class="workflow-step active">Assign</div>
              <div class="workflow-step">Delivery</div>
            </div>

            <div class="card-actions">
              <button class="btn btn-primary match-btn" data-id="${d.id}">Run Admin Match (Assign)</button>
            </div>
          </div>
        </div>
      `).join('');
    }

    return `
      <div class="app-layout">
        ${getSidebarHTML()}
        <div class="main-content">
          <div class="view-header">
            <span class="auth-badge" style="background:#fce8be;color:#856108;">Admin Match Hub</span>
            <h2 class="font-display">${greeting} <span class="wave">✦</span></h2>
            <p>Review requests from NGOs and coordinate assignments across community circles.</p>
          </div>
          
          <div class="glass-panel">
            <h3 class="section-title">Pending Requests</h3>
            <div class="card-grid" id="admin-list">
              ${listHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  },
  attachEvents(navigate, reRender) {
    document.querySelectorAll('.match-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        try {
          await MatchingService.adminMatchDonation(e.target.dataset.id);
          Toast.show('Item assigned successfully!', 'success');
          reRender();
        } catch (err) {
          Toast.show('Failed to assign item.', 'error');
        }
      });
    });
  }
};
