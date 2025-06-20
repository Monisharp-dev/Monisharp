document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("Id");
  if (!userId) {
    console.error("❌ No user ID found in localStorage.");
    return;
  }
  console.log("[Init] ✅ User ID from localStorage:", userId);

  const allCards = document.querySelectorAll(".task-card");
  console.log(`[Init] Found ${allCards.length} task card(s).`);

  // SheetDB fallback API list
  const sheetDbApis = [
    "https://sheetdb.io/api/v1/iiwyeqnkahuo9",
    "https://sheetdb.io/api/v1/bww55osygzdli",
    "https://sheetdb.io/api/v1/apy1rhij3hpgd"];

  allCards.forEach((card) => {
    const taskId = card.dataset.taskId;

    if (!taskId) {
      console.warn("⚠️ Missing data-task-id. Skipping card.");
      return;
    }

    const taskKey = `task_done_${userId}_${taskId}`;
    const form = card.querySelector(".task-form");
    if (!form) {
      console.warn(`[${taskId}] ❌ No form found. Skipping.`);
      return;
    }

    // Pre-fill hidden input
    const hiddenId = form.querySelector(".hidden-id");
    if (hiddenId) {
      hiddenId.value = userId;
      console.log(`[${taskId}] Inserted userId into form.`);
    }

    // Skip if already completed
    if (localStorage.getItem(taskKey)) {
      console.log(`[${taskId}] ✅ Task already completed. Removing card.`);
      card.remove();
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      showLoader();
      console.log(`[${taskId}] 🚀 Starting submission process...`);

      const text = form.querySelector("textarea")?.value.trim();
      const file = form.querySelector('input[type="file"]')?.files[0];

      if (!text || !file) {
        showAlert("Please fill all fields and upload image!", "#f44336");
        hideLoader();
        console.warn(`[${taskId}] ❌ Missing text or image.`);
        return;
      }

      try {
        // ✅ Retry loop for ImgBB upload
        const imageUrl = await uploadToImgBB(file, taskId);
        if (!imageUrl) throw new Error("All attempts to upload image failed");

        console.log(`[${taskId}] ✅ Image uploaded successfully:`, imageUrl);

        const titleEl = card.querySelector("h2, .task-title");
        const rewardEl = card.querySelector(".task-text p, .task-reward");

        const title = titleEl ? titleEl.textContent.trim() : "Untitled";
        const reward = rewardEl ? rewardEl.textContent.trim() : "0";

        console.log(`[${taskId}] 🧾 Debug Info:`);
        console.log(`- User ID: ${userId}`);
        console.log(`- Task Title: ${title}`);
        console.log(`- Task Reward: ${reward}`);
        console.log(`- Text: ${text}`);
        console.log(`- Image URL: ${imageUrl}`);

        const taskData = {
          Id: userId,
          text: text,
          reward: reward,
          title: title,
          imageUrl: imageUrl,
        };

        const finalPayload = { data: [taskData] };
        console.log(`[${taskId}] 📦 Final JSON payload to send:`, finalPayload);

        // ✅ Retry loop for SheetDB submission
        const submitted = await submitToSheetDB(sheetDbApis, finalPayload, taskId);
        if (!submitted) throw new Error("All SheetDB API attempts failed");

        localStorage.setItem(taskKey, "true");
        console.log(`[${taskId}] ✅ Task successfully submitted to SheetDB.`);
        showAlert("Task submitted successfully!");
        card.remove();
      } catch (err) {
        console.error(`[${taskId}] ❌ Error during submission:`, err);
        showAlert("Failed to submit task. Try again.", "#f44336");
      } finally {
        hideLoader();
      }
    });
  });

  // 🔁 ImgBB fallback upload function
  async function uploadToImgBB(file, taskId) {
    const apiKey = "b08c28e563e88b729eefa384ac7d00db"; // Your key
    const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`[${taskId}] 🖼️ ImgBB Upload Attempt ${attempt}...`);
        const formData = new FormData();
        formData.append("image", file);
        formData.append("expiration", Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60); // 7 days

        const res = await fetch(url, { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) return data.data.url;

        console.warn(`[${taskId}] ImgBB failed:`, data);
      } catch (e) {
        console.warn(`[${taskId}] ImgBB error:`, e);
      }
    }
    return null;
  }

  // 🔁 SheetDB fallback submission function
  async function submitToSheetDB(apiList, payload, taskId) {
    for (let i = 0; i < apiList.length; i++) {
      const api = apiList[i];
      try {
        console.log(`[${taskId}] 📨 Trying SheetDB API: ${api}`);
        const res = await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) return true;
        console.warn(`[${taskId}] ❌ SheetDB ${i + 1} failed with status:`, res.status);
      } catch (err) {
        console.warn(`[${taskId}] ❌ Error with SheetDB ${i + 1}:`, err);
      }
    }
    return false;
  }
});

// Alert system
function showAlert(message, color = "#4CAF50") {
  const alertBox = document.getElementById("alertBox");
  const alertMessage = document.getElementById("alertMessage");
  if (!alertBox || !alertMessage) return;

  alertBox.style.backgroundColor = color;
  alertMessage.textContent = message;
  alertBox.classList.remove("hidden");

  setTimeout(() => alertBox.classList.add("hidden"), 4000);
}

// Loader UI
function showLoader() {
  const loader = document.getElementById("loaderOverlay");
  if (loader) loader.classList.remove("hidden");
}

function hideLoader() {
  const loader = document.getElementById("loaderOverlay");
  if (loader) loader.classList.add("hidden");
}