let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

//Connect with task model

let Task = require('../models/task');

// CRUD Operations:

module.exports.displayTaskList = (req,res,next)=>{
    Task.find((err, tasklist)=>{
        if(err)
        {
            return console.error(err);
        }
        else
        {
            res.render('task/list',{
                title:'Task',
                TaskList: tasklist,
                displayName: req.user ? req.user.displayName:''
        })
    }
    });
}

module.exports.displayAddPage = (req,res,next)=>{
    res.render('task/add',{
        title:'Add Task',
        displayName: req.user ? req.user.displayName:''
    })
};

module.exports.processAddPage = (req,res,next)=>{
    let newTask = Task({
        "Task":req.body.Task,
        "Date":req.body.Date,
        "Duration":req.body.Duration,
        "Description":req.body.Description
    });
    Task.create(newTask,(err,Task) => {
        if(err){
            console.log(err);
            res.end(err);
        }
        else
        {
            res.redirect('/task-list');
        }
    })
};

module.exports.displayEditPage = (req,res,next)=>{
    let id = req.params.id;
    Task.findById(id,(err,taskToEdit) => 
    {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            res.render('task/edit',{title:'Edit Task',
            task:taskToEdit,
            displayName: req.user ? req.user.displayName:''})
        }
    });
};

module.exports.processEditPage = (req,res,next) =>
{
    let id = req.params.id;
    let updateTask = Task({
        "_id": id,
        "Task":req.body.Task,
        "Date":req.body.Date,
        "Duration":req.body.Duration,
        "Description":req.body.Description
    });
    Task.updateOne({_id:id}, updateTask, (err)=>
        {
            if(err)
            {
            console.log(err);
            res.end(err);
            }
        else
        {
            res.redirect('/task-list');
        }       
    });
}

module.exports.performDelete = (req,res,next)=>{
    let id = req.params.id;
    Task.deleteOne({_id:id},(err) => {
        if(err)
            {
            console.log(err);
            res.end(err);
            }
        else
        {
            res.redirect('/task-list');
        }
    }); 
}