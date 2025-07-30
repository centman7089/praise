// @ts-nocheck
const mongoose = require('mongoose');

const connectDB = async () => {
  try
  {
    const dbUrl = process.env.MONGO_URI || 'mongodb+srv://pageinnovations:V6vX7zRU1nNUhMVA@evolve.jqqkhul.mongodb.net/Evolve?retryWrites=true&w=majority&appName=Evolve'
    const conn = await mongoose.connect(dbUrl);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
