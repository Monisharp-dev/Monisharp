// List of allowed user Ids
const allowedIds = ["USER123", "USER456", "etokwudog","thehacker190261"]; // Replace with actual allowed Ids

// Get the current user's Id from localStorage
const currentId = localStorage.getItem("Id");

// Check if user is in the allowed list
if (allowedIds.includes(currentId)) {
  // Create CSS via <style> element
  const style = document.createElement("style");
  style.textContent = `
    #user-notification {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #4caf50;
      color: white;
      padding: 16px 24px;
      border-radius: 10px;
      box-shadow: 0 6px 12px rgba(0,0,0,0.2);
      z-index: 9999;
      font-size: 16px;
      opacity: 0;
      transition: opacity 0.5s ease;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    #user-notification.show {
      opacity: 1;
    }

    #user-notification .close-btn {
      margin-left: auto;
      cursor: pointer;
      font-size: 20px;
      font-weight: bold;
      color: white;
    }

    #user-notification .close-btn:hover {
      color: #ddd;
    }
  `;
  document.head.appendChild(style);

  // Create notification container
  const notification = document.createElement("div");
  notification.id = "user-notification";

  // Notification text
  const text = document.createElement("span");
  text.textContent = "Good day user, you performed two task and out of the two task, you performed one wrongly. Please do well to follow instructions to avoid Your Account getting ban. We acknowledge our fault in one of the task and we have compensated your account with ₦50. Thank you ";

  // Close button
  const closeBtn = document.createElement("span");
  closeBtn.className = "close-btn";
  closeBtn.textContent = "×";
  closeBtn.onclick = () => notification.remove();

  // Append elements
  notification.appendChild(text);
  notification.appendChild(closeBtn);
  document.body.appendChild(notification);

  // Show notification (fade in)
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 500); // Remove after fade-out
    }
  }, 15000);
}