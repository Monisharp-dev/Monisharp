document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("Id") || "Guest";

  document.querySelectorAll(".task-card").forEach((card, index) => {
    const taskKey = `task_done_${userId}_#${index}`;
    const form = card.querySelector(".task-form");

    // Check if task already completed
    if (localStorage.getItem(taskKey)) {
      form.parentElement.innerHTML = `<p class="task-done">You have already completed this task.</p>`;
      return;
    }

    // Set hidden input for ID
    const hiddenId = form.querySelector(".hidden-id");
    hiddenId.value = userId;

    // Handle form submission
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const text = form.querySelector("textarea").value.trim();
      const file = form.querySelector('input[type="file"]').files[0];

      if (!file || !text) {
        showAlert("All fields are required!", "#f44336");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      const deleteAt = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);
      formData.append("expiration", deleteAt);

      const imgbbApiKey = "b08c28e563e88b729eefa384ac7d00db";
      const uploadUrl = `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`;

      try {
        const res = await fetch(uploadUrl, {
          method: "POST",
          body: formData
        });

        const imgData = await res.json();

        if (!imgData.success) {
          showAlert("Image upload failed. Try again.", "#f44336");
          return;
        }

        const imageUrl = imgData.data.url;

        // Now send to SheetDB
        const sheetData = {
          Id: userId,
          imageUrl: imageUrl,
          text: text
        };

        await fetch("https://sheetdb.io/api/v1/iiwyeqnkahuo9", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: [sheetData] })
        });

        // Store flag to prevent duplicate submission
        localStorage.setItem(taskKey, "true");

        showAlert("Task submitted successfully!");
        form.reset();
        form.parentElement.innerHTML = `<p class="task-done">You have successfully submitted this task.</p>`;
      } catch (err) {
        console.error("Submission failed:", err);
        showAlert("There was an error submitting the task.", "#f44336");
      }
    });
  });
});

function toggleTaskDetails(header) {
  const card = header.closest(".task-card");
  const details = card.querySelector(".task-details");
  details.style.display = details.style.display === "flex" ? "none" : "flex";
}

function showAlert(message, color = "#4CAF50") {
  const alertBox = document.getElementById("alertBox");
  const alertMessage = document.getElementById("alertMessage");

  alertBox.style.backgroundColor = color;
  alertMessage.textContent = message;
  alertBox.classList.remove("hidden");

  setTimeout(() => {
    alertBox.classList.add("hidden");
  }, 4000);
}