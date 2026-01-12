/* ═══════════════════════════════════════════════════════════════════════════════
   LINE OF PEARL™ — LINEAGE TREE RENDERER
   JESUS IS LORD™
   ═══════════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  let registryData = null;
  let config = null;

  /* ===== Load Data ===== */
  async function loadData() {
    try {
      const [registryRes, configRes] = await Promise.all([
        fetch('data/line_of_pearl_registry.json?v=' + Date.now()),
        fetch('data/lineage_config.json?v=' + Date.now())
      ]);

      registryData = await registryRes.json();
      config = await configRes.json();

      return true;
    } catch (err) {
      console.warn('Could not load lineage data:', err);
      return false;
    }
  }

  /* ===== Go To Profile ===== */
  function goToProfile(id) {
    const el = document.querySelector(`[data-profile="${id}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    } else {
      // If no profile section, scroll to the gallery slide
      const slide = document.querySelector(`[data-dog-id="${id}"]`);
      if (slide) {
        slide.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    }
  }

  /* ===== Build Tree Node ===== */
  function createNode(dog) {
    const node = document.createElement('div');
    node.className = 'lineage-node';
    node.setAttribute('data-node-id', dog.id);
    node.setAttribute('role', 'button');
    node.setAttribute('tabindex', '0');
    node.setAttribute('aria-label', `${dog.name}, ${dog.spirit_name}. Click to view profile.`);

    const statusClass = dog.status === 'at_rest' ? 'at-rest' : '';

    // Use photo if available, otherwise emoji
    const photoSrc = dog.photos && dog.photos.length > 0 ? dog.photos[0] : null;
    const photoHtml = photoSrc
      ? `<img class="node-photo" src="${photoSrc}" alt="${dog.name}" loading="lazy">`
      : `<span class="photo-emoji">${dog.status === 'at_rest' ? '🕯️' : '🐕'}</span>`;

    node.innerHTML = `
      <span class="generation-badge">${dog.generation}</span>
      ${photoHtml}
      <span class="name">${dog.name}</span>
      <span class="spirit-name">${dog.spirit_name}</span>
    `;

    if (statusClass) {
      node.classList.add(statusClass);
    }

    // Click handler
    node.addEventListener('click', () => goToProfile(dog.id));

    // Keyboard handler
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToProfile(dog.id);
      }
    });

    return node;
  }

  /* ===== Build Generation Row ===== */
  function createGenerationRow(generation, dogs) {
    const row = document.createElement('div');
    row.className = 'lineage-row';
    row.setAttribute('data-generation', generation);

    const label = document.createElement('div');
    label.className = 'generation-label';
    label.textContent = generation;

    const nodes = document.createElement('div');
    nodes.className = 'generation-nodes';

    dogs.forEach(dog => {
      nodes.appendChild(createNode(dog));
    });

    row.appendChild(label);
    row.appendChild(nodes);

    return row;
  }

  /* ===== Render Tree ===== */
  function renderTree() {
    const container = document.getElementById('lineage-tree');
    if (!container || !registryData) return;

    // Clear loading state
    container.innerHTML = '';

    // Group dogs by generation
    const generations = {};
    registryData.dogs.forEach(dog => {
      const gen = dog.generation;
      if (!generations[gen]) {
        generations[gen] = [];
      }
      generations[gen].push(dog);
    });

    // Add founder separately at top
    if (registryData.founder) {
      const founderRow = createGenerationRow('Founder', [registryData.founder]);
      founderRow.classList.add('founder-row');
      container.appendChild(founderRow);
    }

    // Order generations: F0, F1.0, F2.0, F2.2
    const genOrder = ['F0', 'F1.0', 'F2.0', 'F2.2'];

    genOrder.forEach(gen => {
      if (generations[gen] && generations[gen].length > 0) {
        // Skip founder (Rocky) if already shown
        const dogs = generations[gen].filter(d => d.id !== registryData.founder?.id);
        if (dogs.length > 0) {
          container.appendChild(createGenerationRow(gen, dogs));
        }
      }
    });

    // Add tree styles inline for simplicity
    addTreeStyles();
  }

  /* ===== Tree Styles ===== */
  function addTreeStyles() {
    if (document.getElementById('lineage-tree-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'lineage-tree-styles';
    styles.textContent = `
      /* Tree Container - Vertical Centered Layout */
      .lineage-tree {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0;
      }

      /* Each Generation Row */
      .lineage-row {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        width: 100%;
      }

      /* Vertical connector line between generations */
      .lineage-row:not(:last-child)::after {
        content: '';
        display: block;
        width: 2px;
        height: 24px;
        background: var(--gold, #daa520);
        margin: 0 auto;
      }

      /* Generation Label - Centered Above Nodes */
      .generation-label {
        font-family: var(--font-serif, Georgia, serif);
        font-weight: 700;
        font-size: 0.85rem;
        color: var(--gold, #daa520);
        text-align: center;
        margin-bottom: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      /* Nodes Container - Centered */
      .generation-nodes {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1.5rem;
      }

      /* Individual Node Card */
      .lineage-node {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem 1.25rem;
        background: var(--paper, #f7f1e3);
        border-radius: var(--radius, 14px);
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        min-width: 130px;
        max-width: 160px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      .lineage-node:hover,
      .lineage-node:focus {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }

      .lineage-node:focus-visible {
        outline: 3px solid var(--gold, #daa520);
        outline-offset: 2px;
      }

      .lineage-node.at-rest {
        opacity: 0.85;
        background: var(--paper-2, #e8dcc4);
      }

      /* Generation Badge */
      .lineage-node .generation-badge {
        font-size: 0.65rem;
        background: var(--gold, #daa520);
        color: white;
        padding: 0.15rem 0.5rem;
        border-radius: 4px;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }

      /* Photo/Emoji */
      .lineage-node .photo-emoji {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
      }

      .lineage-node .node-photo {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 0.5rem;
        border: 3px solid var(--gold, #daa520);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      /* Name */
      .lineage-node .name {
        font-family: var(--font-serif, Georgia, serif);
        font-weight: 700;
        font-size: 1.1rem;
        color: var(--ink, #2b2b2b);
      }

      /* Spirit Name */
      .lineage-node .spirit-name {
        font-size: 0.75rem;
        font-style: italic;
        color: var(--ink-soft, #4a4a4a);
        margin-top: 0.25rem;
      }

      /* Special styling for F0 (Founder) */
      .lineage-row[data-generation="F0"] .lineage-node {
        background: linear-gradient(135deg, var(--paper, #f7f1e3) 0%, var(--gold-soft, #e7c96c) 100%);
        box-shadow: 0 6px 20px rgba(218, 165, 32, 0.25);
      }

      .lineage-row[data-generation="F0"] .lineage-node .node-photo {
        width: 100px;
        height: 100px;
        border-width: 4px;
      }

      /* Responsive */
      @media (max-width: 600px) {
        .generation-nodes {
          gap: 1rem;
        }

        .lineage-node {
          min-width: 110px;
          padding: 0.75rem 1rem;
        }

        .lineage-node .node-photo {
          width: 70px;
          height: 70px;
        }

        .lineage-row[data-generation="F0"] .lineage-node .node-photo {
          width: 80px;
          height: 80px;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  /* ===== Initialize ===== */
  async function init() {
    const container = document.getElementById('lineage-tree');
    if (!container) return;

    const loaded = await loadData();
    if (loaded) {
      renderTree();
    } else {
      container.innerHTML = `
        <div class="coming-soon-card">
          <h3>Lineage Tree</h3>
          <p>Could not load lineage data. Please refresh the page.</p>
        </div>
      `;
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for external use if needed
  window.LineageTree = {
    goToProfile,
    refresh: init
  };

})();
