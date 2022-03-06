const ObjectId = require('mongoose').Types.ObjectId;

module.exports = (req, res, next) => {
    if(!ObjectId.isValid(req.params.id))
        return res.status(404).send('Invalid ID');

    next();
}