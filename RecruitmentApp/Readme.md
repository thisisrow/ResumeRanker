Resume Ranker - App Documentation

Overview
Resume Ranker is a mobile application built using React Native Expo ,MongoDB,Express, Node.js and Cloudinary to uplode resume and Google Gemini API for resume analysis designed to streamline job recruitment. The app allows recruiters to post jobs and job seekers to apply by submitting their resumes. A resume ranking system powered by Google Gemini API helps recruiters shortlist candidates based on job descriptions.

Tech Stack

- Frontend: React Native Expo
- Backend: MongoDB,Express, Node.js
- Resume Analysis: Google Gemini API
- Cloudinary: to uplode resume

---

User Roles & Features

1.  Recruiter

- Post Jobs: Create job postings with title and description.
- View Applications: See a list of applicants for each job.
- Shortlist Candidates: Receive ranked resumes based on job descriptions.
- Accept/Reject Candidates: Manage applicants based on resume relevance.

2.  Job Seeker

- Sign Up & Login: Register and log in with email/password.
- View Job Listings: Browse available jobs.
- Apply for Jobs: Submit name and resume for a job.
- Upload Resume: Resume stored in cloudinary Storage.
- Profile: View and edit profile information.

---

Application Flow

Authentication

1. Users sign up and select their role (Recruiter or Job Seeker).
2. Users log in and are redirected to their respective dashboards.

Recruiter Flow

1. Job Posting

   - Navigate to the "Post Job" screen.
   - Enter job title and description.
   - Submit the job, which gets stored in cloudinary.

2. View Applications

   - Navigate to the "Resume Review" screen.
   - See a list of applicants for each job.

3. Shortlist Candidates
   - Resumes are ranked using Google Gemini API.
   - Recruiters see a list of sorted applicants.
   - Can accept or reject applications.

Job Seeker Flow

1. Job Listings

   - Browse available jobs posted by recruiters.

2. Apply for a Job

   - Select a job and submit an application.
   - Upload a resume (stored in cloudinary Storage).

3. Resume Processing
   - Extracted text from resume is stored in cloudinary.
   - Processed using Google Gemini API for ranking.

---

// Recruiter Model
const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true }, // Hashed password
created_at: { type: Date, default: Date.now }
});

const Recruiter = mongoose.model("Recruiter", recruiterSchema);

// Job Seeker Model
const jobSeekerSchema = new mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true }, // Hashed password
resume_url: { type: String, required: true }, // Resume stored in Supabase Storage
description: { type: String }, // Optional profile summary
created_at: { type: Date, default: Date.now }
});

const JobSeeker = mongoose.model("JobSeeker", jobSeekerSchema);

// Job Post Model
const postSchema = new mongoose.Schema({
recruiter_id: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true },
title: { type: String, required: true },
description: { type: String, required: true },
created_at: { type: Date, default: Date.now }
});

const Post = mongoose.model("Post", postSchema);

// Applications Model
const applicationSchema = new mongoose.Schema({
job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
job_seeker_id: { type: mongoose.Schema.Types.ObjectId, ref: "JobSeeker", required: true },
resume_url: { type: String, required: true }, // URL to resume
created_at: { type: Date, default: Date.now }
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = { Recruiter, JobSeeker, Post, Application };

---

Folder Structure

```
resume-ranker/
├── src/
│   ├── components/                Reusable UI components (buttons, inputs, etc.)
│   ├── screens/                   App screens categorized by role
│   │   ├── Auth/                  Authentication screens
│   │   │   ├── LoginScreen.js
│   │   │   ├── SignupScreen.js
│   │   ├── Recruiter/             Screens for recruiters
│   │   │   ├── RecruiterDashboard.js
│   │   │   ├── JobPostingScreen.js
│   │   │   ├── ResumeReviewScreen.js
│   │   ├── JobSeeker/             Screens for job seekers
│   │   │   ├── JobSeekerDashboard.js
│   │   │   ├── JobListingsScreen.js
│   │   │   ├── ApplicationScreen.js
│   ├── navigation/                 Navigation setup
│   │   ├── AuthNavigator.js        Handles authentication screens
│   │   ├── AppNavigator.js         Main app navigation
│   │   ├── JobSeekerNavigator.js   Handles navigation for job seekers
│   ├── context/                    Global state management
│   │   ├── AuthContext.js          Manage authentication state
│   │   ├── JobContext.js           Handle job-related state
│   ├── App.js                      Root entry point
├── package.json                    Dependencies and scripts
```

---

Next Steps

1. Set Up Authentication
   - Implement sign-up and login with role selection.
2. Build Job Posting & Listings
   - Create job posting functionality.
   - Display job listings to job seekers.
3. Implement Resume Upload & Storage
   - Allow job seekers to upload resumes.
   - Store in cloudinary .
4. Integrate Resume Ranking
   - Use Google Gemini API for resume analysis.
5. Develop Shortlisting Feature
   - Display ranked candidates to recruiters.

---

This structured approach ensures a step-by-step implementation, making it easy for developers to build and expand the application efficiently.
