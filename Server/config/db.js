const mongoose = require('mongoose');

const connectDB = async () => {
    const url='mongodb://127.0.0.1:27017/resume';
  try {
    await mongoose.connect(url);
    console.log('MongoDB connected successfully',url);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;