const flightInput = document.getElementById('flight');
const seatsDiv = document.querySelector('.seats-section');
const confirmButton = document.getElementById('confirm-button');
const formContainer = document.querySelector('.form-container');
const flightSelect = document.getElementById('flight-select');

let selection = '';
let currentSeatButton;
const renderSeats = (seats) => {
  document.querySelector('.form-container').style.display = 'block';

  const alpha = ['A', 'B', 'C', 'D', 'E', 'F'];
  for (let r = 1; r < 11; r++) {
    const row = document.createElement('ol');
    row.classList.add('row');
    row.classList.add('fuselage');
    seatsDiv.appendChild(row);
    for (let s = 1; s < 7; s++) {
      const seatNumber = `${r}${alpha[s - 1]}`;
      const seat = document.createElement('li');
      const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
      const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;
      let currentSeat = seats.find((seat) => seat.id === seatNumber);
      currentSeat.isAvailable
        ? (seat.innerHTML = seatAvailable)
        : (seat.innerHTML = seatOccupied);
      row.appendChild(seat);
    }
  }

  let seatMap = document.forms['seats'].elements['seat'];
  seatMap.forEach((seat) => {
    seat.onclick = () => {
      selection = seat.value;
      currentSeatButton = seat.value;
      seatMap.forEach((x) => {
        if (x.value !== seat.value) {
          document.getElementById(x.value).classList.remove('selected');
        }
      });
      document.getElementById(seat.value).classList.add('selected');
      document.getElementById('seat-number').innerText = `(${selection})`;
      confirmButton.disabled = false;
    };
  });
};

const toggleFormContent = (event) => {
  seatsDiv.innerText = ''; // Removes everything inside to refresh when flight number is different
  const flightNumber = event.target.value;
  console.log('toggleFormContent: ', flightNumber);
  if (isFlightFormat(flightNumber)) {
    fetch('/seat-available', {
      method: 'POST',
      body: JSON.stringify({ flightNumber }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          formContainer.style.display = 'block';
          renderSeats(data.seatAvailable);
        } else formContainer.style.display = 'none';
      });
  }
};

const handleConfirmSeat = (event) => {
  event.preventDefault();
  let reservation = {
    seat: currentSeatButton,
    flightNumber: flightSelect.value,
    givenName: givenName.value,
    surname: surname.value,
    email: email.value,
  };

  fetch('/confirm-seat', {
    method: 'POST',
    body: JSON.stringify(reservation),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 201) {
        window.location.href = `/seat-select/confirmed.html?id=${data.reservation.id}`;
        document.body.removeChild(document.querySelector('.form-content.user'));
      } else {
        const error = document.createElement('h1');
        error.innerHTML = data.message;
        document.querySelector('.form-content.user').append(error);
      }
    })
    .catch((err) => console.log(err));
};

// Check if the flight number is in the good format
const isFlightFormat = (flight) => {
  return flight[0].toLowerCase() === 's' && flight[1].toLowerCase() === 'a';
};

const loadFlights = () => {
  fetch('/slingair/flights', {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((data) => {
      const flights = JSON.parse(data).flights;
      flights.forEach((flight) => {
        const option = document.createElement('option');
        option.value = flight;
        option.innerHTML = flight;
        flightSelect.appendChild(option);
        console.log(flight);
      });
    });
};

// Loads all the flights and store in dropdown
loadFlights();

// flightInput.addEventListener('blur', toggleFormContent);
flightSelect.addEventListener('change', toggleFormContent);
