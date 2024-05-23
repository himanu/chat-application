
const mongoose = require('mongoose');

const connectToDB = () => {
    const url = process.env.DB_URL;
    mongoose.connect(url);
}

module.exports = connectToDB;
