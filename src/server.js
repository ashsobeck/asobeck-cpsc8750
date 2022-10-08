// use the express library
const express = require('express');
const cookieParser = require('cookie-parser');

// create a new server application
const app = express();

// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;
let nextVisitorId = 1;

// The main page of our website now using html
app.use(express.static('public'));
app.use(cookieParser());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const dateNow = Date.now().toString();
  let visitorId = req.cookies.visitorId ? nextVisitorId : ++nextVisitorId;
  res.cookie('visitorId', visitorId);
  res.cookie('visited', dateNow);
  console.log(req.cookies.visited);
  if (req.cookies.visited) {
    req.cookies.visited = Math.floor((dateNow - req.cookies.visited ) / 1000)
  } else {
    req.cookies.visited = null;
  }
  res.render('welcome', {
    name: req.query.name || "World",
    accessDate: new Date().toLocaleString(),
    visitorNum: visitorId,
    timeSinceLastVisit: req.cookies.visited, 
  });
});

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");