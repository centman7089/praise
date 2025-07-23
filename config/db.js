// @ts-nocheck
const mongoose = require('mongoose');

const connectDB = async () => {
  try
  {
    const dbUrl = process.env.MONGO_URI || 'mongodb+srv://pageinnovations:UJx4sO99Ri6dok8m@praise.pu51dsk.mongodb.net/Praise?retryWrites=true&w=majority&appName=Praise'
    const conn = await mongoose.connect(dbUrl);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
