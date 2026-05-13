const { Router } = require('express');
const protect = require('../middleware/auth');
const {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/skillsController');

const router = Router();

router.get('/',     getAllSkills);
router.post('/',    protect, createSkill);
router.put('/:id',  protect, updateSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;
