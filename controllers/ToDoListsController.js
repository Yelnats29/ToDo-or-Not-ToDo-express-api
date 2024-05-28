const express = require('express');
const router = express.Router();
const ToDoList = require('../models/ToDoListSchema.js');
const DayList = require('../models/DayList.js')


// ================= CALENDAR ================== //
// create new day list
router.post('/calendar', async (req, res) => {
    console.log('running new post...');

    // Add a message to test the route on Postman
    // res.json({ message: 'Create Route' });
    try {
        // Create a new task with the data from req.body
        const createdTask = await DayList.create(req.body);
        res.status(201).json(createdTask); // 201 Created
    } catch (error) {
        // Setup for error handling
        res.status(500).json({ error: error.message });
    }
});

// index for all day lists
router.get('/calendar', async (req, res) => {
    try {
        const allDays = await DayList.find();
        res.status(200).json(allDays);  // 200 OK
    } catch (error) {
        res.status(500).json({ error: error.message }); // 500 Internal Server Error
    }
});

// =================== LISTS =================== //
// CREATE - POST -  /todo-lists
// create new ToDo list
router.post('/', async (req, res) => {
    // Add a message to test the route on Postman
    // res.json({ message: 'Create Route' });
    try {
        // Create a new task with the data from req.body
        const createdTask = await ToDoList.create(req.body);
        res.status(201).json(createdTask); // 201 Created
    } catch (error) {
        // Setup for error handling
        res.status(500).json({ error: error.message });
    }
});


// READ - GET - HOME PAGE - /todo-lists
// index for all lists
router.get('/', async (req, res) => {
    try {
        const foundTask = await ToDoList.find();
        res.status(200).json(foundTask);  // 200 OK
    } catch (error) {
        res.status(500).json({ error: error.message }); // 500 Internal Server Error
    }
});



// READ - GET - SHOW ROUTE- /todo-lists/:listId
// show list
router.get('/:listId', async (req, res) => {
    try {
        // Add query to find a single task
        const foundList = await ToDoList.findById(req.params.listId);
        // Add error handling if a task is not found
        if (!foundList) {
            res.status(404);
            throw new Error('List not found.');
        }
        res.status(200).json(foundList); // 200 OK
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


// DELETE - DELETE - /todo-lists/:listId
// delete list
router.delete('/:listId', async (req, res) => {
    try {
        const deletedList = await ToDoList.findByIdAndDelete(req.params.listId)
        res.status(200).json(deletedList)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
});


// UPDATE - PUT - /todo-lists/:listId
// update list
router.put('/:listId', async (req, res) => {
    try {
        // Add query to update a single task
        const updatedList = await ToDoList.findByIdAndUpdate(req.params.listId, {"name": req.body.name});
        // Add a check for a not found task
        if (!updatedList) {
            res.status(404);
            throw new Error('Task not found.');
        }
        // Add a JSON response with the updated task
        res.status(200).json(updatedList);
    } catch (error) {
        // Add code for errors
        if (res.statusCode === 404) {
            res.json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// ==================== TASKS ===================== //
// CREATE - POST -  /todo-lists/:listId/tasks
// create new ToDo list task
router.post('/:listId/tasks', async (req, res) => {
    // Add a message to test the route on Postman
    // res.json({ message: 'Create Route' });
    try {
        // Finds ToDo list
        const foundList = await ToDoList.findById(req.params.listId)

        // Pushes a new task to the list's task array
        // and saves the changes
        const newTask = req.body
        foundList.tasks.push(newTask)
        await foundList.save()

        res.status(201).json(newTask); // 201 Created
    } catch (error) {
        // Setup for error handling
        res.status(500).json({ error: error.message });
    }
});


// READ - GET - HOME PAGE - /todo-lists/:listId/tasks
// index for all list tasks
router.get('/:listId/tasks', async (req, res) => {
    try {
        // Finds ToDo list and returns its tasks
        const foundList = await ToDoList.findById(req.params.listId)
        const listTasks = foundList.tasks
        
        res.status(200).json(listTasks);  // 200 OK
    } catch (error) {
        res.status(500).json({ error: error.message }); // 500 Internal Server Error
    }
});



// READ - GET - SHOW ROUTE- /todo-lists/:listId/tasks/:taskId
// show task in list
router.get('/:listId/tasks/:taskId', async (req, res) => {
    try {
        // Finds ToDo list
        const foundList = await ToDoList.findById(req.params.listId)
        const foundTask = foundList.tasks.id(req.params.taskId)

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


// DELETE - DELETE - /todo-lists/:listId/tasks/:taskId
// delete task from list
router.delete('/:listId/tasks/:taskId', async (req, res) => {
    try {
        // Finds ToDo task and deletes it
        const foundList = await ToDoList.findById(req.params.listId)
        const deletedTask = foundList.tasks.pull(req.params.taskId)
        foundList.save()

        res.status(200).json(deletedTask); // 200 OK
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
});


// UPDATE - PUT - /todo-lists/:listId/tasks/:taskId
// update task in list
router.put('/:listId/tasks/:taskId', async (req, res) => {
    try {
        // Finds ToDo task and updates it
        const foundList = await ToDoList.findById(req.params.listId)
        let foundTask = foundList.tasks.id(req.params.taskId)

        // Loops through the keys of the updated task and
        // updates the respective values of the task
        const updatedTask = req.body
        const updatedTaskKeys = Object.keys(updatedTask)
        updatedTaskKeys.forEach( (key) => {
            foundTask[key] = updatedTask[key]
        })

        // Saves the changes to the task at the list level
        foundList.save()

        // Add a check for a not found task
        if (!foundList) {
            res.status(404);
            throw new Error('Task not found.');
        }
        // Add a JSON response with the updated task
        res.status(200).json(foundTask);
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