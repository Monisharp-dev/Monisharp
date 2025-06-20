document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("withdrawForm");

  // ==== Create Dynamic Loader ====
  const loader = document.createElement("div");
  loader.id = "loader";
  loader.style = `
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    background-color: rgba(0,0,0,0.6);
    display: none; align-items: center; justify-content: center;
    z-index: 9999;
  `;
  loader.innerHTML = `<div style="
    color: white;
    font-size: 1.2em;
    background: #111;
    padding: 20px 30px;
    border-radius: 8px;
    box-shadow: 0 0 10px #000;
    text-align: center;
  ">Submitting...</div>`;
  document.body.appendChild(loader);

  // ==== Create Alert Function ====
  const showAlert = (msg, type = "info") => {
    const notification = document.getElementById("notification") || document.createElement("div");
    notification.id = "notification";
    notification.style = `
      margin-top: 15px;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 14px;
      display: block;
      transition: all 0.3s ease;
    `;

    if (type === "success") {
      notification.style.backgroundColor = "#d4edda";
      notification.style.color = "#155724";
    } else if (type === "warning") {
      notification.style.backgroundColor = "#fff3cd";
      notification.style.color = "#856404";
    } else {
      notification.style.backgroundColor = "#f8d7da";
      notification.style.color = "#721c24";
    }

    notification.textContent = msg;
    document.querySelector(".container")?.appendChild(notification);

    if (type !== "success") {
      setTimeout(() => {
        notification.style.display = "none";
      }, 5000);
    }
  };

  // ==== Populate Fields ====
  const id = localStorage.getItem("Id");
  const balance = parseFloat(localStorage.getItem("mainBalance")) || 0;
  if (id) document.getElementById("Id").value = id;
  document.getElementById("amount").value = balance.toFixed(2);
  document.getElementById("date").value = new Date().toLocaleString();

  // ==== Submit Logic ====
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    loader.style.display = "flex";

    const amount = parseFloat(document.getElementById("amount").value.trim());
    const bankName = document.getElementById("bankName").value.trim();
    const accountName = document.getElementById("accountName").value.trim();
    const accountNumber = document.getElementById("accountNumber").value.trim();

    if (!amount || amount <= 0) {
      loader.style.display = "none";
      return showAlert("Enter a valid amount.", "error");
    }

    if (!bankName || !accountName || !accountNumber) {
      loader.style.display = "none";
      return showAlert("All fields are required.", "warning");
    }

    if (accountNumber.length < 10) {
      loader.style.display = "none";
      return showAlert("Account number must be at least 10 digits.", "warning");
    }

    if (amount > balance) {
      loader.style.display = "none";
      return showAlert("Insufficient balance.", "error");
    }

    if (balance <= 0) {
      loader.style.display = "none";
      return showAlert("Balance is zero. Cannot withdraw.", "error");
    }

    const data = {
      Id: id,
      amount: amount,
      bankName: bankName,
      accountName: accountName,
      accountNumber: accountNumber,
      date: new Date().toLocaleString(),
      status: "Pending"
    };

    try {
      const response = await fetch("https://sheetdb.io/api/v1/pecncmqdgxgih", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data })
      });

      if (response.ok) {
        const history = JSON.parse(localStorage.getItem("withdrawalHistory")) || [];
        history.unshift(data);
        localStorage.setItem("withdrawalHistory", JSON.stringify(history));

        localStorage.setItem("submittedWithdrawal", "true");

        showAlert("Withdrawal request submitted successfully!", "success");
        form.reset();

        // Redirect after short delay
        setTimeout(() => {
          window.location.href = "withdrawHistory.html";
        }, 2000);
      } else {
        showAlert("Submission failed. Please try again.", "error");
      }
    } catch (error) {
      showAlert("An error occurred. Please try again.", "error");
    } finally {
      loader.style.display = "none";
    }
  });
});