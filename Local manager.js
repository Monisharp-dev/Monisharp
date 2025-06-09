(function cleanupStorageForCurrentUser() {
  const currentUserId = localStorage.getItem("Id");
  if (!currentUserId) {
    console.warn("No user Id found in localStorage under key 'Id'. Aborting cleanup.");
    return;
  }
  console.log(`Current user Id: "${currentUserId}"`);

  // Prefixes to check for
  const prefixes = [
    "taskBalance_",
    "usedTaskKeys_",
    "usedDepositKeys_",
    "depositBalance_"
  ];

  // Get all keys from localStorage
  const allKeys = Object.keys(localStorage);

  allKeys.forEach(key => {
    // Check if key starts with any of the prefixes
    const matchedPrefix = prefixes.find(prefix => key.startsWith(prefix));
    if (!matchedPrefix) return; // skip keys that don't match prefixes

    // Extract the userId part after the prefix
    const keyUserId = key.substring(matchedPrefix.length);

    if (keyUserId !== currentUserId) {
      // userId doesn't match, delete key
      console.log(`Deleting key: "${key}" (userId part: "${keyUserId}") does NOT match current userId.`);
      localStorage.removeItem(key);
    } else {
      console.log(`Keeping key: "${key}" (matches current userId).`);
    }
  });

  console.log("Cleanup complete.");
})();