const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

const verifyToken = (req, res, next) => {
  console.log(123, req.headers)
  // Extract token from headers, cookies, or request body
  const token = req.headers.authorization;

  // If token is not provided, return unauthorized error
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  // Verify token
  jwt.verify(token, config.token_secret, (err, decoded) => {
    if (err) {
      // If token verification fails, return unauthorized error
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    // If token is valid, attach decoded payload to request object for use in subsequent middleware
    req.userId = decoded.userId;
    next();
  });
};

module.exports = verifyToken;
