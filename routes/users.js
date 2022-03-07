const UsersController = require('../controllers/users');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const _ = require('lodash');
const router = require('express').Router();


router.get('/', auth, admin, UsersController.getUsers);
router.post('/', UsersController.register);
router.get('/me', auth, UsersController.getMe);

module.exports = router;