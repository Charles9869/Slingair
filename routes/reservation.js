const express = require('express');
const router = express.Router();
const rp = require('request-promise');

router.get('/', (req, res) => {
  res.redirect('/seat-select');
});

router.post('/seat-available', async (req, res) => {
  const { flightNumber } = req.body;
  const response = await rp.get(
    'https://journeyedu.herokuapp.com/slingair/flights'
  );
  const allFlights = JSON.parse(response);
  let flightNumberExist = allFlights.flights.some(
    (flight) => flightNumber === flight
  );
  if (flightNumberExist) {
    const response = await rp.get(
      `https://journeyedu.herokuapp.com/slingair/flights/${flightNumber}`
    );
    res.status(200).send({
      status: 'success',
      seatAvailable: JSON.parse(response)[flightNumber],
    });
  } else res.status(200).send({ status: 'error' });
});

router.post('/confirm-seat', (req, res) => {
  const { seat, flightNumber, givenName, surname, email } = req.body;
  const options = {
    method: 'POST',
    uri: 'https://journeyedu.herokuapp.com/slingair/users',
    form: {
      flight: flightNumber,
      seat,
      email,
      givenName,
      surname,
    },
    headers: {
      'content-type': 'application/json',
    },
  };

  rp.post(options)
    .then((res) => JSON.parse(res))
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(JSON.parse(err.error));
    });
});

router.get('/flight-confirmation', async (req, res) => {
  try {
    const response = await rp.get(
      `https://journeyedu.herokuapp.com/slingair/users/${req.query.id}`
    );
    res
      .status(200)
      .send({ status: 'success', user: JSON.parse(response).data });
  } catch (err) {
    console.error(err);
  }
});

router.get('/slingair/flights', async (req, res) => {
  try {
    const response = await rp.get(
      'https://journeyedu.herokuapp.com/slingair/flights'
    );
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
  }
});

router.post('/reservation', async (req, res) => {
  try {
    const response = await rp.get(
      `https://journeyedu.herokuapp.com/slingair/users/${req.body.value}`
    );
    res.status(200).send(JSON.parse(response));
  } catch (err) {
    res.send(JSON.parse(err.error));
  }
});

// Returns all the reservations
router.get('/reservations', async (req, res) => {
  let index = 0;
  let hasReservation = false;
  let arrayReservation = [];
  do {
    try {
      const response = await rp.get(
        `https://journeyedu.herokuapp.com/slingair/users?limit=10&start=${index}`
      );
      // Checks ifn the number of reservations is smaller
      if (JSON.parse(response).length < 10) hasReservation = true;
      else {
        JSON.parse(response).forEach((reservation) => {
          arrayReservation.push(reservation);
        });
      }
      index += 11; // Increment the count
    } catch (err) {
      console.log(err);
    }
  } while (!hasReservation);
  res.send(arrayReservation);
});

router.post('/reservations/user', async (req, res) => {
  let index = 0;
  let hasReservation = false;
  let arrayReservation = [];
  while (!hasReservation) {
    try {
      const response = await rp.get(
        `https://journeyedu.herokuapp.com/slingair/users?limit=25&start=${index}`
      );
      JSON.parse(response).forEach((element) => {
        arrayReservation.push(element);
      });
      if (JSON.parse(response).length === 0) {
        hasReservation = true;
      }
      index += 25; // Increment the count
    } catch (err) {
      console.log(err);
    }
  }
  res.json(arrayReservation);
});

module.exports = router;
