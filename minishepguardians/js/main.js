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

  /* ===== Lightbox Gallery with Caching ===== */
  const imageCache = new Map();

  function preloadImage(src) {
    if (imageCache.has(src)) {
      return Promise.resolve(imageCache.get(src));
    }
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        imageCache.set(src, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  function initLightbox() {
    // Create lightbox DOM if not exists
    if (document.getElementById('lightbox-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'lightbox-overlay';
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image viewer');
    overlay.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close image viewer">&times;</button>
        <div class="lightbox-image-container">
          <div class="lightbox-loader">Loading...</div>
          <img class="lightbox-image" src="" alt="" />
        </div>
        <div class="lightbox-info">
          <h3 class="lightbox-title"></h3>
          <p class="lightbox-description"></p>
          <a class="lightbox-download btn btn-primary" href="" download>
            <span>⬇</span> Download Full Image
          </a>
        </div>
        <button class="lightbox-nav lightbox-prev" aria-label="Previous image">‹</button>
        <button class="lightbox-nav lightbox-next" aria-label="Next image">›</button>
      </div>
    `;
    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector('.lightbox-close');
    const imgEl = overlay.querySelector('.lightbox-image');
    const loader = overlay.querySelector('.lightbox-loader');
    const title = overlay.querySelector('.lightbox-title');
    const desc = overlay.querySelector('.lightbox-description');
    const downloadBtn = overlay.querySelector('.lightbox-download');
    const prevBtn = overlay.querySelector('.lightbox-prev');
    const nextBtn = overlay.querySelector('.lightbox-next');

    let currentItems = [];
    let currentIndex = 0;

    function closeLightbox() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      imgEl.src = '';
    }

    function showImage(index) {
      if (index < 0 || index >= currentItems.length) return;
      currentIndex = index;

      const item = currentItems[index];
      const fullSrc = item.dataset.fullSrc || item.querySelector('img')?.src || '';
      const thumbSrc = item.querySelector('img')?.src || '';
      const itemTitle = item.dataset.title || item.querySelector('h3')?.textContent || 'Image';
      const itemDesc = item.dataset.description || item.querySelector('.verse')?.textContent || '';

      // Show loader
      loader.style.display = 'block';
      imgEl.style.opacity = '0';

      // Update info
      title.textContent = itemTitle;
      desc.textContent = itemDesc;
      downloadBtn.href = fullSrc || thumbSrc;
      downloadBtn.download = itemTitle.replace(/[^a-z0-9]/gi, '_') + '.jpg';

      // Load and show image (use full or thumb)
      const srcToLoad = fullSrc || thumbSrc;
      preloadImage(srcToLoad).then(() => {
        imgEl.src = srcToLoad;
        imgEl.alt = itemTitle;
        loader.style.display = 'none';
        imgEl.style.opacity = '1';
      }).catch(() => {
        loader.textContent = 'Failed to load image';
      });

      // Update nav visibility
      prevBtn.style.display = currentItems.length > 1 ? 'flex' : 'none';
      nextBtn.style.display = currentItems.length > 1 ? 'flex' : 'none';
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === currentItems.length - 1;

      // Preload adjacent images
      if (index > 0) {
        const prevItem = currentItems[index - 1];
        preloadImage(prevItem.dataset.fullSrc || prevItem.querySelector('img')?.src || '');
      }
      if (index < currentItems.length - 1) {
        const nextItem = currentItems[index + 1];
        preloadImage(nextItem.dataset.fullSrc || nextItem.querySelector('img')?.src || '');
      }
    }

    function openLightbox(items, startIndex) {
      currentItems = Array.from(items);
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      showImage(startIndex);
    }

    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeLightbox();
    });
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });

    // Expose openLightbox globally
    window.openLightbox = openLightbox;

    // Auto-attach to gallery slides
    document.querySelectorAll('.gallery-slide').forEach((slide, index, slides) => {
      slide.style.cursor = 'pointer';
      slide.setAttribute('role', 'button');
      slide.setAttribute('tabindex', '0');
      slide.addEventListener('click', () => openLightbox(slides, index));
      slide.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(slides, index);
        }
      });
    });

    // Auto-attach to any .lightbox-trigger elements
    document.querySelectorAll('.lightbox-trigger').forEach((trigger, index, triggers) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(triggers, index);
      });
    });
  }

  /* ===== Initialize All ===== */
  function init() {
    renderPathGrid();
    initGallery();
    initLightbox();
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
