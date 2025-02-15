const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  job_seeker_id: { type: mongoose.Schema.Types.ObjectId, ref: "JobSeeker", required: true },
  resume_url: { type: String, required: true },
  status: { type: String, enum: ["applied", "shortlisted", "rejected"], default: "applied" },
  rank: { type: Number, default: 0 },
  
  rank_score: {
    type: Number,
    default: 0
  },
  rank_position: {
    type: Number,
    default: 0
  },
  created_at: { type: Date, default: Date.now },
});

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;