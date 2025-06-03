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
  "etokwudog", "popoolaisrael73", "jnrfred74", "etukubonganthony","destinysylvanus74","osuolalemubarak7","imajerry1819","adebayobose235","twostorage554","anthony87630269"
];

// Remove duplicates just in case
const uniqueAllowedIds = [...new Set(allowedIds)];

const currentUserId = localStorage.getItem("Id");
const storedStatus = localStorage.getItem("activateStatus");

// If current user is allowed AND (activateStatus is not set OR belongs to a different user)
if (currentUserId && uniqueAllowedIds.includes(currentUserId) && storedStatus !== "present") {
  localStorage.setItem("activateStatus", "present");
  console.log(`activateStatus set to 'present' for allowed user: ${currentUserId}`);
} else if (!uniqueAllowedIds.includes(currentUserId)) {
  console.log(`User ${currentUserId} is NOT allowed. activateStatus not set.`);
} else {
  console.log(`activateStatus already set for this user: ${currentUserId}`);
}