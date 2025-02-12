const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true }, // Hashed password
created_at: { type: Date, default: Date.now }
});

const Recruiter = mongoose.model("Recruiter", recruiterSchema);
module.exports = Recruiter;