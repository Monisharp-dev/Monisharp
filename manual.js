// List of allowed user Ids
const allowedIds = [
  "Ulingsmart102008", "raetharolin", "ajaniisraelojasope11", "opalekesoromdayo", "obunsodaniel",
  "bilkisumusa888", "feargodthompson", "dconfidence322", "icefieldwaripamoweifreedom",
  "utomobongpatrick16", "sesughdaniel433", "friedsteak006", "owolabidamilare377", "godswillg057",
  "crys9213", "adarikucecilia2", "ezeisaiah2023", "geoffreyjootar", "paschalifechukwu2006",
  "kehindeige527", "emmakani234", "agujiobisamuel", "josephjoeboy445", "mujaheedpresdor001",
  "bokoh5061", "ebubechiwinner066", "emmanuelisaacbamgbose", "oluwatofunmienochoke",
  "edwardjared723", "ayibakurokuro", "usohisrael2", "tmosco4real",
  "olamilekanjoseph601", "gomoarukhe", "Ibbello1507", "ifeanyichukwuoguejiofor", "sermborleeh",
  "godspoweramos01", "happybankmoney", "safiyaibrahimbahago", "muslimatkehinde05",
  "etokwudog", "popoolaisrael73", "jnrfred74", "etukubonganthony"
];

// Remove duplicates (optional but clean)
const uniqueAllowedIds = [...new Set(allowedIds)];

// Get the current user's Id from localStorage
const currentUserId = localStorage.getItem("Id");

// Check if the current Id is allowed and 'activateStatus' is not already set
if (currentUserId && uniqueAllowedIds.includes(currentUserId) && !localStorage.getItem("activateStatus")) {
  localStorage.setItem("activateStatus", "present");
  console.log("activateStatus set to 'present' for", currentUserId);
}