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

// Set storage options for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the folder where we want to store the uploaded resumes
    const uploadDir = "./uploads";

    // Make sure the folder exists, create it if not
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Ensure the file is a PDF
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed."));
    }

    // Set the filename with user ID and a timestamp to avoid conflicts
    const fileName = `${req.params.userId}_${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, fileName);
  },
});

// Set up multer with the storage and file size limits
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single("resume"); // 'resume' is the field name in the form

// Upload resume function
exports.uploadResume = (req, res) => {
  // Use multer to handle the file upload
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      // Get the user from the database
      const user = await JobSeeker.findById(req.params.userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Extract text from the uploaded PDF
      const resumePath = path.join(
        __dirname,
        "..",
        "uploads",
        req.file.filename
      );

      // Read the PDF and extract text
      const dataBuffer = fs.readFileSync(resumePath);
      const pdfData = await pdfParse(dataBuffer);

      // Store the extracted text into the user's description
      user.description = pdfData.text; // Store extracted text in description field

      // Update the user's resume field with the file path
      user.resume = `/uploads/${req.file.filename}`;

      // Save the updated user document
      await user.save();

      res.status(200).json({
        message: "Resume uploaded and description extracted successfully",
        resumeUrl: user.resume,
        description: user.description, // Send back the extracted text
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while uploading resume" });
    }
  });
};

// Controller to serve the resume (PDF file)
exports.getResume = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await JobSeeker.findById(userId);

    if (!user || !user.resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    // The resume URL is stored in the 'resume' field in the user document
    const resumePath = path.join(__dirname, "..", user.resume); // Build absolute path

    // Check if the file exists
    if (!fs.existsSync(resumePath)) {
      return res
        .status(404)
        .json({ error: "Resume file not found on the server" });
    }

    // Send the file as response
    res.sendFile(resumePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while retrieving resume" });
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
