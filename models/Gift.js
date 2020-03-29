const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GiftSchema = new Schema({
    giftTitle: {
        type: String,
        required: true
    },
    giftDetails: {
        type: String,
        required: true
    },
    // user: {
    //     type: String,
    //     required: true
    // },
    getDate: {
        type: Date,
        default: Date.now
    }
})

mongoose.model('gifts', GiftSchema);
