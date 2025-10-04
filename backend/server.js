const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const aiRoutes = require('./routes/aiRoutes');
const bucketRoutes = require('./routes/bucketRoutes');
const userRoutes = require('./routes/authRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// ✅ Routes
app.use('/api/ai', aiRoutes);
app.use('/api/bucket', bucketRoutes);
app.use('/api/users', userRoutes);

// Optional: request size logger
app.use((req, res, next) => {
  let rawBody = '';
  req.on('data', chunk => rawBody += chunk);
  req.on('end', () => {
    console.log('Request size (bytes):', Buffer.byteLength(rawBody));
    next();
  });
});

module.exports = app;  // ✅ export app (no app.listen here)
