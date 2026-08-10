/* ============================================
   GENESIS SNAP — Animations Engine
   Thunder, Web Canvas, Floating Particles
   ============================================ */

(function () {
  'use strict';

  // ===== THUNDER / LIGHTNING SYSTEM =====
  const thunderFlash = document.querySelector('.thunder-flash');
  const heroThunder = document.querySelector('.hero__thunder-overlay');

  function triggerThunder() {
    if (thunderFlash) {
      thunderFlash.classList.add('active');
      setTimeout(() => thunderFlash.classList.remove('active'), 200);
    }
    if (heroThunder) {
      heroThunder.style.opacity = '1';
      setTimeout(() => { heroThunder.style.opacity = '0.6'; }, 50);
      setTimeout(() => { heroThunder.style.opacity = '0.9'; }, 120);
      setTimeout(() => { heroThunder.style.opacity = '0'; }, 250);
    }
  }

  // Random thunder at intervals
  function scheduleThunder() {
    const delay = 4000 + Math.random() * 10000; // 4-14 seconds
    setTimeout(() => {
      triggerThunder();
      // Sometimes double-strike
      if (Math.random() > 0.6) {
        setTimeout(triggerThunder, 200 + Math.random() * 300);
      }
      scheduleThunder();
    }, delay);
  }

  scheduleThunder();


  // ===== SPIDER WEB CANVAS =====
  const canvas = document.getElementById('web-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let webPoints = [];
    let mouseX = 0, mouseY = 0;
    let animationId;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initWebPoints();
    }

    function initWebPoints() {
      webPoints = [];
      const count = Math.floor((width * height) / 25000); // density based on screen
      for (let i = 0; i < count; i++) {
        webPoints.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.3 + 0.1
        });
      }
    }

    function drawWeb() {
      ctx.clearRect(0, 0, width, height);

      // Update and draw points
      webPoints.forEach(point => {
        point.x += point.vx;
        point.y += point.vy;

        // Wrap around edges
        if (point.x < 0) point.x = width;
        if (point.x > width) point.x = 0;
        if (point.y < 0) point.y = height;
        if (point.y > height) point.y = 0;

        // Draw point
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 23, 68, ${point.opacity})`;
        ctx.fill();
      });

      // Draw connections (web lines)
      const connectionDistance = 120;
      for (let i = 0; i < webPoints.length; i++) {
        for (let j = i + 1; j < webPoints.length; j++) {
          const dx = webPoints[i].x - webPoints[j].x;
          const dy = webPoints[i].y - webPoints[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(webPoints[i].x, webPoints[i].y);
            ctx.lineTo(webPoints[j].x, webPoints[j].y);
            ctx.strokeStyle = `rgba(255, 23, 68, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Mouse interaction - draw web from cursor
      const mouseConnectionDist = 180;
      webPoints.forEach(point => {
        const dx = point.x - mouseX;
        const dy = point.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseConnectionDist) {
          const opacity = (1 - dist / mouseConnectionDist) * 0.25;
          ctx.beginPath();
          ctx.moveTo(mouseX, mouseY);
          ctx.lineTo(point.x, point.y);
          ctx.strokeStyle = `rgba(68, 138, 255, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(drawWeb);
    }

    // Only animate when hero is visible
    const heroSticky = document.querySelector('.hero__sticky');
    const canvasObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!animationId) drawWeb();
          } else {
            cancelAnimationFrame(animationId);
            animationId = null;
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroSticky) canvasObserver.observe(heroSticky);

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  }


  // ===== FLOATING PARTICLES =====
  function createParticles(container, count = 15) {
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDuration = (3 + Math.random() * 5) + 's';
      particle.style.animationDelay = (Math.random() * 5) + 's';

      // Randomize color between red and blue
      if (Math.random() > 0.5) {
        particle.style.background = 'var(--clr-blue-accent)';
      }

      container.appendChild(particle);
    }
  }

  // Add particles to sections
  document.querySelectorAll('.section').forEach(section => {
    createParticles(section, 8);
  });


  // ===== WEB CORNER SVG GENERATION =====
  function createWebCornerSVG() {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 120 120');
    svg.setAttribute('width', '120');
    svg.setAttribute('height', '120');
    svg.style.width = '100%';
    svg.style.height = '100%';

    // Radial web lines from corner
    const lines = 6;
    for (let i = 0; i <= lines; i++) {
      const angle = (Math.PI / 2) * (i / lines);
      const x2 = Math.cos(angle) * 120;
      const y2 = Math.sin(angle) * 120;

      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', '0');
      line.setAttribute('y1', '0');
      line.setAttribute('x2', x2.toString());
      line.setAttribute('y2', y2.toString());
      line.setAttribute('stroke', 'rgba(255, 255, 255, 0.3)');
      line.setAttribute('stroke-width', '0.5');
      svg.appendChild(line);
    }

    // Concentric arcs
    const arcs = 4;
    for (let i = 1; i <= arcs; i++) {
      const r = (120 / arcs) * i;
      const arc = document.createElementNS(svgNS, 'path');
      const d = `M ${r} 0 A ${r} ${r} 0 0 1 0 ${r}`;
      arc.setAttribute('d', d);
      arc.setAttribute('fill', 'none');
      arc.setAttribute('stroke', 'rgba(255, 255, 255, 0.2)');
      arc.setAttribute('stroke-width', '0.5');
      svg.appendChild(arc);
    }

    return svg;
  }

  document.querySelectorAll('.web-corner').forEach(corner => {
    corner.appendChild(createWebCornerSVG());
  });


  // ===== CURSOR TRAIL (Subtle Web Thread) =====
  let trailTimeout;
  const trailContainer = document.createElement('div');
  trailContainer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;overflow:hidden;';
  document.body.appendChild(trailContainer);

  document.addEventListener('mousemove', (e) => {
    clearTimeout(trailTimeout);

    const dot = document.createElement('div');
    dot.style.cssText = `
      position: absolute;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: rgba(255, 23, 68, 0.4);
      pointer-events: none;
      transition: all 0.8s ease-out;
    `;
    trailContainer.appendChild(dot);

    requestAnimationFrame(() => {
      dot.style.opacity = '0';
      dot.style.transform = 'scale(0)';
    });

    setTimeout(() => dot.remove(), 800);

    // Cleanup old dots periodically
    trailTimeout = setTimeout(() => {
      while (trailContainer.children.length > 20) {
        trailContainer.removeChild(trailContainer.firstChild);
      }
    }, 100);
  });

})();
