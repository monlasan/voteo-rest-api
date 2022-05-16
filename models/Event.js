const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  event_name: {
    type: String,
    required: true,
    min: 20,
  },
  promotor: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
