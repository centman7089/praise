const Registration = require( '../models/Registration.js' );

const PARTICIPATION_MODES = require('../constants/participationModes.js');


const formatTitleCase = (value) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      country,
      state,
      modeOfParticipation,
      seatNumber
    } = req.body;

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existing = await Registration.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

       // Normalize participation mode (default to Virtual)
       let mode = 'Physical';
       if (modeOfParticipation) {
         const formatted = formatTitleCase(modeOfParticipation);
         if (PARTICIPATION_MODES.includes(formatted)) {
           mode = formatted;
         } else {
           return res.status(400).json({ message: `Invalid modeOfParticipation. Use one of: ${PARTICIPATION_MODES.join(', ')}` });
         }
       }

    // Create new registration
    const registration = new Registration({
      firstName,
      lastName,
      email: normalizedEmail,
      phone,
      country,
      state,
      modeOfParticipation: mode,
      seatNumber
    });

    await registration.save();

    // Count all registered users
    const seatCount = await Registration.countDocuments();

    res.status(201).json({
      message: 'Registration successful',
      user: registration,
      seatCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

const getAllRegistrations = async (req, res) => {
    try {
      const registrations = await Registration.find().sort({ registeredAt: -1 }); // latest first
      res.status(200).json(registrations);
    } catch ( error )
    {
      console.log(error);
      res.status(500).json({ message: 'Failed to fetch registrations', error: error.message });
    }
  };

module.exports = { registerUser, getAllRegistrations };
