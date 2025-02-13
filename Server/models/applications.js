const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  job_seeker_id: { type: mongoose.Schema.Types.ObjectId, ref: "JobSeeker", required: true },
  resume_url: { type: String, required: true },
  status: { type: String, enum: ["applied", "shortlisted", "rejected"], default: "applied" },
  created_at: { type: Date, default: Date.now },
});

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;