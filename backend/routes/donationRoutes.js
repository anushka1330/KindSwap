const express = require('express');
const router = express.Router();
const DonationController = require('../controllers/donationController');

router.post('/', DonationController.create);
router.get('/', DonationController.getAll);
router.get('/requested', DonationController.getRequested); // Must be before /donor/:donorId to avoid catching it
router.get('/donor/:donorId', DonationController.getByDonor);
router.patch('/:id/status', DonationController.updateStatus);
router.post('/:id/request', DonationController.request);
router.post('/:id/match', DonationController.match);

module.exports = router;
