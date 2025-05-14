document.addEventListener("DOMContentLoaded", () => {
  console.log("corrector.js loaded. Checking for 'getData'...");

  const getDataRaw = localStorage.getItem("getData");

  if (!getDataRaw) {
    console.log("'getData' not found in localStorage. Nothing to correct.");
    return;
  }

  let getData;
  try {
    getData = JSON.parse(getDataRaw);
  } catch (err) {
    console.error("Failed to parse 'getData'. Removing corrupt data.");
    localStorage.removeItem("getData");
    return;
  }

  let corrections = 0;

  // 1. Compare Id
  const storedId = localStorage.getItem("Id");
  if (storedId && storedId === getData.Id) {
    delete getData.Id;
    corrections++;
    console.log("Corrected: Matching Id found and removed from 'getData'.");
  }

  // 2. Compare and correct mainBalance
  const storedBalance = parseFloat(localStorage.getItem("mainBalance"));
  const getDataBalance = parseFloat(getData.mainBalance);

  if (!isNaN(storedBalance) && !isNaN(getDataBalance)) {
    if (storedBalance < getDataBalance) {
      localStorage.setItem("mainBalance", getDataBalance.toString());
      console.log(`Corrected: mainBalance updated from ${storedBalance} to ${getDataBalance}.`);
    } else {
      console.log("mainBalance in localStorage is equal or higher. No update needed.");
    }
    delete getData.mainBalance;
    corrections++;
  }

  // 3. Compare activateStatus
  const storedStatus = localStorage.getItem("activateStatus");
  if (storedStatus && storedStatus === getData.activateStatus) {
    delete getData.activateStatus;
    corrections++;
    console.log("Corrected: Matching activateStatus found and removed from 'getData'.");
  }

  // 4. Move remaining getData into localData
  if (Object.keys(getData).length > 0) {
    localStorage.setItem("localData", JSON.stringify(getData));
    console.log("Moved remaining 'getData' contents to 'localData':", getData);
  }

  // 5. Clean up
  localStorage.removeItem("getData");
  console.log("Final cleanup: 'getData' removed from localStorage.");

  if (corrections === 0) {
    console.log("No corrections were made.");
  } else {
    console.log(`Total corrections made: ${corrections}`);
  }
});