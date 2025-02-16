const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JobSeeker = require("../models/JobSeeker");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require("dotenv");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");
const cloudinary = require('cloudinary').v2;
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
                skills: user.skills,
                experience: user.experience,
                education: user.education,
            }
         });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in user' });
    }
};

// Set up multer for temporary storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./temp";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed."));
    }
    const fileName = `${req.params.userId}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single("resume");

// Rename uploadResumeByCloudinary to uploadResume
exports.uploadResume = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const user = await JobSeeker.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const resumePath = path.join(__dirname, "..", "temp", req.file.filename);

      // Upload to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(resumePath, {
        folder: 'resumes',
        resource_type: 'auto',
        public_id: `resume_${req.params.userId}_${Date.now()}`,
        format: 'pdf'
      });

      // Extract text from PDF
      const dataBuffer = fs.readFileSync(resumePath);
      const pdfData = await pdfParse(dataBuffer);

      // Update user document with new data
      const updatedUser = await JobSeeker.findByIdAndUpdate(
        req.params.userId,
        {
          $set: {
            resume: cloudinaryResponse.secure_url,
            description: pdfData.text
          }
        },
        { new: true } // Return the updated document
      );

      if (!updatedUser) {
        throw new Error('Failed to update user document');
      }

      // Delete temporary file
      fs.unlinkSync(resumePath);

      res.status(200).json({
        message: "Resume uploaded successfully",
        resumeUrl: updatedUser.resume,
        description: updatedUser.description,
        cloudinaryDetails: {
          publicId: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
          format: cloudinaryResponse.format,
          size: cloudinaryResponse.bytes
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        error: "Server error while uploading resume",
        details: error.message 
      });
    }
  });
};

// Update getResume to properly return the URL
exports.getResume = async (req, res) => {
  try {
    const user = await JobSeeker.findById(req.params.userId);
    if (!user || !user.resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    res.status(200).json({ resumeUrl: user.resume });
  } catch (error) {
    console.error('GetResume error:', error);
    res.status(500).json({ error: "Server error while retrieving resume URL" });
  }
};

// Get the description of a user by userId
exports.getDescription = async (req, res) => {
  const userId = req.params.userId; // Get the userId from the route parameter

  try {
    // Find the user by userId
    const user = await JobSeeker.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with the description of the user
    res.status(200).json({
      description: user.description || "No description available", // Return description if it exists, otherwise return a default message
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Server error while retrieving description" });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    const { userId } = req.params;
    const { name, skills, experience, education, description } = req.body;

    try {
        // Find user and update
        const updatedUser = await JobSeeker.findByIdAndUpdate(
            userId,
            {
                $set: {
                    name: name,
                    skills: skills,
                    experience: experience,
                    education: education,
                    description: description
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return same format as login response
        res.status(200).json({ 
            message: 'Profile updated successfully',
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                resume_url: updatedUser.resume,
                description: updatedUser.description,
                skills: updatedUser.skills,
                experience: updatedUser.experience,
                education: updatedUser.education,
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            error: 'Error updating profile',
            details: error.message 
        });
    }
};
