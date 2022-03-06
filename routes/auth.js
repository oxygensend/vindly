const AuthController = require('../controllers/auth');
const router = require('express').Router();


router.post('/', AuthController.login);
router.delete('/logout', AuthController.logout);
module.exports = router