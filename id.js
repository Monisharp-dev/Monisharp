// List of fallback APIs
const apiUrls = [
  "https://sheetdb.io/api/v1/k51vpzir9tfo8",
  // Add more APIs here if needed
];

// Function to get ID from email
function extractIdFromEmail(email) {
  const id = email.split("@")[0];
  console.log(`Extracted ID from email '${email}':`, id);
  return id;
}

// Function to check if Id exists in API
async function checkIdInApi(apiUrl, id) {
  console.log(`Checking if ID '${id}' exists in API: ${apiUrl}`);
  try {
    const response = await fetch(`${apiUrl}/search?Id=${id}`);
    const data = await response.json();
    const exists = data.length > 0;
    console.log(`Check result for ID '${id}' in API: ${exists ? "Exists" : "Not found"}`);
    return exists;
  } catch (err) {
    console.error(`Error checking ID '${id}' in ${apiUrl}:`, err);
    return false; // Treat failure as non-existent
  }
}

// Function to post Id to API
async function postIdToApi(apiUrl, id) {
  console.log(`Attempting to post ID '${id}' to API: ${apiUrl}`);
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data: [{ Id: id }] })
    });

    if (response.ok) {
      console.log(`Successfully posted ID '${id}' to API: ${apiUrl}`);
      return true;
    } else {
      console.warn(`Failed to post ID '${id}' to API: ${apiUrl} — Response not OK`);
      return false;
    }
  } catch (err) {
    console.error(`Error posting ID '${id}' to ${apiUrl}:`, err);
    return false;
  }
}

// Main function
async function processStoredEmail() {
  const email = localStorage.getItem("email");

  if (!email) {
    console.warn("No email found in localStorage. Cannot process ID.");
    return;
  }

  console.log(`Starting ID processing for stored email: ${email}`);

  const id = extractIdFromEmail(email);
  const localKey = "Id";

  // Check if already stored
  if (localStorage.getItem(localKey) === id) {
    console.log(`ID '${id}' is already saved in localStorage. Skipping API check.`);
    return;
  }

  // Try each API
  for (const apiUrl of apiUrls) {
    const exists = await checkIdInApi(apiUrl, id);
    if (exists) {
      console.log(`ID '${id}' already exists in API. Saving to localStorage.`);
      localStorage.setItem(localKey, id);
      return;
    } else {
      const success = await postIdToApi(apiUrl, id);
      if (success) {
        console.log(`ID '${id}' successfully posted and saved in localStorage.`);
        localStorage.setItem(localKey, id);
        return;
      } else {
        console.warn(`Posting ID '${id}' failed on API: ${apiUrl}`);
      }
    }
  }

  console.warn(`All attempts failed. ID '${id}' not stored.`);
}

// Run the function
processStoredEmail();