var express    = require('express');
var bodyParser = require('body-parser');
var moment     = require('moment');
var fs         = require('fs');

/* Globals */
var config = JSON.parse(fs.readFileSync('config.json'));
var slackToken = config.slackToken;
var allowedUsers = config.allowedUsers;
var disallowedUsers = config.disallowedUsers;


// Logs data to log.txt file
function log(text, req) {

  var time = moment().toISOString();
  var log = time + ' - ' + text + ': ' + JSON.stringify(req) + '\n';
  fs.appendFile('log.txt', log);

}


function parseRequest(req) {

  // Checks slack token exists and is valid
  if (req.token !== slackToken) { 
    log('Invalid token', req);
    return 'Invalid token. Message @josh and let him know so he can fix it!';
  }

  // Checks username is not in list of disallowed users
  if (disallowedUsers.indexOf(req.user_name) > -1) {
    log('Disallowed user attempted to send tweet', req);
    return 'Sorry, you\'re not authorized to send tweets. Contact @josh or @jamie for details.'
  }

  // Checks whether all users are allowed or if not, that user is allowed to tweet
  if (allowedUsers !== '*' && allowedUsers.indexOf(req.user_name) === -1) {
    log('Unauthorized user attempted to send tweet', req);
    return 'Sorry, you\'re not authorized to send tweets. Contact @josh or @jamie for details.'
  }

  // Checks that tweet is less than 140 characters
  if (req.text.length > 140) {
    log('Tweet too long', req)
    return 'Oops! That tweet is ' + (req.text.length - 140) + ' characters too long!';
  }

  // Sends tweet
  return sendTweet(req.text) ? 'Tweet sent by ' + req.user_name : 'Error sending tweet. Contact @josh and let him know so he can fix it!';

}


function sendTweet(tweet) {
  return true;
}


/* Set-up server */

var app = express();

app.use( bodyParser.urlencoded({ extended: false }) );

app.post('/', function(req, res) {

  var message = parseRequest(req);

  // This is Slack we're dealing with, everything has to return a 200
  res.statusCode = 200;

  // Return a message which will be displayed to the user in Slack
  res.end(message);

});

app.listen(1340);
