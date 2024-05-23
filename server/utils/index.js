const jwt = require("jsonwebtoken");
const User = require("../db/models/User.model");

const getUserFromToken = async (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user_id = decoded.userId;
    const user = await User.findById(user_id).exec();
    return user;
}

module.exports = {
    getUserFromToken
}