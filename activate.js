document.addEventListener('DOMContentLoaded', () => {
  const Id = localStorage.getItem('Id');
  document.getElementById('Id').value = Id || 'N/A';

  const form = document.getElementById('paymentForm');

  // Inject Loader and Notification HTML (initially hidden)
  const loader = document.createElement('div');
  loader.id = 'loader';
  loader.style.display = 'none'; // Ensure it's hidden initially
  loader.innerHTML = '<span>Submitting</span><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>';
  document.body.appendChild(loader);

  const notification = document.createElement('div');
  notification.id = 'notification';
  notification.style.display = 'none'; // Ensure it's hidden initially
  document.body.appendChild(notification);

  // Inject CSS styles
  const style = document.createElement('style');
  style.innerHTML = `
    #loader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(255, 255, 255, 0.7);
      z-index: 9999;
      backdrop-filter: blur(3px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
      flex-direction: row;
      gap: 5px;
    }

    #loader .dot {
      animation: wave 1.2s infinite;
    }

    #loader .dot:nth-child(2) {
      animation-delay: 0.2s;
    }

    #loader .dot:nth-child(3) {
      animation-delay: 0.4s;
    }

    #loader .dot:nth-child(4) {
      animation-delay: 0.6s;
    }

    @keyframes wave {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    #notification {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
      padding: 15px 20px;
      border-radius: 8px;
      max-width: 90%;
      font-size: 16px;
      z-index: 9999;
      box-shadow: 0 0 10px rgba(0, 128, 0, 0.2);
      text-align: center;
    }

    #notification.error {
      background-color: #f8d7da;
      color: #721c24;
      border-color: #f5c6cb;
      box-shadow: 0 0 10px rgba(255, 0, 0, 0.2);
    }
  `;
  document.head.appendChild(style);

  const sheetdbUrls = [
    'https://sheetdb.io/api/v1/y7o8snbs8njpe'
  ];

  const imgbbKeys = [
    '86ac206cbf0a9713952bc49109196e11',
    'b8460f459985ca3a01a5f3a3c9cdcf1f',
    '5da6321ffe26d29500c57086abea4179',
    '86154b3839c2d7db9a08f4383b90b863'
  ];

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (localStorage.getItem('hasNotGySubmitted') === 'true') {
      showNotification('You have already submitted your payment details.', 'error');
      return;
    }

    const proof = document.getElementById('proof').files[0];
    const Id = document.getElementById('Id').value.trim();
    const date = new Date().toLocaleString();

    if (!proof || !Id) {
      alert('All fields are required including proof of payment.');
      return;
    }

    showLoader(true);

    try {
      const proofBase64 = await fileToBase64(proof);
      let imageUrl = null;

      for (let i = 0; i < imgbbKeys.length; i++) {
        try {
          const formData = new FormData();
          formData.append('image', proofBase64);

          const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKeys[i]}`, {
            method: 'POST',
            body: formData
          });

          const result = await imgbbRes.json();
          if (imgbbRes.ok && result?.data?.url) {
            imageUrl = result.data.url;
            break;
          }
        } catch (err) {
          console.error('imgbb error:', err.message);
        }
      }

      if (!imageUrl) throw new Error('Proof upload failed');

      const payload = { imageUrl, Id, date };
      let success = false;

      for (let attempt = 0; attempt < Math.min(sheetdbUrls.length, 16); attempt++) {
        try {
          const response = await fetch(sheetdbUrls[attempt % sheetdbUrls.length], {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            await response.json();
            success = true;
            break;
          }
        } catch (err) {
          console.error('SheetDB error:', err.message);
        }
      }

      if (success) {
        localStorage.setItem('hasSubmitted', 'true');
        form.reset();
        showNotification('Your payment details have been submitted successfully. Confirmation will take place in less than 24 hours. Please be patient.');
      } else {
        showNotification('All API attempts failed. Please try again later.', 'error');
      }
    } catch (err) {
      console.error('Submission error:', err.message);
      showNotification('An unexpected error occurred. Please try again.', 'error');
    }

    showLoader(false);
  });

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = '';
    if (type === 'error') notification.classList.add('error');
    notification.style.display = 'block';
    notification.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      notification.style.display = 'none';
    }, 9000);
  }

  function showLoader(show) {
    const loader = document.getElementById('loader');
    loader.style.display = show ? 'flex' : 'none';
  }
});
