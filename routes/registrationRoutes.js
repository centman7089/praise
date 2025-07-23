const express = require('express');
const router = express.Router();
const {
  registerUser,
  getAllRegistrations
} = require('../controllers/registrationControllers');

// POST - Register user
router.post('/register', registerUser);

// GET - Fetch all registered users
router.get('/registrations', getAllRegistrations);

module.exports = router;
