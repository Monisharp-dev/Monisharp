function copyText(button) {
  const postCard = button.closest('.post-card');
  const title = postCard.querySelector('.post-title').innerText;
  const content = postCard.querySelector('.post-content').innerText;
  const textToCopy = `${title}\n\n${content}`;

  navigator.clipboard.writeText(textToCopy).then(() => {
    showNotification();
  });
}

function showNotification() {
  const notification = document.getElementById('notification');
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2500);
}

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.post-card');
  cards.forEach(card => {
    card.classList.add('fade-in');
  });
});