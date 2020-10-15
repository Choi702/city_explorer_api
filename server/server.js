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

//start our server
app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});

