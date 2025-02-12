const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JobSeeker = require('../models/JobSeeker');
const nodemailer = require('nodemailer');
const crypto= require('crypto');
const dotenv = require("dotenv");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");
dotenv.config();

// User Registration
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const existingUser = await JobSeeker.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new JobSeeker({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
};

// User Login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const user = await JobSeeker.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3m' });
        res.status(200).json({ 
            token,
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                resume_url: user.resume_url,
                description: user.description,
            }
         });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in user' });
    }
};


exports.uploadResume = async (req, res) => {
    const { resume, description } = req.body;
    const newUser = new JobSeeker({ resume, description });
    await newUser.save();
    res.status(201).json({ message: 'Resume uploaded successfully' });
}

