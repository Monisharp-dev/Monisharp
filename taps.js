// uploadScore.js

const scoreUploadApis = [
  "https://sheetdb.io/api/v1/qyn13nrtm1um7"
];

const today = new Date();
const todayDateStr = today.toISOString().split('T')[0];
const day = today.getDay(); // 0 = Sunday, 5 = Friday
const hour = today.getHours(); // 0–23

console.log(`📅 Today's Date: ${todayDateStr}`);
console.log(`🕒 Current Hour: ${hour}`);

function getTimeSlot() {
  if (day === 0) {
    // Sunday: only afternoon and evening
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17) return 'evening';
  } else if (day === 5) {
    // Friday: all three time slots
    if (hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17) return 'evening';
  } else {
    // Other days: morning and evening only
    if (hour < 12) return 'morning';
    if (hour >= 17) return 'evening';
  }
  return null;
}

const timeSlot = getTimeSlot();
console.log(`🕓 Time Slot: ${timeSlot}`);

function shouldUpload() {
  if (!timeSlot) {
    console.log("⛔ Not a valid time slot for uploading.");
    return false;
  }

  const key = `score_uploaded_${timeSlot}_${todayDateStr}`;
  console.log(`🔑 Upload Key: ${key}`);

  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, "true");
    console.log("✅ Allowed to upload: true");
    return true;
  }

  console.log("⛔ Already uploaded for this time slot today.");
  return false;
}

async function uploadScore() {
  const tapTapScore = localStorage.getItem("tapTapScore") || "0";
  const Id = localStorage.getItem("Id");
  const name = localStorage.getItem("firstName") || "Unknown";
  const bank = localStorage.getItem("bank") || "";
  const accountNumber = localStorage.getItem("accountNumber") || "";
  const accountName = localStorage.getItem("accountName") || "";

  if (!Id) {
    console.error("❌ Cannot upload score: Id is missing in localStorage.");
    return;
  }

  const data = {
    Id,
    score: tapTapScore,
    name,
    bank,
    accountNumber,
    accountName,
    date: todayDateStr
  };

  console.log("📤 Uploading score data:", data);

  for (const api of scoreUploadApis) {
    try {
      // Check if record with this Id exists
      const getRes = await fetch(`${api}/search?Id=${Id}`);
      const existing = await getRes.json();

      if (existing.length > 0) {
        console.log("🔁 Id already exists. Deleting old row...");
        const delRes = await fetch(`${api}/Id/${Id}`, {
          method: "DELETE"
        });

        if (!delRes.ok) {
          console.warn(`⚠️ Failed to delete old row for Id ${Id}`);
          continue;
        }
        console.log("🗑️ Old record deleted successfully.");
      } else {
        console.log("🆕 No existing row found. Proceeding with POST.");
      }

      const postRes = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [data] })
      });

      if (postRes.ok) {
        console.log(`✅ Score successfully uploaded to: ${api}`);
        return;
      } else {
        console.warn(`⚠️ Upload failed with status: ${postRes.status}`);
      }
    } catch (err) {
      console.error(`❌ Error with API ${api}:`, err);
    }
  }

  console.error("❌ All upload attempts failed.");
}

// Main
if (shouldUpload()) {
  uploadScore();
}