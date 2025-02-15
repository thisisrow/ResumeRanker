const Application = require("../models/applications");
const Job = require('../models/job'); // You'll need to import your Job model

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


// Get Applications for a Specific Job Seeker
const getApplicationsByJobSeeker = async (req, res) => {
  try {
    const { job_seeker_id } = req.params;
    
    const applications = await Application.find({ job_seeker_id })
      .select("job_id resume_url status created_at")  // Include job_id in select
      .lean();  // Convert to plain JavaScript object

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: "No applications found for this job seeker." });
    }

    res.status(200).json({ applications });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid job seeker ID format." });
    }
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

// Helper function for basic scoring without AI
const calculateBasicScore = (job, jobSeeker) => {
  let score = 0;
  const requiredSkills = job.required_skills || [];
  const candidateSkills = jobSeeker.skills || [];
  
  // Handle case where there are no required skills
  if (requiredSkills.length === 0) {
    return 50; // Return a default middle score
  }
  
  // Calculate skill match percentage
  const matchedSkills = candidateSkills.filter(skill => 
    requiredSkills.some(reqSkill => 
      reqSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(reqSkill.toLowerCase())
    )
  );
  
  // Calculate score based on matched skills
  score = (matchedSkills.length / requiredSkills.length) * 100;
  
  // Ensure score is a valid number
  if (isNaN(score)) {
    return 0;
  }
  
  // Cap the score at 100 and ensure it's an integer
  return Math.min(Math.round(score), 100);
};

// Modified rankApplications function to handle edge cases
const rankApplications = async (req, res) => {
  try {
    const { job_id } = req.params;

    const job = await Job.findById(job_id);

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    const applications = await Application.find({ job_id })
      .populate("job_seeker_id", "name email skills experience education")
      .select("resume_url status created_at");

    if (applications.length === 0) {
      return res.status(404).json({ message: "No applications found for this job." });
    }

    const rankedApplications = applications.map(application => {
      const jobSeeker = application.job_seeker_id;
      // Ensure jobSeeker exists before calculating score
      if (!jobSeeker) {
        return {
          application_id: application._id,
          score: 0,
          status: application.status,
          resume_url: application.resume_url,
          created_at: application.created_at
        };
      }

      const score = calculateBasicScore(job, jobSeeker);

      return {
        application_id: application._id,
        job_seeker: {
          name: jobSeeker.name,
          email: jobSeeker.email,
          skills: jobSeeker.skills || [],
          experience: jobSeeker.experience || 'Not specified',
          education: jobSeeker.education || 'Not specified'
        },
        score,
        status: application.status,
        resume_url: application.resume_url,
        created_at: application.created_at
      };
    });

    // Sort by score in descending order
    rankedApplications.sort((a, b) => b.score - a.score);

    // Update applications with rankings
    const updatePromises = rankedApplications.map((app, index) => {
      // Ensure score is a valid number before updating
      const score = typeof app.score === 'number' && !isNaN(app.score) ? app.score : 0;
      
      return Application.findByIdAndUpdate(
        app.application_id,
        { 
          rank_score: score,
          rank_position: index + 1 
        },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      message: "Applications ranked successfully",
      ranked_applications: rankedApplications
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Error ranking applications", 
      error: error.message 
    });
  }
};

module.exports = {
  applyForJob,
  getApplicationsByJob,
  getApplicationsByJobSeeker,
  updateApplicationStatus,
  deleteApplication,
  rankApplications,
};
