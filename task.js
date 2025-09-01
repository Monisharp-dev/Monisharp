document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("Id");
  if (!userId) {
    console.error("❌ No user ID found in localStorage.");
    return;
  }

  // ===== 1️⃣ Create fixed shuffle button =====
  const shuffleBtn = document.createElement("button");
  shuffleBtn.textContent = "🔀 Shuffle";
  shuffleBtn.style.cssText = `
    position: fixed;
    top: 15px;
    right: 15px;
    z-index: 9999;
    padding: 6px 12px;
    font-size: 0.85rem;
    border-radius: 8px;
    border: none;
    background-color: rgba(0, 155, 114, 0.9);
    color: white;
    cursor: pointer;
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
    transition: transform 0.2s, background-color 0.2s, opacity 0.3s;
  `;
  document.body.appendChild(shuffleBtn);

  shuffleBtn.addEventListener("mouseover", () => {
    shuffleBtn.style.transform = "scale(1.1)";
    shuffleBtn.style.backgroundColor = "rgba(0, 155, 114, 1)";
  });
  shuffleBtn.addEventListener("mouseout", () => {
    shuffleBtn.style.transform = "scale(1)";
    shuffleBtn.style.backgroundColor = "rgba(0, 155, 114, 0.9)";
  });

  let scrollTimeout;
  window.addEventListener("scroll", () => {
    shuffleBtn.style.opacity = "0.3";
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      shuffleBtn.style.opacity = "1";
    }, 300);
  });

  shuffleBtn.addEventListener("click", () => {
    const allCards = Array.from(document.querySelectorAll(".task-card"));
    for (let i = allCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
    }
    allCards.forEach(card => card.parentNode.appendChild(card));
  });

  // ===== 2️⃣ Existing Task Logic =====
  const allCards = document.querySelectorAll(".task-card");
  const sheetDbApis = [
    "https://sheetdb.io/api/v1/apy1rhij3hpgd",
    "https://sheetdb.io/api/v1/iiwyeqnkahuo9",
    "https://sheetdb.io/api/v1/bww55osygzdli",
    "https://sheetdb.io/api/v1/apy1rhij3hpgd"
  ];

  allCards.forEach((card) => {
    const taskId = card.dataset.taskId;
    if (!taskId) return;

    const taskKey = `task_done_${userId}_${taskId}`;
    const form = card.querySelector(".task-form");
    if (!form) return;

    const hiddenId = form.querySelector(".hidden-id");
    if (hiddenId) hiddenId.value = userId;

    if (localStorage.getItem(taskKey)) {
      card.remove();
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      showLoader();

      const text = form.querySelector("textarea")?.value.trim();
      const file = form.querySelector('input[type="file"]')?.files[0];

      if (!text || !file) {
        showAlert("Please fill all fields and upload image!", "#f44336");
        hideLoader();
        return;
      }

      try {
        const imageUrl = await uploadToImgBB(file, taskId);
        if (!imageUrl) throw new Error("Image upload failed");

        const title = card.querySelector("h2, .task-title")?.textContent.trim() || "Untitled";
        const reward = card.querySelector(".task-text p, .task-reward")?.textContent.trim() || "0";

        const taskData = { Id: userId, text, reward, title, imageUrl };

        const submitted = await submitToSheetDB(sheetDbApis, { data: [taskData] }, taskId);
        if (!submitted) throw new Error("Submission failed");

        localStorage.setItem(taskKey, "true");
        showAlert("✅ Task submitted successfully! Please wait 24 - 48 hours for confirmation.", "#4CAF50");
        card.remove();

      } catch (err) {
        console.error(`[${taskId}] ❌ Error:`, err);
        showAlert("Failed to submit task. Try again.", "#f44336");
      } finally {
        hideLoader();
      }
    });
  });

  // ===== 3️⃣ ImgBB Upload Function =====
  async function uploadToImgBB(file, taskId) {
    const apiKey = "b08c28e563e88b729eefa384ac7d00db"; // replace if needed
    const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("expiration", Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60);
        const res = await fetch(url, { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) return data.data.url;
      } catch (e) {
        console.warn(`[${taskId}] Upload attempt ${attempt} failed`);
      }
    }
    return null;
  }

  // ===== 4️⃣ SheetDB Submission Function =====
  async function submitToSheetDB(apiList, payload, taskId) {
    for (let i = 0; i < apiList.length; i++) {
      try {
        const res = await fetch(apiList[i], {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) return true;
      } catch (err) {
        console.warn(`[${taskId}] SheetDB attempt ${i + 1} failed`);
      }
    }
    return false;
  }
});

// ===== 5️⃣ Alert & Loader Utilities =====
function showAlert(message, color = "#4CAF50") {
  const alertBox = document.getElementById("alertBox");
  const alertMessage = document.getElementById("alertMessage");
  if (!alertBox || !alertMessage) return;
  alertBox.style.backgroundColor = color;
  alertMessage.textContent = message;
  alertBox.classList.remove("hidden");
  setTimeout(() => alertBox.classList.add("hidden"), 4000);
}

function showLoader() {
  const loader = document.getElementById("loaderOverlay");
  if (loader) loader.classList.remove("hidden");
}

function hideLoader() {
  const loader = document.getElementById("loaderOverlay");
  if (loader) loader.classList.add("hidden");
}