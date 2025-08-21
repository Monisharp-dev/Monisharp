// === Inject CSS dynamically ===
(function injectCopyLinkCSS() {
  const css = `
    .copy-link-btn {
      background: #2563eb;
      color: #fff;
      border: none;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background .25s;
    }
    .copy-link-btn:hover {
      background: #1e40af;
    }
    .copy-link-btn i { font-size: 0.9rem; }

    /* Tooltip styling */
    .copy-tooltip {
      margin-top: 6px;
      background: #111827;
      color: #f9fafb;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
      opacity: 0;
      pointer-events: none;
      transform: translateY(-6px);
      transition: opacity .25s ease, transform .25s ease;
      max-width: 260px;
      line-height: 1.4;
      box-shadow: 0 2px 8px rgba(0,0,0,.35);
      position: absolute;
      right: 20px;
      z-index: 5;
    }
    .copy-tooltip.visible {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
    .copy-tooltip .close-tip {
      margin-left: 8px;
      cursor: pointer;
      font-weight: bold;
      color: #f87171;
    }

    /* Task header flex fix */
    .task-header {
      justify-content: space-between;
      position: relative;
    }
    .task-header-left {
      display: flex;
      gap: 15px;
      flex: 1;
      align-items: flex-start;
    }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
})();

// === Helpers ===
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

    // restructure header for left/right alignment
    const img = header.querySelector('img');
    const text = header.querySelector('.task-text');

    const left = document.createElement('div');
    left.className = 'task-header-left';
    if (img) left.appendChild(img);
    if (text) left.appendChild(text);

    header.innerHTML = ''; // clear
    header.appendChild(left);

    // add copy button
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-link-btn';
    btn.innerHTML = '<i class="fas fa-link"></i> Copy Link';
    header.appendChild(btn);

    // tooltip
    const tip = document.createElement('span');
    tip.className = 'copy-tooltip';
    header.appendChild(tip);

    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const href = getTaskLink(card);
      if (!href) {
        showTooltip(tip, 'No link available for this task.');
        return;
      }

      try {
        await navigator.clipboard.writeText(href);
        showTooltip(tip, 'Link copied! Open Chrome, tap the top bar, hold, and paste to continue.');
      } catch (_) {
        showTooltip(tip, 'Copy blocked. Long-press the link text instead and choose Copy.');
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