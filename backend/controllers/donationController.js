const DonationService = require('../services/donationService');

const DonationController = {
  create: async (req, res) => {
    try {
      const newDonation = await DonationService.addDonation(req.body);
      res.status(201).json(newDonation);
    } catch (error) {
      console.error('Error creating donation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getAll: async (req, res) => {
    try {
      const donations = await DonationService.getAllDonations();
      res.status(200).json(donations);
    } catch (error) {
      console.error('Error fetching donations:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getByDonor: async (req, res) => {
    try {
      const { donorId } = req.params;
      const donations = await DonationService.getDonationsByDonor(donorId);
      res.status(200).json(donations);
    } catch (error) {
      console.error('Error fetching donor donations:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }
      
      const success = await DonationService.updateStatus(id, status);
      if (success) {
        res.status(200).json({ message: 'Status updated successfully' });
      } else {
        res.status(404).json({ error: 'Donation not found' });
      }
    } catch (error) {
      console.error('Error updating donation status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  request: async (req, res) => {
    try {
      const { id } = req.params;
      const { ngoId } = req.body;
      if (!ngoId) {
        return res.status(400).json({ error: 'ngoId is required' });
      }
      const success = await DonationService.requestDonation(id, ngoId);
      if (success) {
        res.status(200).json({ message: 'Donation requested successfully' });
      } else {
        res.status(404).json({ error: 'Donation not found' });
      }
    } catch (error) {
      console.error('Error requesting donation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getRequested: async (req, res) => {
    try {
      const requested = await DonationService.getRequestedDonations();
      res.status(200).json(requested);
    } catch (error) {
      console.error('Error fetching requested donations:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  match: async (req, res) => {
    try {
      const { id } = req.params;
      const success = await DonationService.adminMatchDonation(id);
      if (success) {
        res.status(200).json({ message: 'Donation assigned successfully' });
      } else {
        res.status(404).json({ error: 'Donation not found' });
      }
    } catch (error) {
      console.error('Error matching donation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = DonationController;
