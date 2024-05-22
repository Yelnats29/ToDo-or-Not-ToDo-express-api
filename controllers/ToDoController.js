const express = require('express');
const router = express.Router();
const ToDo = require('../models/ToDoSchema.js');



// CREATE - POST -  /tasks
router.post('/', async (req, res) => {
    // Add a message to test the route on Postman
    // res.json({ message: 'Create Route' });
    try {
        // Create a new task with the data from req.body
        const createdTask = await ToDo.create(req.body);
        res.status(201).json(createdTask); // 201 Created
    } catch (error) {
        // Setup for error handling
        res.status(500).json({ error: error.message });
    }
});


// READ - GET - HOME PAGE - /tasks
router.get('/', async (req, res) => {
    try {
        const foundTask = await ToDo.find();
        res.status(200).json(foundTask);  // 200 OK
    } catch (error) {
        res.status(500).json({ error: error.message }); // 500 Internal Server Error
    }
});



// READ - GET - SHOW ROUTE- /tasks/:tasksId
router.get('/:tasksId', async (req, res) => {
    try {
        // Add query to find a single task
        const foundTask = await ToDo.findById(req.params.tasksId);
        // Add error handling if a task is not found
        if (!foundTask) {
            res.status(404);
            throw new Error('Task not found.');
        }
        res.status(200).json(foundTask); // 200 OK
    } catch (error) {
        // Add error handling code for 404 errors
        if (res.statusCode === 404) {
            res.json({ error: error.message });
        } else {
            // Add else statement to handle all other errors
            res.status(500).json({ error: error.message });
        }
    }
});


// DELETE - DELETE - /tasks/:tasksId
router.delete('/:tasksId', async (req, res) => {
    try {
        const deletedTask = await ToDo.findByIdAndDelete(req.params.tasksId)
        res.status(200).json(deletedTask)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
});


// UPDATE - PUT - /tasks/:tasksId
router.put('/:tasksId', async (req, res) => {
    try {
        // Add query to update a single task
        const updatedTask = await ToDo.findByIdAndUpdate(req.params.tasksId, req.body);
        // Add a check for a not found task
        if (!updatedTask) {
            res.status(404);
            throw new Error('Task not found.');
        }
        // Add a JSON response with the updated task
        res.status(200).json(updatedTask);
    } catch (error) {
        // Add code for errors
        if (res.statusCode === 404) {
            res.json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});


module.exports = router;