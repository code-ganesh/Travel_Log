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

app.use(cors()); // enable CORS

// ✅ Correct payload limit
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// ✅ Route definitions
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
