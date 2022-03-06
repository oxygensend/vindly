const GenreController = require('../controllers/genres');
const auth = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validateObjectId');
const admin = require('../middlewares/admin');
const router = require('express').Router();


router.get('/', GenreController.index);
router.post('/', auth, GenreController.create);
router.put('/:id', validateObjectId, auth, GenreController.update);
router.get('/:id', validateObjectId, GenreController.get);
router.delete('/:id', validateObjectId, auth, admin, GenreController.destroy);


module.exports = router;