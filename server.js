// Base imports
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const cors = require('cors');
//DB Connection
connectDB();
// Init Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

// Launch server.js listener
app.listen(8080, () => console.log(`Server runs on: http://localhost:8080`));
