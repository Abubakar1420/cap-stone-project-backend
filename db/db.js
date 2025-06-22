const mongoose = require ('mongoose');
require('dotenv').config();

const connectDB = async () => {

    await mongoose.connect(process.env.MONG_URI);
    console.log('Mongoose Connected');

    }

module.exports = connectDB;
