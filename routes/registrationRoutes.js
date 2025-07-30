const express = require('express');
const router = express.Router();
const {
  registerUser,
  getAllRegistrations,
  getUsersFiltered,
  exportUsersAsExcel
} = require('../controllers/registrationControllers');

// POST - Register user
router.post('/register', registerUser);

// GET - Fetch all registered users
router.get( '/registrations', getAllRegistrations );
router.get( '/filter', getUsersFiltered );
router.get('/export/excel', exportUsersAsExcel);


module.exports = router;
