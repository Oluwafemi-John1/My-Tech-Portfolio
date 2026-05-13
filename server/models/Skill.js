const { Schema, model } = require('mongoose');

const skillSchema = new Schema({
  name:     { type: String, required: true, trim: true },
  category: { type: String, required: true },
  level:    { type: Number, min: 0, max: 100, default: 50 },
  icon:     { type: String, default: '' },
});

module.exports = model('Skill', skillSchema);
