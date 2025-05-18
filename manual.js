// List of allowed user Ids
const allowedIds = ["Ulingsmart102008","raetharolin"]; // Replace with your specific Ids

// Get the current user's Id from localStorage
const currentUserId = localStorage.getItem("Id");

// Check if the current Id is allowed and 'activateStatus' is not already set
if (allowedIds.includes(currentUserId) && !localStorage.getItem("activateStatus")) {
  localStorage.setItem("activateStatus", "present");
  console.log("activateStatus set to 'present' for", currentUserId);
}