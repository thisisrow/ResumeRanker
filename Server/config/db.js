const mongoose = require('mongoose');

const connectDB = async () => {
    const url='mongodb+srv://prathameshmishra2020:%23dpmishra%3D1%2Bmongodb@cluster0.rfqwr.mongodb.net/resume?retryWrites=true&w=majority&appName=Cluster0';
  try {
    await mongoose.connect(url);
    console.log('MongoDB connected successfully',url);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;