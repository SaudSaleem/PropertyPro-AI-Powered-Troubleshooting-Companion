const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

const verifyToken = (req, res, next) => {
  // Extract token from headers, cookies, or request body
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({ error: 'Unauthorized: No Authorization header provided' });
  }
  const token = authorizationHeader.split(' ')[1];

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
