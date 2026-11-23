document.addEventListener("DOMContentLoaded", function () {
    const CLAIM_KEY = "ucp_current_claim";
    const CLAIM_DURATION = 30 * 60 * 1000; // 30 minutes
    
    const countdown = document.getElementById("countdown");
    const timerCard = document.getElementById("timerCard");
    const billInput = document.getElementById("billInput");
    const billBox = document.getElementById("billBox");
    const billPreview = document.getElementById("billPreview");
    const uploadPlaceholder = document.getElementById("uploadPlaceholder");
    const retakeBtn = document.getElementById("retakeBtn");
    const invoiceInput = document.getElementById("invoiceNo");
    const invoiceError = document.getElementById("invoiceError");
    const submitBtn = document.getElementById("submitBillBtn");
    const billForm = document.getElementById("billForm");
    const locationStatus = document.getElementById("locationStatus");
    const expiredModal = document.getElementById("expiredModal");
    const duplicateModal = document.getElementById("duplicateModal");
    
    let hasFile = false;
    let locationOk = false;
    let isExpired = false;
    let timerId = null;
    
    // Get or create claim session
    function getClaim() {
        let claim = null;
        try {
            claim = JSON.parse(sessionStorage.getItem(CLAIM_KEY));
        } catch (error) {
            claim = null;
        }
        
        if (!claim || !claim.expiresAt) {
            claim = {
                id: "CLM-" + Date.now(),
                expiresAt: Date.now() + CLAIM_DURATION,
                attemptsLeft: 2
            };
            sessionStorage.setItem(CLAIM_KEY, JSON.stringify(claim));
        }
        
        return claim;
    }
    
    const claim = getClaim();
    
    // Update countdown timer
    function updateTimer() {
        const remaining = claim.expiresAt - Date.now();
        
        if (remaining <= 0) {
            expireClaim();
            return;
        }
        
        const seconds = Math.floor(remaining / 1000);
        const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
        const ss = String(seconds % 60).padStart(2, "0");
        countdown.textContent = `${mm}:${ss}`;
        
        // Add urgent class when less than 5 minutes
        if (remaining <= 5 * 60 * 1000) {
            timerCard.classList.add("is-urgent");
        }
    }
    
    // Expire the claim
    function expireClaim() {
        if (isExpired) return;
        
        isExpired = true;
        clearInterval(timerId);
        countdown.textContent = "00:00";
        submitBtn.disabled = true;
        billInput.disabled = true;
        
        openModal(expiredModal);
    }
    
    // Validate form
    function validateForm() {
        const invoice = invoiceInput.value.trim();
        const invoicePattern = /^[A-Za-z0-9][A-Za-z0-9/-]{3,23}$/;
        let error = "";
        
        if (invoice && !invoicePattern.test(invoice)) {
            error = "Use 4–24 letters, numbers, slash or hyphen.";
        }
        
        invoiceError.textContent = error;
        
        submitBtn.disabled = 
            isExpired || 
            !hasFile || 
            !locationOk || 
            !invoice || 
            Boolean(error);
        
        return !submitBtn.disabled;
    }
    
    // Handle file upload
    billInput.addEventListener("change", function () {
        const file = this.files && this.files[0];
        if (!file) return;
        
        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file.");
            this.value = "";
            return;
        }
        
        if (file.size > 8 * 1024 * 1024) {
            alert("Image must be below 8 MB.");
            this.value = "";
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function (event) {
            billPreview.src = event.target.result;
            billPreview.classList.remove("hidden");
            uploadPlaceholder.classList.add("hidden");
            retakeBtn.classList.remove("hidden");
            billBox.classList.add("has-file");
            hasFile = true;
            validateForm();
        };
        reader.readAsDataURL(file);
    });
    
    // Handle retake
    retakeBtn.addEventListener("click", function () {
        billInput.value = "";
        billPreview.src = "";
        billPreview.classList.add("hidden");
        uploadPlaceholder.classList.remove("hidden");
        retakeBtn.classList.add("hidden");
        billBox.classList.remove("has-file");
        hasFile = false;
        validateForm();
        billInput.click();
    });
    
    // Handle invoice input
    invoiceInput.addEventListener("input", validateForm);
    
    // Check geolocation
    function checkLocation() {
        if (!navigator.geolocation) {
            locationStatus.classList.add("is-blocked");
            locationStatus.querySelector("span:last-child").textContent = 
                "Location is not supported on this device.";
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            function (position) {
                locationStatus.classList.remove("is-blocked");
                locationStatus.classList.add("is-ok");
                locationStatus.querySelector("span:last-child").textContent = 
                    `Location verified: ${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}`;
                locationOk = true;
                validateForm();
            },
            function () {
                locationStatus.classList.remove("is-ok");
                locationStatus.classList.add("is-blocked");
                locationStatus.querySelector("span:last-child").textContent = 
                    "Please turn on location services to submit your bill.";
                locationOk = false;
                validateForm();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000
            }
        );
    }
    
    // Handle form submission
    billForm.addEventListener("submit", function (event) {
        event.preventDefault();
        
        if (!validateForm()) return;
        
        if (Date.now() >= claim.expiresAt) {
            expireClaim();
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="material-symbols-rounded">hourglass_empty</span> Verifying...';
        
        setTimeout(function () {
            const invoice = invoiceInput.value.trim().toUpperCase();
            const usedInvoices = JSON.parse(
                localStorage.getItem("ucp_used_invoices") || "[]"
            );
            
            // Check for duplicate
            if (usedInvoices.includes(invoice)) {
                submitBtn.innerHTML = '<span class="material-symbols-rounded">check_circle</span> Submit Bill';
                validateForm();
                openModal(duplicateModal);
                return;
            }
            
            // Mark as used
            usedInvoices.push(invoice);
            localStorage.setItem("ucp_used_invoices", JSON.stringify(usedInvoices));
            sessionStorage.removeItem(CLAIM_KEY);
            
            // Redirect to scratch card
            window.location.href = "scratch-card.html";
        }, 1200);
    });
    
    // Modal functions
    function openModal(modal) {
        modal.classList.add("is-open");
        document.body.classList.add("no-scroll");
    }
    
    function closeModal(modal) {
        modal.classList.remove("is-open");
        document.body.classList.remove("no-scroll");
    }
    
    // Close modal buttons
    document.querySelectorAll("[data-close-modal]").forEach(function (button) {
        button.addEventListener("click", function () {
            closeModal(button.closest(".modal-overlay"));
        });
    });
    
    // Close duplicate modal on overlay click
    duplicateModal.addEventListener("click", function (event) {
        if (event.target === duplicateModal) {
            closeModal(duplicateModal);
        }
    });
    
    // Update timer when tab becomes visible
    document.addEventListener("visibilitychange", function () {
        if (!document.hidden) updateTimer();
    });
    
    // Initialize
    checkLocation();
    updateTimer();
    timerId = setInterval(updateTimer, 1000);
});