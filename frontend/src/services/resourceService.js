// src/services/resourceService.js

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ResourceService = {
  async addDonation(donation) {
    const response = await fetch(`${API_BASE}/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donation)
    });
    if (!response.ok) throw new Error('Failed to add donation');
    return await response.json();
  },

  async getDonationsByDonor(donorId) {
    const response = await fetch(`${API_BASE}/donations/donor/${donorId}`);
    if (!response.ok) throw new Error('Failed to fetch donations');
    return await response.json();
  },

  async getAllDonations() {
    const response = await fetch(`${API_BASE}/donations`);
    if (!response.ok) throw new Error('Failed to fetch all donations');
    return await response.json();
  },

  async updateDonationStatus(id, status) {
    const response = await fetch(`${API_BASE}/donations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return response.ok;
  },

  async requestDonation(id, ngoId) {
    const response = await fetch(`${API_BASE}/donations/${id}/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ngoId })
    });
    return response.ok;
  },

  async getRequestedDonations() {
    const response = await fetch(`${API_BASE}/donations/requested`);
    if (!response.ok) throw new Error('Failed to fetch requested donations');
    return await response.json();
  },

  async adminMatchDonation(id) {
    const response = await fetch(`${API_BASE}/donations/${id}/match`, {
      method: 'POST'
    });
    return response.ok;
  }
};
