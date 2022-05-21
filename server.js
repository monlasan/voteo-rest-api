// Base imports
require('dotenv').config();
const express = require('express');
const cloudinary = require('cloudinary');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const connectDB = require('./config/db');

//DB Connection
connectDB();
// Init Express
const app = express();

// Middlewares
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/user', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/posts', require('./routes/posts'));

// Launch server.js listener
app.listen(8080, () => console.log(`Server runs on: http://localhost:8080`));
