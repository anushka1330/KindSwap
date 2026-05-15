const DonationQueries = require('../queries/donationQueries');

const DonationService = {
  addDonation: async (donationData) => {
    const newDonation = {
      ...donationData,
      id: Date.now().toString(), // Simple ID generator, could use uuid
      status: 'Available',
      date: new Date().toISOString()
    };
    return await DonationQueries.createDonation(newDonation);
  },

  getDonationsByDonor: async (donorId) => {
    return await DonationQueries.getDonationsByDonorId(donorId);
  },

  getAllDonations: async () => {
    return await DonationQueries.getAllDonations();
  },

  updateStatus: async (id, status) => {
    return await DonationQueries.updateDonationStatus(id, status);
  },

  requestDonation: async (id, ngoId) => {
    return await DonationQueries.requestDonation(id, ngoId);
  },

  getRequestedDonations: async () => {
    return await DonationQueries.getRequestedDonations();
  },

  adminMatchDonation: async (id) => {
    return await DonationQueries.adminMatchDonation(id);
  }
};

module.exports = DonationService;
