document.addEventListener("DOMContentLoaded", () => {
  console.log("homepage.js loaded. Waiting for Id...");

  let retries = 0;
  const maxRetries = 4;

  const waitForId = setInterval(() => {
    const Id = localStorage.getItem("Id");
    const email = localStorage.getItem("email");

    if (Id && email) {
      clearInterval(waitForId);
      console.log("Found Id and email in localStorage:", Id, email);
      runHomepageLogic(Id, email);
    } else {
      retries++;
      console.log(`Id or email not found. Retrying (${retries}/${maxRetries})...`);
      if (retries >= maxRetries) {
        clearInterval(waitForId);
        console.warn("Id or email not found after max retries. Aborting homepage logic.");
      }
    }
  }, 200);
});

async function runHomepageLogic(Id, email) {
  const referralApis = [
    "https://sheetdb.io/api/v1/ceh2avnf98hi1",
    "https://sheetdb.io/api/v1/npvktjn37lk2v"
  ];

  const postWithFallback = async (apiList, data) => {
    for (const api of apiList) {
      try {
        const res = await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: [data] }),
        });

        if (res.ok) {
          console.log(`✅ Successfully posted to API: ${api}`);
          return true;
        } else {
          console.warn(`⚠️ Failed to post to ${api}, status: ${res.status}`);
        }
      } catch (err) {
        console.error(`❌ Error posting to ${api}:`, err);
      }
    }
    return false;
  };

  // Generate referral code if not set
  if (!localStorage.getItem("referralCode")) {
    const generateReferralCode = (email) => {
      const namePart = email.split("@")[0];
      const prefix = namePart.slice(0, 2).toUpperCase();
      const digits = namePart.match(/\d{3}$/);
      const suffix = digits ? digits[0] : Math.floor(100 + Math.random() * 900);
      return `${prefix}${suffix}`;
    };

    const referralCode = generateReferralCode(email);
    localStorage.setItem("referralCode", referralCode);
    console.log("📦 Generated and stored referralCode:", referralCode);
  } else {
    console.log("📦 referralCode already exists:", localStorage.getItem("referralCode"));
  }

  const referralCode = localStorage.getItem("referralCode");
  const alreadyPosted = localStorage.getItem("referralPosted");

  if (alreadyPosted === "true") {
    console.log("✅ Referral already successfully posted. Skipping API call.");
    return;
  }

  console.log("📡 Attempting to post referral data to API...");
  const success = await postWithFallback(referralApis, { Id, referralCode });

  if (success) {
    localStorage.setItem("referralPosted", "true");
    console.log("✅ Referral data successfully posted. Flag saved in localStorage.");
  } else {
    localStorage.setItem("referralPosted", "false");
    console.warn("❌ Failed to post referral data. Will retry on next page load.");
  }
}