// src/db/storage.js

const DEFAULT_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
];
const DEFAULT_CATEGORIES = ["Food", "Clothes", "Books", "Medicines"];

// Seed data to make the app look alive
const SEED_DONATIONS = [
  { id: '1', title: 'Packets of Biscuits', category: 'Food', state: 'Maharashtra', quantity: 10, donorId: 'donor1', status: 'Available', date: new Date().toISOString() },
  { id: '2', title: 'Winter Coats (S/M)', category: 'Clothes', state: 'Delhi', quantity: 5, donorId: 'donor1', status: 'Available', date: new Date().toISOString() },
  { id: '3', title: 'Engineering Textbooks', category: 'Books', state: 'Karnataka', quantity: 3, donorId: 'donor2', status: 'Available', date: new Date().toISOString() },
  { id: '4', title: 'Unused Paracetamol Box', category: 'Medicines', state: 'Maharashtra', quantity: 1, donorId: 'donor2', status: 'Assigned', date: new Date().toISOString() },
];

const SEED_REQUESTS = [
  { id: 'req1', title: 'Need Rice and Dal', category: 'Food', state: 'Maharashtra', quantity: 20, ngoId: 'ngo1', status: 'Open', date: new Date().toISOString() },
  { id: 'req2', title: 'Winter Clothes for Shelter', category: 'Clothes', state: 'Delhi', quantity: 15, ngoId: 'ngo2', status: 'Open', date: new Date().toISOString() },
];

export const StorageService = {
  init() {
    if (!localStorage.getItem('kindswap_donations')) {
      localStorage.setItem('kindswap_donations', JSON.stringify(SEED_DONATIONS));
    }
    if (!localStorage.getItem('kindswap_requests')) {
      localStorage.setItem('kindswap_requests', JSON.stringify(SEED_REQUESTS));
    }
  },

  getDonations() {
    return JSON.parse(localStorage.getItem('kindswap_donations')) || [];
  },
  saveDonations(data) {
    localStorage.setItem('kindswap_donations', JSON.stringify(data));
  },

  getRequests() {
    return JSON.parse(localStorage.getItem('kindswap_requests')) || [];
  },
  saveRequests(data) {
    localStorage.setItem('kindswap_requests', JSON.stringify(data));
  },
  
  getStates() {
    return DEFAULT_STATES;
  },
  
  getCategories() {
    return DEFAULT_CATEGORIES;
  }
};
