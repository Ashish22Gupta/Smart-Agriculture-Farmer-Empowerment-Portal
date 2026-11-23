// Add this to the existing app.js file

// ==========================================================================
// 4. Mobile Number → OTP Flow (Login Page)
// ==========================================================================
const mobileInput = document.getElementById("mobileNumber");
const otpSection = document.getElementById("otpSection");
const submitBtn = document.getElementById("submitBtn");
const otpForm = document.getElementById("otpForm");

if (mobileInput && otpSection && submitBtn) {
    let otpSent = false;
    
    mobileInput.addEventListener("input", function() {
        // Only allow numbers
        this.value = this.value.replace(/[^0-9]/g, "");
        
        // Enable/disable button based on mobile number length
        if (this.value.length === 10) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    });
    
    // Initially disable button
    submitBtn.disabled = true;
    
    otpForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        if (!otpSent) {
            // Step 1: Send OTP
            const mobile = mobileInput.value;
            if (mobile.length !== 10) {
                alert("Please enter a valid 10-digit mobile number.");
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="material-symbols-rounded">hourglass_empty</span> Sending...';
            
            // Simulate API call
            setTimeout(() => {
                otpSent = true;
                mobileInput.disabled = true;
                otpSection.style.display = "block";
                submitBtn.innerHTML = '<span class="material-symbols-rounded">verified</span> Verify & Continue';
                submitBtn.disabled = true;
                
                // Focus first OTP box
                const firstOtpBox = document.querySelector(".otp-box");
                if (firstOtpBox) firstOtpBox.focus();
            }, 1500);
            
        } else {
            // Step 2: Verify OTP (existing logic from original app.js)
            let otpValue = "";
            otpBoxes.forEach(box => otpValue += box.value);
            
            if (otpValue.length === 4) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="material-symbols-rounded">hourglass_empty</span> Verifying...';
                
                setTimeout(() => {
                    // Success - redirect to dashboard
                    window.location.href = "dashboard.html";
                }, 1500);
            } else {
                alert("Please enter a valid 4-digit OTP.");
            }
        }
    });
}



// Add this to app.js

// ==========================================================================
// 5. Mobile Sidebar Toggle
// ==========================================================================
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const sidebar = document.querySelector(".sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

if (mobileMenuBtn && sidebar && sidebarOverlay) {
    mobileMenuBtn.addEventListener("click", function() {
        sidebar.classList.add("is-open");
        sidebarOverlay.classList.add("is-open");
        document.body.classList.add("no-scroll");
    });
    
    sidebarOverlay.addEventListener("click", function() {
        sidebar.classList.remove("is-open");
        sidebarOverlay.classList.remove("is-open");
        document.body.classList.remove("no-scroll");
    });
}

/* ==========================================================================
   SMART KRISHI PORTAL - GLOBAL SCRIPT
   1. OTP inputs  2. Login flow  3. Sidebar  4. Shared modal helpers
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* ----------------------------------------------------------------------
       1. OTP AUTO-ADVANCE / BACKSPACE / PASTE
    ---------------------------------------------------------------------- */
    const otpBoxes = Array.from(document.querySelectorAll(".otp-box"));

    function getOtpValue() {
        return otpBoxes.map(function (b) { return b.value; }).join("");
    }

    otpBoxes.forEach(function (box, index) {
        box.addEventListener("input", function () {
            this.value = this.value.replace(/[^0-9]/g, "");
            if (this.value.length === 1 && index < otpBoxes.length - 1) {
                otpBoxes[index + 1].focus();
            }
            document.dispatchEvent(new CustomEvent("otp:change", {
                detail: { value: getOtpValue() }
            }));
        });

        box.addEventListener("keydown", function (e) {
            if (e.key === "Backspace" && this.value === "" && index > 0) {
                otpBoxes[index - 1].focus();
            }
            if (e.key === "ArrowLeft" && index > 0) otpBoxes[index - 1].focus();
            if (e.key === "ArrowRight" && index < otpBoxes.length - 1) otpBoxes[index + 1].focus();
        });

        box.addEventListener("paste", function (e) {
            e.preventDefault();
            const data = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, otpBoxes.length);
            data.split("").forEach(function (char, i) {
                if (otpBoxes[i]) otpBoxes[i].value = char;
            });
            const focusIndex = Math.min(data.length, otpBoxes.length - 1);
            otpBoxes[focusIndex].focus();
            document.dispatchEvent(new CustomEvent("otp:change", {
                detail: { value: getOtpValue() }
            }));
        });
    });

    /* ----------------------------------------------------------------------
       2. LOGIN FLOW (Mobile Number -> OTP -> Dashboard)
    ---------------------------------------------------------------------- */
    const otpForm = document.getElementById("otpForm");
    const mobileInput = document.getElementById("mobileNumber");
    const otpSection = document.getElementById("otpSection");
    const submitBtn = document.getElementById("submitBtn");

    if (otpForm && mobileInput && submitBtn) {
        let otpSent = false;

        function setButton(icon, label) {
            submitBtn.innerHTML = '<span class="material-symbols-rounded">' + icon + '</span> ' + label;
        }

        submitBtn.disabled = true;

        mobileInput.addEventListener("input", function () {
            this.value = this.value.replace(/[^0-9]/g, "");
            if (!otpSent) submitBtn.disabled = this.value.length !== 10;
        });

        document.addEventListener("otp:change", function (e) {
            if (otpSent) submitBtn.disabled = e.detail.value.length !== otpBoxes.length;
        });

        otpForm.addEventListener("submit", function (e) {
            e.preventDefault();

            if (!otpSent) {
                if (mobileInput.value.length !== 10) return;

                submitBtn.disabled = true;
                setButton("hourglass_empty", "Sending OTP...");

                setTimeout(function () {
                    otpSent = true;
                    mobileInput.disabled = true;
                    otpSection.style.display = "block";
                    setButton("verified", "Verify & Continue");
                    submitBtn.disabled = true;
                    if (otpBoxes[0]) otpBoxes[0].focus();
                }, 1200);
                return;
            }

            if (getOtpValue().length !== otpBoxes.length) return;

            submitBtn.disabled = true;
            setButton("hourglass_empty", "Verifying...");

            setTimeout(function () {
                try {
                    sessionStorage.setItem("skp_farmer_mobile", mobileInput.value);
                } catch (err) { /* ignore */ }
                window.location.href = "dashboard.html";
            }, 1200);
        });
    }

    /* ----------------------------------------------------------------------
       3. SIDEBAR (Desktop persistent / Mobile drawer)
    ---------------------------------------------------------------------- */
    const menuBtn = document.getElementById("mobileMenuBtn");
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    function openSidebar() {
        if (!sidebar) return;
        sidebar.classList.add("is-open");
        if (overlay) overlay.classList.add("is-open");
        document.body.classList.add("no-scroll");
    }

    function closeSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove("is-open");
        if (overlay) overlay.classList.remove("is-open");
        document.body.classList.remove("no-scroll");
    }

    if (menuBtn) menuBtn.addEventListener("click", openSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", function (e) {
        if (e.key !== "Escape") return;
        if (sidebar && sidebar.classList.contains("is-open")) closeSidebar();
        const openModal = document.querySelector(".modal-overlay.is-open, .modal-overlay.active");
        if (openModal && !openModal.hasAttribute("data-lock-modal")) {
            window.SKP.closeModal(openModal);
        }
    });

    // Reset drawer state when resizing up to desktop
    window.addEventListener("resize", function () {
        if (window.innerWidth > 1024) closeSidebar();
    });

    /* ----------------------------------------------------------------------
       4. SHARED MODAL HELPERS + GENERIC CLOSE BUTTONS
    ---------------------------------------------------------------------- */
    window.SKP = {
        openModal: function (modal) {
            if (!modal) return;
            modal.classList.add("is-open");
            document.body.classList.add("no-scroll");
        },
        closeModal: function (modal) {
            if (!modal) return;
            modal.classList.remove("is-open", "active");
            if (!document.querySelector(".modal-overlay.is-open, .sidebar.is-open")) {
                document.body.classList.remove("no-scroll");
            }
        }
    };

    document.querySelectorAll("[data-close-modal]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            window.SKP.closeModal(btn.closest(".modal-overlay"));
        });
    });
});