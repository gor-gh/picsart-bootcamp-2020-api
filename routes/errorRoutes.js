const router = require('express').Router(),
    errorController = require('../controllers/errorController');

router.use(errorController.pageNotFound);
router.use(errorController.internalServerError);

module.exports = router;