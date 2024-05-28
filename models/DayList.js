const mongoose = require('mongoose');

const dayListSchema = mongoose.Schema({
    date: {
      type: String,
      required: true,
    },
    list: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'ToDoList'
    }
});

const DayList = mongoose.model('DayList', dayListSchema);

module.exports = DayList
