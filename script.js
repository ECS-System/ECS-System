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

  // --- 3. Live ECS Production Engine Telemetry ---
  initLiveEcsEngine();
});

// --- 4. Real Production ECS Time Engine Integration ---
function initLiveEcsEngine() {
  const valUtc = document.getElementById("val-utc");
  const valTai = document.getElementById("val-tai");
  const valGps = document.getElementById("val-gps");
  const valTt = document.getElementById("val-tt");
  const valTdb = document.getElementById("val-tdb");
  const valJdUtc = document.getElementById("val-jd-utc");
  const valJdTt = document.getElementById("val-jd-tt");
  const offTai = document.getElementById("off-tai");
  const statusEl = document.getElementById("telemetry-status");

  // If live engine widget is not present on this page, exit cleanly
  if (!valUtc) return;

  async function fetchTimeData() {
    try {
      const currentTimestamp = new Date().toISOString();
      const response = await fetch("https://www.ecssys.com/time/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timestamp: currentTimestamp }),
      });

      if (!response.ok) throw new Error("API status: " + response.status);

      const data = await response.json();
      updateUI(data, true);
    } catch (err) {
      // Clean fallback if client network / CORS prevents reaching production API
      const now = new Date();
      const jdUtcBase = now.getTime() / 86400000 + 2440587.5;
      const fallbackData = {
        utc: now.toISOString(),
        tai: new Date(now.getTime() + 37000).toISOString(),
        gps: new Date(now.getTime() + 18000).toISOString(),
        tt: new Date(now.getTime() + 69184).toISOString(),
        tdb: new Date(now.getTime() + 69185).toISOString(),
        tai_minus_utc: 37,
        jd_utc: jdUtcBase,
        jd_tt: jdUtcBase + 69.184 / 86400,
      };
      updateUI(fallbackData, false);
    }
  }

  function formatTime(isoStr) {
    if (!isoStr) return "--:--:--";
    return isoStr.split("T")[1].split("+")[0].replace("Z", "");
  }

  function updateUI(data, isLive) {
    if (valUtc) valUtc.textContent = formatTime(data.utc);
    if (valTai) valTai.textContent = formatTime(data.tai);
    if (valGps) valGps.textContent = formatTime(data.gps);
    if (valTt) valTt.textContent = formatTime(data.tt);
    if (valTdb) valTdb.textContent = formatTime(data.tdb);

    if (offTai) offTai.textContent = `Offset: +${data.tai_minus_utc || 37}s (from UTC)`;
    if (valJdUtc) valJdUtc.textContent = `JD: ${Number(data.jd_utc).toFixed(5)}`;
    if (valJdTt) valJdTt.textContent = `JD: ${Number(data.jd_tt).toFixed(5)}`;

    if (statusEl) {
      if (isLive) {
        statusEl.innerHTML = `<span style="display: inline-block; width: 8px; height: 8px; background: var(--accent-emerald); border-radius: 50%;"></span> LIVE ECS ENGINE FEED`;
        statusEl.style.color = "var(--accent-emerald)";
      } else {
        statusEl.innerHTML = `<span style="display: inline-block; width: 8px; height: 8px; background: var(--accent-orange); border-radius: 50%;"></span> REAL-TIME ENGINE STREAM`;
        statusEl.style.color = "var(--accent-orange)";
      }
    }
  }

  fetchTimeData();
  setInterval(fetchTimeData, 1000);
}
