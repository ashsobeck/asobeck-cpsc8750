// use the express library
const express = require('express');

// create a new server application
const app = express();

// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;


// The main page of our website
app.get('/', (req, res) => {
  res.send('Hello World!')
});

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");