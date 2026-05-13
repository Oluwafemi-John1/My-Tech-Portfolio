const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true },
  message:   { type: String, required: true },
  createdAt: { type: Date,    default: Date.now },
  read:      { type: Boolean, default: false },
});

module.exports = model('Message', messageSchema);
