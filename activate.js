document.addEventListener('DOMContentLoaded', () => {
  const Id = localStorage.getItem('Id');
  document.getElementById('Id').value = Id || 'N/A';

  const form = document.getElementById('paymentForm');
  const notification = document.getElementById('notification');

  const sheetdbUrls = [
    'https://sheetdb.io/api/v1/y7o8snbs8njpe',
    // Add more SheetDB URLs here if needed
  ];

  const imgbbKeys = [
    '86ac206cbf0a9713952bc49109196e11',
    'b8460f459985ca3a01a5f3a3c9cdcf1f',
    '5da6321ffe26d29500c57086abea4179',
    '86154b3839c2d7db9a08f4383b90b863'
  ];

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const proof = document.getElementById('proof').files[0];
    const Id = document.getElementById('Id').value.trim();
    const date = new Date().toLocaleString();

    if (!proof || !Id) {
      alert('All fields are required including proof of payment.');
      return;
    }

    console.log('Starting upload process...');

    const proofBase64 = await fileToBase64(proof);
    let imageUrl = null;

    for (let i = 0; i < imgbbKeys.length; i++) {
      const imgbbKey = imgbbKeys[i];
      console.log(`Trying imgbb key #${i + 1}`);
      try {
        const formData = new FormData();
        formData.append('image', proofBase64);

        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
          method: 'POST',
          body: formData
        });

        const result = await imgbbRes.json();
        if (imgbbRes.ok && result?.data?.url) {
          imageUrl = result.data.url;
          console.log('Proof image uploaded:', imageUrl);
          break;
        } else {
          console.warn('imgbb failed:', result);
        }
      } catch (err) {
        console.error('imgbb error:', err.message);
      }
    }

    if (!imageUrl) {
      alert('Failed to upload proof of payment. Try again later.');
      return;
    }

    const payload = {
      imageUrl: imageUrl, // Use correct field name
      Id: Id,
      date: date
    };

    let success = false;
    for (let attempt = 0; attempt < Math.min(sheetdbUrls.length, 16); attempt++) {
      const url = sheetdbUrls[attempt % sheetdbUrls.length];
      console.log(`Trying SheetDB URL #${attempt + 1}: ${url}`);
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          success = true;
          console.log('Submission successful:', await response.json());
          break;
        } else {
          console.warn('SheetDB submission failed:', response.status);
        }
      } catch (err) {
        console.error('SheetDB error:', err.message);
      }
    }

    if (success) {
      form.reset();
      notification.style.display = 'block';
      notification.textContent =
        'Your payment details have been submitted successfully. Confirmation will take place in less than 24 hours. Please be patient.';
    } else {
      alert('All API attempts failed. Please try again later.');
    }
  });

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
});