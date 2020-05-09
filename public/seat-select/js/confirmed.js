const flight = document.getElementById('flight');
const name = document.getElementById('name');
const email = document.getElementById('email');
const seat = document.getElementById('seat');
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

fetch(`/flight-confirmation?id=${id}`)
  .then(res => res.json())
  .then(userData => {
    const { user } = userData; // Deconstruct the object
    flight.innerHTML = user.flight;
    name.innerHTML = user.givenName + ' ' + user.surname; // Add a space between the surname and the given name
    email.innerHTML = user.email;
    seat.innerHTML = user.seat;
  });
