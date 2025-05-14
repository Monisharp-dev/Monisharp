document.addEventListener("DOMContentLoaded", () => {
  console.log("homepage.js loaded. Waiting for Id...");

  let retries = 0;
  const maxRetries = 20;

  // Retry logic to wait for Id and email from localStorage
  const waitForId = setInterval(() => {
    const id = localStorage.getItem("Id"); // Correct casing
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
  const databaseApis = ["https://sheetdb.io/api/v1/k51vpzir9tfo8"];

  // 1. Handle referralCode generation and posting
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
    // Attempt to post referral code to all API endpoints
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

  // 2. Fetch user data if 'firstTime' is not set
  if (!localStorage.getItem("firstTime")) {
    let users = [];

    // Attempt to fetch user data from all database APIs
    for (const api of databaseApis) {
      try {
        const res = await fetch(api);
        const data = await res.json();
        if (Array.isArray(data)) {
          console.log(`Fetched user list from ${api}, total rows: ${data.length}`);
          users = data;
          break;
        } else {
          console.warn(`Unexpected data format from ${api}`);
        }
      } catch (err) {
        console.error(`Failed to fetch user data from ${api}:`, err);
      }
    }

    if (users.length === 0) {
      console.warn("No user data retrieved. Exiting.");
      return;
    }

    // Check if user ID exists in fetched data
    const matchedUser = users.find(user => user.Id === id);
    if (matchedUser) {
      localStorage.setItem("getData", JSON.stringify(matchedUser));
      localStorage.setItem("firstTime", "done");
      console.log("Stored user data in 'getData':", matchedUser);
    } else {
      console.warn("User Id not found in database.");
    }
  } else {
    console.log("'firstTime' already exists in localStorage. Skipping user data fetch.");
  }
}