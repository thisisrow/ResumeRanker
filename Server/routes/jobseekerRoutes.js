const express = require('express');
const { registerUser, loginUser, uploadResume, getResume, getDescription } = require('../controllers/JobSeekerController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/uploadResume/:userId', uploadResume);
router.get('/getResume/:userId', getResume);
router.get('/getDescription/:userId', getDescription);

module.exports = router;