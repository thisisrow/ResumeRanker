const Recruiter = require('../models/recruiter');
const { hashPassword } = require('../helpers/authHelper');
const jwt = require('jsonwebtoken');
const recruiter = require("../models/recruiter");
//middleware
const requireSingIn = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
  });

exports.registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingRecruiter = await Recruiter.findOne({ email });
    if (existingRecruiter) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await hashPassword(password);
    const recruiter = new Recruiter({ name, email, password: hashedPassword });
    await recruiter.save();
    res.status(201).json({ message: "Recruiter registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering recruiter", error });
  }
};


exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find recruiter by email
    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    // Compare passwords
    const isMatch = await comparePassword(password, recruiter.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    // Generate JWT token
    const token = JWT.sign({ id: recruiter._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Respond with token and recruiter info
    res.status(200).json({ token, recruiter: { id: recruiter._id, name: recruiter.name, email: recruiter.email } });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};