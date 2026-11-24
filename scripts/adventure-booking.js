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

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${yyyy}-${mm}-${dd}`;

    const a = Math.floor(Math.random() * 9) + 5;
    const b = Math.floor(Math.random() * 9) + 5;
    captchaQuestion.textContent = `${a} + ${b} =`;

    dateInput.addEventListener("change", function () {
        if (!this.value) return;
        const selected = new Date(this.value);
        const day = selected.getDay();
        
        if (day !== 0 && day !== 6) {
            alert("Training batches are only available on Saturdays and Sundays. Please select a weekend date.");
            this.value = "";
        }
        validateForm();
    });

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

    const guestToggle = document.getElementById("guestToggle");
    const guestPanel = document.getElementById("guestPanel");
    
    guestToggle.addEventListener("click", function () {
        const isOpen = guestToggle.getAttribute("aria-expanded") === "true";
        guestToggle.setAttribute("aria-expanded", String(!isOpen));
        
        if (isOpen) {
            guestPanel.style.maxHeight = "0px";
            document.getElementById("guestName").value = "";
            document.getElementById("guestAge").value = "";
        } else {
            guestPanel.style.maxHeight = guestPanel.scrollHeight + "px";
        }
    });

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

    [dateInput, slotInput, captchaAnswer].forEach(function (input) {
        input.addEventListener("input", validateForm);
        input.addEventListener("change", validateForm);
    });
    
    consent.addEventListener("change", validateForm);

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        
        if (!validateForm()) return;

        redeemBtn.disabled = true;
        redeemBtn.innerHTML = '<span class="material-symbols-rounded">hourglass_empty</span> Processing...';

        setTimeout(function () {
            window.SKP.openModal(successModal);
            redeemBtn.innerHTML = '<span class="material-symbols-rounded">flight_takeoff</span> Redeem Experience';
            redeemBtn.disabled = false;
        }, 1500);
    });
});

const customSelects = document.querySelectorAll(".custom-select");
customSelects.forEach(function (select) {
    const wrapper = select.closest(".select-wrapper");
    if (!wrapper) return;
    
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
