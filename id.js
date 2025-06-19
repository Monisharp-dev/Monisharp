// List of fallback APIs
const apiUrls = [
  "https://sheetdb.io/api/v1/c144vqnly26t5",
  "https://sheetdb.io/api/v1/k51vpzir9tfo8"
  // Add more APIs here if needed
];

// Function to get Id from email
function extractIdFromEmail(email) {
  const Id = email.split("@")[0];
  console.log(`Extracted Id from email '${email}':`, Id);
  return Id;
}

// Function to check if Id exists in API
async function checkIdInApi(apiUrl, Id) {
  console.log(`Checking if Id '${Id}' exists in API: ${apiUrl}`);
  try {
    const response = await fetch(`${apiUrl}/search?Id=${Id}`);
    const data = await response.json();
    const exists = data.length > 0;
    console.log(`Check result for Id '${Id}' in API: ${exists ? "Exists" : "Not found"}`);
    return exists;
  } catch (err) {
    console.error(`Error checking Id '${Id}' in ${apiUrl}:`, err);
    return false; // Treat failure as non-existent
  }
}

// Function to post Id to API
async function postIdToApi(apiUrl, Id) {
  console.log(`Attempting to post Id '${Id}' to API: ${apiUrl}`);
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data: [{ Id: Id }] })
    });

    if (response.ok) {
      console.log(`Successfully posted Id '${Id}' to API: ${apiUrl}`);
      return true;
    } else {
      console.warn(`Failed to post Id '${Id}' to API: ${apiUrl} — Response not OK`);
      return false;
    }
  } catch (err) {
    console.error(`Error posting Id '${Id}' to ${apiUrl}:`, err);
    return false;
  }
}

// Main function
async function processStoredEmail() {
  const email = localStorage.getItem("email");

  if (!email) {
    console.warn("No email found in localStorage. Cannot process Id.");
    return;
  }

  console.log(`Starting Id processing for stored email: ${email}`);

  const Id = extractIdFromEmail(email);
  const localKey = "Id";

  // Check if already stored
  if (localStorage.getItem(localKey) === Id) {
    console.log(`Id '${Id}' is already saved in localStorage. Skipping API check.`);
    return;
  }

  // Try each API
  for (const apiUrl of apiUrls) {
    const exists = await checkIdInApi(apiUrl, Id);
    if (exists) {
      console.log(`Id '${Id}' already exists in API. Saving to localStorage.`);
      localStorage.setItem(localKey, Id);
      return;
    } else {
      const success = await postIdToApi(apiUrl, Id);
      if (success) {
        console.log(`Id '${Id}' successfully posted and saved in localStorage.`);
        localStorage.setItem(localKey, Id);
        return;
      } else {
        console.warn(`Posting Id '${Id}' failed on API: ${apiUrl}`);
      }
    }
  }

  console.warn(`All attempts failed. Id '${Id}' not stored.`);
}

// Run the function
processStoredEmail();