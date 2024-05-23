const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  task: {
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

const toDoListSchema = mongoose.Schema({
    listName: {
      type: String,
      required: true,
    },
    tasks: [taskSchema]
});

const ToDoList = mongoose.model('ToDoList', toDoListSchema);

module.exports = ToDoList
