const router = require('express').Router();
const projectsController = require('../../controllers/v1/projectsController');

router.get('/', projectsController.getAllProjectsInfo);
router.post('/:projectId/voting', projectsController.vote);
router.post('/', projectsController.create);

module.exports = router;