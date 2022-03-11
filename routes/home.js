const router = require('express').Router();
router.get('/', (req, res) => {
    res.send('Vidly - REST API for movie rental');
});
module.exports = router;