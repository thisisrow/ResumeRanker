const express = require('express');
const { getAllJobs, getAllRecruiterJobs, createJob, updateJob, deleteJob, getJobDescription } = require('../controllers/jobController');
const router = express.Router();

router.get('/getAllJobs', getAllJobs); //get all jobs
router.get('/getAllRecruiterJobs/:id', getAllRecruiterJobs); //get all jobs for a specific recruiter
router.get('/description/:id', getJobDescription); //get the description of the job
router.post('/createJob', createJob); //create a new job
router.put('/updateJob/:id', updateJob); //update a job
router.delete('/deleteJob/:id', deleteJob); //delete a job
module.exports = router;
