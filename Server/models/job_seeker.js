const mongoose = require("mongoose");
const jobSeekerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    resume_url: { type: String, required: true }, // Resume stored in Supabase Storage
    description: { type: String }, // Optional profile summary
    created_at: { type: Date, default: Date.now }
    });
    
    const JobSeeker = mongoose.model("JobSeeker", jobSeekerSchema);
    module.exports = JobSeeker;