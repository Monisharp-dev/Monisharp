// Map of user IDs to their messages
const userMessages = {
  "simonejembi783": "Please do well to follow instructions.The task that has to do with you having 2 Referrals on your dashboard, you did not perform it well instead you sent a screenshot of your WhatsApp chat with your Referral. It has not been approved as well as the vother tasks you perform. You did not heed to our Instructions.",
  "victorumoren113": "Please do well to follow instructions. The WhatsApp task you perform. You were instructed to have at least 20 views but instead in the screenshot you provided, we noticed your viewers were not up to 20. Hence, you were not rewarded for the task.You have been credited for the Account Verification Task",
 "femigodslove069": "When you are asked to create a Facebook post, please create a new one no matter if it is the same subject or title. Do not upload an image or screenshot of an old Facebook post. You also performed a WhatsApp Status task, you Don't have up to 20 views yet, hence, you have not been credited for performing that task.",
 "etokwudog": "The Facebook Reel task you did was not successful because the link you shared appears to be broken, hence you have not been credited for that task. Other Tasks have been approved.Thank you",
 "ed9583378": "Please follow instructions carefully. The WhatsApp group you created had only 2 members instead of 20 as instructed.We have credited your account with one-fourth of the payment.",
 "davidoton713": "Sir, the 14 tasks you performed were COMPLETELY rejected. You submitted screenshot s that do not relate to the Task you perform. Please be informed that if this continues, you will be ban from the Task Page."
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

