require("dotenv").config();

var keys = require('./keys.js');

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');

var spotify = new Spotify(keys.spotify);

var getMyTweets = function() {

  var client = new Twitter(keys.twitter);

  var params = {screen_name: 'ApolloniaBC'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      // console.log(tweets);
      for(var i = 0; i < tweets.length; i++) {
        console.log(tweets[i].created_at);
        console.log('========================================================');
        console.log(tweets[i].text);
      }
    }
  });
}

var getArtistName = function(artist) {
  return artist.name;
}

var getMeSpotify = function(songName) {

  if (songName == null) {
    songName = 'The Sign';
  }

  spotify.search({ type: 'track', query: songName}, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }
    var songs = data.tracks.items;
      for(var i = 0; i < songs.length; i++) {
        console.log(i);
        console.log('Artist(s): ' + songs[i].artists.map(
          getArtistName));
        console.log('Song Name: ' + songs[i].name);
        console.log('Preview Song: ' + songs[i].preview_url);
        console.log('Album: ' + songs[i].album.name);
        console.log('========================================================')
      }
  });
}

  // console.log("The movie name is " + movieName); 

var getMeMovie = function(movieName) {

  request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function (error, response, body) { 

    if (!error && response.statusCode === 200) {

      console.log("Movie Title: " + JSON.parse(body).Title);
      console.log("Release Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      // console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
      console.log("Country of Production: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
      }
      else {
        console.log('LIRI says: "I am sorry, but there was an error somewhere..."');
      }
  });
}

var pick = function(caseData, functionData) {
  switch(caseData) {
    case 'my-tweets' :
      getMyTweets();
      break;
    case 'spotify-this-song':
      getMeSpotify(functionData);
      break;
    case 'movie-this':
      getMeMovie(functionData);
      break;
    default:
      console.log('LIRI says: "I am sorry, but I cannot process your request"');
  }
}

var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);