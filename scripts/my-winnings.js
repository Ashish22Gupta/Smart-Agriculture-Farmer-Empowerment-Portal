/* ==========================================================================
   SMART KRISHI PORTAL - MY WINNINGS
   Reads vouchers from localStorage['skp_wallet']
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const WALLET_KEY = "skp_wallet";
    const SEED_KEY = "skp_wallet_seeded";

    const vouchersGrid = document.getElementById("vouchersGrid");
    const emptyState = document.getElementById("emptyState");
    const totalAmount = document.getElementById("totalAmount");
    const totalVouchers = document.getElementById("totalVouchers");
    const filterTabs = document.querySelectorAll(".filter-tab");
    const voucherModal = document.getElementById("voucherModal");
    const copyCodeBtn = document.getElementById("copyCodeBtn");
    const markRedeemedBtn = document.getElementById("markRedeemedBtn");

    let currentFilter = "all";
    let currentVoucherCode = null;

    /* ---------------------- 1. Seed initial wallet ---------------------- */
    function seedWallet() {
        if (localStorage.getItem(SEED_KEY)) return;

        const seedVouchers = [
            {
                code: "KRSEED01",
                icon: "grass",
                title: "Premium Wheat Seeds",
                value: 1200,
                validity: "Valid till 31 March 2027",
                status: "active",
                wonOn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                code: "KRSEED02",
                icon: "science",
                title: "Soil Health Test Kit",
                value: 750,
                validity: "Valid for Kharif Season 2026",
                status: "active",
                wonOn: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                code: "KRSEED03",
                icon: "agriculture",
                title: "Tractor Service Voucher",
                value: 1500,
                validity: "Valid till 30 June 2027",
                status: "redeemed",
                wonOn: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                code: "KRSEED04",
                icon: "water_drop",
                title: "Drip Irrigation Coupon",
                value: 2000,
                validity: "Valid till 31 December 2026",
                status: "active",
                wonOn: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];

        try {
            localStorage.setItem(WALLET_KEY, JSON.stringify(seedVouchers));
            localStorage.setItem(SEED_KEY, "true");
        } catch (e) { /* storage blocked */ }
    }

    /* ---------------------- 2. Load wallet ---------------------- */
    function loadWallet() {
        try {
            return JSON.parse(localStorage.getItem(WALLET_KEY) || "[]");
        } catch (e) {
            return [];
        }
    }

    function saveWallet(wallet) {
        try {
            localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
        } catch (e) { /* storage blocked */ }
    }

    /* ---------------------- 3. Render vouchers ---------------------- */
    function renderVouchers() {
        const wallet = loadWallet();
        const filtered = currentFilter === "all"
            ? wallet
            : wallet.filter(v => v.status === currentFilter);

        // Update totals (always based on full wallet)
        const total = wallet.reduce((sum, v) => sum + (v.value || 0), 0);
        totalAmount.textContent = "₹" + total.toLocaleString("en-IN");
        totalVouchers.textContent = wallet.length + " voucher" + (wallet.length !== 1 ? "s" : "") + " earned";

        // Clear grid
        vouchersGrid.innerHTML = "";

        if (filtered.length === 0) {
            emptyState.hidden = false;
            return;
        }

        emptyState.hidden = true;

        filtered.forEach(function (voucher) {
            const card = document.createElement("div");
            card.className = "voucher-card";
            card.dataset.status = voucher.status;
            card.dataset.code = voucher.code;

            const statusLabel = voucher.status === "active" ? "Active" : "Redeemed";
            const actionLabel = voucher.status === "active" ? "Show Code" : "View Details";
            const actionDisabled = voucher.status === "redeemed" ? "" : "";

            card.innerHTML = `
                <div class="voucher-left">
                    <span class="material-symbols-rounded" style="font-size: 32px; color: var(--brand-primary); margin-bottom: 6px;">${voucher.icon}</span>
                    <div class="voucher-amount">₹${voucher.value}</div>
                    <div class="voucher-brand">${voucher.title}</div>
                </div>
                <div class="voucher-right">
                    <div class="voucher-status ${voucher.status}">
                        <span class="material-symbols-rounded" style="font-size: 14px;">
                            ${voucher.status === "active" ? "check_circle" : "task_alt"}
                        </span>
                        ${statusLabel}
                    </div>
                    <div class="voucher-type">${voucher.title}</div>
                    <div class="voucher-validity">
                        <span class="material-symbols-rounded" style="font-size: 14px;">schedule</span>
                        ${voucher.validity}
                    </div>
                    <button class="voucher-action" data-code="${voucher.code}">
                        <span class="material-symbols-rounded" style="font-size: 16px; vertical-align: middle;">${voucher.status === "active" ? "qr_code_2" : "visibility"}</span>
                        ${actionLabel}
                    </button>
                </div>
            `;

            vouchersGrid.appendChild(card);
        });

        // Attach click handlers
        document.querySelectorAll(".voucher-action").forEach(function (btn) {
            btn.addEventListener("click", function () {
                const code = this.dataset.code;
                openVoucherModal(code);
            });
        });
    }

    /* ---------------------- 4. Filter tabs ---------------------- */
    filterTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            filterTabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
            currentFilter = this.dataset.filter;
            renderVouchers();
        });
    });

    /* ---------------------- 5. Voucher modal ---------------------- */
    function openVoucherModal(code) {
        const wallet = loadWallet();
        const voucher = wallet.find(v => v.code === code);
        if (!voucher) return;

        currentVoucherCode = code;

        document.getElementById("modalIcon").textContent = voucher.icon;
        document.getElementById("modalTitle").textContent = voucher.title;
        document.getElementById("modalValidity").textContent = voucher.validity;
        document.getElementById("modalCode").textContent = voucher.code;

        // Show/hide mark as redeemed button based on status
        if (voucher.status === "redeemed") {
            markRedeemedBtn.hidden = true;
            markRedeemedBtn.disabled = true;
        } else {
            markRedeemedBtn.hidden = false;
            markRedeemedBtn.disabled = false;
        }

        window.SKP.openModal(voucherModal);
    }

    /* ---------------------- 6. Copy code ---------------------- */
    if (copyCodeBtn) {
        copyCodeBtn.addEventListener("click", function () {
            const code = document.getElementById("modalCode").textContent;
            navigator.clipboard.writeText(code).then(function () {
                copyCodeBtn.innerHTML = '<span class="material-symbols-rounded">check</span> Copied!';
                setTimeout(function () {
                    copyCodeBtn.innerHTML = '<span class="material-symbols-rounded">content_copy</span> Copy Code';
                }, 2000);
            }).catch(function () {
                // Fallback for older browsers
                const textarea = document.createElement("textarea");
                textarea.value = code;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
                copyCodeBtn.innerHTML = '<span class="material-symbols-rounded">check</span> Copied!';
                setTimeout(function () {
                    copyCodeBtn.innerHTML = '<span class="material-symbols-rounded">content_copy</span> Copy Code';
                }, 2000);
            });
        });
    }

    /* ---------------------- 7. Mark as redeemed ---------------------- */
    if (markRedeemedBtn) {
        markRedeemedBtn.addEventListener("click", function () {
            if (!currentVoucherCode) return;

            const wallet = loadWallet();
            const voucher = wallet.find(v => v.code === currentVoucherCode);
            if (voucher) {
                voucher.status = "redeemed";
                saveWallet(wallet);
                window.SKP.closeModal(voucherModal);
                renderVouchers();
            }
        });
    }

    /* ---------------------- 8. Initialize ---------------------- */
    seedWallet();
    renderVouchers();
});