const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    against: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    minute: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    teamFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    teamTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
},
{
    timestamps: true
}
);
