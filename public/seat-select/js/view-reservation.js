const inputValue = document.getElementById('item');
const flight = document.getElementById('flight');
const name = document.getElementById('name');
const email = document.getElementById('email');
const seat = document.getElementById('seat');
const id = document.getElementById('id');
const userInfo = document.querySelector('.user-info');

const handleReservation = event => {
  event.preventDefault(); // Prevent reload of the page
  fetch('/reservation', {
    method: 'POST',
    body: JSON.stringify({ value: inputValue.value }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(user => {
      if (user.status === 200) {
        userInfo.style.display = 'block';
        const { data } = user;
        id.innerHTML = data.id;
        name.innerHTML = data.givenName + ' ' + data.surname;
        flight.innerHTML = data.flight;
        email.innerHTML = data.email;
        seat.innerHTML = data.seat;
      } else userInfo.style.display = 'none';
    });
  inputValue.value = '';
};
