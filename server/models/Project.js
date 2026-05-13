const { Schema, model } = require('mongoose');

const projectSchema = new Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  techStack:   [{ type: String }],
  githubUrl:   { type: String, default: '' },
  liveUrl:     { type: String, default: '' },
  thumbnail:   { type: String, default: '' },
  featured:    { type: Boolean, default: false },
  createdAt:   { type: Date,    default: Date.now },
});

module.exports = model('Project', projectSchema);
