const mongoose = require("mongoose");
const {User} = require("./user");
const moment = require("moment");

const requestSchema = new mongoose.Schema({
    created_by: {
        type: mongoose.Types.ObjectId,
        ref: User
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

requestSchema.statics.userRequests = async function (user) {

    return  user.isAdmin ? NaN : await this.find({
        created_by: user._id,
        created_at: {
            $gte: moment().startOf('month').toISOString(),
            $lte: moment().endOf('month').toISOString()
        }
    }).count();
};

module.exports = mongoose.model('Request', requestSchema);

