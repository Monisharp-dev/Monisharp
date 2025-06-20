document.addEventListener("DOMContentLoaded", () => {
  const apis = [
    'https://sheetdb.io/api/v1/nl6j5kit103gh',
    'https://sheetdb.io/api/v1/ceh2avnf98hi1',
    'https://sheetdb.io/api/v1/npvktjn37lk2v'
  ];

  const messages = [
    "Processing...",
    "Arranging...",
    "Do not leave this page until it's complete",
    "Almost done"
  ];

  let messageIndex = 0;
  let messageInterval;

  function createLoader() {
    const loader = document.createElement("div");
    loader.id = "dynamicLoader";
    Object.assign(loader.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.85)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "9999",
      color: "#fff",
      fontSize: "18px",
      textAlign: "center",
      padding: "20px"
    });

    const text = document.createElement("div");
    text.id = "loaderMessage";
    text.textContent = messages[0];
    loader.appendChild(text);

    document.body.appendChild(loader);

    messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      text.textContent = messages[messageIndex];
    }, 2500);
  }

  function removeLoader() {
    const loader = document.getElementById("dynamicLoader");
    if (loader) loader.remove();
    clearInterval(messageInterval);
  }

  function showDynamicAlert(msg) {
    const alertBox = document.createElement("div");
    alertBox.textContent = msg;
    Object.assign(alertBox.style, {
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "16px 24px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      zIndex: "10000",
      fontSize: "16px",
      maxWidth: "90%",
      textAlign: "center",
      animation: "fadeInOut 3s ease forwards"
    });

    document.body.appendChild(alertBox);

    setTimeout(() => {
      alertBox.remove();
    }, 4000);
  }

  async function processWithdrawal() {
    const id = localStorage.getItem("Id");
    if (!id) return console.log("No user Id found.");

    console.log("Checking for submittedWithdrawal...");

    for (let api of apis) {
      try {
        const res = await fetch(`${api}/search?Id=${id}`);
        const data = await res.json();

        if (data && data.length > 0) {
          console.log(`Id found in: ${api}`);

          const updateRes = await fetch(`${api}/Id/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: { referrals: 0 } })
          });

          if (updateRes.ok) {
            console.log("Referrals set to 0 in API.");

            localStorage.setItem("mainBalance", "0");
            localStorage.setItem("referrals", "0");
            localStorage.setItem("referralBalance", "0");

            console.log("Local storage reset.");
            localStorage.removeItem("submittedWithdrawal");
            console.log("submittedWithdrawal key removed.");

            removeLoader();
            showDynamicAlert("✅ Process complete! Withdrawal handled successfully.");
            break;
          } else {
            console.log("Failed to update referrals on API.");
          }
        } else {
          console.log(`Id not found in: ${api}`);
        }
      } catch (err) {
        console.error(`Error with API ${api}:`, err);
      }
    }
  }

  if (localStorage.getItem("submittedWithdrawal")) {
    createLoader();
    processWithdrawal();
  }
});