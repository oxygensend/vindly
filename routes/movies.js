const MovieController = require('../controllers/movies');
const auth = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validateObjectId');
const admin = require('../middlewares/admin');
const router = require('express').Router();

router.get('/', MovieController.index);
router.post('/', validateObjectId, auth, MovieController.create);
router.put('/:id', validateObjectId, auth, MovieController.update);
router.get('/:id', MovieController.get);
router.delete('/:id', validateObjectId, auth, admin, MovieController.destroy);

module.exports = router;
