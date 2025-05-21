// Map of user IDs to their messages
const userMessages = {
  "etokwudog": "You are ALREADY A MEMBER in Bounty News. That task was specifically for newusrrs only. You have not been credited",
  "opalekesoromdayo": "₦100 cash has been credited to your account for performing task very well",
  "Jamesudom2510": "You are ALREADY A MEMBER in Bounty News. That task was specifically for newusrrs only. You have not been credited",
  "favyjay28": "You are ALREADY A MEMBER in Bounty News. That task was specifically for newusrrs only. You have not been credited",
  "ajaniisraelojasope11": "₦50 has been credited to your task balance instead if ₦100 because you did not link your WhatsApp account to Wabot",
  "gomoarukhe": "You are already a member on bounty news and you earned ₦50 for partially completing a task.",
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

etokwudog	ALREADY A MEMBER 
opalekesoromdayo	₦100 cash
Jamesudom2510	ALREADY A MEMBER
favyjay28	ALREADY A MEMBER 
ajaniisraelojasope11	₦50. Did not link account 
gomoarukhe	ALREADY A MEMBER 
gomoarukhe	₦50 
gomoarukhe	Have registered
gomoarukhe	ALREADY A MEMBER 