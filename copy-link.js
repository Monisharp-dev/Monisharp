// === Inject CSS dynamically ===
(function injectCopyLinkCSS() {
  const css = `
    .copy-link-btn {
      position: absolute;
      top: 10px;
      right: 12px;
      padding: 6px 12px;
      border: none;
      border-radius: 999px;
      background: #007bff;
      color: #fff;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,.12);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      z-index: 2;
    }
    .copy-link-btn i { font-size: 0.9rem; }
    .copy-link-btn:active { transform: scale(0.96); }

    /* Friendly tooltip */
    .copy-tooltip {
      position: absolute;
      top: 46px;
      right: 12px;
      background: #333;
      color: #fff;
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 0.85rem;
      opacity: 0;
      pointer-events: none;
      transform: translateY(-8px);
      transition: opacity .25s ease, transform .25s ease;
      max-width: 280px;
      line-height: 1.4;
      z-index: 3;
      box-shadow: 0 3px 8px rgba(0,0,0,.25);
    }
    .copy-tooltip.visible {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
    .copy-tooltip .close-tip {
      margin-left: 10px;
      cursor: pointer;
      font-weight: bold;
      color: #ff6b6b;
    }

    /* Alert close button */
    #alertBox .close-alert {
      margin-left: 12px;
      cursor: pointer;
      font-weight: bold;
      color: #ff6b6b;
    }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
})();

// === Helpers ===
function showAlert(msg, timeout = 15000) {
  const box = document.getElementById('alertBox');
  const msgSpan = document.getElementById('alertMessage');
  if (!box || !msgSpan) return;

  // Add close button if not already added
  if (!box.querySelector('.close-alert')) {
    const closeBtn = document.createElement('span');
    closeBtn.textContent = '×';
    closeBtn.className = 'close-alert';
    closeBtn.setAttribute('role', 'button');
    closeBtn.title = 'Close';
    closeBtn.onclick = () => box.classList.add('hidden');
    box.appendChild(closeBtn);
  }

  msgSpan.textContent = msg;
  box.classList.remove('hidden');
  clearTimeout(box._t);
  box._t = setTimeout(() => box.classList.add('hidden'), timeout);
}

function showTooltip(tipEl, text, timeout = 15000) {
  if (!tipEl) return;

  tipEl.innerHTML = `${text} <span class="close-tip" title="Close">×</span>`;
  tipEl.classList.add('visible');

  const closeBtn = tipEl.querySelector('.close-tip');
  if (closeBtn) {
    closeBtn.onclick = () => tipEl.classList.remove('visible');
  }

  clearTimeout(tipEl._t);
  tipEl._t = setTimeout(() => tipEl.classList.remove('visible'), timeout);
}

function getTaskLink(card) {
  const link =
    card.querySelector('.task-text a[href]') ||
    card.querySelector('.task-details a[href]') ||
    card.querySelector('a[href]');
  return link ? link.href : null;
}

// === Main logic ===
function initCopyLinkButtons() {
  document.querySelectorAll('.task-card').forEach(card => {
    const header = card.querySelector('.task-header');
    if (!header || header.querySelector('.copy-link-btn')) return;

    header.style.position = header.style.position || 'relative';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-link-btn';
    btn.setAttribute('aria-label', 'Copy task link');
    btn.innerHTML = '<i class="fas fa-link" aria-hidden="true"></i><span>Copy Link</span>';

    const tip = document.createElement('span');
    tip.className = 'copy-tooltip';
    tip.textContent = 'Tap “Copy Link”, then open Chrome, tap the top bar, hold, and paste the link to continue.';

    header.appendChild(btn);
    header.appendChild(tip);

    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const href = getTaskLink(card);
      if (!href) {
        showTooltip(tip, 'No link available for this task.');
        showAlert('No link available for this task.');
        return;
      }

      try {
        await navigator.clipboard.writeText(href);
        showTooltip(tip, 'Link copied! Now open Chrome, tap the top bar, hold, and paste the link to continue.');
        showAlert('Link copied! Paste it into Chrome to continue.');
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = href;
        ta.style.position = 'fixed';
        ta.style.top = '-1000px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);

        if (ok) {
          showTooltip(tip, 'Link copied! Now open Chrome, tap the top bar, hold, and paste the link to continue.');
          showAlert('Link copied! Paste it into Chrome to continue.');
        } else {
          showTooltip(tip, 'Copy blocked. Long-press the link text instead and choose Copy.');
          showAlert('Copy blocked. Long-press the link text instead.');
        }
      }
    });
  });
}

// === Observe changes ===
const observer = new MutationObserver(() => initCopyLinkButtons());
document.addEventListener('DOMContentLoaded', () => {
  initCopyLinkButtons();
  observer.observe(document.getElementById('task-list') || document.body, {
    childList: true, subtree: true
  });
});