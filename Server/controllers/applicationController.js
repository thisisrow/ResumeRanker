const Application = require("../models/applications");

// Apply for a Job
const applyForJob = async (req, res) => {
  try {
    const { job_id, job_seeker_id, resume_url } = req.body;

    if (!job_id || !job_seeker_id || !resume_url) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newApplication = new Application({ job_id, job_seeker_id, resume_url });
    await newApplication.save();

    res.status(201).json({ message: "Application submitted successfully.", application: newApplication });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Get All Applications for a Specific Job
const getApplicationsByJob = async (req, res) => {
  try {
    const { job_id } = req.params;

    const applications = await Application.find({ job_id })
      .populate("job_seeker_id", "name email") // Fetch job seeker details
      .select("resume_url status created_at"); // Select required fields

    if (applications.length === 0) {
      return res.status(404).json({ message: "No applications found for this job." });
    }

    res.status(200).json({ applicants: applications });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

//issue
// Get Applications for a Specific Job Seeker
const getApplicationsByJobSeeker = async (req, res) => {
  try {
    const { job_seeker_id } = req.params;
    const applications = await Application.find({ job_seeker_id }).populate("job_id", "title description");

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Update Application Status (Shortlist or Reject)
const updateApplicationStatus = async (req, res) => {
  try {
    const { application_id } = req.params;
    const { status } = req.body;

    if (!["applied", "shortlisted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const updatedApplication = await Application.findByIdAndUpdate(application_id, { status }, { new: true });

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.status(200).json({ message: "Application status updated.", application: updatedApplication });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Delete an Application
const deleteApplication = async (req, res) => {
  try {
    const { application_id } = req.params;

    const deletedApplication = await Application.findByIdAndDelete(application_id);

    if (!deletedApplication) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.status(200).json({ message: "Application deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

module.exports = {
  applyForJob,
  getApplicationsByJob,
  getApplicationsByJobSeeker,
  updateApplicationStatus,
  deleteApplication,
};
