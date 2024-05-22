const mongoose = require('mongoose');

const toDoSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      notes: {
        type: String,
        required: false,
      },
      completed: {
      type: Boolean,
      required: true,
    },
    });
  
    const ToDo = mongoose.model('ToDo', toDoSchema);
  
    module.exports = ToDo;