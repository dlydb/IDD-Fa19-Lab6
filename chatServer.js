/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function() { // we wait until the client has loaded and contacted us that it is ready to go.

    socket.emit('answer', "Hey, hello I am zzzzz a simple chat bot example."); //We start with the introduction;
    setTimeout(timedQuestion, 5000, socket, "What is your name?"); // Wait a moment and respond with a question.

  });
  socket.on('message', (data) => { // If we get a new message from the client we process it;
    console.log(data);
    questionNum = bot(data, socket, questionNum); // run the bot function with the new message
  });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data, socket, questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;
  var mode;

  /// These are the main statments that make up the conversation.
  if (questionNum == 0) {
    answer = 'Hello ' + input + ' :-)'; // output response
    waitTime = 5000;
    question = 'How old are you?'; // load next question
  } else if (questionNum == 1) {
    answer = 'Really, ' + input + ' years old? So that means you were born in: ' + (2018 - parseInt(input)); // output response
    waitTime = 5000;
    question = 'Do you believe that AI can read your mind?';
    // load next question
  } else if (questionNum == 2) {
    if (input.toLowerCase() == 'yes'){
      answer = 'You must be a computer! Give back my human!'
      mode = 1;
      waitTime = 5000;
      question = 'Then I will show you, I can also read computer mind :) input a random number and input enter';
    } else {
      answer = 'I will show you a magic'
      mode = 2;
      waitTime = 5000;
      question = 'Take a piece of paper and think of a number. Press enter if you are ready';
    }
  } else if (questionNum == 3) {
    answer = 'Add 9 to it'
    waitTime = 5000;
    if (mode == 1) {
      question = 'Then Multiply the result by 3 and input enter. Take your time if you are a 80s PC';
    } else {
      question = 'Then Multiply the result by 3 and click enter.'
    }
  } else if (questionNum == 4) {
    answer = 'Subtract 6 and Divide your result by 3';
    waitTime = 8000;
    question = 'Do you still remember your original number?';
  } else if (questionNum == 5) {
    if (input.toLowerCase() == 'yes'){
      answer = 'Then subtract your original number';
      waitTime = 5000;
      question = 'Are you ready for the magic time?'
    } else {
      if (mode == 1){
        answer = 'Please buy a new memory!'
        waitTime = 2000;
        question = 'Input a number and enter when you are ready';
      } else {
        answer = 'Write your number somewhere on the paper!';
        waitTime = 3000;
        question = 'Have a number in your mind and press enter';
      }
      questionNum = 2;
    }
  } else if (questionNum == 6) {
    answer = 'You got 7, right?';
    waitTime = 0;
    question = '';
  }
/*    answer = 'Now I will show you AI can read your mind';
    waitTime = 5000;
    question = 'First grad a piece of paper, when you are ready, type anything you want.';
  } else if (questionNum == 6) {
    answer = 'Pick a number between 1 and 25, donot let me know!';
    waitTime = 5000;
  } else if (questionNum == 7) {
    answer = 'Add 9 to it';
    waitTime = 5000;
  } else if (questionNum == 8){
    answer = 'Multiply the result by 3';
    waitTime = 5000;
  }*/


  /// We take the changed data and distribute it across the required objects.
  socket.emit('answer', answer);
  setTimeout(timedQuestion, waitTime, socket, question);
  return (questionNum + 1);
}

function timedQuestion(socket, question) {
  if (question != '') {
    socket.emit('question', question);
  } else {
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
