document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const form = document.getElementById("bookingForm");
    const dateInput = document.getElementById("slotDate");
    const slotInput = document.getElementById("slotLocation");
    const idProof = document.getElementById("idProof");
    const idProofName = document.getElementById("idProofName");
    const idProofRow = document.getElementById("idProofRow");
    const consent = document.getElementById("consent");
    const captchaQuestion = document.getElementById("captchaQuestion");
    const captchaAnswer = document.getElementById("captchaAnswer");
    const redeemBtn = document.getElementById("redeemBtn");
    const successModal = document.getElementById("successModal");

    // 1. Set minimum date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${yyyy}-${mm}-${dd}`;

    // 2. Generate Math CAPTCHA
    const a = Math.floor(Math.random() * 9) + 5; // 5 to 13
    const b = Math.floor(Math.random() * 9) + 5; // 5 to 13
    captchaQuestion.textContent = `${a} + ${b} =`;

    // 3. Date Validation (Weekends Only)
    dateInput.addEventListener("change", function () {
        if (!this.value) return;
        const selected = new Date(this.value);
        const day = selected.getDay();
        
        // 0 = Sunday, 6 = Saturday
        if (day !== 0 && day !== 6) {
            alert("Training batches are only available on Saturdays and Sundays. Please select a weekend date.");
            this.value = "";
        }
        validateForm();
    });

    // 4. File Upload Handling
    idProof.addEventListener("change", function () {
        const file = this.files && this.files[0];
        if (!file) {
            idProofName.textContent = "No file chosen";
            idProofRow.classList.remove("has-file");
            validateForm();
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("File size must be below 5 MB.");
            this.value = "";
            idProofName.textContent = "No file chosen";
            idProofRow.classList.remove("has-file");
            validateForm();
            return;
        }

        idProofName.textContent = file.name;
        idProofRow.classList.add("has-file");
        validateForm();
    });

    // 5. Accordion Toggle for Co-passenger
    const guestToggle = document.getElementById("guestToggle");
    const guestPanel = document.getElementById("guestPanel");
    
    guestToggle.addEventListener("click", function () {
        const isOpen = guestToggle.getAttribute("aria-expanded") === "true";
        guestToggle.setAttribute("aria-expanded", String(!isOpen));
        
        if (isOpen) {
            guestPanel.style.maxHeight = "0px";
            // Clear fields when closing
            document.getElementById("guestName").value = "";
            document.getElementById("guestAge").value = "";
        } else {
            guestPanel.style.maxHeight = guestPanel.scrollHeight + "px";
        }
    });

    // 6. Form Validation
    function validateForm() {
        const isDateValid = dateInput.value !== "";
        const isSlotValid = slotInput.value !== "";
        const isFileValid = idProof.files.length > 0;
        const isConsentValid = consent.checked;
        const isCaptchaValid = Number(captchaAnswer.value) === (a + b);

        const isValid = isDateValid && isSlotValid && isFileValid && isConsentValid && isCaptchaValid;
        
        redeemBtn.disabled = !isValid;
        return isValid;
    }

    // Attach validation listeners
    [dateInput, slotInput, captchaAnswer].forEach(function (input) {
        input.addEventListener("input", validateForm);
        input.addEventListener("change", validateForm);
    });
    
    consent.addEventListener("change", validateForm);

    // 7. Form Submission
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        
        if (!validateForm()) return;

        redeemBtn.disabled = true;
        redeemBtn.innerHTML = '<span class="material-symbols-rounded">hourglass_empty</span> Processing...';

        // Simulate API call
        setTimeout(function () {
            window.SKP.openModal(successModal);
            redeemBtn.innerHTML = '<span class="material-symbols-rounded">flight_takeoff</span> Redeem Experience';
            redeemBtn.disabled = false;
        }, 1500);
    });
});

/* ---------------------- Custom Select Arrow Rotation ---------------------- */
const customSelects = document.querySelectorAll(".custom-select");
customSelects.forEach(function (select) {
    const wrapper = select.closest(".select-wrapper");
    if (!wrapper) return;
    
    // Add 'is-open' class when focused (dropdown opened)
    select.addEventListener("focus", function () {
        wrapper.classList.add("is-open");
    });
    
    select.addEventListener("blur", function () {
        wrapper.classList.remove("is-open");
    });
    
    select.addEventListener("click", function () {
        wrapper.classList.toggle("is-open");
    });
});