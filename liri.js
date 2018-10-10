require("dotenv").config();

var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");

var divider = "\n______________________________________________________________________________________________\n\n";

var spotify = new Spotify(keys.spotify);

var getMyTweets = function() {

  var client = new Twitter(keys.twitter);

  var screenName = {screen_name: 'ApolloniaBC'};
  client.get('statuses/user_timeline', screenName, function(error, tweets, response) {
    if (!error) {
      for(var i = 0; i < tweets.length; i++) {
        var date = tweets[i].created_at;
        
        var tweetHistory = [

          'On: ' + date.substring(0, 19),
          '@ApolloniaBC tweeted: ' + tweets[i].text,
        ].join("\n\n");
          console.log(tweetHistory);
          console.log(divider);
        fs.appendFile("log.txt", tweetHistory + divider, function(err) {
          if (err) throw err;
        });
      }
    }
    else {
      console.log('LIRI says:"I have encountered an error"');
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
        var songData = [
          '#' + (i + 1),
          'Artist(s): ' + songs[i].artists.map(getArtistName),
          'Song Name: ' + songs[i].name,
          'Preview Song: ' + songs[i].preview_url,
          'Album: ' + songs[i].album.name
        ].join("\n\n");
          console.log(songData);
          console.log(divider);
        fs.appendFile("log.txt", songData + divider, function(err) {
          if (err) throw err;
        });
      }
    });
  }

var getMeMovie = function(movieName) {

  if (movieName == null) {
    movieName = 'Mr. Nobody';
      console.log(divider);
      console.log('LIRI says: "If you have not seen "Mr. Nobody", then you should: http://www.imdb.com/title/tt0485947/"');
      console.log("It's on Netflix!");
      console.log(divider);
  }

  request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function (error, response, body) { 

    if (!error && response.statusCode === 200) {

      var jsonData = JSON.parse(body);

      var movieData = [
        'Movie Title: ' + jsonData.Title,
        'Release Year: ' + jsonData.Year,
        'IMDB Rating: ' + jsonData.imdbRating,
        'Rotten Tomatoes Rating: ' + jsonData.Ratings[1].Value,
        'Country of Production:  ' + jsonData.Country,
        'Language: ' + jsonData.Language,
        'Plot: ' + jsonData.Plot,
        'Actors: ' + jsonData.Actors
      ].join("\n\n");
        console.log(movieData);
        console.log(divider);
      fs.appendFile("log.txt", movieData + divider, function(err) {
        if (err) throw err;
      });
      }
      else {
        console.log('LIRI says: "I am sorry, but there was an error somewhere..."');
      }
  });
}

var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      console.log(error);
    }
    var dataArr = data.split(",");
      if (dataArr.length == 2) {
        pick(dataArr[0], dataArr[1]);
      } 
      else if (dataArr.length == 1) {
        pick(dataArr[0]);
      }
  });
}

var pick = function(caseData, functionData) {
  switch(caseData) {
    case 'my-tweets':
      getMyTweets();
      break;
    case 'spotify-this-song':
      getMeSpotify(functionData);
      break;
    case 'movie-this':
      getMeMovie(functionData);
      break;
    case 'do-what-it-says':
      doWhatItSays();
      break;
    default:
      console.log('LIRI says: "I am sorry, but I cannot process your request. Please enter a command."');
  }
}

var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);