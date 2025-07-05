document.addEventListener('DOMContentLoaded', function () {
    const hasSeenPopup = localStorage.getItem('monisharp_popup_shown');

    if (!hasSeenPopup) {
        setTimeout(() => {
            const popup = document.createElement('div');
            popup.id = 'monisharp-popup';
            popup.innerHTML = `
                <div class="popup-content">
                    <button class="close-btn" aria-label="Close">&times;</button>
                    <div class="popup-body">
                        <h2>🚀 Advertise Here!</h2>
                        <p>Looking to reach thousands of users?</p>
                        <p><strong>Message us on Facebook:</strong></p>
                        <a href="https://facebook.com/MoniSharpOfficial" target="_blank" class="cta-button">MONISHARP OFFICIAL</a>
                    </div>
                </div>
            `;

            const style = document.createElement('style');
            style.innerHTML = `
                #monisharp-popup {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    max-width: 90vw;
                    width: 340px;
                    background: #fff;
                    border-radius: 20px;
                    box-shadow: 0 16px 30px rgba(0, 0, 0, 0.2);
                    z-index: 10000;
                    font-family: 'Segoe UI', sans-serif;
                    animation: fadeInUp 0.4s ease-out;
                }

                .popup-content {
                    position: relative;
                    padding: 24px 20px 20px 20px;
                }

                .popup-body h2 {
                    font-size: 1.4rem;
                    color: #1a1a1a;
                    margin-bottom: 10px;
                    text-align: center;
                }

                .popup-body p {
                    font-size: 1rem;
                    color: #444;
                    margin: 4px 0;
                    text-align: center;
                }

                .cta-button {
                    display: block;
                    width: fit-content;
                    margin: 12px auto 0;
                    padding: 10px 20px;
                    font-size: 1rem;
                    background-color: #006aff;
                    color: #fff;
                    border-radius: 12px;
                    text-decoration: none;
                    transition: background-color 0.3s ease;
                    font-weight: 600;
                }

                .cta-button:hover {
                    background-color: #004dc1;
                }

                .close-btn {
                    position: absolute;
                    top: 10px;
                    right: 12px;
                    font-size: 1.6rem;
                    background: none;
                    border: none;
                    color: #999;
                    cursor: pointer;
                    transition: color 0.3s ease, transform 0.2s ease;
                }

                .close-btn:hover {
                    color: #000;
                    transform: scale(1.1);
                }

                @keyframes fadeInUp {
                    from {
                        transform: translateY(60px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @media (max-width: 400px) {
                    #monisharp-popup {
                        bottom: 15px;
                        right: 15px;
                        width: 90%;
                    }
                }
            `;

            document.body.appendChild(style);
            document.body.appendChild(popup);
            localStorage.setItem('monisharp_popup_shown', 'true');

            popup.querySelector('.close-btn').addEventListener('click', () => {
                popup.style.display = 'none';
            });

        }, 6000);
    }
});