
// Inject styles
const style = document.createElement('style');
style.textContent = `
  .net-status {
    display: none;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9999;
    padding: 10px;
    text-align: center;
    font-weight: bold;
    color: white;
    font-family: Arial, sans-serif;
  }

  .net-offline {
    background-color: #ff5252;
  }

  .net-online {
    background-color: #00c853;
  }
`;
document.head.appendChild(style);

// Inject HTML notice bars
const offlineNotice = document.createElement('div');
offlineNotice.id = 'offline-notice';
offlineNotice.className = 'net-status net-offline';
offlineNotice.textContent = '🚫 You are offline';
document.body.appendChild(offlineNotice);

const onlineNotice = document.createElement('div');
onlineNotice.id = 'online-notice';
onlineNotice.className = 'net-status net-online';
onlineNotice.textContent = '✅ Back online';
document.body.appendChild(onlineNotice);

// Handle status changes
window.addEventListener('offline', () => {
  offlineNotice.style.display = 'block';
  onlineNotice.style.display = 'none';
});

window.addEventListener('online', () => {
  offlineNotice.style.display = 'none';
  onlineNotice.style.display = 'block';

  setTimeout(() => {
    onlineNotice.style.display = 'none';
  }, 3000);
});

// Show offline notice on load if offline
if (!navigator.onLine) {
  offlineNotice.style.display = 'block';
}
