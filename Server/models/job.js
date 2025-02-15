const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  recruiter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recruiter",
    required: true,
  },
  company_name: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  required_skills: {
    type: [String],
    default: []
  },
  created_at: { type: Date, default: Date.now },
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
