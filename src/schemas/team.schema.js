const mongoose = require('mongoose');
const GoalSchema = require('./goal.schema');

module.exports = new mongoose.Schema({
    code: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    flag: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    goals: [ GoalSchema ]
});
