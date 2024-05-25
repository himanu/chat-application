const User = require("../../db/models/User.model");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const { getUserFromToken } = require("../../utils");

const signUpController = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const user = new User({
          email,
          password: hashedPassword,
          name,
        });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const signInController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: 'User doesnt exist' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ message: 'Incorrect password'});
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET);
        res.status(200).json({ 
          token, 
          user: {
            email: user?.email,
            name: user?.name,
            id: user?.id
          },
          message: "Successfully Logged In" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
}

const verifyTokenController = async (req, res) => {
  const token = req.headers['authorization'];
  // Check if token is provided
  if (!token) {
      return res.status(401).json({ error: 'No token provided' });
  }
  // Verify the token
  try {
    const user = await getUserFromToken(token);
    return res.status(200).json({
      sucess: true,
      message: "Valid token",
      user: {
        email: user?.email,
        name: user?.name,
        id: user._id
      }
    })
  } catch (err) {
    console.log(err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};


module.exports = {
    signInController,
    signUpController,
    verifyTokenController,
}