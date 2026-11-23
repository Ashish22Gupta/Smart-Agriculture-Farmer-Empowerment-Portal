/* ==========================================================================
   SMART KRISHI PORTAL - FAQs
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const faqSearch = document.getElementById("faqSearch");
    const faqCategories = document.querySelectorAll("#faqCategories .category-chip");
    const faqList = document.getElementById("faqList");
    const emptyState = document.getElementById("emptyState");
    const searchHint = document.getElementById("searchHint");
    let currentCategory = "all";

    /* ---------------------- 1. Accordion Toggle ---------------------- */
    document.querySelectorAll(".faq-question").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const faqItem = this.closest(".faq-item");
            const answer = faqItem.querySelector(".faq-answer");
            const chevron = this.querySelector(".faq-chevron");
            const isOpen = faqItem.classList.contains("is-open");

            // Close all other FAQs
            document.querySelectorAll(".faq-item.is-open").forEach(function (openItem) {
                if (openItem !== faqItem) {
                    openItem.classList.remove("is-open");
                    openItem.querySelector(".faq-answer").style.maxHeight = "0";
                    openItem.querySelector(".faq-chevron").style.transform = "rotate(0deg)";
                }
            });

            // Toggle current FAQ
            if (isOpen) {
                faqItem.classList.remove("is-open");
                answer.style.maxHeight = "0";
                chevron.style.transform = "rotate(0deg)";
            } else {
                faqItem.classList.add("is-open");
                answer.style.maxHeight = answer.scrollHeight + "px";
                chevron.style.transform = "rotate(180deg)";
            }
        });
    });

    /* ---------------------- 2. Category Filter ---------------------- */
    faqCategories.forEach(function (chip) {
        chip.addEventListener("click", function () {
            faqCategories.forEach(c => c.classList.remove("active"));
            this.classList.add("active");
            currentCategory = this.dataset.category;
            filterFAQs();
        });
    });

    /* ---------------------- 3. Search Functionality ---------------------- */
    faqSearch.addEventListener("input", function () {
        filterFAQs();
    });

    function filterFAQs() {
        const searchTerm = faqSearch.value.toLowerCase().trim();
        const faqItems = document.querySelectorAll(".faq-item");
        const categoryHeaders = document.querySelectorAll(".faq-category-header");
        let visibleCount = 0;

        // Hide all category headers initially
        categoryHeaders.forEach(header => header.style.display = "none");

        faqItems.forEach(function (item) {
            const category = item.dataset.category;
            const question = item.querySelector(".faq-question-text").textContent.toLowerCase();
            const answer = item.querySelector(".faq-answer").textContent.toLowerCase();
            
            const matchesCategory = currentCategory === "all" || category === currentCategory;
            const matchesSearch = !searchTerm || question.includes(searchTerm) || answer.includes(searchTerm);
            
            if (matchesCategory && matchesSearch) {
                item.style.display = "block";
                visibleCount++;
                
                // Show category header if not in "all" mode
                if (currentCategory !== "all") {
                    const header = document.querySelector(`[data-category-header="${currentCategory}"]`);
                    if (header) header.style.display = "flex";
                }
            } else {
                item.style.display = "none";
            }
        });

        // Show/hide search hint
        if (searchTerm) {
            searchHint.textContent = `Found ${visibleCount} question${visibleCount !== 1 ? 's' : ''} matching "${searchTerm}"`;
        } else {
            searchHint.textContent = 'Try searching for "upload", "voucher", "scheme", or "login"';
        }

        emptyState.hidden = visibleCount !== 0;
    }
});