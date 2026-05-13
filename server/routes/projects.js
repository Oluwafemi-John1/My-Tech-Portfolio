const { Router } = require('express');
const protect = require('../middleware/auth');
const upload  = require('../middleware/upload');
const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectsController');

const router = Router();

router.get('/',    getAllProjects);
router.get('/:id', getProject);
router.post('/',    protect, upload.single('thumbnail'), createProject);
router.put('/:id',  protect, upload.single('thumbnail'), updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
