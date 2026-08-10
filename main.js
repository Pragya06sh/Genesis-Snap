/* ============================================
   GENESIS SNAP — Main JavaScript
   Scroll-synced video, Intersection Observer,
   Navbar, Mobile Menu, Animated Counters
   ============================================ */

(function () {
  'use strict';

  // ---- DOM References ----
  const video = document.getElementById('hero-video');
  const heroSection = document.querySelector('.hero');
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.navbar__toggle');
  const navLinks = document.querySelector('.navbar__links');
  const preloader = document.querySelector('.preloader');

  // ---- State ----
  let ticking = false;
  let videoReady = false;

  // ---- Preloader ----
  function hidePreloader() {
    setTimeout(() => {
      if (preloader) preloader.classList.add('hidden');
    }, 600);
  }

  // Wait for video to be ready, or timeout after 4s
  if (video) {
    video.pause();
    video.currentTime = 0;

    const onVideoReady = () => {
      videoReady = true;
      video.pause();
      video.currentTime = 0;
      syncVideoToScroll();
    };

    if (video.readyState >= 2) {
      onVideoReady();
    } else {
      video.addEventListener('loadeddata', onVideoReady, { once: true });
    }

    // Handle video load errors gracefully
    video.addEventListener('error', () => {
      console.warn('Hero video failed to load. Continuing without scroll-sync video.');
      videoReady = false;
    }, { once: true });
  }

  window.addEventListener('load', () => {
    hidePreloader();
  });

  // Fallback: hide preloader after 4s even if load event is slow
  setTimeout(hidePreloader, 4000);

  // ---- Scroll-Synced Video Playback ----
  function syncVideoToScroll() {
    if (!video || !heroSection || !videoReady) return;
    if (!video.duration || !isFinite(video.duration)) return;

    const heroRect = heroSection.getBoundingClientRect();
    const heroHeight = heroSection.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollable = heroHeight - windowHeight;

    if (scrollable <= 0) return;

    const scrollY = window.scrollY;
    const progress = Math.min(Math.max(scrollY / scrollable, 0), 1);
    const targetTime = progress * video.duration;

    // Only update if difference is meaningful (prevents jitter)
    if (Math.abs(video.currentTime - targetTime) > 0.015) {
      video.currentTime = targetTime;
    }
  }

  // ---- Navbar Scroll Effect ----
  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // ---- Mobile Menu Toggle ----
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // ---- Intersection Observer for Reveal Animations ----
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .web-sling-in, .web-sling-in-right'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Animated Counters ----
  const counterElements = document.querySelectorAll('[data-count]');
  const countedSet = new Set();

  function animateCounter(el) {
    if (countedSet.has(el)) return;
    countedSet.add(el);

    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    }

    requestAnimationFrame(updateCount);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counterElements.forEach(el => counterObserver.observe(el));

  // ---- Smooth Scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Parallax Subtle Layers ----
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  function handleParallax() {
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const windowCenter = window.innerHeight / 2;
      const offset = (centerY - windowCenter) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }

  // ---- Master Scroll Handler (RAF throttled) ----
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        syncVideoToScroll();
        handleNavbarScroll();
        handleParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ---- Keyboard Accessibility ----
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.classList.remove('menu-open');
    }
  });

  // ---- Initial setup ----
  syncVideoToScroll();
  handleNavbarScroll();

})();
