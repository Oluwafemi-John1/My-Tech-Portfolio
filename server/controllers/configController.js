const Config = require('../models/Config');

// Returns the single portfolio config document.
// Creates a blank one on first request so GET always succeeds.
exports.getConfig = async (_req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) config = await Config.create({});
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = await Config.create(req.body);
    } else {
      Object.assign(config, req.body);
      await config.save();
    }
    res.json(config);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
