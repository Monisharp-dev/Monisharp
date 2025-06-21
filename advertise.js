window.addEventListener("DOMContentLoaded", () => {
  const id = localStorage.getItem("Id") || "Unknown";
  let depositBalance = parseFloat(localStorage.getItem(`depositBalance_${id}`)) || 0;

  const userId = document.getElementById("userId");
  const reward = document.getElementById("reward");
  const targetUsers = document.getElementById("targetUsers");
  const price = document.getElementById("price");
  const date = document.getElementById("date");
  const payBtn = document.getElementById("payBtn");
  const alertBox = document.getElementById("alertBox");
  const loader = document.getElementById("loader"); // Loader element

  userId.value = id;
  date.value = new Date().toLocaleDateString();

  function showAlert(message, type = "success") {
    alertBox.textContent = message;
    alertBox.className = `alertBox ${type}`;
    alertBox.style.display = "block";
    setTimeout(() => {
      alertBox.style.display = "none";
    }, 5000);
  }

  function calculatePrice() {
    const r = parseFloat(reward.value);
    const u = parseInt(targetUsers.value);
    if (!isNaN(r) && !isNaN(u)) {
      const base = r * u;
      const total = base + base * 0.5; // 50% markup
      price.value = total.toFixed(2);
    } else {
      price.value = "";
    }
  }

  reward.addEventListener("input", calculatePrice);
  targetUsers.addEventListener("input", calculatePrice);

  payBtn.addEventListener("click", async () => {
    const r = parseFloat(reward.value);
    const u = parseInt(targetUsers.value);
    const p = parseFloat(price.value);
    const taskText = document.getElementById("task").value;
    const category = document.getElementById("category").value;

    // Validation
    if (isNaN(r) || r < 10) {
      showAlert("Reward must be at least ₦10.", "error");
      return;
    }

    if (isNaN(u) || u <= 9) {
      showAlert("You must target more than 9 users.", "error");
      return;
    }

    if (!taskText || taskText.trim() === "") {
      showAlert("Task description is required.", "error");
      return;
    }

    if (!category || category.trim() === "") {
      showAlert("Task category is required.", "error");
      return;
    }

    if (p > depositBalance) {
      showAlert("Insufficient balance to pay. Please top up.", "error");
      return;
    }

    loader.style.display = "block"; // Show loader

    try {
      // Deduct balance
      const newBal = depositBalance - p;
      depositBalance = newBal;
      localStorage.setItem(`depositBalance_${id}`, newBal.toFixed(2));

      // Save task to localStorage
      const newTask = {
        Id: id,
        category,
        reward: r,
        users: u,
        task: taskText,
        date: date.value,
        totalPaid: p.toFixed(2),
        status: "Pending (24hrs)"
      };

      const taskHistoryKey = `taskHistory_${id}`;
      const existingHistory = JSON.parse(localStorage.getItem(taskHistoryKey)) || [];
      existingHistory.push(newTask);
      localStorage.setItem(taskHistoryKey, JSON.stringify(existingHistory));

      // Post to API
      await fetch("https://sheetdb.io/api/v1/mndxqf0liv4ch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Id: id,
          reward: r,
          category,
          task: taskText,
          date: date.value
        })
      });

      // Show success alert
      showAlert("Payment successful! Task submitted. Tasks will be processed and approved in 24hrs.", "success");

      // Reset form
      document.getElementById("adForm").reset();
      userId.value = id;
      date.value = new Date().toLocaleDateString();
      price.value = "";

      // Auto-scroll to bottom
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }, 300);

    } catch (error) {
      console.error("Error submitting task:", error);
      showAlert("An error occurred while submitting the task. Try again later.", "error");
    } finally {
      loader.style.display = "none"; // Hide loader
    }
  });
});
