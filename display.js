// BLOCK METHOD START

{
  // Step 1: Retrieve plusId from localStorage
  const plusId = localStorage.getItem("plus-Id");
  console.log("[Step 1] Retrieved plusId:", plusId);

  // Step 2: Proceed only if plusId exists
  if (plusId) {
    console.log("[Step 2] plusId exists. Proceeding...");

    // Step 3: Retrieve task balance using dynamic key
    const taskBalanceKey = `taskBalance_${plusId}`;
    const taskBalanceRaw = localStorage.getItem(taskBalanceKey);
    const taskBalance = parseFloat(taskBalanceRaw) || 0;
    console.log(`[Step 3] Retrieved taskBalance from '${taskBalanceKey}':`, taskBalanceRaw, "-> Parsed:", taskBalance);

    // Step 4: Retrieve current activity balance
    const activityBalanceKey = "plus-activityBalance";
    const activityBalanceRaw = localStorage.getItem(activityBalanceKey);
    const activityBalance = parseFloat(activityBalanceRaw) || 0;
    console.log(`[Step 4] Retrieved activityBalance from '${activityBalanceKey}':`, activityBalanceRaw, "-> Parsed:", activityBalance);

    // Step 5: Retrieve last synced taskBalance to prevent duplication
    const lastSyncedTaskKey = `lastSyncedTaskBalance_${plusId}`;
    const lastSyncedRaw = localStorage.getItem(lastSyncedTaskKey);
    const lastSynced = parseFloat(lastSyncedRaw) || 0;
    console.log(`[Step 5] Last synced taskBalance from '${lastSyncedTaskKey}':`, lastSyncedRaw, "-> Parsed:", lastSynced);

    // Step 6: Check if new taskBalance differs from last synced
    if (taskBalance !== lastSynced) {
      console.log("[Step 6] taskBalance has changed. Updating activityBalance...");

      // Step 7: Calculate updated activity balance
      const newActivityBalance = activityBalance + taskBalance;
      console.log("[Step 7] New total activityBalance:", newActivityBalance);

      // Step 8: Store updated values
      localStorage.setItem(activityBalanceKey, newActivityBalance.toString());
      localStorage.setItem(lastSyncedTaskKey, taskBalance.toString());
      console.log(`[Step 8] Stored new activityBalance in '${activityBalanceKey}' and updated last synced task balance.`);
    } else {
      console.log("[Step 6] taskBalance has not changed. No update required.");
    }
  } else {
    console.warn("[Step 2] plusId not found in localStorage. Aborting process.");
  }
}

// BLOCK METHOD END