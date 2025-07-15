/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Firebase Admin once
admin.initializeApp({
  projectId: 'property-pro-d0272',
});

// Initialize Express app
const app = express();

// More comprehensive CORS configuration
app.use(cors({
  origin: 'http://127.0.0.1:5002/',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['*'],
}));
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
    res.status(200).send('Health is  really OK');
  });
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Health is OK');
});

  
// Import routes
const loginRoutes = require('./routes/login');
const userRoutes = require('./routes/users');
const chatRoutes = require('./routes/chat');


// Use routes - Note: removing /api prefix since it's already in the function URL
app.use('/auth', loginRoutes);
app.use('/users', userRoutes);
app.use('/chat', chatRoutes);


// Add backward compatibility for direct routes (for your current frontend calls)
app.use('/', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
