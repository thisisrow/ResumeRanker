const mongoose = require("mongoose");
const Post = require("../models/post");
const Recruiter = require("../models/recruiter");

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get only recruiter posts
exports.getAllRecruiterPosts = async (req, res) => {
    const { id } = req.params;
    try{
        const posts = await Post.find({recruiter_id: id});
        res.status(200).json(posts);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

// Create a new post with recruiter validation
exports.createPost = async (req, res) => {
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
  
      const post = new Post({ recruiter_id, title, description });
      const newPost = await post.save();
      res.status(201).json(newPost);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
};
  
// Update a post with ID validation
exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
  
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
  
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { title, description },
        { new: true }
      );
  
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Failed to update post" });
    }
};
  
// Delete a post with ID validation
exports.deletePost = async (req, res) => {
    const { id } = req.params;
  
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
  
      const deletedPost = await Post.findByIdAndDelete(id);
      if (!deletedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
};

// Get post description by ID
exports.getPostDescription = async (req, res) => {
    const { id } = req.params;
    
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }

        const post = await Post.findById(id).select('description');
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ description: post.description });
    } catch (error) {
        console.error("Error fetching post description:", error);
        res.status(500).json({ message: "Failed to fetch post description" });
    }
};