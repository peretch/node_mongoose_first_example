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
    }
});
