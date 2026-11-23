/* ==========================================================================
   SMART KRISHI PORTAL - THEME ENGINE
   Themes: Bhoomi (default) | Krishi Tech | Harit
   ========================================================================== */
(function () {
    "use strict";

    const THEME_KEY = "skp_selected_theme";
    const THEMES = ["campaign-bhoomi", "campaign-krishi-tech", "campaign-harit"];
    const DEFAULT_THEME = "campaign-bhoomi";

    function applyTheme(theme) {
        if (!THEMES.includes(theme)) theme = DEFAULT_THEME;

        THEMES.forEach(function (item) {
            document.body.classList.remove(item);
        });
        document.body.classList.add(theme);
        document.body.setAttribute("data-campaign", theme.replace("campaign-", ""));

        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) { /* storage blocked */ }

        document.querySelectorAll("[data-theme-btn]").forEach(function (btn) {
            const isActive = btn.dataset.themeBtn === theme;
            btn.classList.toggle("active", isActive);
            btn.setAttribute("aria-pressed", String(isActive));
        });
    }

    window.setTheme = applyTheme;

    // Apply saved theme immediately (prevents flash)
    let saved = null;
    try {
        saved = localStorage.getItem(THEME_KEY);
    } catch (e) { saved = null; }
    applyTheme(saved || DEFAULT_THEME);

    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll("[data-theme-btn]").forEach(function (btn) {
            btn.setAttribute("role", "button");
            btn.setAttribute("tabindex", "0");

            btn.addEventListener("click", function () {
                applyTheme(btn.dataset.themeBtn);
            });
            btn.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    applyTheme(btn.dataset.themeBtn);
                }
            });
        });
    });
})();