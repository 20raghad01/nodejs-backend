const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectToDb = require('./config/db');
const path = require('path');

// Connect to the database
connectToDb();

// Initialize app
const app = express();

// Apply middleware
app.use(cors()); // Allow CORS
app.use(express.json({ limit: '10mb' })); // Increase payload size limit
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Handle URL-encoded data

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define routers
app.use('/api/books', require('./routers/books'));
app.use('/api/authors', require('./routers/authors'));
app.use('/api/categories', require('./routers/categories'));
app.use('/api/auth', require('./routers/auth'));
app.use('/api/upload', require('./routers/upload')); 
app.use('/api/status', require('./routers/UserBookStatus')); 

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const Port = process.env.PORT || 3000;
app.listen(Port, () => console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${Port}`));
