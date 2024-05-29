const mongoose = require('mongoose');

// Simple task model with a text value (name) and
// whether or not the task has been completed. Notes
// property is a future feature to add any optional
// notes to the task that the user wishes
const taskSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  }
})

// Simple list model with a name for the list and
// an array of task models to be added by the user
const toDoListSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    tasks: [taskSchema]
});

const ToDoList = mongoose.model('ToDoList', toDoListSchema);
module.exports = ToDoList
