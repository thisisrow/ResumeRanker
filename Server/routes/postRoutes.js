const express = require('express');
const { getAllPosts, getAllRecruiterPosts, createPost, updatePost, deletePost, getPostDescription } = require('../controllers/postController');
const router = express.Router();

router.get('/getAllPosts', getAllPosts);
router.get('/getAllRecruiterPosts/:id', getAllRecruiterPosts);
router.get('/description/:id', getPostDescription);
router.post('/createPost', createPost);
router.put('/updatePost/:id', updatePost);
router.delete('/deletePost/:id', deletePost);
module.exports = router;
