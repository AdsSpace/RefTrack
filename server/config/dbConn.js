const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.DATABASE_URL);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
