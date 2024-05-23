const { getUserFromToken } = require("../utils");

const verifyUser = async (req, res, next) => {
    const token = req.headers['authorization'];
    // Check if token is provided
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    // Verify the token
    try {
      const user = await getUserFromToken(token);
      req.user = user;
    } catch (err) {
      console.log(err.message);
      return res.status(401).json({ error: 'Invalid token' });
    }
    next();
};

module.exports = verifyUser;