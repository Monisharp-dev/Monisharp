function activateTapForUser(userId) {
    const tapKey = `tapActivated_${userId}`;
    const now = Date.now();
    const existingData = localStorage.getItem(tapKey);

    if (existingData) {
        const data = JSON.parse(existingData);
        if (now >= data.expiresAt) {
            localStorage.removeItem(tapKey);
            console.log(`Expired. Removed tapActivated for ${userId}`);
        } else {
            console.log(`Already active for ${userId}`);
            return;
        }
    }

    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const expiresAt = now + sevenDays;

    const tapData = {
        status: "active",
        activatedAt: now,
        expiresAt: expiresAt
    };

    localStorage.setItem(tapKey, JSON.stringify(tapData));
    console.log(`tapActivated set for ${userId}`);
}

// 👥 List of user Ids to assign
const userIds = ["abelscoliom11", "goodness18", "edickson774","unwanaidiong2008","akinoye7600","hesabasi","femigodslove069"];

userIds.forEach(id => activateTapForUser(id));