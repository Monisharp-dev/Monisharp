document.addEventListener("DOMContentLoaded", () => {
  console.log("homepage.js loaded. Waiting for Id...");

  let retries = 0;
  const maxRetries = 20;

  // Retry logic to wait for Id and email from localStorage
  const waitForId = setInterval(() => {
    const id = localStorage.getItem("Id");
    const email = localStorage.getItem("email");

    if (id && email) {
      clearInterval(waitForId);
      console.log("Found Id and email in localStorage:", id, email);
      runHomepageLogic(id, email);
    } else {
      retries++;
      console.log(`Id or email not found. Retrying (${retries}/${maxRetries})...`);
      if (retries >= maxRetries) {
        clearInterval(waitForId);
        console.warn("Id or email not found in localStorage after max retries. Aborting homepage logic.");
      }
    }
  }, 200);
});

async function runHomepageLogic(id, email) {
  const referralApi = ["https://sheetdb.io/api/v1/ceh2avnf98hi1"];

  // Generate and post referral code if not already set
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
    console.log("Generated referral code:", referralCode);

    let posted = false;
    for (const api of referralApi) {
      try {
        const res = await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: [{ Id: id, referralCode }] }),
        });

        if (res.ok) {
          console.log(`Referral code posted to ${api}`);
          posted = true;
          break;
        } else {
          console.warn(`Failed to post referral code to ${api}, status: ${res.status}`);
        }
      } catch (err) {
        console.error(`Error posting referral code to ${api}:`, err);
      }
    }

    if (!posted) console.warn("All referral API posts failed.");
  } else {
    console.log("Referral code already exists in localStorage:", localStorage.getItem("referralCode"));
  }
}