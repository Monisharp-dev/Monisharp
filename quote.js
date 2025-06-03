// Rotating "Did you know" or quotes
    const quotes = [
      "Did you know? Success starts with a single step.",
      "Tip: Stay patient, good things take time.",
      "You're almost done. Just a moment...",
      "Great things are loading — don’t leave!",
      "Verifying securely... hang tight!",
      "Almost there! Preparing your dashboard."
    ];
    let quoteIndex = 0;
    const quoteEl = document.getElementById("quoteDisplay");

    setInterval(() => {
      quoteEl.textContent = quotes[quoteIndex];
      quoteIndex = (quoteIndex + 1) % quotes.length;
    }, 4000);
