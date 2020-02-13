require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
// Remember to insert your credentials here
// In this case, the credentials are saved in a .env file that is in .gitignore
const clientId = process.env.CLIENT_ID,
  clientSecret = process.env.CLIENT_SECRET;

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:
// Route "/" (http://localhost:3000)
app.get('/', (req, res, next) => {
  res.render('index'); // Render /views/index.hbs
});

app.get('/artists', (req, res, next) => {
  const query = req.query.search;
  spotifyApi
    .searchArtists(query)
    .then(artists => {
      const data = {
        artists: artists.body.artists.items
      };
      console.log('The received data from the API: ', artists.body.artists.items[0].images[0]);
      res.render('artists', data);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
