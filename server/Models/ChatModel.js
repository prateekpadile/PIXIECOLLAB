const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true
    },
    sender: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  { minimize: false }
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;