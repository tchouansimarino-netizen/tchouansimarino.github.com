(() => {
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const LANG_KEY = "capsulemedia_lang";
  const langSelect = document.querySelector("[data-lang-select]");
  const getSavedLang = () => {
    const value = window.localStorage.getItem(LANG_KEY);
    return value === "en" ? "en" : "fr";
  };
  const saveLang = (lang) => window.localStorage.setItem(LANG_KEY, lang);
  const applyGoogleTranslate = (lang) => {
    const combo = document.querySelector(".goog-te-combo");
    if (!(combo instanceof HTMLSelectElement)) return;
    combo.value = lang;
    combo.dispatchEvent(new Event("change"));
  };

  if (langSelect instanceof HTMLSelectElement) {
    langSelect.value = getSavedLang();
    langSelect.addEventListener("change", () => {
      const lang = langSelect.value === "en" ? "en" : "fr";
      saveLang(lang);
      applyGoogleTranslate(lang);
    });
  }

  window.googleTranslateElementInit = () => {
    const googleAny = window.google;
    if (!googleAny?.translate?.TranslateElement) return;
    new googleAny.translate.TranslateElement(
      { pageLanguage: "fr", includedLanguages: "fr,en", autoDisplay: false },
      "google_translate_element",
    );
    setTimeout(() => applyGoogleTranslate(getSavedLang()), 350);
  };

  if (nav && navToggle) {
    const setOpen = (isOpen) => {
      nav.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      const label = navToggle.querySelector(".sr-only");
      if (label) label.textContent = isOpen ? "Fermer le menu" : "Ouvrir le menu";
    };

    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.contains("is-open");
      setOpen(!isOpen);
    });

    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("is-open")) return;
      const target = e.target;
      if (!(target instanceof Element)) return;
      const clickedInside = nav.contains(target) || navToggle.contains(target);
      if (!clickedInside) setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  // Gestion du mode sombre/clair
  const THEME_KEY = "capsulemedia_theme";
  const themeToggle = document.querySelector("[data-theme-toggle]");
  
  const getSavedTheme = () => {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved) return saved === "light" ? "light" : "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };
  
  const saveTheme = (theme) => {
    window.localStorage.setItem(THEME_KEY, theme);
  };
  
  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    document.documentElement.classList.remove("light-mode");
    if (!isDark) {
      document.documentElement.classList.add("light-mode");
    }
    document.body.classList.remove("light-mode");
    if (!isDark) {
      document.body.classList.add("light-mode");
    }
    saveTheme(theme);
  };
  
  if (themeToggle) {
    const currentTheme = getSavedTheme();
    applyTheme(currentTheme);
    
    themeToggle.addEventListener("click", () => {
      const body = document.body;
      const isLight = body.classList.contains("light-mode");
      const newTheme = isLight ? "dark" : "light";
      applyTheme(newTheme);
    });
  }

  const tabsRoot = document.querySelector("[data-tabs]");
  if (tabsRoot) {
    const tabButtons = Array.from(tabsRoot.querySelectorAll("[role='tab']"));
    const tabPanels = Array.from(tabsRoot.querySelectorAll("[role='tabpanel']"));

    const activate = (tabName, shouldUpdateHash) => {
      tabButtons.forEach((btn) => {
        const isActive = btn.getAttribute("data-tab") === tabName;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
        btn.tabIndex = isActive ? 0 : -1;
      });
      tabPanels.forEach((panel) => {
        const isActive = panel.id === `tab-${tabName}`;
        panel.classList.toggle("is-active", isActive);
      });
      if (shouldUpdateHash) history.replaceState(null, "", `#${tabName}`);
    };

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabName = btn.getAttribute("data-tab");
        if (!tabName) return;
        activate(tabName, true);
      });
    });

    const initialHash = window.location.hash.replace("#", "").trim();
    const available = new Set(tabButtons.map((b) => b.getAttribute("data-tab")).filter(Boolean));
    if (initialHash && available.has(initialHash)) activate(initialHash, false);
  }

  const toast = (title, text) => {
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<div class="toast-title"></div><div class="toast-text"></div>`;
    const t = el.querySelector(".toast-title");
    const p = el.querySelector(".toast-text");
    if (t) t.textContent = title;
    if (p) p.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  };

  document.querySelectorAll("form[data-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitter = form.querySelector("[type='submit']");
      if (submitter instanceof HTMLButtonElement) {
        submitter.disabled = true;
        setTimeout(() => (submitter.disabled = false), 900);
      }
      toast("Demande enregistrée", "Connectez ce formulaire à votre email/CRM pour l’envoi réel.");
      form.reset();
    });
  });
})();
