/* ═══════════════════════════════════════════════════════════════════════════════
   LINE OF PEARL™ — MAIN JAVASCRIPT
   JESUS IS LORD™
   ═══════════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ===== Path Grid Renderer ===== */
  async function renderPathGrid() {
    const grid = document.getElementById('path-grid');
    if (!grid) return;

    try {
      const res = await fetch('data/pathways.json');
      const { paths } = await res.json();

      grid.innerHTML = paths.map(p => {
        const isComingSoon = p.phase !== 'v1';
        const classes = `path-tile${isComingSoon ? ' coming-soon' : ''}`;
        const href = isComingSoon ? '#' : p.target;
        const tabIndex = isComingSoon ? 'tabindex="-1"' : '';

        return `
          <a class="${classes}" href="${href}" ${tabIndex} data-path-id="${p.id}">
            <h3>${p.title}</h3>
            <p>${p.desc}</p>
            <span class="cta">${p.cta} →</span>
          </a>
        `;
      }).join('');

      // Handle coming soon clicks
      grid.querySelectorAll('.path-tile.coming-soon').forEach(tile => {
        tile.addEventListener('click', (e) => {
          e.preventDefault();
          showComingSoon(tile.querySelector('h3').textContent);
        });
      });

    } catch (err) {
      console.warn('Could not load pathways:', err);
      grid.innerHTML = `
        <div class="coming-soon-card">
          <h3>Pathways Loading...</h3>
          <p>Please refresh the page or check back soon.</p>
        </div>
      `;
    }
  }

  function showComingSoon(title) {
    // Simple alert for now; can be replaced with modal
    alert(`"${title}" is coming soon. Thank you for your patience.`);
  }

  /* ===== Horizontal Gallery ===== */
  function initGallery() {
    const container = document.querySelector('.gallery-scroll');
    if (!container) return;

    const slides = container.querySelectorAll('.gallery-slide');
    const dotsContainer = document.querySelector('.gallery-dots');
    const prevBtn = document.querySelector('.gallery-btn.prev');
    const nextBtn = document.querySelector('.gallery-btn.next');

    if (!slides.length) return;

    let currentIndex = 0;

    // Create dots
    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `gallery-dot${i === 0 ? ' active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });
    }

    function goToSlide(index) {
      if (index < 0) index = 0;
      if (index >= slides.length) index = slides.length - 1;

      currentIndex = index;
      slides[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      updateDots();
    }

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.querySelectorAll('.gallery-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    // Button handlers
    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    }

    // Keyboard navigation
    container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToSlide(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToSlide(currentIndex + 1);
      }
    });

    // Update dots on scroll
    let scrollTimeout;
    container.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const slideWidth = slides[0].offsetWidth + 24; // gap
        const newIndex = Math.round(container.scrollLeft / slideWidth);
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < slides.length) {
          currentIndex = newIndex;
          updateDots();
        }
      }, 100);
    });
  }

  /* ===== Accessibility Toggles ===== */
  function initAccessibilityToggles() {
    const reduceMotion = document.getElementById('reduceMotion');
    const highContrast = document.getElementById('highContrast');

    if (reduceMotion) {
      // Check saved preference
      if (localStorage.getItem('reduceMotion') === 'true') {
        reduceMotion.checked = true;
        document.documentElement.setAttribute('data-reduce-motion', 'true');
      }

      reduceMotion.addEventListener('change', (e) => {
        document.documentElement.toggleAttribute('data-reduce-motion', e.target.checked);
        localStorage.setItem('reduceMotion', e.target.checked);
      });
    }

    if (highContrast) {
      // Check saved preference
      if (localStorage.getItem('highContrast') === 'true') {
        highContrast.checked = true;
        document.documentElement.setAttribute('data-high-contrast', 'true');
      }

      highContrast.addEventListener('change', (e) => {
        document.documentElement.toggleAttribute('data-high-contrast', e.target.checked);
        localStorage.setItem('highContrast', e.target.checked);
      });
    }
  }

  /* ===== Back to Top Button ===== */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    function toggleVisibility() {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== Smooth Scroll for Anchor Links ===== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      });
    });
  }

  /* ===== Accordion Enhancement ===== */
  function initAccordions() {
    // Ensure only one accordion is open at a time (optional)
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(accordion => {
      accordion.addEventListener('click', (e) => {
        const summary = e.target.closest('summary');
        if (!summary) return;

        // Close other details in this accordion
        const parentDetails = summary.parentElement;
        accordion.querySelectorAll('details[open]').forEach(details => {
          if (details !== parentDetails) {
            details.removeAttribute('open');
          }
        });
      });
    });
  }

  /* ===== Initialize All ===== */
  function init() {
    renderPathGrid();
    initGallery();
    initAccessibilityToggles();
    initBackToTop();
    initSmoothScroll();
    initAccordions();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
