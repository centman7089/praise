// @ts-nocheck
const Registration = require( '../models/Registration.js' );
const ExcelJS = require('exceljs');
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
      seatReservations,
      courseOfInterest,
      selectedSession
    } = req.body;

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existing = await Registration.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

       // Normalize participation mode (default to Virtual)
       let mode = 'Morning';
       if (selectedSession) {
         const formatted = formatTitleCase(selectedSession);
         if (PARTICIPATION_MODES.includes(formatted)) {
           mode = formatted;
         } else {
           return res.status(400).json({ message: `Invalid selectedSession. Use one of: ${PARTICIPATION_MODES.join(', ')}` });
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
      seatReservations,
      courseOfInterest,
      selectedSession: mode
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
const getUsersFiltered = async (req, res) => {
  try {
    const { country, state, date } = req.query;

    let query = {};

    if (country) {
      query.country = country;
    }

    if (state) {
      query.state = state;
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }

    const users = await Registration.find(query);
    res.json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Export to Excel
const exportUsersAsExcel = async (req, res) => {
  try {
    const users = await Registration.find().lean();

    if (!users.length) {
      return res.status(404).json({ message: 'No users found' });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registered Users');

    // Define columns
    worksheet.columns = [
      { header: 'First Name', key: 'firstName', width: 20 },
      { header: 'Last Name', key: 'lastName', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Course of Interest', key: 'courseOfInterest', width: 25 },
      { header: 'Seat Reservations', key: 'seatReservations', width: 20 },
      { header: 'Selected Session', key: 'selectedSession', width: 25 },
      { header: 'Country', key: 'country', width: 20 },
      { header: 'State', key: 'state', width: 20 },
      { header: 'Registration Date', key: 'createdAt', width: 25 }
    ];

    // Add rows
    users.forEach(user => {
      worksheet.addRow({
        ...user,
        createdAt: new Date(user.createdAt).toLocaleString()
      });
    });

    // Set headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="evolve_africa_users.xlsx"');

    // Send the Excel file as stream
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, getAllRegistrations, getUsersFiltered, exportUsersAsExcel };
