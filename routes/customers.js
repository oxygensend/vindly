const CustomerController = require('../controllers/customers');
const auth = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validateObjectId');
const admin = require('../middlewares/admin');
const router = require('express').Router();

router.get('/', CustomerController.index);
router.post('/',
    auth,
    admin,
    CustomerController.create
);
router.put('/:id',
    validateObjectId,
    auth,
    admin,
    CustomerController.update);
router.get('/:id',
    validateObjectId,
    CustomerController.get);
router.delete('/:id',
    validateObjectId,
    auth,
    admin,
    CustomerController.destroy);

module.exports = router;
