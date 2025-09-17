// BlockAccess.js

document.addEventListener('DOMContentLoaded', function () {
    // Arrays of blocked IDs for each package
    const blockedStudentIds = ["sisfathia120", "moghj56"]; 
    const blockedPlusIds = ["alexanderifenabohplus", "plusBoss777"]; 

    // Fetch both possible IDs
    const studentId = localStorage.getItem("Id");
    const plusId = localStorage.getItem("plus-Id");

    let isBlocked = false;

    // Check if student ID exists and is blocked
    if (studentId && blockedStudentIds.includes(studentId)) {
        isBlocked = true;
    }

    // Check if plus ID exists and is blocked
    if (plusId && blockedPlusIds.includes(plusId)) {
        isBlocked = true;
    }

    if (isBlocked) {
        // Create and inject CSS to block entire interface
        const style = document.createElement('style');
        style.innerHTML = `
            html, body {
                margin: 0;
                padding: 0;
                overflow: hidden !important;
                height: 100vh;
                width: 100vw;
            }

            #block-overlay {
                position: fixed;
                top: 0;
                left: 0;
                height: 100vh;
                width: 100vw;
                background-color: #1a1a1a;
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 999999;
                font-family: 'Segoe UI', sans-serif;
                text-align: center;
                padding: 20px;
            }

            #block-overlay h1 {
                font-size: 2.5em;
                color: #ff4d4d;
                margin-bottom: 20px;
            }

            #block-overlay p {
                font-size: 1.2em;
                max-width: 90%;
                line-height: 1.6;
            }

            #block-overlay .icon {
                font-size: 4em;
                color: #ff4d4d;
                margin-bottom: 10px;
            }
        `;
        document.head.appendChild(style);

        // Inject blocking overlay HTML
        const overlay = document.createElement('div');
        overlay.id = 'block-overlay';
        overlay.innerHTML = `
            <div class="icon">🚫</div>
            <h1>Access Denied</h1>
            <p>Your account has been flagged by the admin for violating our policies.<br>
            If you believe this is a mistake, please contact the admin on Facebook or WhatsApp.</p>
        `;

        // Wipe existing content and display the message
        document.body.innerHTML = '';
        document.body.appendChild(overlay);
    }
});