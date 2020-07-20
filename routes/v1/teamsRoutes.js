const router = require('express').Router();
const teamsController = require('../../controllers/v1/teamsController');

router.get('/generate', teamsController.generateTeams);

module.exports = router;