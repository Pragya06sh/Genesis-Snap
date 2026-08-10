/* ============================================
   GENESIS SNAP — Countdown Timer
   Counts down to hackathon date: Aug 22, 2026
   ============================================ */

(function () {
  'use strict';

  const TARGET_DATE = new Date('2026-08-22T09:00:00+05:30').getTime();

  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minsEl = document.getElementById('countdown-mins');
  const secsEl = document.getElementById('countdown-secs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  // Apply transition to countdown numbers so animateNumber() works visually
  [daysEl, hoursEl, minsEl, secsEl].forEach(el => {
    el.style.transition = 'transform 0.15s ease, opacity 0.15s ease';
    el.style.display = 'inline-block';
  });

  let eventLiveShown = false;

  function pad(n) {
    return n < 10 ? '0' + n : n.toString();
  }

  function updateCountdown() {
    const now = Date.now();
    const diff = TARGET_DATE - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';

      // Show "Event Started" message (only once)
      if (!eventLiveShown) {
        eventLiveShown = true;
        const countdownSection = document.querySelector('.countdown');
        if (countdownSection) {
          const msg = document.createElement('div');
          msg.className = 'countdown__live';
          msg.innerHTML = '<span class="pulse-glow" style="display:inline-block;padding:0.5rem 1.5rem;border-radius:var(--radius-sm);background:var(--clr-red);color:#fff;font-family:var(--font-heading);font-size:0.8rem;letter-spacing:0.2em;">🔴 EVENT IS LIVE</span>';
          msg.style.marginTop = '1rem';
          countdownSection.appendChild(msg);
        }
      }
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    // Animate number change
    animateNumber(daysEl, pad(days));
    animateNumber(hoursEl, pad(hours));
    animateNumber(minsEl, pad(mins));
    animateNumber(secsEl, pad(secs));
  }

  function animateNumber(el, newValue) {
    if (el.textContent !== newValue) {
      el.style.transform = 'translateY(-5px)';
      el.style.opacity = '0.5';
      setTimeout(() => {
        el.textContent = newValue;
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      }, 120);
    }
  }

  // Initial update
  updateCountdown();

  // Update every second
  setInterval(updateCountdown, 1000);

})();
