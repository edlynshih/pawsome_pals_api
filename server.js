// load .env data into process.env
require('dotenv').config();

// Web server config

const express = require('express');
const morgan = require('morgan');
const PORT = process.env.PORT || 8080;
const app = express();
const cors = require("cors");


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own

//SECOND
const petApiRoutes = require('./routes/pets-api');
const matchApiRoutes = require('./routes/matches-api');
const userApiRoutes = require('./routes/users-api');
const relationshipsApiRoutes = require('./routes/relationships-api');
const messageApiRoutes = require('./routes/messages-api');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`

//FIRST
app.use(cors());
app.use('/api/pets', petApiRoutes);
app.use('/api/matches', matchApiRoutes);
app.use('/api/users', userApiRoutes);
app.use('/api/relationships', relationshipsApiRoutes);
app.use('/api/messages', messageApiRoutes);

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});



