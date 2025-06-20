document.addEventListener("DOMContentLoaded", () => {
  console.log("homepage.js loaded. Waiting for Id...");

  let retries = 0;
  const maxRetries = 4;

  const waitForId = setInterval(() => {
    const Id = localStorage.getItem("Id");
    const email = localStorage.getItem("email");

    if (Id && email) {
      clearInterval(waitForId);
      console.log("✅ Found Id and email:", Id, email);
      runHomepageLogic(Id, email);
    } else {
      retries++;
      console.log(`⏳ Retrying (${retries}/${maxRetries})...`);
      if (retries >= maxRetries) {
        clearInterval(waitForId);
        console.warn("❌ Id or email not found after max retries.");
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
          body: JSON.stringify(data), // ✅ Plain object format
        });

        if (res.ok) {
          console.log(`✅ Successfully posted to API: ${api}`);
          return true;
        } else {
          console.warn(`⚠️ Failed to post to ${api}. Status: ${res.status}`);
        }
      } catch (err) {
        console.error(`❌ Error posting to ${api}:`, err);
      }
    }
    return false;
  };

  // Step 1: Generate referralCode if missing
  let referralCode = localStorage.getItem("referralCode");
  if (!referralCode) {
    const generateReferralCode = (email) => {
      const namePart = email.split("@")[0];
      const prefix = namePart.slice(0, 2).toUpperCase();
      const digits = namePart.match(/\d{3}$/);
      const suffix = digits ? digits[0] : Math.floor(100 + Math.random() * 900);
      return `${prefix}${suffix}`;
    };

    referralCode = generateReferralCode(email);
    localStorage.setItem("referralCode", referralCode);
    console.log("🎉 Generated referralCode:", referralCode);
  } else {
    console.log("ℹ️ referralCode already exists:", referralCode);
  }

  // Step 2: Avoid duplicate posting
  if (localStorage.getItem("referralPosted") === "true") {
    console.log("✅ Referral already posted. Skipping...");
    return;
  }

  // Step 3: Post to API
  console.log("📡 Posting referral data...");
  const payload = { Id, referralCode };

  const success = await postWithFallback(referralApis, payload);

  if (success) {
    localStorage.setItem("referralPosted", "true");
    console.log("✅ Referral data posted and flag saved.");
  } else {
    localStorage.setItem("referralPosted", "false");
    console.warn("❌ Failed to post referral data. Will retry on next load.");
  }
}