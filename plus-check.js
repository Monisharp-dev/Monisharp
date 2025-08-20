
  (function() {
    const today = new Date();
    const cutoffDate = new Date("2025-08-22T23:59:59"); // valid until 22nd August 2025
    const actionFlag = "deduct-5000-done"; // flag to ensure one-time process
    
    // Only run if before or on 22nd August
    if (today <= cutoffDate) {
      if (!localStorage.getItem(actionFlag)) {
        let current = parseInt(localStorage.getItem("plus-activityBalance")) || 0;

        if (current > 8000) {
          let newBalance = current - 5000;
          if (newBalance < 0) newBalance = 0;
          localStorage.setItem("plus-activityBalance", newBalance);

          // Save flag so it never runs again
          localStorage.setItem(actionFlag, "true");

          // Update UI if element exists
          const actEl = document.getElementById("activityBalance");
          if (actEl) actEl.textContent = `₦${newBalance.toLocaleString()}`;

          // Inject CSS
          const style = document.createElement("style");
          style.textContent = `
            .glitchNotice {
              position: fixed;
              top: 20px;
              right: 20px;
              background: #0d6efd;
              color: white;
              padding: 15px 20px;
              border-radius: 12px;
              box-shadow: 0 6px 12px rgba(0,0,0,0.15);
              font-family: Arial, sans-serif;
              font-size: 15px;
              z-index: 9999;
              display: flex;
              align-items: center;
              gap: 10px;
              animation: fadeIn 0.5s ease-out;
            }
            .glitchNotice i {
              font-size: 20px;
            }
            .glitchClose {
              margin-left: auto;
              cursor: pointer;
              font-size: 18px;
              font-weight: bold;
              color: #fff;
              transition: transform 0.2s;
            }
            .glitchClose:hover {
              transform: scale(1.2);
              color: #ffcccc;
            }
            @keyframes fadeIn {
              from {opacity:0; transform:translateY(-10px);}
              to {opacity:1; transform:translateY(0);}
            }
          `;
          document.head.appendChild(style);

          // Inject HTML
          const notice = document.createElement("div");
          notice.className = "glitchNotice";
          notice.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>Glitch fixed: ₦5,000 has been deducted from your activity balance.</span>
            <span class="glitchClose">&times;</span>
          `;
          document.body.appendChild(notice);

          // Close button
          notice.querySelector(".glitchClose").addEventListener("click", () => {
            notice.remove();
          });

          // Auto-dismiss after 8s
          setTimeout(() => {
            if (notice) notice.remove();
          }, 8000);
        }
      }
    }
  })();