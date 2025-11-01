const mongoose = require('mongoose');

const connector = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('Mongo connected Successfully');
  } catch (err) {
    console.log(err);
  }
};
module.exports = connector;
