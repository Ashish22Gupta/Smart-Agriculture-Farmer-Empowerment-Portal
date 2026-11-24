document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const schemeSearch = document.getElementById("schemeSearch");
    const schemeCategories = document.querySelectorAll("#schemeCategories .category-chip");
    const schemesGrid = document.getElementById("schemesGrid");
    const emptyState = document.getElementById("emptyState");
    let currentCategory = "all";

    document.querySelectorAll(".scheme-expand-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const schemeId = this.dataset.scheme;
            const details = document.getElementById(schemeId + "-details");
            const card = this.closest(".scheme-card");
            
            if (details.classList.contains("is-open")) {
                details.classList.remove("is-open");
                card.classList.remove("is-expanded");
                this.querySelector(".material-symbols-rounded:last-child").style.transform = "rotate(0deg)";
            } else {
                details.classList.add("is-open");
                card.classList.add("is-expanded");
                this.querySelector(".material-symbols-rounded:last-child").style.transform = "rotate(180deg)";
            }
        });
    });

    document.querySelectorAll("[data-close-details]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const details = this.closest(".scheme-details");
            const card = details.closest(".scheme-card");
            const expandBtn = card.querySelector(".scheme-expand-btn");
            
            details.classList.remove("is-open");
            card.classList.remove("is-expanded");
            expandBtn.querySelector(".material-symbols-rounded:last-child").style.transform = "rotate(0deg)";
        });
    });

    schemeCategories.forEach(function (chip) {
        chip.addEventListener("click", function () {
            schemeCategories.forEach(c => c.classList.remove("active"));
            this.classList.add("active");
            currentCategory = this.dataset.category;
            filterSchemes();
        });
    });

    schemeSearch.addEventListener("input", function () {
        filterSchemes();
    });

    function filterSchemes() {
        const searchTerm = schemeSearch.value.toLowerCase().trim();
        const cards = document.querySelectorAll(".scheme-card");
        let visibleCount = 0;

        cards.forEach(function (card) {
            const category = card.dataset.category;
            const title = card.querySelector(".scheme-title").textContent.toLowerCase();
            const subtitle = card.querySelector(".scheme-subtitle").textContent.toLowerCase();
            
            const matchesCategory = currentCategory === "all" || category === currentCategory;
            const matchesSearch = !searchTerm || title.includes(searchTerm) || subtitle.includes(searchTerm);
            
            if (matchesCategory && matchesSearch) {
                card.style.display = "block";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        emptyState.hidden = visibleCount !== 0;
    }
});
