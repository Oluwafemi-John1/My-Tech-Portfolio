const { Router } = require('express');
const protect = require('../middleware/auth');
const { getConfig, updateConfig } = require('../controllers/configController');

const router = Router();

router.get('/',  getConfig);
router.put('/',  protect, updateConfig);

module.exports = router;
