// use the express library
const express = require('express');
const cookieParser = require('cookie-parser');
const fetch = require('node-fetch')

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

const makeAnswerMap = (correctAnswer, answers) => {
  const answerLinks = answers.map(answer => {
    return `<a href="javascript:alert('${answer === correctAnswer ? 'Correct!' : 'Incorrect, Please Try Again!'
      }')">${answer}</a>`
  });
  return answerLinks;
}

app.get("/trivia", async (req, res) => {
  // fetch the data
  const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");


  // fail if bad response
  if (!response.ok) {
    res.status(500);
    res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
    return;
  }

  // interpret the body as json
  const content = await response.json();
  // res.send(JSON.stringify(content, 2));
  const results = content.results[0];
  // fail if db failed
  if (content.response_code !== 0) {
    res.status(500);
    res.send(`Open Trivia Database failed with internal response code ${content.response_code}`);
    return;
  }

  // respond to the browser
  // TODO: make proper html
  //... operator unpacks all values from the incorrect answers
  // sort with random randomizes the array instead of always making the 
  // correct answer at the end
  // credit: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  const allAnswers = [...results.incorrect_answers, results.correct_answer]
    .sort(() => (Math.random() - .5));
  console.log(allAnswers);
  // console.log(results);
  res.render('trivia', {
    question: results.question,
    answers: makeAnswerMap(results.correct_answer, allAnswers),
    category: results.category,
    difficulty: results.difficulty,
  });
});

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");