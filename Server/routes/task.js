let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

//Connect with task model

let Task = require('../models/task');
let taskController = require('../controller/task');
// CRUD Operations:

//read operation
//get route for the task list

router.get('/', taskController.displayTaskList);
module.exports = router;

// Add Operation

// Get route for displaying the add page(Create operation)
router.get('/add',taskController.displayAddPage);

// Post route for processing the add page(Create operation)
router.post('/add',taskController.processAddPage);

// Edit operation

// Get route for displaying the edit operation(Update operation)
router.get('/edit/:id',taskController.displayEditPage);

// Post route for displaying the edit operation(Update operation)
router.post('/edit/:id',taskController.processEditPage);

// Delete operation
// Get to perform delete operation

router.get('/delete/:id',taskController.performDelete);