const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const recruiterRoutes = require("./routes/recruiterRoutes");
const jobseekerRoutes = require("./routes/jobseekerRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

//DOTENV
dotenv.config();

// MONGODB CONNECTION
connectDB();

//REST OBJECT
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
// ✅ Make uploaded resumes publicly accessible
app.use("/uploads", express.static("uploads"));
//ROUTES
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/jobseeker", jobseekerRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/uploads", express.static("uploads"));

//PORT
const PORT = process.env.PORT || 3000;

//listen
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});