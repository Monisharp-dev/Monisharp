function showToast(message) {
      const toast = document.getElementById("toast");
      toast.textContent = message;
      toast.style.display = "block";
      setTimeout(() => toast.style.opacity = "1", 100);
      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.style.display = "none", 400);
      }, 2500);
    }

    function copyAppLink() {
      const link = document.getElementById("appLink").innerText;
      navigator.clipboard.writeText(link).then(() => {
        showToast("App link copied to clipboard!");
      });
    }

    document.getElementById("copyBtn").addEventListener("click", function () {
      const code = document.getElementById("referralCode").innerText;
      navigator.clipboard.writeText(code).then(() => {
        showToast("Referral code copied to clipboard!");
      });
    });