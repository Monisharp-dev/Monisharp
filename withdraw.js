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

  const withdrawalApis = [
    `https://sheetdb.io/api/v1/pecncmqdgxgih`
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

    if (amount < 250) {
      showNotification("Minimum withdrawal is ₦250.", "warning");
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

    const payload = { Id, amount, bankName, accountName, accountNumber, date };
    const withdrawalSuccess = await submitWithdrawal(payload);

    if (withdrawalSuccess) {
      localStorage.setItem('referrals', "0");
      localStorage.setItem('referralBalance', "0");
      localStorage.setItem('mainBalance', "0");

      const history = JSON.parse(localStorage.getItem('withdrawalHistory')) || [];
      const lastRecord = history[history.length - 1];
      lastRecord.status = 'Completed';
      localStorage.setItem('withdrawalHistory', JSON.stringify(history));
      localStorage.removeItem('withdrawAmount');
      window.location.href = 'withdrawHistory.html';
    }
  });
});