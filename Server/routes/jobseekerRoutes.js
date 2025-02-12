const express = require('express');
const { registerUser, loginUser,uploadResume} = require('../controllers/JobSeekerController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/uploadResume', uploadResume);
module.exports = router;