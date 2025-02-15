const mongoose = require("mongoose");
const jobSeekerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    resume: { type: String, default: null }, // Resume stored in server
    description: { type: String,default: null }, // Optional profile summary
    skills: {
        type: [String],
        default: []
    },
    experience: {
        type: String,
        default: ''
    },
    education: {
        type: String,
        default: ''
    },
    created_at: { type: Date, default: Date.now }
    }, { timestamps: true });
    
    const JobSeeker = mongoose.model("JobSeeker", jobSeekerSchema);
    module.exports = JobSeeker;