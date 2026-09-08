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

export const NGOView = {
  async render() {
    const availableMatches = await MatchingService.getMatchesForNGO(window.currentUser.state);
    
    let listHtml = '';
    if (availableMatches.length === 0) {
      listHtml = `
        <div class="empty-state">
          <div class="empty-icon">🌱</div>
          <p>No available donations found nearby. Check back later!</p>
        </div>
      `;
    } else {
      listHtml = availableMatches.map(d => `
        <div class="glass-panel resource-card">
          <div class="card-header">
            <div class="card-title">${d.title}</div>
            <span class="badge ${getBadgeClass(d.status)}">${d.status}</span>
          </div>
          <div class="card-body">
            <div class="card-detail"><span class="icon">🏷️</span> ${d.category}</div>
            <div class="card-detail"><span class="icon">📦</span> Quantity: ${d.quantity || 1}</div>
            <div class="card-detail"><span class="icon">📍</span> ${d.state}</div>
            <div class="match-score badge ${d.matchScore.includes('Exact') ? 'badge-available' : 'badge-assigned'}">
              ${d.matchScore}
            </div>
            <div class="card-actions">
              <button class="btn btn-primary accept-btn" data-id="${d.id}">Request Match</button>
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
            <h2>NGO / Volunteer Dashboard</h2>
            <p>Find resources available near you.</p>
          </div>
          
          <div class="glass-panel">
            <h3 class="section-title">Available Matches</h3>
            <div class="card-grid" id="ngo-list">
              ${listHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  },
  attachEvents(navigate, reRender) {
    document.querySelectorAll('.accept-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        try {
          await MatchingService.requestMatch(e.target.dataset.id, window.currentUser.id);
          Toast.show('Request submitted successfully!', 'success');
          reRender();
        } catch (err) {
          Toast.show('Failed to submit request.', 'error');
        }
      });
    });
  }
};
