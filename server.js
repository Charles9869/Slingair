'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const Reservation = require('./routes/reservation');

const PORT = process.env.PORT || 8000;

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use(morgan('tiny'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', Reservation);

// endpoints
app.use((req, res) => res.send('Not Found'));
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
