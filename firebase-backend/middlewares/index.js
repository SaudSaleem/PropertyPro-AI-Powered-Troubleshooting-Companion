const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

// Helper function to extract userId from bearer token
const extractUserIdFromToken = (req, res, next) => {
  try {
    // Extract token from Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }
    
    // Check if header starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid authorization header format. Expected: Bearer <token>');
    }
    
    // Extract the token part (remove 'Bearer ' prefix)
    const token = authHeader.substring(7); // 'Bearer '.length = 7
    
    if (!token) {
      throw new Error('No token provided in authorization header');
    }
    
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, config.token_secret);
    
    // Extract userId from the decoded token
    if (!decoded.userId) {
      throw new Error('No userId found in token payload');
    }
    
    // return {
    //   success: true,
    //   userId: decoded.userId,
    //   decoded: decoded
    // };
    req.body.userId = decoded.userId;
    req.body.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Middleware to check if user is authenticated
const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1] || req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'No token provided' });
  
    try {
      const decoded = jwt.verify(token, config.token_secret);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

  module.exports = { authenticate, extractUserIdFromToken };