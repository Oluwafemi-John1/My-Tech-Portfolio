const { Schema, model } = require('mongoose');

const configSchema = new Schema({
  ownerName: { type: String, default: '' },
  bio:       { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  status:    { type: String, default: '' },
  wallpaper: { type: String, default: '' },
  socialLinks: {
    github:   { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter:  { type: String, default: '' },
  },
});

module.exports = model('Config', configSchema);
