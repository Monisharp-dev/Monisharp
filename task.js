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

  // Hover animation
  shuffleBtn.addEventListener("mouseover", () => {
    shuffleBtn.style.transform = "scale(1.1)";
    shuffleBtn.style.backgroundColor = "rgba(0, 155, 114, 1)";
  });
  shuffleBtn.addEventListener("mouseout", () => {
    shuffleBtn.style.transform = "scale(1)";
    shuffleBtn.style.backgroundColor = "rgba(0, 155, 114, 0.9)";
  });

  // ===== 2️⃣ Make button transparent while scrolling =====
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    shuffleBtn.style.opacity = "0.3";
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      shuffleBtn.style.opacity = "1";
    }, 300); // restores opacity 300ms after scroll stops
  });

  // ===== 3️⃣ Shuffle functionality =====
  shuffleBtn.addEventListener("click", () => {
    const allCards = Array.from(document.querySelectorAll(".task-card"));
    for (let i = allCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
    }
    allCards.forEach(card => card.parentNode.appendChild(card));
  });

  // ===== 4️⃣ Existing Task Logic =====
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
        if (!imageUrl) throw new Error("All attempts to upload image failed");

        const titleEl = card.querySelector("h2, .task-title");
        const rewardEl = card.querySelector(".task-text p, .task-reward");

        const title = titleEl ? titleEl.textContent.trim() : "Untitled";
        const reward = rewardEl ? rewardEl.textContent.trim() : "0";

        const taskData = { Id: userId, text, reward, title, imageUrl };
        const finalPayload = { data: [taskData] };

        const submitted = await submitToSheetDB(sheetDbApis, finalPayload, taskId);
        if (!submitted) throw new Error("All SheetDB API attempts failed");

        localStorage.setItem(taskKey, "true");
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

  // ===== 5️⃣ ImgBB Upload Function =====
  async function uploadToImgBB(file, taskId) { /* existing fallback logic */ }

  // ===== 6️⃣ SheetDB Submission Function =====
  async function submitToSheetDB(apiList, payload, taskId) { /* existing fallback logic */ }
});

// ===== 7️⃣ Alert & Loader Utilities =====
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