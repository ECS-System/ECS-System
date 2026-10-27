/* ==========================================================================
   A-GOLD RESOURCING / ECS SYSTEMS
   Core Application Script & Live Data Pipeline Simulator
   ========================================================================== */

// --- 1. Global Interactive Handlers ---

// Toggle expandable exposure cards
function toggleCard(cardElement) {
  if (!cardElement) return;
  cardElement.classList.toggle('active');
}

// Copy code snippets to clipboard
function copyCode(buttonElement) {
  const codeBlock = buttonElement.closest('.api-code-group') ? 
    buttonElement.closest('.api-code-group').querySelector('code, pre') : null;
  
  const textToCopy = codeBlock ? codeBlock.textContent : '';
  if (!textToCopy) return;

  navigator.clipboard.writeText(textToCopy).then(() => {
    const originalIcon = buttonElement.innerHTML;
    buttonElement.innerHTML = '<i class="fa-solid fa-check" style="color: var(--accent-emerald);"></i>';
    setTimeout(() => {
      buttonElement.innerHTML = originalIcon;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}

// Smooth scroll helper
function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (target) {
    const navHeight = 80;
    const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: elementPosition - navHeight,
      behavior: 'smooth'
    });
  }
}

// Tab switcher for code / previews
function switchModernTab(tabId, clickedButton) {
  const tabs = document.querySelectorAll('.modern-tab');
  tabs.forEach(tab => tab.classList.remove('active'));
  if (clickedButton) clickedButton.classList.add('active');

  const contents = document.querySelectorAll('.modern-tab-content');
  contents.forEach(content => content.style.display = 'none');

  const activeContent = document.getElementById('content-' + tabId);
  if (activeContent) activeContent.style.display = 'block';
}

// --- 2. Main DOM Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // --- Theme Toggle Engine (Light First Default) ---
  const themeToggles = document.querySelectorAll('.theme-btn');
  const savedTheme = localStorage.getItem('theme') || 'light';
  body.setAttribute('data-theme', savedTheme);

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  });

  // --- Mobile Drawer Menu ---
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.style.overflow = 'auto';
      });
    });
  }

  // --- Dynamic Year in Footer ---
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- 3. Live Interactive Data Pipeline Simulator ---
  initDataPipelineSimulator();
});

// --- 4. Interactive Data Pipeline Simulator Logic ---
function initDataPipelineSimulator() {
  const streamIngest = document.getElementById('stream-ingest');
  const streamFilter = document.getElementById('stream-filter');
  const streamClassify = document.getElementById('stream-classify');

  // KPI elements
  const elIngested = document.getElementById('kpi-ingested');
  const elFilteredPct = document.getElementById('kpi-filtered-pct');
  const elCostSaved = document.getElementById('kpi-cost-saved');
  const elHoursSaved = document.getElementById('kpi-hours-saved');

  // If simulator is not present on this page, exit cleanly
  if (!streamIngest || !streamFilter || !streamClassify) return;

  // Simulator Data Mock Library
  const mockPackets = [
    {
      name: "Duplicate IoT Sensor Ping",
      source: "Industrial Mesh Cluster",
      domain: "infrastructure",
      size: "1.4 MB",
      verdict: "noise",
      reason: "Unchanged telemetry within 50ms window. Discarded.",
      cost: 14.50,
      hours: 0.2
    },
    {
      name: "Settlement Transaction 0x4B9",
      source: "Banking Ledger Gateway",
      domain: "finance",
      size: "82 KB",
      verdict: "classified",
      category: "Financial Clearing",
      tag: "Deterministic Replay",
      benefit: "Immutable timestamp indexed"
    },
    {
      name: "Raw Webhook Polling Noise",
      source: "Distributed API Mesh",
      domain: "cloud",
      size: "3.2 MB",
      verdict: "noise",
      reason: "Heartbeat health ping with zero delta. Discarded.",
      cost: 32.80,
      hours: 0.4
    },
    {
      name: "Statutory NHS Encounter Record",
      source: "GP Connect / Spine Gateway",
      domain: "health",
      size: "140 KB",
      verdict: "classified",
      category: "Healthcare Interop",
      tag: "FHIR Canonical",
      benefit: "Authority-traceable patient state"
    },
    {
      name: "Redundant Clickstream Events",
      source: "Analytics Pipeline",
      domain: "cloud",
      size: "4.8 MB",
      verdict: "noise",
      reason: "Repetitive hover spam without session trigger. Discarded.",
      cost: 48.00,
      hours: 0.6
    },
    {
      name: "Orbital Attitude Telemetry",
      source: "VSOP87 Ephemeris Bus",
      domain: "aerospace",
      size: "95 KB",
      verdict: "classified",
      category: "Space-Time Systems",
      tag: "TAI / TT Reconciled",
      benefit: "Sub-microsecond physical verification"
    },
    {
      name: "Orphaned Cache Sync Spike",
      source: "Redis Rebalancer",
      domain: "infrastructure",
      size: "2.1 MB",
      verdict: "noise",
      reason: "Stale replication queue without consumer. Discarded.",
      cost: 21.00,
      hours: 0.3
    },
    {
      name: "Council Statutory Tax Audit",
      source: "Public Sector Ledger",
      domain: "public",
      size: "115 KB",
      verdict: "classified",
      category: "Regulatory Defensibility",
      tag: "Version-Locked",
      benefit: "Auditable snapshot schema"
    }
  ];

  // State metrics
  let totalIngested = 1240;
  let totalNoiseCount = 920;
  let totalCostSaved = 34500;
  let totalHoursSaved = 284;
  let isStreaming = true;
  let packetIndex = 0;

  // Stream toggle button
  const toggleBtn = document.getElementById('sim-toggle-stream');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isStreaming = !isStreaming;
      toggleBtn.innerHTML = isStreaming 
        ? '<i class="fa-solid fa-pause"></i> Pause Stream' 
        : '<i class="fa-solid fa-play"></i> Resume Stream';
    });
  }

  function renderPacket(packet) {
    // 1. Render in Stage 1: INGEST (Get)
    const ingestCard = document.createElement('div');
    ingestCard.className = 'data-packet';
    ingestCard.innerHTML = `
      <div class="packet-header">
        <span class="packet-name">${packet.name}</span>
        <span class="packet-meta">${packet.size}</span>
      </div>
      <div class="packet-meta">Source: ${packet.source}</div>
      <div style="font-size: 0.725rem; color: var(--accent-blue); font-weight: 600;">
        <i class="fa-solid fa-arrow-down"></i> Captured at Source
      </div>
    `;
    streamIngest.prepend(ingestCard);
    cleanOldPackets(streamIngest, 4);

    // 2. Render in Stage 2: SORT & TRIAGE
    setTimeout(() => {
      const filterCard = document.createElement('div');
      filterCard.className = 'data-packet';
      const isNoise = packet.verdict === 'noise';

      filterCard.innerHTML = `
        <div class="packet-header">
          <span class="packet-name">${packet.name}</span>
          <span class="packet-verdict ${isNoise ? 'verdict-noise' : 'verdict-classified'}">
            ${isNoise ? '<i class="fa-solid fa-ban"></i> WASTE FILTERED' : '<i class="fa-solid fa-check"></i> HIGH VALUE'}
          </span>
        </div>
        <div class="packet-meta">${isNoise ? packet.reason : 'Meets strict extraction criteria'}</div>
      `;
      streamFilter.prepend(filterCard);
      cleanOldPackets(streamFilter, 4);

      // 3. Render in Stage 3: CLASSIFY
      setTimeout(() => {
        const classifyCard = document.createElement('div');
        classifyCard.className = 'data-packet';

        if (isNoise) {
          classifyCard.innerHTML = `
            <div class="packet-header">
              <span class="packet-name" style="opacity: 0.6; text-decoration: line-through;">${packet.name}</span>
              <span class="verdict-noise" style="font-size: 0.7rem;">ZERO CLOUD EXPENSE</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--accent-crimson); font-weight: 500;">
              Saved $${packet.cost.toFixed(2)} in storage & query load
            </div>
          `;
          totalCostSaved += packet.cost;
          totalHoursSaved += packet.hours;
          totalNoiseCount += 1;
        } else {
          classifyCard.innerHTML = `
            <div class="packet-header">
              <span class="packet-name">${packet.name}</span>
              <span class="pill-tag pill-tag-emerald">${packet.category}</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--accent-emerald); font-weight: 600;">
              <i class="fa-solid fa-database"></i> ${packet.benefit}
            </div>
            <div class="packet-meta">Schema: ${packet.tag}</div>
          `;
        }

        streamClassify.prepend(classifyCard);
        cleanOldPackets(streamClassify, 4);

        // Update Totals
        totalIngested += 1;
        updateKpis();
      }, 500);
    }, 500);
  }

  function cleanOldPackets(container, maxItems) {
    while (container.children.length > maxItems) {
      container.removeChild(container.lastChild);
    }
  }

  function updateKpis() {
    if (elIngested) elIngested.textContent = totalIngested.toLocaleString();
    if (elFilteredPct) {
      const pct = ((totalNoiseCount / totalIngested) * 100).toFixed(1);
      elFilteredPct.textContent = `${pct}%`;
    }
    if (elCostSaved) elCostSaved.textContent = `$${Math.round(totalCostSaved).toLocaleString()}`;
    if (elHoursSaved) elHoursSaved.textContent = `${Math.round(totalHoursSaved)} hrs`;
  }

  // Ticking Simulator Loop
  setInterval(() => {
    if (!isStreaming) return;
    const packet = mockPackets[packetIndex % mockPackets.length];
    renderPacket(packet);
    packetIndex++;
  }, 2200);

  // Initial immediate run
  renderPacket(mockPackets[0]);
  setTimeout(() => renderPacket(mockPackets[1]), 800);
}
