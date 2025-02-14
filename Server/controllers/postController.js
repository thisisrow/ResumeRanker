const mongoose = require("mongoose");
const Job = require("../models/job");
const Recruiter = require("../models/recruiter");

// Get all Jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get only recruiter posts
exports.getAllRecruiterJobs = async (req, res) => {
    const { id } = req.params;
    try{
        const jobs = await Job.find({recruiter_id: id});
        res.status(200).json(jobs);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

// Create a new post with recruiter validation
exports.createJob = async (req, res) => {
    const { recruiter_id, title, description } = req.body;
  
    try {
      // Validate recruiter ID
      if (!mongoose.Types.ObjectId.isValid(recruiter_id)) {
        return res.status(400).json({ message: "Invalid recruiter ID" });
      }
  
      const recruiterExists = await Recruiter.findById(recruiter_id);
      if (!recruiterExists) {
        return res.status(404).json({ message: "Recruiter not found" });
      }
      
      const job = new Job({ recruiter_id, title, description });
      const newJob = await job.save();
      res.status(201).json(newJob);
    } catch (error) {
      console.error("Error creating job:", error);
      res.status(500).json({ message: "Failed to create job" });
    }
};
  
// Update a post with ID validation
exports.updateJob = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
  
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
  
      const updatedJob = await Job.findByIdAndUpdate(
        id,
        { title, description },
        { new: true }
      );
  
      if (!updatedJob) {
        return res.status(404).json({ message: "Job not found" });
      }
  
      res.status(200).json(updatedJob);
    } catch (error) {
      console.error("Error updating job:", error);
      res.status(500).json({ message: "Failed to update job" });
    }
};
  
// Delete a post with ID validation
exports.deleteJob = async (req, res) => {
    const { id } = req.params;
  
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
  
      const deletedJob = await Job.findByIdAndDelete(id);
      if (!deletedJob) {
        return res.status(404).json({ message: "Job not found" });
      }
  
      res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
      console.error("Error deleting job:", error);
      res.status(500).json({ message: "Failed to delete job" });
    }
};

// Get job description by ID
exports.getJobDescription = async (req, res) => {
    const { id } = req.params;
    
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }

        const job = await Job.findById(id).select('description');
        
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json({ description: job.description });
    } catch (error) {
        console.error("Error fetching job description:", error);
        res.status(500).json({ message: "Failed to fetch job description" });
    }
};