const flight = document.getElementById('flight');
const name = document.getElementById('name');
const email = document.getElementById('email');
const seatText = document.getElementById('seat');

fetch('/reservations')
  .then(res => res.json())
  .then(data => {
    data.forEach(reservation => {
      const user = document.createElement('div');
      const domString = `<div class="user allo"><ul class="user-info"><li>Flight #:<span id="flight">${
        reservation.flight
      }</span> seat #: <span id="seat">${
        reservation.seat
      }</span></li><li>Name:<span id="name">${reservation.givenName +
        ' ' +
        reservation.surname}</span></li><li>Email:<span id="email">${
        reservation.email
      }</span></li></ul></div>`;
      user.innerHTML = domString;
      document.querySelector('.admin').appendChild(user.firstChild);
    });
  });

const flightContainer = document.querySelector('.flight-container');

const renderSeats = (seats, number) => {
  const alpha = ['A', 'B', 'C', 'D', 'E', 'F'];
  for (let r = 1; r < 11; r++) {
    const row = document.createElement('ol');
    row.classList.add('row');
    row.classList.add('fuselage');
    document.getElementById(number).appendChild(row);
    for (let s = 1; s < 7; s++) {
      const seatNumber = `${r}${alpha[s - 1]}`;
      const seat = document.createElement('li');
      const seatOccupied = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="flight-seat-occupied">${seatNumber}</span></label></li>`;
      const seatAvailable = `<li><label class="seat"><span id="${seatNumber}" class="avail no-cursor">${seatNumber}</span></label></li>`;
      let currentSeat = seats.find(seat => seat.id === seatNumber);
      currentSeat.isAvailable
        ? (seat.innerHTML = seatAvailable)
        : (seat.innerHTML = seatOccupied);
      row.appendChild(seat);
    }
  }

  let seatMap = document.forms['seats'].elements['seat'];
  seatMap.forEach(seat => {
    seat.onclick = event => {
      fetch('/reservations/user', {
        method: 'POST',
        body: JSON.stringify({ flight: event.path[5].id, seat: seat.value }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          data.forEach(reservation => {
            if (
              reservation.flight == event.path[5].id &&
              reservation.seat == seat.value
            ) {
              seatText.innerHTML = reservation.seat;
              flight.innerHTML = reservation.flight;
              name.innerHTML =
                reservation.givenName + ' ' + reservation.surname;
              email.innerHTML = reservation.email;
            }
          });
        });
    };
  });
};

fetch('/slingair/flights')
  .then(res => res.json())
  .then(data => {
    const flights = JSON.parse(data).flights;
    handleSeatRender(flights);
  });

const handleSeatRender = flights => {
  flights.forEach(flightNumber => {
    // Create flight number <h1></h1>
    const flightInfo = document.createElement('div');
    const flightContent = `<div class="flight-info" id=${flightNumber}><img class="loading" src="./images/loading.gif"><h1>${flightNumber}</h1></div>`;
    flightContainer.innerHTML += flightContent;

    fetch('/seat-available', {
      method: 'POST',
      body: JSON.stringify({ flightNumber }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        // Removes the loading image
        document
          .querySelectorAll('.loading')
          .forEach(element => (element.style.display = 'none'));
        renderSeats(data.seatAvailable, flightNumber);
      });
  });
};
