const { Router } = require('express');
const protect = require('../middleware/auth');
const {
  sendMessage,
  getMessages,
  markRead,
} = require('../controllers/contactController');

const router = Router();

router.post('/',           sendMessage);            // public
router.get('/',     protect, getMessages);          // admin
router.patch('/:id/read', protect, markRead);       // admin

module.exports = router;
