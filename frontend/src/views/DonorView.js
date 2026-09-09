import { ResourceService } from '../services/resourceService.js';
import { MatchingService } from '../services/matchingService.js';
import { StorageService } from '../db/storage.js';
import { Toast } from '../components/Toast.js';
import { getTimeBasedGreeting, getFirstName } from '../utils/greeting.js';

function getBadgeClass(status) {
  if (status === 'Available') return 'badge-available';
  if (status === 'Assigned' || status === 'Requested') return 'badge-assigned';
  return 'badge-delivered';
}

function getSidebarHTML() {
  if (!window.currentUser) return '';
  const firstName = getFirstName(window.currentUser.name) || 'Friend';
  const initial = firstName.charAt(0).toUpperCase();

  return `
    <aside class="sidebar-profile">
      <div class="glass-panel profile-card">
        <div class="profile-header">
          <div class="profile-avatar">${initial}</div>
          <h3 class="profile-name">${window.currentUser.name || window.currentUser.email}</h3>
          <span class="profile-role-badge">Donor</span>
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
            <span>Verified Status</span>
            <strong style="color:#4a7c3b;">Active Member</strong>
          </div>
        </div>
      </div>
    </aside>
  `;
}

export const DonorView = {
  async render() {
    const donations = await ResourceService.getDonationsByDonor(window.currentUser.id);
    const statesOptions = StorageService.getStates().map(s => `<option value="${s}">${s}</option>`).join('');
    const catOptions = StorageService.getCategories().map(c => `<option value="${c}">${c}</option>`).join('');

    const activeDonations = donations.filter(d => d.status !== 'Delivered').length;
    const deliveredDonations = donations.filter(d => d.status === 'Delivered').length;
    const greeting = getTimeBasedGreeting(window.currentUser.name);

    let listHtml = '';
    if (donations.length === 0) {
      listHtml = `
        <div class="empty-state">
          <div class="empty-icon">🎁</div>
          <p>No donations yet. Start sharing with your community!</p>
        </div>
      `;
    } else {
      listHtml = donations.map(d => `
        <div class="glass-panel resource-card">
          <div class="card-header">
            <div class="card-title">${d.title}</div>
            <span class="badge ${getBadgeClass(d.status)}">${d.status}</span>
          </div>
          <div class="card-body">
            <div class="card-detail"><span class="icon">🏷️</span> ${d.category}</div>
            <div class="card-detail"><span class="icon">📦</span> Quantity: ${d.quantity || 1}</div>
            <div class="card-detail"><span class="icon">📍</span> ${d.state}</div>
            <div class="card-detail"><span class="icon">📅</span> ${new Date(d.date).toLocaleDateString()}</div>
            ${d.status === 'Assigned' ? `<button class="btn btn-secondary deliver-btn" data-id="${d.id}">Mark Delivered ✓</button>` : ''}
          </div>
        </div>
      `).join('');
    }

    return `
      <div class="app-layout">
        ${getSidebarHTML()}
        <div class="main-content">
          <div class="view-header">
            <span class="auth-badge">Donor Hub</span>
            <h2 class="font-display">${greeting} <span class="wave">✦</span></h2>
            <p>Manage your donations, list new items, and track your giving impact.</p>
          </div>
          
          <div class="dashboard-stats">
            <div class="stat-card">
              <h3>${donations.length}</h3>
              <p>Total Items Donated</p>
            </div>
            <div class="stat-card">
              <h3>${activeDonations}</h3>
              <p>Active Listings</p>
            </div>
            <div class="stat-card">
              <h3>${deliveredDonations}</h3>
              <p>Items Delivered</p>
            </div>
          </div>

          <div class="dashboard-split">
            <div class="glass-panel form-panel">
              <h3 class="section-title">Add New Donation</h3>
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
                <button type="submit" class="btn btn-primary btn-block">Add Donation</button>
              </form>
            </div>
            
            <div class="list-panel">
              <h3 class="section-title">My Donations</h3>
              <div class="card-grid" id="donor-list">
                ${listHtml}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  attachEvents(navigate, reRender) {
    document.getElementById('add-donation-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await ResourceService.addDonation({
          title: document.getElementById('d-title').value,
          category: document.getElementById('d-category').value,
          quantity: parseInt(document.getElementById('d-quantity').value),
          state: document.getElementById('d-state').value,
          donorId: window.currentUser.id
        });
        Toast.show('Donation added successfully!', 'success');
        reRender();
      } catch (err) {
        Toast.show('Failed to add donation.', 'error');
      }
    });

    document.querySelectorAll('.deliver-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        try {
          await MatchingService.markDelivered(e.target.dataset.id);
          Toast.show('Item marked as delivered!', 'success');
          reRender();
        } catch (err) {
          Toast.show('Failed to update status.', 'error');
        }
      });
    });
  }
};
