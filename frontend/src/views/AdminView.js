import { MatchingService } from '../services/matchingService.js';
import { Toast } from '../components/Toast.js';

function getBadgeClass(status) {
  if (status === 'Available') return 'badge-available';
  if (status === 'Assigned' || status === 'Requested') return 'badge-assigned';
  return 'badge-delivered';
}

function getSidebarHTML() {
  if (!window.currentUser) return '';
  return `
    <aside class="sidebar-profile">
      <div class="glass-panel profile-card">
        <div class="profile-header">
          <div class="profile-avatar">${window.currentUser.email.charAt(0).toUpperCase()}</div>
          <h3 class="profile-name">${window.currentUser.email}</h3>
          <span class="profile-role-badge">${window.currentUser.role}</span>
        </div>
        <div class="profile-stats">
          <div class="profile-detail">
            <span>Location</span>
            <strong>${window.currentUser.state}</strong>
          </div>
        </div>
      </div>
    </aside>
  `;
}

export const AdminView = {
  async render() {
    const requestedItems = await MatchingService.getRequestedDonations();
    
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
            <h2>Admin Match Dashboard</h2>
            <p>Review requests from NGOs and assign items to fulfill them.</p>
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
