require('dotenv').config();
var keys = require('./keys');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var pick = (process.argv[2]);

var selection = (process.argv[3]) || 'I saw the sign'; // default operator

if (pick === 'spotify-this-song') {
  getSpotify();

} else if (pick === 'my-tweets') {
  getTweets();

} else if (pick === 'movie-this') {
  getMovie();

} else if (pick === 'do-what-it-says') {
  doWhatItSays();

} else {
  //console.log('pick', pick); //undefined/null
  doWhatItSays();
}

function getSpotify() {
  spotify.search({ type: 'track', query: selection }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var songs = data.tracks.items;
    songs.forEach(function(song) {
      var artists = song.artists;
      // strip out only artists names
      artists = artists.map(function(artist) {
        return artist.name;
      });
      // artists = ['David Bowie', 'Kelly Clarkson']
      console.log('-------------------------');
      console.log('Name:', song.name);
      console.log('Artists:', artists.join(', '));
      console.log('Album:', song.album.name);
      console.log('Preview:', song.preview_url);
    });
  });
}

function getTweets() {
  var me = 'stephen_meyers0';
  var donald = 'realdonaldtrump';
  var params = {screen_name: donald};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      tweets.forEach(function(tweet) {
        var created = tweet.created_at;
        var text = tweet.text;
        console.log('-----------------------------');
        console.log('Created:', created);
        console.log('Tweet:', text);
      });
    }
  });
}

function getMovie() {
  var queryUrl = "http://www.omdbapi.com/?t=" + selection + "&y=&plot=short&apikey=trilogy";
  request(queryUrl, function(error, response, body) {
    if (error) {
      console.log('Error')
    } else {
      console.log('-----------------------------');
      console.log('Title: ' + JSON.parse(body).Title)
      console.log("Release Year: " + JSON.parse(body).Year);
    };
  });
}

function doWhatItSays() {
  pick = 'spotify-this-song'
  selection = 'I want it that way'
  getSpotify();
}
