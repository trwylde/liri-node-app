require("dotenv").config();

var keys = require('./keys.js');

var Twitter = require('twitter');
// var Spotify = require('node-spotify-api');

// var spotify = new Spotify(keys.spotify);

var getMyTweets = function() {

var client = new Twitter(keys.twitter);

var params = {screen_name: 'ApolloniaBC'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    // console.log(tweets);
    for(var i = 0; i < tweets.length; i++) {
      console.log(tweets[i].created_at);
      console.log(' ');
      console.log(tweets[i].text);
    }
  }
});
}

var pick = function(caseData, functionData) {
  switch(caseData) {
    case 'my-tweets' :
      getMyTweets();
      break;
    default:
    console.log('LIRI says: "I am sorry, but I cannot process your request"');
  }
}

var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);