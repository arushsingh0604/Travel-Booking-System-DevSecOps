document.addEventListener('DOMContentLoaded', () => {
  const logged = localStorage.getItem('isLoggedIn');
  const email = localStorage.getItem('currentUserEmail');
  const user = JSON.parse(localStorage.getItem('travelEaseUser'));
  if (!logged || !user || user.email !== email) {
    location.href = '../index.html'; return;
  }
  document.getElementById('username').textContent = user.name;
  document.getElementById('userFirstName').textContent = user.name.split(' ')[0];
  if (user.avatar) document.getElementById('userAvatar').src = user.avatar;
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUserEmail');
    location.href = '../index.html';
  });
});
