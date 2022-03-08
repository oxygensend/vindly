const CustomerController = require('../controllers/customers');
const auth = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validateObjectId');
const admin = require('../middlewares/admin');
const router = require('express').Router();

router.get('/', CustomerController.index);
router.post('/',
    auth,
    CustomerController.create
);
router.put('/:id',
    auth,
    validateObjectId,
    CustomerController.update);
router.get('/:id',
    validateObjectId,
    CustomerController.get);
router.delete('/:id',
    auth,
    admin,
    validateObjectId,
    CustomerController.destroy);

module.exports = router;
