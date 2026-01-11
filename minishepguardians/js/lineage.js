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
        fetch('data/line_of_pearl_registry.json'),
        fetch('data/lineage_config.json')
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

    node.innerHTML = `
      <span class="generation-badge">${dog.generation}</span>
      <span class="photo-emoji">${dog.status === 'at_rest' ? '🕯️' : '🐕'}</span>
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

    // Order generations: F0, F1, F2.1, F2.2
    const genOrder = ['F0', 'F1', 'F2.1', 'F2.2'];

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
      .lineage-row {
        display: flex;
        align-items: flex-start;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px dashed var(--paper-3, #d9c9a8);
      }

      .lineage-row:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }

      .generation-label {
        min-width: 60px;
        font-family: var(--font-serif, Georgia, serif);
        font-weight: 700;
        font-size: 0.9rem;
        color: var(--gold, #daa520);
        padding-top: 1rem;
      }

      .generation-nodes {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        flex: 1;
      }

      .lineage-node {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        background: var(--paper, #f7f1e3);
        border-radius: var(--radius, 14px);
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        min-width: 120px;
        text-align: center;
      }

      .lineage-node:hover,
      .lineage-node:focus {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      .lineage-node:focus-visible {
        outline: 2px solid var(--gold, #daa520);
        outline-offset: 2px;
      }

      .lineage-node.at-rest {
        opacity: 0.8;
        background: var(--paper-2, #e8dcc4);
      }

      .lineage-node .generation-badge {
        font-size: 0.65rem;
        background: var(--gold, #daa520);
        color: white;
        padding: 0.1rem 0.4rem;
        border-radius: 4px;
        margin-bottom: 0.5rem;
      }

      .lineage-node .photo-emoji {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }

      .lineage-node .name {
        font-family: var(--font-serif, Georgia, serif);
        font-weight: 700;
        font-size: 1rem;
      }

      .lineage-node .spirit-name {
        font-size: 0.75rem;
        font-style: italic;
        color: var(--ink-soft, #4a4a4a);
        margin-top: 0.25rem;
      }

      .founder-row .lineage-node {
        background: linear-gradient(135deg, var(--paper, #f7f1e3) 0%, var(--gold-soft, #e7c96c) 100%);
      }

      @media (max-width: 600px) {
        .lineage-row {
          flex-direction: column;
          gap: 0.75rem;
        }

        .generation-label {
          padding-top: 0;
        }

        .generation-nodes {
          width: 100%;
          justify-content: center;
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
