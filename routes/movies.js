const MovieController = require('../controllers/movies');
const auth = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validateObjectId');
const admin = require('../middlewares/admin');
const router = require('express').Router();

router.get('/', MovieController.index);
router.post('/',  auth, MovieController.create);
router.put('/:id',  auth, validateObjectId ,MovieController.update);
router.get('/:id', validateObjectId, MovieController.get);
router.delete('/:id',  auth, admin, validateObjectId, MovieController.destroy);

module.exports = router;
