const router = require('express').Router();
const usersController = require('../../controllers/v1/usersController');

router.get('/', usersController.getUserInfo);
router.post('/register', usersController.create);
router.post('/login', usersController.login);
router.get('/logout', usersController.logout);
router.put('/update', usersController.updateUserInfo);

module.exports = router;
