const { User } = require("../models");

const isAdmin = async (req, res, next) => {

  try {
    const user = await User.findOne({ where: { id: req.userId } });
    // If user not found or not admin, return unauthorized error
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }
    next();
  } catch (error) {
    // If token verification fails or any other error occurs, return unauthorized error
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = isAdmin;
