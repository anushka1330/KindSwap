// src/services/matchingService.js
import { ResourceService } from './resourceService.js';

export const MatchingService = {
  // Get donations for an NGO, prioritized by same State
  getMatchesForNGO(ngoState, categoryFilter = null) {
    let allDonations = ResourceService.getAllDonations().filter(d => d.status === 'Available');
    
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

  matchDonation(donationId) {
    // NGO requests match for this donation
    return ResourceService.updateDonationStatus(donationId, 'Assigned');
  },
  
  markDelivered(donationId) {
    return ResourceService.updateDonationStatus(donationId, 'Delivered');
  }
};
