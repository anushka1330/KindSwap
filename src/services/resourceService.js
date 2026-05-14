// src/services/resourceService.js
import { StorageService } from '../db/storage.js';

export const ResourceService = {
  addDonation(donation) {
    const donations = StorageService.getDonations();
    const newDonation = {
      ...donation,
      id: Date.now().toString(),
      status: 'Available',
      date: new Date().toISOString()
    };
    donations.push(newDonation);
    StorageService.saveDonations(donations);
    return newDonation;
  },

  getDonationsByDonor(donorId) {
    return StorageService.getDonations().filter(d => d.donorId === donorId);
  },

  getAllDonations() {
    return StorageService.getDonations();
  },

  updateDonationStatus(id, status) {
    const donations = StorageService.getDonations();
    const index = donations.findIndex(d => d.id === id);
    if (index !== -1) {
      donations[index].status = status;
      StorageService.saveDonations(donations);
      return true;
    }
    return false;
  },

  addRequest(request) {
    const requests = StorageService.getRequests();
    const newReq = {
      ...request,
      id: 'req_' + Date.now(),
      status: 'Open',
      date: new Date().toISOString()
    };
    requests.push(newReq);
    StorageService.saveRequests(requests);
    return newReq;
  },

  getRequestsByNGO(ngoId) {
    return StorageService.getRequests().filter(r => r.ngoId === ngoId);
  },

  getAllRequests() {
    return StorageService.getRequests();
  }
};
