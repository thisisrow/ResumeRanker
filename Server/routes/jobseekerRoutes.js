const express = require('express');
const { 
    registerUser, 
    loginUser, 
    uploadResume, 
    getResume, 
    getDescription,
    updateProfile 
} = require('../controllers/JobSeekerController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/uploadResume/:userId', uploadResume);
router.get('/getResume/:userId', getResume);
router.get('/getDescription/:userId', getDescription);
router.put('/profile/:userId', updateProfile);

module.exports = router;