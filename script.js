/* ============================================================
   script.js — Dark mode toggle + mobile nav + active nav links
   ============================================================ */

(function () {
  'use strict';

  /* --------------------------------------------------------
     1. Dark / Light Mode
  -------------------------------------------------------- */
  const html = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const iconSun = document.getElementById('icon-sun');
  const iconMoon = document.getElementById('icon-moon');

  function applyTheme(dark) {
    if (dark) {
      html.setAttribute('data-theme', 'dark');
      iconSun.style.display = 'block';
      iconMoon.style.display = 'none';
      toggleBtn.setAttribute('aria-label', 'Activer le mode clair');
    } else {
      html.removeAttribute('data-theme');
      iconSun.style.display = 'none';
      iconMoon.style.display = 'block';
      toggleBtn.setAttribute('aria-label', 'Activer le mode sombre');
    }
  }

  function getPreferred() {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  applyTheme(getPreferred());

  toggleBtn.addEventListener('click', function () {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const next = !isDark;
    localStorage.setItem('theme', next ? 'dark' : 'light');
    applyTheme(next);
  });

  /* --------------------------------------------------------
     2. Navbar scroll shadow
  -------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 8) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  /* --------------------------------------------------------
     3. Mobile hamburger nav
  -------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  hamburger.addEventListener('click', function () {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close mobile nav when a link is clicked
  mobileNav.querySelectorAll('.navbar-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* --------------------------------------------------------
     4. Active nav link on scroll (IntersectionObserver)
  -------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.navbar-links .navbar-link[href^="#"]');
  const mobileLinks = document.querySelectorAll('#mobile-nav .navbar-link[href^="#"]');
  const allNavLinks = [...desktopLinks, ...mobileLinks];

  function setActive(id) {
    allNavLinks.forEach(function (link) {
      if (link.getAttribute('href') === '#' + id) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  let currentActive = null;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        currentActive = entry.target.id;
        setActive(currentActive);
      }
    });
  }, observerOptions);

  sections.forEach(function (section) {
    observer.observe(section);
  });

  /* --------------------------------------------------------
     5. Smooth scroll for anchor links with offset (sticky nav)
  -------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

}());
