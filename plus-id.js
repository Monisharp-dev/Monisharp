// Function to extract Id from email and add 'plus' as suffix
function extractIdFromEmail(email) {
  const baseId = email.split("@")[0];
  const Id = `${baseId}plus`;
  console.log(`Extracted Id from email '${email}':`, Id);
  return Id;
}

// Main function to process email and store Id locally
function processStoredEmail() {
  const emailKey = "plus-email";
  const idKey = "plus-Id";

  const email = localStorage.getItem(emailKey);

  if (!email) {
    console.warn("No email found in localStorage. Cannot process Id.");
    return;
  }

  console.log(`Starting Id processing for stored email: ${email}`);

  const Id = extractIdFromEmail(email);

  if (localStorage.getItem(idKey) === Id) {
    console.log(`Id '${Id}' already exists in localStorage. Skipping.`);
    return;
  }

  // Save the Id locally using the correct key
  localStorage.setItem(idKey, Id);
  console.log(`Id '${Id}' saved in localStorage under key '${idKey}'.`);
}

// Run the function
processStoredEmail();