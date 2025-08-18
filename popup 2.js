// ==============================
// POPUP CODE FOR TESTIMONIALS
// (Shows once per day, after 3s, slide-in)
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  // Check if popup was already shown today
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const lastShown = localStorage.getItem("testimonialPopupDate");
  if (lastShown === today) return;

  setTimeout(() => {
    // Create popup container
    const popup = document.createElement("div");
    popup.innerHTML = `
      <div id="testimonial-popup" style="
        position: fixed; 
        top: 0; left: 0; 
        width: 100%; height: 100%; 
        background: rgba(0,0,0,0.5); 
        display: flex; 
        align-items: flex-end; 
        justify-content: center; 
        z-index: 9999; 
        animation: fadeIn 0.4s ease;">
        
        <div style="
          background: white; 
          border-radius: 20px 20px 0 0; 
          padding: 25px; 
          max-width: 400px; 
          width: 100%; 
          text-align: center; 
          box-shadow: 0 -4px 20px rgba(0,0,0,0.2); 
          animation: slideUp 0.6s ease;">
          
          <div style="font-size: 40px; color: #0077ff; margin-bottom: 10px;">
            ⭐
          </div>
          
          <h2 style="font-family: Arial, sans-serif; color: #222; margin-bottom: 10px;">
            See Our Progress!
          </h2>
          
          <p style="font-family: Arial, sans-serif; color: #555; font-size: 15px; margin-bottom: 20px;">
            Visit our <b>Testimonials</b> page to see how <span style="color:#0077ff;">MoniSharp</span> is growing and hear from real users.
          </p>
          
          <button id="visit-btn" style="
            background: linear-gradient(135deg, #0077ff, #00d4ff); 
            border: none; 
            padding: 12px 20px; 
            color: white; 
            font-size: 15px; 
            border-radius: 50px; 
            cursor: pointer; 
            transition: 0.3s; 
            width: 100%;
          ">
            🚀 Visit Testimonials
          </button>
          
          <button id="close-btn" style="
            margin-top: 12px; 
            background: transparent; 
            border: none; 
            color: #888; 
            font-size: 14px; 
            cursor: pointer;
          ">
            ✖ Close
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(popup);

    // Button actions
    document.getElementById("visit-btn").onclick = () => {
      localStorage.setItem("testimonialPopupDate", today);
      window.location.href = "testimonials.html";
    };
    
    document.getElementById("close-btn").onclick = () => {
      localStorage.setItem("testimonialPopupDate", today);
      document.getElementById("testimonial-popup").remove();
    };

    // Inject CSS Animations
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeIn {
        from {opacity: 0;} 
        to {opacity: 1;}
      }
      @keyframes slideUp {
        from {transform: translateY(100%);} 
        to {transform: translateY(0);}
      }
      #visit-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }
    `;
    document.head.appendChild(style);

  }, 3000); // Delay = 3 seconds
});