let mongoose = require('mongoose');

// Create a task model

let taskModel = mongoose.Schema({
    Task: String,
    Date: String,
    Duration: String,
    Description: String,
    },
    {
        collection: "task"
    }
);
module.exports = mongoose.model('task', taskModel);