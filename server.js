const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const methodOverride = require("method-override")

// Import the controller file
const ToDoListsRouter = require('./controllers/ToDoListsController.js');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors({ origin: 'http://localhost:5173' })); // ONLY this host can now access this API
app.use(express.json()); // Formats the data for Fetch and Ajax use. Similar to how the url extended allow for req.body use.
app.use(methodOverride("_method"));

// Add the JukeboxRouter to the `/tracks` route
app.use('/todo-lists', ToDoListsRouter);





app.listen(3000, () => {
  console.log('The express app is ready!');
});
