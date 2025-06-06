// Map of user IDs to their messages
const userMessages = {
  "icefieldwaripamoweifreedom": "You are ALREADY A MEMBER in Bounty News. That task was specifically for new users only. You have not been credited for that task",
  "happybankmoney": "Your account is at risk of being BAN. Please do well to follow task instructions so as to be credited.",
 "femigodslove069": "When you are asked to create a Facebook post, please create a new one no matter if it is the same subject or title. Do not upload an image or screenshot of an old Facebook post. You also performed a WhatsApp Status task, you Don't have up to 20 views yet, hence, you have not been credited for performing that task.",
 "etokwudog": "Thank you for completing the tasks but the Facebook group you created, you were supposed to have at least 20 members not 1 member. Also please when you are instructed to create a post, please create a new post for that task. Do not send an old screenshot for a task again.Thank you",
 "ed9583378": "You were instructed to create a Facebook post not a Facebook story.We have credited your account for the tasks you performed well.Thank you"
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

