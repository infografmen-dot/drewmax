/**
 * DREWMAX Cookie Consent Manager
 * Fully GDPR-compliant custom cookies modal & banner.
 * Supports Polish & English, custom settings drawer, and togglable states.
 */

(function () {
  const STORAGE_KEY = 'drewmax_cookie_consent_v1';
  
  // Detect language
  const isEn = (document.documentElement.lang || '').toLowerCase().startsWith('en') || window.location.pathname.includes('/en/');
  const lang = isEn ? 'en' : 'pl';

  // Translations
  const trans = {
    pl: {
      badgeTitle: "Ustawienia plików cookies",
      header: "Dostosuj preferencje dotyczące zgody",
      description: "Używamy plików cookie (ciasteczek), aby ułatwić Ci korzystanie z naszej witryny DREWMAX oraz w celach analitycznych i funkcjonalnych. Możesz zaakceptować wszystkie pliki cookie, odrzucić te, które nie są niezbędne, lub dostosować swoje ustawienia poniżej. Więcej informacji znajdziesz w naszej <a href='/polityka-prywatnosci' class='cookie-link'>Polityce Prywatności</a>.",
      bannerText: "Nasza strona używa plików cookie do optymalizacji działania oraz analityki. Klikając „Akceptuj wszystkie”, wyrażasz zgodę na wszystkie technologie śledzenia. Możesz też dostosować swoje preferencje lub odrzucić opcjonalne pliki.",
      catNecessaryTitle: "Niezbędne",
      catNecessaryDesc: "Niezbędne pliki cookie są kluczowe dla podstawowych funkcji witryny. Bez nich nasza strona nie mogłaby poprawnie wyświetlać katalogów produktów, zapytań ofertowych ani innych ważnych funkcji technicznych. Nie przechowują one żadnych danych osobowych umożliwiających identyfikację osoby.",
      catFunctionalTitle: "Funkcjonalne",
      catFunctionalDesc: "Funkcjonalne pliki cookie pomagają wykonywać pewne funkcje, takie jak udostępnianie zawartości witryny na platformach mediów społecznościowych, zapamiętywanie ustawień językowych oraz innych funkcji dostosowywania preferencji.",
      catAnalyticalTitle: "Analityczne",
      catAnalyticalDesc: "Analityczne pliki cookie (np. Google Analytics) służą do zrozumienia, w jaki sposób użytkownicy wchodzą w interakcję z witryną. Pomagają dostarczać informacje o metrykach liczby odwiedzających, współczynniku odrzuceń, najczęściej przeglądanych produktach czy źródłach ruchu.",
      alwaysActive: "Zawsze aktywne",
      btnAcceptAll: "Akceptuj wszystkie",
      btnSave: "Zapisz moje preferencje",
      btnRejectAll: "Odrzuć wszystkie",
      btnCustomize: "Dostosuj",
      poweredBy: "Zarządzaj Cookies — DREWMAX",
      showMore: "Pokaż więcej",
      showLess: "Pokaż mniej"
    },
    en: {
      badgeTitle: "Cookie Consent Settings",
      header: "Customize Consent Preferences",
      description: "We use cookies to help you navigate efficiently and perform certain functions on our DREWMAX website, as well as for functional and analytical purposes. You can accept all cookies, reject non-essential ones, or customize your preferences below. Learn more in our <a href='/en/privacy-policy' class='cookie-link'>Privacy Policy</a>.",
      bannerText: "Our website uses cookies to optimize your experience and for analytical purposes. By clicking 'Accept All', you agree to all tracking technologies. You can also customize your preferences or reject optional cookies.",
      catNecessaryTitle: "Necessary",
      catNecessaryDesc: "Necessary cookies are crucial for the basic functions of the website. Without them, our site might not display product catalogs, secure B2B quote inquiries, or basic layout options correctly. They do not store any personally identifiable data.",
      catFunctionalTitle: "Functional",
      catFunctionalDesc: "Functional cookies help perform certain functionalities like remembering language preferences, user interface layouts, or third-party feedback tools on the DREWMAX website.",
      catAnalyticalTitle: "Analytical",
      catAnalyticalDesc: "Analytical cookies (such as Google Analytics) are used to understand how visitors interact with our website. They help provide information on metrics, traffic sources, bounce rates, and popular brush models, helping us improve our website for your needs.",
      alwaysActive: "Always active",
      btnAcceptAll: "Accept All",
      btnSave: "Save Preferences",
      btnRejectAll: "Reject All",
      btnCustomize: "Customize",
      poweredBy: "Cookie Management — DREWMAX",
      showMore: "See more",
      showLess: "See less"
    }
  };

  const t = trans[lang];

  // Prepare Styles
  const css = `
    /* Floating badge bottom-left */
    .cookie-badge {
      position: fixed;
      bottom: 24px;
      left: 24px;
      width: 46px;
      height: 46px;
      background-color: var(--dark, #1A1A1A);
      color: var(--white, #FFFFFF);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 999997;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .cookie-badge:hover {
      background-color: var(--primary, #82B440);
      border-color: var(--primary, #82B440);
      transform: scale(1.1) rotate(15deg);
    }
    .cookie-badge svg {
      width: 22px;
      height: 22px;
      fill: currentColor;
    }

    /* Overlay / Backdrop */
    .cookie-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 999998;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      backdrop-filter: blur(2px);
    }
    .cookie-backdrop.active {
      opacity: 1;
      visibility: visible;
    }

    /* Left Drawer Sidebar */
    .cookie-drawer {
      position: fixed;
      top: 0;
      left: -420px;
      width: 400px;
      height: 100vh;
      background-color: var(--white, #FFFFFF);
      z-index: 999999;
      box-shadow: 4px 0 24px rgba(0, 0, 0, 0.18);
      transition: left 0.33s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      font-family: var(--font-primary), 'Outfit', -apple-system, sans-serif;
      color: var(--dark, #1A1A1A);
    }
    @media (max-width: 576px) {
      .cookie-drawer {
        width: 100%;
        left: -100%;
      }
    }
    .cookie-drawer.active {
      left: 0;
    }

    /* Drawer Header */
    .cookie-dr-header {
      padding: 20px 24px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .cookie-dr-header h2 {
      font-size: 1.15rem;
      font-weight: 700;
      margin: 0;
      line-height: 1.3;
      color: var(--dark, #1A1A1A);
    }
    .cookie-dr-close {
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: var(--gray-500, #6A6A6A);
      padding: 0;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s ease;
    }
    .cookie-dr-close:hover {
      color: var(--dark, #1A1A1A);
    }

    /* Drawer Content */
    .cookie-dr-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }
    .cookie-welcome-text {
      font-size: 0.9rem;
      color: var(--gray-700, #4A4A4A);
      line-height: 1.55;
      margin-bottom: 24px;
    }
    .cookie-link {
      color: var(--primary, #82B440);
      text-decoration: underline;
      font-weight: 500;
      transition: opacity 0.2s ease;
    }
    .cookie-link:hover {
      opacity: 0.8;
    }

    /* Category Accordion */
    .cookie-cat-item {
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: var(--radius-md, 8px);
      margin-bottom: 12px;
      background: var(--bg-light, #FAFAFA);
      overflow: hidden;
      transition: border-color 0.2s ease;
    }
    .cookie-cat-item:hover {
      border-color: rgba(0, 0, 0, 0.15);
    }
    .cookie-cat-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      cursor: pointer;
      user-select: none;
    }
    .cookie-cat-title-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .cookie-cat-arrow {
      width: 14px;
      height: 14px;
      transition: transform 0.25s ease;
      transform: rotate(0deg);
      opacity: 0.7;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cookie-cat-item.expanded .cookie-cat-arrow {
      transform: rotate(90deg);
    }
    .cookie-cat-arrow svg {
      width: 10px;
      height: 10px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
    }
    .cookie-cat-title {
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--dark, #1A1A1A);
    }
    .cookie-cat-status-badge {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary, #82B440);
      background-color: var(--primary-bg, rgba(130, 180, 64, 0.08));
      padding: 4px 8px;
      border-radius: var(--radius-sm, 6px);
      user-select: none;
    }
    .cookie-cat-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s cubic-bezier(0, 1, 0, 1);
      padding: 0 16px;
    }
    .cookie-cat-item.expanded .cookie-cat-content {
      max-height: 250px;
      padding-bottom: 16px;
      transition: max-height 0.35s ease-in-out;
    }
    .cookie-cat-desc {
      font-size: 0.83rem;
      color: var(--gray-700, #4A4A4A);
      line-height: 1.5;
      border-top: 1px dashed rgba(0, 0, 0, 0.05);
      padding-top: 10px;
    }

    /* Switch styling */
    .cookie-switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
    }
    .cookie-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .cookie-slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: var(--gray-300, #DADADA);
      transition: .25s ease;
      border-radius: 24px;
    }
    .cookie-slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .25s ease;
      border-radius: 50%;
      box-shadow: 0 1px 4px rgba(0,0,0,0.18);
    }
    input:checked + .cookie-slider {
      background-color: var(--primary, #82B440);
    }
    input:checked + .cookie-slider:before {
      transform: translateX(20px);
    }

    /* Drawer Footer Buttons styling */
    .cookie-dr-footer {
      padding: 20px 24px;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
      background-color: var(--white, #FFFFFF);
    }
    .cookie-btn-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .cookie-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px var(--gutter, 24px);
      font-size: 0.9rem;
      font-weight: 600;
      border-radius: var(--radius-md, 12px);
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      text-align: center;
      border: none;
    }
    .cookie-btn-accept {
      background-color: var(--primary, #82B440);
      color: var(--white, #FFFFFF);
      box-shadow: 0 4px 12px rgba(130, 180, 64, 0.22);
    }
    .cookie-btn-accept:hover {
      background-color: var(--primary-hover, #74A136);
      transform: translateY(-1.5px);
      box-shadow: 0 6px 16px rgba(130, 180, 64, 0.3);
    }
    .cookie-btn-save {
      background-color: var(--gray-100, #F5F5F5);
      color: var(--dark, #1A1A1A);
      border: 1px solid rgba(0,0,0,0.06);
    }
    .cookie-btn-save:hover {
      background-color: var(--gray-300, #DADADA);
      transform: translateY(-1.5px);
    }
    .cookie-btn-reject {
      background-color: transparent;
      color: var(--gray-700, #4A4A4A);
      border: 1px solid var(--gray-300, #DADADA);
    }
    .cookie-btn-reject:hover {
      background-color: rgba(0, 0, 0, 0.04);
      color: var(--dark, #1A1A1A);
      transform: translateY(-1.5px);
    }
    .cookie-powered {
      text-align: center;
      font-size: 0.72rem;
      color: var(--gray-500, #6A6A6A);
      margin-top: 14px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }


    /* First-time Bottom Toast/Bar Banner */
    .cookie-banner {
      position: fixed;
      bottom: -300px;
      left: 24px;
      right: 24px;
      max-width: var(--container-width, 1200px);
      margin: 0 auto;
      background-color: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      color: var(--dark, #1A1A1A);
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: var(--radius-lg, 16px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      z-index: 999995;
      padding: 14px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      transition: bottom 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: var(--font-primary), 'Outfit', sans-serif;
    }
    @media (max-width: 991px) {
      .cookie-banner {
        flex-direction: column;
        align-items: stretch;
        gap: 14px;
        padding: 16px 20px;
        bottom: -400px;
        left: 16px;
        right: 16px;
      }
    }
    .cookie-banner.active {
      bottom: 24px;
    }
    @media (max-width: 576px) {
      .cookie-banner.active {
        bottom: 16px;
      }
    }
    .cookie-banner-text {
      flex: 1;
      font-size: 0.88rem;
      line-height: 1.6;
      color: var(--gray-900, #2A2A2A);
    }
    .cookie-banner-btns {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    @media (max-width: 576px) {
      .cookie-banner-btns {
        flex-direction: column;
        width: 100%;
        gap: 10px;
      }
      .cookie-banner-btns .cookie-btn {
        width: 100%;
      }
    }
    .cookie-banner-btns .cookie-btn {
      padding: 10px 22px;
      font-size: 0.85rem;
    }
  `;

  // Check if consent already saved
  let consent = null;
  const rawConsent = localStorage.getItem(STORAGE_KEY);
  if (rawConsent) {
    try {
      consent = JSON.parse(rawConsent);
    } catch (e) {
      consent = null;
    }
  }

  // Create document elements on ready
  function init() {
    // Inject Stylesheet
    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // Create persistent toggle badge (always present)
    const badge = document.createElement('div');
    badge.className = 'cookie-badge';
    badge.title = t.badgeTitle;
    badge.setAttribute('id', 'cookieConsentBadge');
    badge.innerHTML = `
      <svg viewBox="0 0 24 24">
        <!-- Cookie shape -->
        <path d="M12 21a9 9 0 1 1 9-9c0 .546-.05 1.08-.145 1.597l-.022.09c-.198.7-.638 1.294-1.229 1.693l-.112.07c-.492.308-.755.857-.751 1.454.008.471.189.923.513 1.259.324.336.755.541 1.21.57l.115.006c-.452.176-.921.306-1.402.385l-.105.016C17.584 20.954 12 21 12 21Zm0-17a8 8 0 0 0-8 8c0 4.08 3.056 7.447 7.001 7.937A3.992 3.992 0 0 1 15 17a3.99 3.99 0 0 1-2.903-1.12c-.8-.829-1.218-1.921-1.234-3.076a4.01 4.01 0 0 1 1.272-2.964c.8-.759 1.838-1.155 2.924-1.155a3.99 3.99 0 0 1 3.921 3.208A8 8 0 0 0 12 4Z" style="display:none;" />
        <path d="M12 2A10 10 0 1 0 22 12c0-.505-.333-.94-.82-1.071a2.83 2.83 0 0 1-2.03-2.03c-.131-.487-.566-.82-1.071-.82a4.425 4.425 0 0 0-4.414-4.414c0-.505-.333-.94-.82-1.071A2.83 2.83 0 0 1 12 2Zm0 2c.046.852.54 1.597 1.277 1.954l.11.05.05.11c.357.737 1.102 1.231 1.954 1.277a6.432 6.432 0 0 1 5.923 5.923c-.852-.046-1.597-.54-1.954-1.277l-.05-.11-.11-.05c-.737-.357-1.231-1.102-1.277-1.954c-.035-2.955-2.221-5.4-5.111-5.783L12.5 4H12ZM7.5 10.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm7.5 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM9.5 15.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" fill="currentColor"/>
      </svg>
    `;
    document.body.appendChild(badge);

    // Create Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'cookie-backdrop';
    backdrop.setAttribute('id', 'cookieConsentBackdrop');
    document.body.appendChild(backdrop);

    // Create Drawer
    const drawer = document.createElement('div');
    drawer.className = 'cookie-drawer';
    drawer.setAttribute('id', 'cookieConsentDrawer');

    // Retrieve initial switch states
    const fChecked = consent ? (consent.functional ? 'checked' : '') : 'checked';
    const aChecked = consent ? (consent.analytical ? 'checked' : '') : 'checked';

    drawer.innerHTML = `
      <div class="cookie-dr-header">
        <h2>${t.header}</h2>
        <button class="cookie-dr-close" id="cookieDrawerClose" aria-label="Close">&times;</button>
      </div>
      <div class="cookie-dr-content">
        <p class="cookie-welcome-text">${t.description}</p>
        
        <div class="cookie-cat-list">
          <!-- Necessary Category -->
          <div class="cookie-cat-item expanded" id="catItemNecessary">
            <div class="cookie-cat-header-row" onclick="document.getElementById('catItemNecessary').classList.toggle('expanded')">
              <div class="cookie-cat-title-wrap">
                <span class="cookie-cat-arrow">
                  <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor"/></svg>
                </span>
                <span class="cookie-cat-title">${t.catNecessaryTitle}</span>
              </div>
              <span class="cookie-cat-status-badge">${t.alwaysActive}</span>
            </div>
            <div class="cookie-cat-content">
              <p class="cookie-cat-desc">${t.catNecessaryDesc}</p>
            </div>
          </div>

          <!-- Functional Category -->
          <div class="cookie-cat-item" id="catItemFunctional">
            <div class="cookie-cat-header-row" onclick="document.getElementById('catItemFunctional').classList.toggle('expanded')">
              <div class="cookie-cat-title-wrap">
                <span class="cookie-cat-arrow">
                  <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor"/></svg>
                </span>
                <span class="cookie-cat-title">${t.catFunctionalTitle}</span>
              </div>
              <label class="cookie-switch" onclick="event.stopPropagation()">
                <input type="checkbox" id="cookieSwitchFunctional" ${fChecked}>
                <span class="cookie-slider"></span>
              </label>
            </div>
            <div class="cookie-cat-content">
              <p class="cookie-cat-desc">${t.catFunctionalDesc}</p>
            </div>
          </div>

          <!-- Analytical Category -->
          <div class="cookie-cat-item" id="catItemAnalytical">
            <div class="cookie-cat-header-row" onclick="document.getElementById('catItemAnalytical').classList.toggle('expanded')">
              <div class="cookie-cat-title-wrap">
                <span class="cookie-cat-arrow">
                  <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor"/></svg>
                </span>
                <span class="cookie-cat-title">${t.catAnalyticalTitle}</span>
              </div>
              <label class="cookie-switch" onclick="event.stopPropagation()">
                <input type="checkbox" id="cookieSwitchAnalytical" ${aChecked}>
                <span class="cookie-slider"></span>
              </label>
            </div>
            <div class="cookie-cat-content">
              <p class="cookie-cat-desc">${t.catAnalyticalDesc}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="cookie-dr-footer">
        <div class="cookie-btn-group">
          <button class="cookie-btn cookie-btn-accept" id="cookieAcceptAllBtn">${t.btnAcceptAll}</button>
          <button class="cookie-btn cookie-btn-save" id="cookieSaveBtn">${t.btnSave}</button>
          <button class="cookie-btn cookie-btn-reject" id="cookieRejectAllBtn">${t.btnRejectAll}</button>
        </div>
        <div class="cookie-powered">${t.poweredBy}</div>
      </div>
    `;
    document.body.appendChild(drawer);

    // Create Initial Bottom Toast/Bar Banner if consent not given
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('id', 'cookieConsentBanner');
    banner.innerHTML = `
      <div class="cookie-banner-text">
        ${t.bannerText}
      </div>
      <div class="cookie-banner-btns">
        <button class="cookie-btn cookie-btn-accept" id="bannerAcceptAllBtn" style="white-space: nowrap;">${t.btnAcceptAll}</button>
        <button class="cookie-btn cookie-btn-reject" id="bannerRejectAllBtn" style="white-space: nowrap;">${t.btnRejectAll}</button>
        <button class="cookie-btn cookie-btn-outline" id="bannerCustomizeBtn" style="white-space: nowrap; margin-top:0;">${t.btnCustomize}</button>
      </div>
    `;
    document.body.appendChild(banner);

    // WIRE UP EVENT HANDLERS

    // Helper functions to open/close drawer
    function openDrawer() {
      drawer.classList.add('active');
      backdrop.classList.add('active');
      banner.classList.remove('active'); // Hide banner while settings are open
    }

    function closeDrawer() {
      drawer.classList.remove('active');
      backdrop.classList.remove('active');
      // If user still hasn't decided, keep showing the banner
      if (!localStorage.getItem(STORAGE_KEY)) {
        banner.classList.add('active');
      }
    }

    function savePreferences(necessary, functional, analytical) {
      const payload = {
        necessary: true,
        functional: functional,
        analytical: analytical,
        timestamp: new Date().getTime()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      
      // Update checkbox switches visually
      document.getElementById('cookieSwitchFunctional').checked = functional;
      document.getElementById('cookieSwitchAnalytical').checked = analytical;

      // Close elements
      drawer.classList.remove('active');
      backdrop.classList.remove('active');
      banner.classList.remove('active');

      // Dispatch dynamic custom event for analytic triggers/etc
      const event = new CustomEvent('drewmaxCookieConsentUpdated', { detail: payload });
      document.dispatchEvent(event);
    }

    // Badge click
    badge.addEventListener('click', openDrawer);

    // Backdrop click
    backdrop.addEventListener('click', closeDrawer);

    // Close button click
    document.getElementById('cookieDrawerClose').addEventListener('click', closeDrawer);

    // Accept All in Drawer
    document.getElementById('cookieAcceptAllBtn').addEventListener('click', () => {
      savePreferences(true, true, true);
    });

    // Save preferences in Drawer
    document.getElementById('cookieSaveBtn').addEventListener('click', () => {
      const func = document.getElementById('cookieSwitchFunctional').checked;
      const anal = document.getElementById('cookieSwitchAnalytical').checked;
      savePreferences(true, func, anal);
    });

    // Reject All in Drawer
    document.getElementById('cookieRejectAllBtn').addEventListener('click', () => {
      savePreferences(true, false, false);
    });

    // Banner Buttons
    document.getElementById('bannerAcceptAllBtn').addEventListener('click', () => {
      savePreferences(true, true, true);
    });

    document.getElementById('bannerRejectAllBtn').addEventListener('click', () => {
      savePreferences(true, false, false);
    });

    document.getElementById('bannerCustomizeBtn').addEventListener('click', openDrawer);

    // Show initial banner if no saved preference
    if (!consent) {
      setTimeout(() => {
        banner.classList.add('active');
      }, 1000);
    }
  }

  // Load when body is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
