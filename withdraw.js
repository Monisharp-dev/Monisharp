document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded and parsed.");

  const Id = localStorage.getItem('Id');
  const mainBalance = parseFloat(localStorage.getItem('mainBalance')) || 0;

  console.log("Loaded Id:", Id);
  console.log("Loaded mainBalance:", mainBalance);

  document.getElementById('Id').value = Id || 'N/A';
  document.getElementById('date').value = new Date().toLocaleString();
  document.getElementById('amount').value = mainBalance.toFixed(2);
  document.getElementById('amount').readOnly = true;

  const form = document.getElementById('withdrawForm');
  const notification = document.getElementById('notification');

  function showNotification(message, type) {
    console.log(`Notification (${type}): ${message}`);
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
  }

  function showLoader(show) {
    console.log(show ? "Showing loader..." : "Hiding loader...");
    let loader = document.getElementById('loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'loader';
      loader.style.position = 'fixed';
      loader.style.top = 0;
      loader.style.left = 0;
      loader.style.width = '100%';
      loader.style.height = '100%';
      loader.style.backgroundColor = 'rgba(0,0,0,0.7)';
      loader.style.display = 'flex';
      loader.style.alignItems = 'center';
      loader.style.justifyContent = 'center';
      loader.style.zIndex = '9999';
      loader.innerHTML = '<div style="color: white; font-size: 24px;">Processing withdrawal...</div>';
      document.body.appendChild(loader);
    }
    loader.style.display = show ? 'flex' : 'none';
  }

  function trackWithdrawalHistory(amount, bankName, accountName, accountNumber, date) {
    const history = JSON.parse(localStorage.getItem('withdrawalHistory')) || [];
    const withdrawalRecord = {
      amount, bankName, accountName, accountNumber, date, status: 'Pending'
    };
    history.push(withdrawalRecord);
    localStorage.setItem('withdrawalHistory', JSON.stringify(history));
    console.log("Withdrawal history updated:", history);
  }

  // ========== PROCESS 1: CLEAR MAIN BALANCE ==========
  const balanceApis = [
    `https://sheetdb.io/api/v1/k51vpzir9tfo8/Id/${Id}`
    // Add more APIs here if needed
  ];

  async function clearMainBalanceLoop(attempt = 1) {
    console.log(`Clearing main balance attempt ${attempt}`);
    for (let apiUrl of balanceApis) {
      try {
        const res = await fetch(apiUrl, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { mainBalance: "0" } })
        });
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        localStorage.setItem('mainBalance', "0");
        console.log("Main balance cleared via", apiUrl);
        return true;
      } catch (err) {
        console.warn(`Balance API failed (${apiUrl}) on attempt ${attempt}:`, err.message);
      }
    }
    if (attempt < 10) {
      return await clearMainBalanceLoop(attempt + 1);
    }
    showNotification("Failed to update main balance. Try again later.", "error");
    showLoader(false);
    return false;
  }

  // ========== PROCESS 2: CLEAR REFERRALS ==========
  const referralApis = [
    `https://sheetdb.io/api/v1/ceh2avnf98hi1/Id/${Id}`
    // Add more APIs here if needed
  ];

  async function clearReferralLoop(attempt = 1) {
    console.log(`Clearing referrals attempt ${attempt}`);
    for (let apiUrl of referralApis) {
      try {
        const res = await fetch(apiUrl, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { referrals: "0" } })
        });
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        localStorage.setItem('referrals', "0");
        localStorage.setItem('referralBalance', "0");
        console.log("Referral data cleared via", apiUrl);
        return true;
      } catch (err) {
        console.warn(`Referral API failed (${apiUrl}) on attempt ${attempt}:`, err.message);
      }
    }
    if (attempt < 10) {
      return await clearReferralLoop(attempt + 1);
    }
    showNotification("Failed to clear referral data. Try again later.", "error");
    showLoader(false);
    return false;
  }

  // ========== PROCESS 3: SUBMIT WITHDRAWAL ==========
  const withdrawalApis = [
    `https://sheetdb.io/api/v1/pecncmqdgxgih`
    // Add more APIs here if needed
  ];

  async function submitWithdrawal(payload, attempt = 1) {
    console.log(`Withdrawal attempt ${attempt}`);
    for (let apiUrl of withdrawalApis) {
      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: payload })
        });
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const result = await res.json();
        console.log("Withdrawal response:", result);
        showNotification("Withdrawal request submitted successfully.", "success");
        showLoader(false);
        return true;
      } catch (err) {
        console.warn(`Withdrawal API failed (${apiUrl}) on attempt ${attempt}:`, err.message);
      }
    }
    if (attempt < 16) {
      return await submitWithdrawal(payload, attempt + 1);
    }
    showNotification("Failed to submit withdrawal. Try again later.", "error");
    showLoader(false);
    return false;
  }

  // ========== HANDLE FORM SUBMIT ==========
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Withdrawal form submitted.");

    const amount = parseFloat(document.getElementById('amount').value);
    const bankName = document.getElementById('bankName').value.trim();
    const accountName = document.getElementById('accountName').value.trim();
    const accountNumber = document.getElementById('accountNumber').value.trim();
    const date = document.getElementById('date').value;

    if (isNaN(amount) || amount <= 0) {
      showNotification("Enter a valid withdrawal amount.", "warning");
      return;
    }

    if (amount !== mainBalance) {
      showNotification(`You must withdraw your full balance of ₦${mainBalance}.`, "warning");
      return;
    }

    if (!bankName || !accountName || !accountNumber) {
      showNotification("All fields are required.", "warning");
      return;
    }

    showNotification("Do not leave this page. Processing withdrawal...", "warning");
    showLoader(true);
    localStorage.setItem('withdrawAmount', amount.toFixed(2));
    trackWithdrawalHistory(amount, bankName, accountName, accountNumber, date);

    const balanceCleared = await clearMainBalanceLoop();
    const referralsCleared = await clearReferralLoop();

    if (!balanceCleared || !referralsCleared) {
      console.log("Retrying failed processes...");
      if (!balanceCleared) await clearMainBalanceLoop();
      if (!referralsCleared) await clearReferralLoop();
    }

    const payload = { Id, amount, bankName, accountName, accountNumber, date };
    const withdrawalSuccess = await submitWithdrawal(payload);

    if (withdrawalSuccess) {
      console.log("Withdrawal completed. Updating history...");
      const history = JSON.parse(localStorage.getItem('withdrawalHistory')) || [];
      const lastRecord = history[history.length - 1];
      lastRecord.status = 'Completed';
      localStorage.setItem('withdrawalHistory', JSON.stringify(history));
      localStorage.removeItem('withdrawAmount');
      window.location.href = 'withdrawHistory.html';
    }
  });
});