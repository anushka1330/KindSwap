// src/services/matchingService.js
import { ResourceService } from './resourceService.js';

export const MatchingService = {
  // Get donations for an NGO, prioritized by same State
  async getMatchesForNGO(ngoState, categoryFilter = null) {
    let allDonations = await ResourceService.getAllDonations();
    // Only show available ones
    allDonations = allDonations.filter(d => d.status === 'Available');
    
    if (categoryFilter) {
      allDonations = allDonations.filter(d => d.category === categoryFilter);
    }
    
    // Sort by state match first
    return allDonations.sort((a, b) => {
      const aMatch = a.state === ngoState ? 1 : 0;
      const bMatch = b.state === ngoState ? 1 : 0;
      return bMatch - aMatch; // exact state match comes first
    }).map(d => ({
      ...d,
      matchScore: d.state === ngoState ? 'Exact State Match' : 'Out of State'
    }));
  },

  async requestMatch(donationId, ngoId) {
    // NGO requests match for this donation (status becomes Requested)
    return await ResourceService.requestDonation(donationId, ngoId);
  },
  
  async getRequestedDonations() {
    return await ResourceService.getRequestedDonations();
  },

  async adminMatchDonation(donationId) {
    return await ResourceService.adminMatchDonation(donationId);
  },

  async markDelivered(donationId) {
    return await ResourceService.updateDonationStatus(donationId, 'Delivered');
  }
};
