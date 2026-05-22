/* ============================================================
   PIXELMINT — main.js
   Handles: Preloader, Cursor, Navbar, Scroll Reveal,
            Tilt Effects, Counter Animation, Form, Back-to-top
   ============================================================ */

/* ── Preloader ── */
window.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hide');
    document.body.style.overflow = '';
  }, 2000);
  document.body.style.overflow = 'hidden';
});

/* ── Custom Cursor ── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  });

  // Laggy ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .service-card, .portfolio-item, .testimonial-card, .hero-card-service');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
})();

/* ── Sticky Navbar + Active Highlighting ── */
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a[data-section], .nav-mobile a[data-section]');
  const sections = Array.from(navLinks)
    .map(a => document.getElementById(a.getAttribute('data-section')))
    .filter(Boolean);

  // Scroll classes
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // Back to top button
    const btt = document.getElementById('back-to-top');
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);

    // Active section
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('data-section') === current);
    });
  }, { passive: true });

  // Mobile hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('nav-mobile');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }
})();

/* ── Scroll Reveal ── */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, +delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  // Stagger children of grids
  document.querySelectorAll('.services-grid, .testimonials-grid, .deliverables-list, .about-pillars').forEach(grid => {
    grid.querySelectorAll(':scope > *').forEach((child, idx) => {
      child.classList.add('reveal');
      child.dataset.delay = idx * 80;
    });
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
})();

/* ── Vanilla Tilt for portfolio cards ── */
(function initTilt() {
  function applyTilt(el) {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(4px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    });
    el.addEventListener('mouseenter', () => {
      el.style.transition = 'transform 0.1s linear';
    });
  }
  document.querySelectorAll('.service-card, .testimonial-card').forEach(applyTilt);
})();

/* ── Parallax on hero orbs ── */
(function initParallax() {
  const orbs = document.querySelectorAll('.hero-orb');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = i === 0 ? 0.15 : 0.08;
      orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
})();

/* ── Animated Counter ── */
(function initCounters() {
  const counters = document.querySelectorAll('.hero-stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      const dur    = 1800;
      const start  = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / dur, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ── Typewriter for hero subtitle ── */
(function initTypewriter() {
  const el = document.getElementById('hero-typewriter');
  if (!el) return;
  const texts = ['Brand Identity', 'Digital Presence', 'Creative Direction', 'Website Design'];
  let textIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const current = texts[textIndex];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        textIndex = (textIndex + 1) % texts.length;
      }
    }
    setTimeout(tick, deleting ? 60 : 100);
  }
  setTimeout(tick, 1200);
})();

/* ── Contact Form ── */
(function initForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    // Simulate submit
    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('show');
    }, 1400);
  });
})();

/* ── Back to Top ── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── Portfolio hover label ── */
(function initPortfolio() {
  // Keyboard accessibility
  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
  });
})();
