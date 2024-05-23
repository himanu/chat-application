const { ObjectId, Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    text: {
      type: String,
      required: true,
    },
    sender_id: {
      type: ObjectId,
      required: true,
    },
    recipient_id: {
      type: ObjectId,
      required: true,
    }, 
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      required: true
    },
  });
  
  const Messages = mongoose.model('Messages', MessageSchema);

  module.exports = Messages;