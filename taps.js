// uploadScore.js

const scoreUploadApis = [
  "https://sheetdb.io/api/v1/qyn13nrtm1um7",
  // Add more fallback APIs below:
  // "https://sheetdb.io/api/v1/your-backup-api"
];

// Cache today's date once and log it
const todayDateStr = new Date().toISOString().split('T')[0];
console.log(`📅 Today's Date: ${todayDateStr}`);

function getCurrentHour() {
  const hour = new Date().getHours(); // 0–23
  console.log(`🕒 Current Hour: ${hour}`);
  return hour;
}

function shouldUploadScore(timeLeftMillis) {
  const isFriday = new Date().getDay() === 5;
  const hour = getCurrentHour();

  console.log(`📆 Is Friday: ${isFriday}`);
  console.log(`⏳ Time Left (ms): ${timeLeftMillis}`);

  // Friday special case: morning & evening
  if (isFriday) {
    const morningKey = `score_uploaded_morning_${todayDateStr}`;
    const eveningKey = `score_uploaded_evening_${todayDateStr}`;

    if (hour < 12 && !localStorage.getItem(morningKey)) {
      localStorage.setItem(morningKey, "true");
      console.log("🌅 Morning upload allowed.");
      return true;
    } else if (hour >= 12 && !localStorage.getItem(eveningKey)) {
      localStorage.setItem(eveningKey, "true");
      console.log("🌇 Evening upload allowed.");
      return true;
    }

    console.log("⛔ Already uploaded today (Friday).");
    return false;
  }

  // Other days – upload only once
  const timeLeftMin = Math.floor(timeLeftMillis / 60000);
  const dailyKey = `score_uploaded_${todayDateStr}`;
  console.log(`⏱ Time Left (minutes): ${timeLeftMin}`);

  if (!localStorage.getItem(dailyKey) && (timeLeftMin === 50 || timeLeftMin === 20)) {
    localStorage.setItem(dailyKey, "true");
    console.log("✅ Upload allowed today at special time (50 or 20 minutes left).");
    return true;
  }

  console.log("⛔ Upload not allowed at this time.");
  return false;
}

async function uploadScoreOnce(score) {
  const data = {
    Id: localStorage.getItem("Id"),
    score: score,
    name: localStorage.getItem("firstName") || "Unknown",
    bank: localStorage.getItem("bank") || "",
    accountNumber: localStorage.getItem("accountNumber") || "",
    accountName: localStorage.getItem("accountName") || "",
    date: todayDateStr
  };

  console.log("📤 Preparing to upload score:", data);

  for (const api of scoreUploadApis) {
    try {
      const res = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [data] })
      });

      if (res.ok) {
        console.log(`✅ Score successfully uploaded to: ${api}`);
        return true;
      } else {
        console.warn(`⚠️ Upload failed with status: ${res.status} at ${api}`);
      }
    } catch (err) {
      console.warn(`⚠️ Error while uploading to ${api}`, err);
    }
  }

  console.error("❌ All score upload attempts failed.");
  return false;
}