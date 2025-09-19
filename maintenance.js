(function() {
  // Avoid injecting twice
  if (window.__maintenanceOverlayInjected) return;
  window.__maintenanceOverlayInjected = true;

  // --- Helper: create style + overlay markup ---
  const css = `
    /* Overlay container — highest z-index */
    #__maintenance_overlay {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(6,10,18,0.88);
      color: #fff;
      z-index: 2147483646; /* near max z-index */
      -webkit-font-smoothing:antialiased;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      pointer-events: auto; /* capture all input */
    }
    /* Visual card */
    #__maintenance_card {
      max-width: 760px;
      width: calc(100% - 48px);
      margin: 16px;
      background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02));
      border-radius: 12px;
      padding: 28px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.6);
      text-align: center;
      border: 1px solid rgba(255,255,255,0.06);
    }
    #__maintenance_card h1 {
      margin: 0 0 8px;
      font-size: 28px;
      letter-spacing: -0.2px;
    }
    #__maintenance_card p {
      margin: 0 0 18px;
      color: #d7e3ff;
      opacity: 0.95;
    }
    #__maintenance_card .time {
      font-weight: 600;
      color: #ffd966;
      margin-bottom: 14px;
    }
    #__maintenance_card button {
      background: #0b84ff;
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(11,132,255,0.26);
    }
    #__maintenance_card button:focus { outline: 3px solid rgba(11,132,255,0.18); }
    /* Prevent background animations & transitions */
    html, body, body *:not(#__maintenance_overlay):not(#__maintenance_overlay *) {
      animation-play-state: paused !important;
      transition: none !important;
    }
    /* Small responsive */
    @media (max-width:420px){
      #__maintenance_card { padding: 20px; }
      #__maintenance_card h1 { font-size: 20px; }
    }
  `;

  const html = `
    <div id="__maintenance_overlay" role="dialog" aria-modal="true" aria-labelledby="__maintenance_title">
      <div id="__maintenance_card" tabindex="0">
        <h1 id="__maintenance_title">Monisharp is under maintenance</h1>
        <p class="time">It will be restored by <strong>9:00 PM today</strong>.</p>
        <p>Please save your work. We apologize for the inconvenience — service will resume shortly.</p>
        <div>
          <button id="__maintenance_dismiss">Dismiss (Admins only)</button>
        </div>
      </div>
    </div>
  `;

  // Inject CSS
  const style = document.createElement('style');
  style.id = '__maintenance_style';
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  // Inject overlay markup
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper.firstElementChild);

  // Prevent background interaction: disable pointer-events and scrolling for body children except overlay
  const overlay = document.getElementById('__maintenance_overlay');
  const overlayCard = document.getElementById('__maintenance_card');

  // Disable body scroll
  const previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  // Make all other elements non-interactive (but keep overlay interactive)
  function disableBackgroundInteraction() {
    const children = Array.from(document.body.children);
    children.forEach(el => {
      if (el !== overlay) {
        el.__prevPointerEvents = el.style.pointerEvents;
        el.style.pointerEvents = 'none';
      }
    });
  }
  function restoreBackgroundInteraction() {
    const children = Array.from(document.body.children);
    children.forEach(el => {
      if (el !== overlay && el.__prevPointerEvents !== undefined) {
        el.style.pointerEvents = el.__prevPointerEvents;
        delete el.__prevPointerEvents;
      }
    });
  }
  disableBackgroundInteraction();

  // Pause and mute all <video> and <audio>
  const mediaElements = Array.from(document.querySelectorAll('video, audio'));
  const pausedMedia = [];
  mediaElements.forEach(m => {
    try {
      if (!m.paused) {
        m.pause();
        pausedMedia.push(m);
      }
      // mute to avoid stray sound from other sources
      m.__prevMuted = m.muted;
      m.muted = true;
    } catch (e) { /* ignore cross-origin or other errors */ }
  });

  // Best-effort: suspend requestAnimationFrame loops by replacing window.requestAnimationFrame temporarily
  const origRequestAnimationFrame = window.requestAnimationFrame;
  try {
    window.requestAnimationFrame = function(){ return 0; };
  } catch (e) {}

  // Block many user input events on the document (wheel, keydown, touchmove, pointerdown)
  const blockHandler = function(e) { e.stopImmediatePropagation(); /* allow overlay to receive events */ };
  const captureBlock = function(e) {
    // If event target is within overlay, allow it
    if (overlay.contains(e.target)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  };
  ['wheel','keydown','touchmove','pointerdown','mousedown','mouseup','click'].forEach(ev => {
    document.addEventListener(ev, captureBlock, { passive: false, capture: true });
  });

  // Focus trap: keep focus inside the overlay card
  overlayCard.focus();
  document.addEventListener('focus', function(ev) {
    if (!overlay.contains(ev.target)) {
      ev.stopPropagation();
      overlayCard.focus();
    }
  }, true);

  // Provide a safe admin dismiss button (will remove overlay and restore states)
  function removeOverlay() {
    // restore body overflow
    document.body.style.overflow = previousBodyOverflow || '';
    // restore pointer events
    restoreBackgroundInteraction();
    // unpause media & restore muted states
    pausedMedia.forEach(m => { try { m.play().catch(()=>{}); } catch(e){} });
    mediaElements.forEach(m => { if (m.__prevMuted !== undefined) m.muted = m.__prevMuted; delete m.__prevMuted; });
    // restore requestAnimationFrame
    try { window.requestAnimationFrame = origRequestAnimationFrame; } catch(e){}
    // remove event listeners
    ['wheel','keydown','touchmove','pointerdown','mousedown','mouseup','click'].forEach(ev => {
      document.removeEventListener(ev, captureBlock, { capture: true });
    });
    document.removeEventListener('focus', () => {}, true);

    // remove elements
    const s = document.getElementById('__maintenance_style'); if (s) s.remove();
    const o = document.getElementById('__maintenance_overlay'); if (o) o.remove();
    delete window.__maintenanceOverlayInjected;
    // remove reference to remover
    try { delete window.removeMaintenanceOverlay; } catch(e) {}
  }

  // Expose removal function globally (admin can call)
  window.removeMaintenanceOverlay = removeOverlay;

  // Hook dismiss button (protected by a simple prompt)
  const dismissBtn = document.getElementById('__maintenance_dismiss');
  dismissBtn.addEventListener('click', function() {
    // basic confirm for admin: type "admin" to dismiss (prevent accidental clicks)
    const secret = prompt('Administrative dismiss — enter passphrase to remove overlay:');
    if (secret === 'admin' || secret === 'dismiss' || secret === 'MonisharpAdmin010101064') {
      removeOverlay();
    } else {
      alert('Incorrect passphrase. Overlay remains.');
    }
  });

  // Accessibility: announce to screen readers
  const live = document.createElement('div');
  live.setAttribute('aria-live','assertive');
  live.style.position = 'absolute';
  live.style.width = '1px';
  live.style.height = '1px';
  live.style.overflow = 'hidden';
  live.style.clip = 'rect(1px,1px,1px,1px)';
  live.style.whiteSpace = 'nowrap';
  live.textContent = 'Monisharp is under maintenance. It will be restored by 9pm today.';
  overlay.appendChild(live);

  // Keep overlay on top if some script tries to change z-index
  const zEnforcer = setInterval(() => {
    const o = document.getElementById('__maintenance_overlay');
    if (o) {
      const z = parseInt(window.getComputedStyle(o).zIndex || '0', 10);
      if (z < 2147483646) {
        o.style.zIndex = '2147483646';
      }
    } else {
      clearInterval(zEnforcer);
    }
  }, 500);

  // Informational console message
  console.info('Maintenance overlay injected. Call removeMaintenanceOverlay() from console to remove (admins only).');

})();