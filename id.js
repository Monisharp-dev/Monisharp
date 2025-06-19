
// Function to extract Id from email
function extractIdFromEmail(email) {
  const Id = email.split("@")[0];
  console.log(`Extracted Id from email '${email}':`, Id);
  return Id;
}

// Main function to process email and store Id locally
function processStoredEmail() {
  const email = localStorage.getItem("email");

  if (!email) {
    console.warn("No email found in localStorage. Cannot process Id.");
    return;
  }

  console.log(`Starting Id processing for stored email: ${email}`);

  const Id = extractIdFromEmail(email);
  const localKey = "Id";

  if (localStorage.getItem(localKey) === Id) {
    console.log(`Id '${Id}' already exists in localStorage. Skipping.`);
    return;
  }

  // Save the Id locally
  localStorage.setItem(localKey, Id);
  console.log(`Id '${Id}' saved in localStorage.`);
}

// Run the function
processStoredEmail();










