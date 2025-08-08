const mongoose = require('mongoose');

const PARTICIPATION_MODES = require('../constants/participationModes.js');

const registrationSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: String,
  country: String,
  state: String,
  modeOfParticipation: {
    type: String,
    enum: PARTICIPATION_MODES,
    default: 'Physical'
  },
  seatNumber: Number
});

module.exports = mongoose.model('Registration', registrationSchema);