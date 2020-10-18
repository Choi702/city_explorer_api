'use strict'

//Bring in our dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

//environmental variables
require('dotenv').config();


//Declare our port for our server to listen on
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

//Routes
// app.get('/location', locationHandler => {
//   response.send('Whats Up Man!');
// });


//Route handler
app.get('/location', (req, res) => {
  let city = req.query.city;
  let key = process.env.LOCATIONIQ_API_KEY;
console.log('key');
  const URL = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
  superagent.get(URL)
    .then(data => {
      let location = new Location(data.body[0], city);
      res.status(200).send(location);
    })
    .catch(error => {
      console.log('error', error);
      res.status(500).send('Your API call did not work!');
    });
  
});
// constructor to tailor incoming raw data
function Location(obj, query) {
    this.latitude = obj.lat;
    this.longitude = obj.lon;
    this.search_query = query;
    this.formatted_query = obj.display_name;
}

app.get('/weather', (req, res) =>{
let city = req.query.city;
let tok = process.env.WEATHER_API_KEY;
const URL = `http://api.weatherbit.io/v2.0/forecast/daily?lat={47.61}&lon={-122.33}?city={Seattle}&country={US}?key=${tok}`
superagent.get(URL)
let newMap =[];
  let maps = new maps.map(data[0], city);
  res.status(200).send(maps);
});

function Weather(obj, query){
  this.latitude = obj.lat;
  this.longitude = obj.lon;
  this.forecast = obj.forecast;
  this.search_query = query;
  this.time = obj.time;

}

       
   
//start our server
app.listen(PORT, () => {
    console.log(`Server is now listening on port ${PORT}`);
  });
