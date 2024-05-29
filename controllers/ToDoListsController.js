const express = require('express');
const router = express.Router();
const ToDoList = require('../models/ToDoListSchema.js');


// =================== LISTS =================== //
// INDEX - GET - /todo-lists
// Returns all ToDo lists
router.get('/', async (req, res) => {
    try {
        const foundTask = await ToDoList.find();
        res.status(200).json(foundTask);  // 200 OK
    } catch (error) {
        res.status(500).json({ error: error.message }); // 500 Internal Server Error
    }
});

// CREATE - POST - /todo-lists
// Creates new ToDo list
router.post('/', async (req, res) => {
    try {
        // Create a new list with data from req.body
        const createdList = await ToDoList.create(req.body);
        res.status(201).json(createdList); // 201 Created
    } catch (error) {
        // Responds with error if caught
        res.status(500).json({ error: error.message });
    }
});

// SHOW - GET - /todo-lists/:listId
// Show ToDo list
router.get('/:listId', async (req, res) => {
    try {
        // Query finds specific list
        const foundList = await ToDoList.findById(req.params.listId);
        // Throws error if list not found
        if (!foundList) {
            // Sets reponse status to "not found" and throws custom error
            res.status(404);
            throw new Error('List not found.');
        }
        res.status(200).json(foundList); // 200 OK
    } catch (error) {
        // Responds with 404 and custom error if list not found,
        // else responds with error
        if (res.statusCode === 404) {
            res.json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// UPDATE - PUT - /todo-lists/:listId
// Update list
router.put('/:listId', async (req, res) => {
    try {
        // Query finds specific list and updates it
        const updatedList = await ToDoList.findByIdAndUpdate(req.params.listId, {"name": req.body.name});
        // Throws error if list not found
        if (!updatedList) {
            // Sets reponse status to "not found" and throws custom error
            res.status(404);
            throw new Error('Task not found.');
        }
        res.status(200).json(updatedList);
    } catch (error) {
        // Responds with 404 and custom error if list not found,
        // else responds with error
        if (res.statusCode === 404) {
            res.json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// DELETE - DELETE - /todo-lists/:listId
// Delete list
router.delete('/:listId', async (req, res) => {
    try {
        // Query finds specific list and deletes it
        const deletedList = await ToDoList.findByIdAndDelete(req.params.listId)
        // Responds with deleted list if found
        res.status(200).json(deletedList)
    } catch (error) {
        // Responds with 404 if not found
        res.status(404).json({ error: error.message })
    }
});


// ==================== TASKS ===================== //
// INDEX - GET - /todo-lists/:listId/tasks
// Gets all tasks for a specific list
router.get('/:listId/tasks', async (req, res) => {
    try {
        // Finds specific ToDo list and returns all its tasks
        const foundList = await ToDoList.findById(req.params.listId)
        const listTasks = foundList.tasks
        
        // Throws error if list not found
        if (!foundList) {
            // Sets reponse status to "not found" and throws custom error
            res.status(404);
            throw new Error('Task not found.');
        }

        // Responds with all tasks for specific list
        res.status(200).json(listTasks);  // 200 OK
    } catch (error) {
        // Responds with 404 and custom error if list not found,
        // else responds with error
        if (res.statusCode === 404) {
            res.json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// CREATE - POST - /todo-lists/:listId/tasks
// Create new task in specific ToDo list
router.post('/:listId/tasks', async (req, res) => {
    try {
        // Finds specific ToDo list
        const foundList = await ToDoList.findById(req.params.listId)

        // Throws error if list not found
        if (!foundList) {
            // Sets reponse status to "not found" and throws custom error
            res.status(404);
            throw new Error('Task not found.');
        }

        // Pushes a new task to the list's task array
        // and saves the changes
        const newTask = req.body
        foundList.tasks.push(newTask)
        await foundList.save()

        // Responds with the newly created task
        res.status(201).json(newTask); // 201 Created
    } catch (error) {
        // Responds with 404 and custom error if list not found,
        // else responds with error
        if (res.statusCode === 404) {
            res.json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// SHOW - GET - /todo-lists/:listId/tasks/:taskId
// Shows specific task in specific list
router.get('/:listId/tasks/:taskId', async (req, res) => {
    try {
        // Finds specific ToDo list and specific task
        const foundList = await ToDoList.findById(req.params.listId)
        const foundTask = foundList.tasks.id(req.params.taskId)

        // Throws error if task not found
        if (!foundTask) {
            // Sets reponse status to "not found" and throws custom error
            res.status(404);
            throw new Error('Task not found.');
        }

        // Responds with found task
        res.status(200).json(foundTask); // 200 OK
    } catch (error) {
        // Responds with 404 and custom error if list not found,
        // else responds with error
        if (res.statusCode === 404) {
            res.json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// UPDATE - PUT - /todo-lists/:listId/tasks/:taskId
// Updates specific task in specific list
router.put('/:listId/tasks/:taskId', async (req, res) => {
    try {
        // Finds specific task in specific list and updates it
        const foundList = await ToDoList.findById(req.params.listId)
        let foundTask = foundList.tasks.id(req.params.taskId)
        
        // Throws error if task not found
        if (!foundTask) {
            // Sets reponse status to "not found" and throws custom error
            res.status(404);
            throw new Error('Task not found.');
        }

        // Loops through the keys of the updated task and
        // updates the respective values of the task
        const updatedTask = req.body
        const updatedTaskKeys = Object.keys(updatedTask)
        updatedTaskKeys.forEach( (key) => {
            foundTask[key] = updatedTask[key]
        })
        
        // Saves the changes to the task at the list level
        foundList.save()
        
        // Responds with updated task
        res.status(200).json(foundTask);
    } catch (error) {
        // Responds with 404 and custom error if list not found,
        // else responds with error
        if (res.statusCode === 404) {
            res.json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// DELETE - DELETE - /todo-lists/:listId/tasks/:taskId
// Deletes specific task from specific list
router.delete('/:listId/tasks/:taskId', async (req, res) => {
    try {
        // Finds specific task in specific list and pulls it from list.tasks array
        const foundList = await ToDoList.findById(req.params.listId)
        const deletedTask = foundList.tasks.pull(req.params.taskId)
        
        // Throws error if task not found
        if (!deletedTask) {
            // Sets reponse status to "not found" and throws custom error
            res.status(404);
            throw new Error('Task not found.');
        }
        
        // Saves the list with the removed task in list.tasks
        foundList.save()

        // Responds with the deleted task
        res.status(200).json(deletedTask); // 200 OK
    } catch (error) {
        // Responds with 404 and custom error if list not found,
        // else responds with error
        if (res.statusCode === 404) {
            res.json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});


module.exports = router;