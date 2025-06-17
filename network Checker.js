// Inject stylish CSS with centered alignment
const style = document.createElement('style');
style.innerHTML = `
  #network-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: radial-gradient(circle at center, #1e1e1e 0%, #111 100%);
    color: white;
    z-index: 10000;
    display: none;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-family: 'Segoe UI', sans-serif;
    text-align: center;
    padding: 30px;
    box-sizing: border-box;
  }

  #network-overlay h2 {
    font-size: 2.2em;
    color: #ff4d4d;
    margin: 0;
  }

  #network-overlay p {
    margin-top: 15px;
    font-size: 1.05em;
    color: #e0e0e0;
    max-width: 90%;
    line-height: 1.6;
  }

  @keyframes fadeIn {
    from {opacity: 0;}
    to {opacity: 1;}
  }
`;
document.head.appendChild(style);

// Inject the overlay HTML
const overlay = document.createElement('div');
overlay.id = 'network-overlay';
overlay.innerHTML = `
  <h2>🚫 Connection Lost or Unstable</h2>
  <p>Your internet connection is either lost or unstable.<br>
  For your safety, the page has been temporarily paused.<br>
  Please check your connection and try again.</p>
`;
document.body.appendChild(overlay);

// Show or hide overlay
function toggleOverlay(show) {
  overlay.style.display = show ? 'flex' : 'none';
}

// Function to check network status
async function checkConnection() {
  try {
    await fetch("https://www.google.com/favicon.ico?_=" + Date.now(), {
      method: 'HEAD',
      cache: 'no-cache',
      mode: 'no-cors'
    });
    toggleOverlay(false);
  } catch {
    toggleOverlay(true);
  }
}

// Check every 10 seconds
setInterval(checkConnection, 10000);

// Initial check
checkConnection();

// Also listen for offline/online events
window.addEventListener('offline', () => toggleOverlay(true));
window.addEventListener('online', checkConnection);