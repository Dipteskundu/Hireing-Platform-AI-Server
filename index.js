// index.js
// Entry point for the backend server

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

// configuration
dotenv.config();

const app = express();

// middleware
app.use(cors()); // allow cross origin requests
app.use(express.json()); // parse json body

// import routes
const jobsRoutes = require('./routes/jobs.routes');
const companiesRoutes = require('./routes/companies.routes');
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const communicationRoutes = require('./routes/communication.routes');
const transparencyRoutes = require('./routes/transparency.routes');
const skillTestRoutes = require('./routes/skillTest.routes');
const resumeRoutes = require('./routes/resume.routes');
const skillGapRoutes = require('./routes/skillGapRoutes');

app.use(jobsRoutes);
app.use(companiesRoutes);
app.use(authRoutes);
app.use(dashboardRoutes);
app.use(communicationRoutes);
app.use(transparencyRoutes);
app.use(skillTestRoutes);
app.use(resumeRoutes);
app.use(skillGapRoutes);

// simple root route
app.get('/', (req, res) => {
  res.send('Hello from simple backend');
});

const PORT = Number(process.env.PORT) || 5000;

// connect to DB then start server
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Set a different PORT in .env.`);
        return;
      }
      console.error('Server failed to start:', err);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
  });

// Optional: if you want firebase token verification, you can
// initialize firebase-admin here and write a simple middleware.
// See README or comments.
