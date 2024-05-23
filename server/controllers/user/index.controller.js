const User = require("../../db/models/User.model");

const getUserController = async (req, res) => {
    const currentUser = req.user;
    const users = await User.find({ _id: { $ne: currentUser._id } }).select(['name', 'email']).exec();
    console.log("users ", users);
    const usersObj = {};
    users.forEach((user) => {
        usersObj[user.id] = {
            id: user.id,
            name: user.name,
            email: user.email
        }
    })
    res.json(usersObj);
};

module.exports = {getUserController};