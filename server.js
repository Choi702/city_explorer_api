'use strict'

//Bring in our dependencies
const express = require('express');
const cors = require('cors');

require('dotenv').config();


//Declare our port for our server to listen on
const PORT = process.env.PORT || 3000;

// start/._nstanciate Express
const app = express();

// Use CORS (cross origin resource sharing)
app.use(cors());

//Routes
app.get('/', (request, response) =>{
 response.send('Whats Up Man!');
})


app.get('/location', (request, response) =>{
let city = request.query.city;
  //getting the data from the database or api using a flat file
  let locationData = require('./data/location.json')[0];
  let location = new Location(locationData, city);
  response.send(location);
});

//constructor to tailor incoming raw data
function Location(obj, query){
  this.latitude = obj.lat;
  this.longitude = obj.lon;
  this.search_query = query;
  this.formatted_query = obj.display_name;
}
 app.get('/weather', (request, response) => {
  let data = require('./data/weather.json');
  let weatherArray = [];
  data.data.forEach(val => {
    weatherArray.push(new Weather(val));  
    
  });
  response.send(weatherArray);
 })

 function Weather(obj){
   this.forecast = obj.weather.description;
   this.time = new Date(obj.valid_date).toDateString();


 }



//start our server
app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});