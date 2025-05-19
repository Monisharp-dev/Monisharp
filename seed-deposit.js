function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = 'notification';
  if (type === 'error') {
    notification.classList.add('error');
  }
  notification.classList.remove('hidden');
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 6000);
}

document.addEventListener('DOMContentLoaded', () => {
  const idInput = document.getElementById('id');
  const dateInput = document.getElementById('date');
  const form = document.getElementById('depositForm');
  const paymentPurpose = document.getElementById('paymentPurpose');

  const storedId = localStorage.getItem('Id');
  const today = new Date().toISOString().split('T')[0];

  if (storedId) {
    idInput.value = storedId;
  } else {
    showNotification('User ID not found in localStorage.', 'error');
    console.error('User ID not found in localStorage.');
  }

  dateInput.value = today;

  // Prevent multiple submissions in a day
  const lastSubmitDate = localStorage.getItem('lastSeedDeposit');
  if (lastSubmitDate === today) {
    showNotification('You have already submitted a deposit today.', 'error');
    form.querySelector('button[type="submit"]').disabled = true;
    console.warn('Duplicate submission attempt blocked.');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = document.getElementById('screenshot').files[0];
    const purpose = paymentPurpose.value;

    if (!file) {
      showNotification('Please upload a screenshot of your payment.', 'error');
      return;
    }

    if (!purpose) {
      showNotification('Please select a purpose of payment.', 'error');
      return;
    }

    showNotification('Uploading screenshot...');
    console.log('Uploading screenshot to ImgBB...');

    const imageUrl = await uploadImage(file);
    if (!imageUrl) {
      showNotification('Failed to upload image. Try again.', 'error');
      return;
    }

    showNotification('Submitting deposit...');
    console.log('Image uploaded. Submitting deposit to SheetDB...');

    const entry = {
      Id: storedId,
      date: today,
      paymentPurpose: purpose,
      imageUrl: imageUrl
    };

    const success = await submitToSheetDB(entry);

    if (success) {
      localStorage.setItem('lastSeedDeposit', today); // Mark submission for the day
      showNotification('Deposit submitted successfully. Await confirmation to plant a seed.');
      console.log('Deposit data submitted to SheetDB:', entry);

      form.reset();
      idInput.value = storedId;
      dateInput.value = today;
    } else {
      showNotification('Failed to submit deposit. Please try again.', 'error');
    }
  });
});

async function uploadImage(file) {
  const keys = [
    '86ac206cbf0a9713952bc49109196e11',
    'b8460f459985ca3a01a5f3a3c9cdcf1f',
    '5da6321ffe26d29500c57086abea4179',
    '86154b3839c2d7db9a08f4383b90b863'
  ];

  const formData = new FormData();
  formData.append('image', file);

  for (let key of keys) {
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.success && data.data && data.data.url) {
        console.log('Image uploaded successfully with key:', key);
        return data.data.url;
      }
    } catch (err) {
      console.error('ImgBB upload error with key:', key, err);
    }
  }

  return null;
}

async function submitToSheetDB(data) {
  const apiURL = 'https://sheetdb.io/api/v1/c3skr13rkth9y';

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const res = await fetch(apiURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      });

      const result = await res.json();
      if (result && result.created) {
        console.log(`SheetDB submission success on attempt ${attempt}.`);
        return true;
      }
    } catch (err) {
      console.warn(`Attempt ${attempt} failed:`, err);
    }
  }

  return false;
}