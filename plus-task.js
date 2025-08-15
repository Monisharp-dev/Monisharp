document.addEventListener("DOMContentLoaded", () => {
  const theUserId = localStorage.getItem("plus-Id");
  if (!theUserId) {
    console.error("❌ No user ID found in localStorage.");
    return;
  }
  console.log("[Init] ✅ User ID from localStorage:", theUserId);

  const allCards = document.querySelectorAll(".task-card");
  console.log(`[Init] Found ${allCards.length} task card(s).`);

  const sheetDbApis = [
    "https://sheetdb.io/api/v1/apy1rhij3hpgd",
    "https://sheetdb.io/api/v1/iiwyeqnkahuo9",
    "https://sheetdb.io/api/v1/bww55osygzdli",
    "https://sheetdb.io/api/v1/apy1rhij3hpgd"
  ];

  allCards.forEach((card) => {
    const taskId = card.dataset.taskId;
    if (!taskId) {
      console.warn("⚠️ Missing data-task-id. Skipping card.");
      return;
    }

    const taskKey = `task_done_${theUserId}_${taskId}`;
    const form = card.querySelector(".task-form");
    if (!form) {
      console.warn(`[${taskId}] ❌ No form found. Skipping.`);
      return;
    }

    const hiddenId = form.querySelector(".hidden-id");
    if (hiddenId) {
      hiddenId.value = theUserId;
    }

    if (localStorage.getItem(taskKey)) {
      card.remove();
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      showTextLoader(); // Show animated loader

      const text = form.querySelector("textarea")?.value.trim();
      const file = form.querySelector('input[type="file"]')?.files[0];

      if (!text || !file) {
        hideTextLoader();
        showAlert("Please fill all fields and upload image!", "#f44336");
        return;
      }

      try {
        const imageUrl = await uploadToImgBB(file, taskId);
        if (!imageUrl) throw new Error("Image upload failed");

        const title = card.querySelector("h2, .task-title")?.textContent.trim() || "Untitled";
        const reward = card.querySelector(".task-text p, .task-reward")?.textContent.trim() || "0";

        const taskData = { Id: theUserId, text, reward, title, imageUrl };

        const submitted = await submitToSheetDB(sheetDbApis, { data: [taskData] }, taskId);
        if (!submitted) throw new Error("Submission failed");

        localStorage.setItem(taskKey, "true");

        hideTextLoader();
        showAlert("✅ Task submitted successfully! Please wait 24 - 48 hours for confirmation.", "#4CAF50");
        card.remove();

      } catch (err) {
        console.error(`[${taskId}] ❌ Error:`, err);
        hideTextLoader();
        showAlert("Failed to submit task. Try again.", "#f44336");
      }
    });
  });

  async function uploadToImgBB(file, taskId) {
    const apiKey = "b08c28e563e88b729eefa384ac7d00db";
    const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("expiration", Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60);
        const res = await fetch(url, { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) return data.data.url;
      } catch (e) { }
    }
    return null;
  }

  async function submitToSheetDB(apiList, payload, taskId) {
    for (let i = 0; i < apiList.length; i++) {
      try {
        const res = await fetch(apiList[i], {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) return true;
      } catch (err) { }
    }
    return false;
  }
});

// ===== Alert System =====
function showAlert(message, color = "#4CAF50") {
  let alertBox = document.getElementById("alertBox");
  if (!alertBox) {
    alertBox = document.createElement("div");
    alertBox.id = "alertBox";
    alertBox.style.cssText = `
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      padding: 12px 20px; color: #fff; border-radius: 5px;
      z-index: 9999; font-size: 14px; font-weight: bold;
      opacity: 0; transition: opacity 0.5s ease;
    `;
    document.body.appendChild(alertBox);
  }
  alertBox.style.backgroundColor = color;
  alertBox.textContent = message;
  alertBox.style.opacity = "1";
  setTimeout(() => { alertBox.style.opacity = "0"; }, 4000);
}

// ===== Animated Text Loader with Fade =====
let loaderInterval;
function showTextLoader() {
  let loader = document.getElementById("textLoader");
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "textLoader";
    loader.style.cssText = `
      position: fixed; bottom: 20px; left: 50%;
      transform: translateX(-50%);
      background: #222; color: white;
      padding: 10px 15px; border-radius: 6px;
      font-size: 14px; font-weight: bold;
      z-index: 10000; letter-spacing: 0.5px;
      opacity: 0; transition: opacity 0.4s ease;
    `;
    document.body.appendChild(loader);
  }
  loader.textContent = "⏳ Processing";
  loader.style.opacity = "1";
  loader.style.display = "block";

  let dots = "";
  clearInterval(loaderInterval);
  loaderInterval = setInterval(() => {
    dots = dots.length < 3 ? dots + "." : "";
    loader.textContent = "⏳ Processing" + dots;
  }, 500);
}

function hideTextLoader() {
  const loader = document.getElementById("textLoader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => { loader.style.display = "none"; }, 400);
  }
  clearInterval(loaderInterval);
}
