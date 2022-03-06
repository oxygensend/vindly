const RentalController = require('../controllers/rentals')
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const validateObjectId = require('../middlewares/validateObjectId');

const router = require('express').Router();

router.get('/', RentalController.index);
router.post('/', auth, admin, RentalController.create);
router.get('/:id', validateObjectId,RentalController.get);

module.exports = router;
