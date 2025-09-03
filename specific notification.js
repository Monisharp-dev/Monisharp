// List of specific user IDs allowed to see the message
const allowedUserIds = ["67890", "hi"]; // Replace with actual Ids

// Get user ID from localStorage
const monisharpUserId = localStorage.getItem("Id");

// Check if the user is in the list
if (allowedUserIds.includes(monisharpUserId)) {
  // Inject CSS
  const style = document.createElement("style");
  style.textContent = `
    .mono-notify {
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #0c4a6e;
      color: #fff;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 0 15px rgba(0,0,0,0.2);
      font-family: 'Segoe UI', sans-serif;
      font-size: 15px;
      z-index: 9999;
      max-width: 320px;
      display: flex;
      justify-content: space-between;
      align-items: start;
      gap: 10px;
    }

    .mono-notify a {
      color: #22d3ee;
      text-decoration: underline;
      font-weight: bold;
    }

    .mono-notify .close-btn {
      background: none;
      border: none;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      margin: 0;
    }

    .mono-notify .close-btn:hover {
      color: #f87171;
    }
  `;
  document.head.appendChild(style);

  // Inject HTML
  const notify = document.createElement("div");
  notify.className = "mono-notify";
  notify.innerHTML = `
    <div>
      ❌ Your Task was not advertise because you did not include your TicTok link in your Task. Please message the admin on Facebook for help. </div>
    <button class="close-btn" onclick="this.parentElement.remove()">×</button>
  `;
  document.body.appendChild(notify);
}
