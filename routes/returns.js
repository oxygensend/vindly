const ReturnController = require('../controllers/returns')
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const validateObjectId = require('../middlewares/validateObjectId');

const router = require('express').Router();

router.post('/', auth, ReturnController.create);

module.exports = router;
