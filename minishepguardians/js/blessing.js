/* ═══════════════════════════════════════════════════════════════════════════════
   LINE OF PEARL™ — BLESSING SCROLL GENERATOR
   JESUS IS LORD™
   ═══════════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  const form = document.getElementById('blessingForm');
  const preview = document.getElementById('blessingPreview');
  const printBtn = document.getElementById('printBlessing');

  if (!form || !preview) return;

  /* ===== Form Submit Handler ===== */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    // Validate required fields
    if (!data.name || !data.spirit_name || !data.lineage || !data.verse || !data.spoken) {
      alert('Please fill in all required fields.');
      return;
    }

    // Generate preview
    preview.innerHTML = `
      <div class="blessing-scroll-output" id="blessingOutput">
        <header>
          <h3>Blessing Scroll</h3>
          <p class="subtitle">Line of Pearl™ — Guardians of the Bloodline™</p>
          <p class="lineage">${escapeHtml(data.lineage)}</p>
        </header>

        <section>
          <p><strong>Dog:</strong> ${escapeHtml(data.name)}</p>
          <p><strong>Spirit Name:</strong> ${escapeHtml(data.spirit_name)}</p>
          <p><strong>Covering Verse (NKJV):</strong> ${escapeHtml(data.verse)}</p>

          <blockquote>
            ${escapeHtml(data.spoken)}
          </blockquote>
        </section>

        <footer>
          <div class="signatures">
            <p><strong>Guardian:</strong> ${escapeHtml(data.guardian_sig || '_______________')}</p>
            <p><strong>Steward:</strong> ${escapeHtml(data.steward_sig || '_______________')}</p>
            <p class="date"><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div class="seal-container">
            <img src="glyphs/f2_stone_double_ring.svg" alt="F2 Generation Seal" class="seal" onerror="this.outerHTML='🛡️'">
          </div>
        </footer>

        <p class="footer-verse">"O LORD, You preserve man and beast." — Psalm 36:6 (NKJV)</p>
        <p class="footer-tag">🟢 JESUS IS LORD™</p>
      </div>
    `;

    // Add preview-specific styles
    addPreviewStyles();

    // Scroll to preview
    preview.scrollIntoView({ behavior: 'smooth' });

    // Show print button
    if (printBtn) {
      printBtn.style.display = 'inline-flex';
    }
  });

  /* ===== Print Handler ===== */
  if (printBtn) {
    printBtn.style.display = 'none'; // Hide until preview generated

    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  /* ===== Escape HTML ===== */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /* ===== Preview Styles ===== */
  function addPreviewStyles() {
    if (document.getElementById('blessing-preview-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'blessing-preview-styles';
    styles.textContent = `
      .blessing-scroll-output {
        text-align: center;
        font-family: var(--font-serif, Georgia, serif);
      }

      .blessing-scroll-output header {
        border-bottom: 2px solid var(--gold, #daa520);
        padding-bottom: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .blessing-scroll-output header h3 {
        font-size: 2rem;
        margin-bottom: 0.25rem;
        color: var(--ink, #2b2b2b);
      }

      .blessing-scroll-output header .subtitle {
        font-size: 0.9rem;
        color: var(--gold, #daa520);
        margin-bottom: 0.5rem;
      }

      .blessing-scroll-output header .lineage {
        font-size: 1rem;
        font-style: italic;
        color: var(--ink-soft, #4a4a4a);
      }

      .blessing-scroll-output section {
        text-align: left;
        padding: 1rem 0;
      }

      .blessing-scroll-output section p {
        margin-bottom: 0.75rem;
        font-family: var(--font-sans, sans-serif);
      }

      .blessing-scroll-output blockquote {
        margin: 1.5rem 0;
        padding: 1rem 1.5rem;
        background: var(--paper-2, #e8dcc4);
        border-left: 4px solid var(--gold, #daa520);
        border-radius: 0 var(--radius-sm, 8px) var(--radius-sm, 8px) 0;
        font-style: italic;
        font-size: 1.1rem;
        line-height: 1.6;
      }

      .blessing-scroll-output footer {
        border-top: 1px solid var(--paper-3, #d9c9a8);
        padding-top: 1.5rem;
        margin-top: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        text-align: left;
      }

      .blessing-scroll-output .signatures {
        font-family: var(--font-sans, sans-serif);
      }

      .blessing-scroll-output .signatures p {
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
      }

      .blessing-scroll-output .seal-container {
        text-align: right;
      }

      .blessing-scroll-output .seal {
        width: 64px;
        height: 64px;
      }

      .blessing-scroll-output .footer-verse {
        margin-top: 2rem;
        font-style: italic;
        font-size: 0.85rem;
        color: var(--ink-soft, #4a4a4a);
      }

      .blessing-scroll-output .footer-tag {
        font-size: 0.8rem;
        color: var(--gold, #daa520);
        margin-top: 0.5rem;
      }
    `;
    document.head.appendChild(styles);
  }

})();
