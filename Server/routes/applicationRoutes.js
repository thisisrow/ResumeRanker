const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");

router.post("/apply", applicationController.applyForJob); // Apply for a job
router.get("/job/:job_id", applicationController.getApplicationsByJob); //Get All Applications for a Specific Job
//issue 
/*router.get("/seeker/:job_seeker_id", applicationController.getApplicationsByJobSeeker);*/ // Get applications for a job seeker
router.patch("/:application_id", applicationController.updateApplicationStatus); // Update application status
router.delete("/:application_id", applicationController.deleteApplication); // Delete an application

module.exports = router;
