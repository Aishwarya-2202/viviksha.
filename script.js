/* ═══════════════════════════════════════════════════════════════════
   VIVIKSHA DESIGN STUDIO — script.js
   Premium interactions, animations, scroll reveals
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ── 1. SCROLL REVEAL (Intersection Observer) ──────────────────── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-scale'
  );

  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
})();

/* ── 2. NAVBAR: transparent → glassmorphism on scroll ─────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScrollY = 0;
  let ticking = false;

  function updateNav() {
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('scrolled', scrolled);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // Active link highlight
  const sections = ['home', 'about', 'services', 'archive', 'enquiry'];
  const navLinks = {
    home:    document.getElementById('nav-home'),
    about:   document.getElementById('nav-about'),
    services:document.getElementById('nav-services'),
    archive: document.getElementById('nav-archive'),
    enquiry: document.getElementById('nav-enquiry'),
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        Object.values(navLinks).forEach((l) => l && l.classList.remove('active-link'));
        if (navLinks[id]) navLinks[id].classList.add('active-link');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });
})();

/* ── 3. MOBILE NAV TOGGLE ──────────────────────────────────────── */
(function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();

/* ── 4. HERO PARALLAX ──────────────────────────────────────────── */
(function initHeroParallax() {
  const heroBg = document.getElementById('hero-bg');
  if (!heroBg) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const maxScroll = window.innerHeight;
        if (scrollY <= maxScroll) {
          const offset = scrollY * 0.35;
          heroBg.style.transform = `translateY(${offset}px)`;
          // Fade sketch as user scrolls
          const opacity = 1 - (scrollY / maxScroll) * 0.4;
          heroBg.style.opacity = Math.max(opacity, 0);
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ── 5. HERO CONTENT FADE ON SCROLL ───────────────────────────── */
(function initHeroContentFade() {
  const content = document.getElementById('hero-content');
  if (!content) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const maxFade = window.innerHeight * 0.5;
    if (scrollY < maxFade) {
      const fade = 1 - scrollY / maxFade;
      content.style.opacity = fade;
      content.style.transform = `translateY(${scrollY * 0.12}px)`;
    }
  }, { passive: true });
})();

/* ── 6. PORTFOLIO SLIDER ───────────────────────────────────────── */
(function initSlider() {
  const track  = document.getElementById('slider-track');
  const prev   = document.getElementById('slider-prev');
  const next   = document.getElementById('slider-next');
  const dots   = document.querySelectorAll('.slider-dot');
  const slides = document.querySelectorAll('.portfolio-slide');

  if (!track || !slides.length) return;

  let current = 0;
  let autoTimer = null;
  const total = slides.length;

  function goTo(index) {
    // Wrap
    current = ((index % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;

    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  prev && prev.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  next && next.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      stopAuto();
      goTo(parseInt(dot.dataset.slide, 10));
      startAuto();
    });
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX   = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      stopAuto();
      goTo(diff > 0 ? current + 1 : current - 1);
      startAuto();
    }
  }, { passive: true });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    const slider = document.getElementById('portfolio-slider');
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      if (e.key === 'ArrowLeft')  { stopAuto(); goTo(current - 1); startAuto(); }
      if (e.key === 'ArrowRight') { stopAuto(); goTo(current + 1); startAuto(); }
    }
  });

  startAuto();
})();

/* ── 7. ARCHIVE FILTER ─────────────────────────────────────────── */
(function initArchiveFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const tiles = document.querySelectorAll('.archive-tile');

  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;

      tiles.forEach((tile) => {
        const cat = tile.dataset.category;
        const show = filter === 'all' || cat === filter;

        if (show) {
          tile.classList.remove('hidden');
          // Re-trigger scale animation
          tile.classList.remove('visible');
          void tile.offsetWidth; // reflow
          setTimeout(() => tile.classList.add('visible'), 10);
        } else {
          tile.classList.add('hidden');
        }
      });
    });
  });
})();

/* ── 8. ENQUIRY FORM ───────────────────────────────────────────── */
(function initEnquiryForm() {
  const form  = document.getElementById('enquiry-form');
  const toast = document.getElementById('toast');
  if (!form) return;

  // Animate label on focus
  form.querySelectorAll('.form-input').forEach((input) => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });

  function showToast(msg) {
    if (!toast) return;
    const msgEl = toast.querySelector('.toast-msg');
    if (msgEl) msgEl.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4500);
  }

form.addEventListener('submit', (e) => {

  const name  = document.getElementById('field-name');
  const email = document.getElementById('field-email');
  const type  = document.getElementById('field-type');

  let valid = true;

  [name, email, type].forEach((field) => {
    if (!field.value.trim()) {
      field.style.borderBottomColor = '#c0392b';
      valid = false;

      setTimeout(() => {
        field.style.borderBottomColor = '';
      }, 2000);
    }
  });

  if (!valid) {
    e.preventDefault();
    showToast('Please fill in the required fields.');
    return;
  }

  const submitBtn = document.getElementById('form-submit');

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Sending...';
  }

});   // <-- semicolon here

})(); // <-- closes initEnquiryForm

/* ── 9. SMOOTH SECTION TRANSITIONS ────────────────────────────── */
(function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ── 10. SERVICE CARD KEYBOARD ACCESSIBILITY ───────────────────── */
(function initServiceCards() {
  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('expanded');
      }
    });
  });
})();

/* ── 11. HERO ENTRY ANIMATIONS TRIGGER ────────────────────────── */
(function initHeroReveal() {
  // Stagger hero reveals after a brief delay
  setTimeout(() => {
    document.querySelectorAll('.hero-content .reveal-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150);
    });
  }, 300);
})();

/* ── 12. CURSOR GLOW EFFECT (desktop only) ─────────────────────── */
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(184,150,62,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease;
    mix-blend-mode: multiply;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let rafId = null;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animateCursor() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    rafId = requestAnimationFrame(animateCursor);
  }

  animateCursor();
})();

/* ── 13. ABOUT SECTION PARALLAX ─────────────────────────────────── */
(function initAboutParallax() {
  const aboutImg = document.querySelector('.about-main-img');
  if (!aboutImg) return;

  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;

  window.addEventListener('scroll', () => {
    const rect = aboutSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const progress = 1 - (rect.top / window.innerHeight);
      const offset = progress * 25 - 12;
      aboutImg.style.transform = `scale(1.04) translateY(${-offset}px)`;
    }
  }, { passive: true });
})();

/* ── 14. STATS COUNTER ANIMATION ─────────────────────────────── */
(function initCounters() {
  const chips = document.querySelectorAll('.chip-num');
  const targets = [100, 8];

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const target = targets[i] || parseInt(entry.target.textContent, 10);
        let current = 0;
        const increment = target / 40;
        const suffix = entry.target.textContent.includes('+') ? '+' : '';

        const counter = setInterval(() => {
          current = Math.min(current + increment, target);
          entry.target.textContent = Math.round(current) + suffix;
          if (current >= target) clearInterval(counter);
        }, 30);

        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  chips.forEach((chip) => counterObserver.observe(chip));
})();

/* ── 15. BLUEPRINT LINE HOVER DRAW ──────────────────────────────── */
(function initServiceCardDraw() {
  // Cards already handled via CSS hover — ensure fallback for touch
  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('touchstart', () => {
      card.classList.add('touch-hover');
    }, { passive: true });
    card.addEventListener('touchend', () => {
      setTimeout(() => card.classList.remove('touch-hover'), 1000);
    });
  });
})();

/* ── INIT ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Apply active-link style
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active-link::after { width: 100% !important; }
    .service-card.touch-hover .card-services { max-height: 200px !important; }
    .form-group.focused .form-label { color: var(--forest); }
  `;
  document.head.appendChild(style);

  // Preload about image
  const aboutImg = new Image();
  aboutImg.src = 'images/realistic.jpg';

  console.log('%c✦ Viviksha Design Studio', 'font-size:18px;font-family:serif;color:#2C4A3E;font-style:italic;');
  console.log('%c"Desire for Knowledge" — Built with wisdom & intention.', 'font-size:12px;color:#B8963E;');
});
