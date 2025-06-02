// Map of user IDs to their messages
const userMessages = {
  "icefieldwaripamoweifreedom": "You are ALREADY A MEMBER in Bounty News. That task was specifically for new users only. You have not been credited for that task",
  "happybankmoney": "Your account is at risk of being BAN. Please do well to follow task instructions so as to be credited.",
 "emmakani234": "You are ALREADY A MEMBER in Bounty News. That task was specifically for new users only. You have not been credited for that task",
 "etokwudog": "Thank you for completing the tasks but the Facebook group you created, you were supposed to have at least 20 members not 1 member. Also please when you are instructed to create a post, please create a new post for that task. Do not send an old screenshot for a task again.Thank you",
 "emmakani234": "One of your task was rejected. You were expected ti have at LEAST 20 members in the WhatsApp group not 4 as provided on the screenshot you upload. You have been credited for other tasks approved. Thank you !"
};

// Get the current user's ID
const currentId = localStorage.getItem("Id");

// Check if there's a message for the current user
if (userMessages[currentId]) {
  // Create <style> for notification if not already present
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

  // Create the notification element
  const notification = document.createElement("div");
  notification.id = "user-notification";

  const text = document.createElement("span");
  text.textContent = `Hello ${currentId}, ${userMessages[currentId]}`;

  const closeBtn = document.createElement("span");
  closeBtn.className = "close-btn";
  closeBtn.textContent = "×";
  closeBtn.onclick = () => notification.remove();

  notification.appendChild(text);
  notification.appendChild(closeBtn);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 500);
    }
  }, 15000);
}

