'use strict'

//Bring in our dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const { query } = require('express');

//environmental variables
require('dotenv').config();

//Declare our port for our server to listen on
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

//create our postgres client
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

// Routes
// app.get('/location', locationHandler => {
//   response.send('Whats Up Man!');
// });

//Route handler
app.get('/location', (req, res) => {
  let city = req.query.city;
  let key = process.env.LOCATIONIQ_API_KEY;
  //check the DB to see if I have stored the information
  const sqlData = `SELECT * FROM location WHERE search_query= $1;`;
  client.query(sqlData, [city])
    .then(data => {
      if (data.rowCount) {
        //cached data
        res.status(200).json(data.rows[0]);
        //location data
      } else {
        const URL = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
        superagent.get(URL)
          .then(data => {
            let location = new Location(data.body[0], city);
            const SQL = `INSERT INTO location (latitude, longitude, search_query, formatted_query) VALUES ($1, $2, $3, $4)`;
            client.query(SQL, [location.latitude, location.longitude, location.search_query, location.formatted_query])
              .then(data => {
                res.status(200).send(location);

              })

          })
          .catch(error => {
            console.log('error', error);
            res.status(500).send('Your API call did not work!');
          });

      }

    })

});
// constructor to tailor incoming raw data
function Location(obj, query) {
  this.latitude = obj.lat;
  this.longitude = obj.lon;
  this.search_query = query;
  this.formatted_query = obj.display_name;
}

app.get('/weather', (req, res) => {
  let city = req.query.search_query;
  let tok = process.env.WEATHER_API_KEY;
  const URL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${tok}`;
  superagent.get(URL)
    .then(data => {
      let newMap = data.body.data.map(function (weatherDay) {
        let weatherApi = new Weather(weatherDay)
        return weatherApi;

      });
      newMap = newMap.slice(0, 8);
      res.status(200).send(newMap);
    })
    .catch((error) => {
      console.log('error', error);
      res.status(500).send('Your API call did not work!');
    });
});

function Weather(obj) {

  this.forecast = obj.weather.description;
  this.time = obj.datetime;

}

app.get('/trails', (req, res) => {
  let city = req.query.latitude;
  let city2 = req.query.longitude;
  // console.log('req.query', req.query);
  let tok1 = process.env.TRAIL_API_KEY;
  const URL = `https://www.hikingproject.com/data/get-trails?lat=${city}&lon=${city2}&maxDistance=10&key=${tok1}`;
  superagent.get(URL)
    .then(data => {
      let trailsNew = data.body.trails.map(trails => {
        let trailsApi = new Trails(trails)
        return trailsApi;
      })
      res.status(200).send(trailsNew);
    })
    .catch((error) => {
      console.log('error', error);
      res.status(500).send('Your API call did not work!');
    });


});

function Trails(obj) {
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.starVotes;
  this.summary = obj.summary;
  this.trail_url = obj.url;
  this.conditions = obj.conditionDetails;
  this.condition_date = obj.conditionDate;
  this.condition_time = obj.conditionStatus;
}

app.get('/movies', (req, res) => {
  let city = req.query.search_query;
  // console.log('city here', city);
  let tok4 = process.env.MOVIE_API_KEY;
  const URL = `https://api.themoviedb.org/3/search/movie/?api_key=${tok4}&query=${city}`;
  superagent.get(URL)
    .then(results => {
      // console.log('results.body', results.body);
      let searchMovie = results.body.results.map(movies => {
        let newerMovies = new Movies(movies)
        return newerMovies;
      })
      res.status(200).send(searchMovie);
    })
    .catch(error => {
      console.log('error', error);
      res.status(500).send('Your API call did not work!');
    });

})

function Movies(obj) {
  this.title = obj.title;
  this.overview = obj.overview;
  this.average_votes = obj.vote_average;
  this.total_votes = obj.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${obj.poster_path}`;
  this.popularity = obj.popluarity;
  this.released_on = obj.release_date;
}


app.get('/yelp', (req, res) => {
  const numPageMax = 5;
  let page = req.query.page || 1;
  const URL = `https://api.yelp.com/v3/businesses/search`;
  const queryParam = {
    term: 'restaurant',
    latitude: req.query.latitude,
    longitude: req.query.longitude,
    limit: 5,
    offset: ((page - 1) * numPageMax + 1),
  };
  superagent.get(URL)
    .auth(process.env.YELP_API_KEY, { type: "bearer" })
    .query(queryParam)
    .then(result => {
      let yelpSearch = result.body.businesses.map(yelp => {
        let newerYelp = new Yelp(yelp)
        return newerYelp;
      })
      res.status(200).send(yelpSearch);
    })
    .catch(error => {
      console.log('error', error);
      res.status(500).send('Your API call did not work!');
    });


})


function Yelp(obj) {
  this.name = obj.name;
  this.image_url = obj.image_url;
  this.price = obj.price;
  this.rating = obj.rating;
  this.url = obj.url;
}
// Routes
app.use('*', notFoundHandler);

//Function handler
function notFoundHandler(req, res) {
  res.status(404).send('Not Found');
};

//start our server
app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});
