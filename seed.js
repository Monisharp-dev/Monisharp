// seed.js

function showNotification(message, type = 'success') {
  const note = document.getElementById('notification');
  note.className = 'notification';
  if (type === 'error') {
    note.classList.add('error');
  }
  note.textContent = message;
  note.classList.remove('hidden');
  setTimeout(() => {
    note.classList.add('hidden');
  }, 5000);
}

function plantSeed(type) {
  // You can enhance this with actual logic using SheetDB
  let seedAmount = 0;

  switch (type) {
    case 'Basic':
      seedAmount = 100;
      break;
    case 'Green':
      seedAmount = 400;
      break;
    case 'Mega':
      seedAmount = 1000;
      break;
    default:
      showNotification('Invalid seed type selected.', 'error');
      return;
  }

  // Simulate slotting and response
  showNotification(`You've successfully planted a ${type} Seed worth ₦${seedAmount}. Good luck!`);

  // Add animation on planting
  animatePlanting();
}

function animatePlanting() {
  const container = document.querySelector('.container');
  container.style.transition = 'transform 0.3s';
  container.style.transform = 'scale(1.03)';
  setTimeout(() => {
    container.style.transform = 'scale(1)';
  }, 300);
}