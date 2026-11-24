document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const canvas = document.getElementById("scratchCanvas");
    if (!canvas) return;

    const container   = document.getElementById("scratchContainer");
    const ctx         = canvas.getContext("2d", { willReadFrequently: true });
    const progressBar = document.getElementById("scratchProgress");
    const progressTxt = document.getElementById("progressPercent");
    const hint        = document.getElementById("scratchHint");
    const revealBtn   = document.getElementById("revealBtn");
    const modal       = document.getElementById("celebrationModal");

    const REVEAL_AT = 60;
    const BRUSH     = 22;

    let isDrawing = false;
    let isRevealed = false;
    let lastPos = null;
    let lastCheck = 0;
    let cssW = 0, cssH = 0;

    const REWARDS = [
        { icon: "science",    title: "Soil Health Kit", sub: "Free Soil Testing Kit",      validity: "Valid for Kharif Season 2026", value: 750 },
        { icon: "grass",      title: "50 kg Seeds",     sub: "Premium Wheat Seeds",        validity: "Valid till 31 March 2027",     value: 1200 },
        { icon: "agriculture",title: "Tractor Service", sub: "Free Service Voucher",       validity: "Valid till 30 June 2027",      value: 1500 },
        { icon: "water_drop", title: "Drip Coupon",     sub: "Drip Irrigation Discount",   validity: "Valid till 31 December 2026",  value: 2000 }
    ];

    let reward = REWARDS[0];
    try {
        const stored = sessionStorage.getItem("skp_pending_reward");
        if (stored) {
            reward = JSON.parse(stored);
        } else {
            reward = REWARDS[Math.floor(Math.random() * REWARDS.length)];
            sessionStorage.setItem("skp_pending_reward", JSON.stringify(reward));
        }
    } catch (e) {
        reward = REWARDS[Math.floor(Math.random() * REWARDS.length)];
    }

    document.getElementById("rewardIcon").textContent     = reward.icon;
    document.getElementById("rewardTitle").textContent    = reward.title;
    document.getElementById("rewardSub").textContent      = reward.sub;
    document.getElementById("rewardValidity").textContent = reward.validity;

    function paintCover() {
        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        cssW = rect.width;
        cssH = rect.height;

        canvas.width  = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
        canvas.style.width  = cssW + "px";
        canvas.style.height = cssH + "px";

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.globalCompositeOperation = "source-over";

        const gradient = ctx.createLinearGradient(0, 0, cssW, cssH);
        gradient.addColorStop(0,    "#C9922F");
        gradient.addColorStop(0.45, "#F6DE8B");
        gradient.addColorStop(0.55, "#FBE67B");
        gradient.addColorStop(1,    "#C9922F");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, cssW, cssH);

        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.lineWidth = 12;
        for (let x = -cssH; x < cssW; x += 46) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + cssH, cssH);
            ctx.stroke();
        }

        ctx.fillStyle = "rgba(62, 39, 35, 0.42)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "800 " + Math.max(18, Math.round(cssW / 16)) + "px Nunito, sans-serif";
        ctx.fillText("SCRATCH HERE", cssW / 2, cssH / 2 - 10);
        ctx.font = "600 " + Math.max(11, Math.round(cssW / 30)) + "px Nunito, sans-serif";
        ctx.fillText("Reveal your agri-input reward", cssW / 2, cssH / 2 + 20);
    }

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const point = e.touches && e.touches[0] ? e.touches[0] : e;
        return { x: point.clientX - rect.left, y: point.clientY - rect.top };
    }

    function erase(pos) {
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = BRUSH * 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        if (lastPos) {
            ctx.moveTo(lastPos.x, lastPos.y);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }
        ctx.arc(pos.x, pos.y, BRUSH, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        lastPos = pos;
    }

    function scratchedPercent() {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let clear = 0, total = 0;
        
        for (let i = 3; i < data.length; i += 40) {
            total++;
            if (data[i] < 128) clear++;
        }
        return total ? (clear / total) * 100 : 0;
    }

    function updateProgress(force) {
        const now = Date.now();
        if (!force && now - lastCheck < 100) return;
        lastCheck = now;

        const pct = Math.min(100, scratchedPercent());
        if (progressBar) progressBar.style.width = pct + "%";
        if (progressTxt) progressTxt.textContent = Math.round(pct) + "%";
        
        if (pct > REVEAL_AT - 1) {
            revealCard();
        }
    }

    function onMove(e) {
        if (!isDrawing || isRevealed) return;
        e.preventDefault();
        erase(getPos(e));
        updateProgress(false);
    }

    function startDraw(e) {
        if (isRevealed) return;
        isDrawing = true;
        lastPos = getPos(e);
        erase(lastPos);
        updateProgress(true);
    }

    function endDraw() {
        if (!isDrawing) return;
        isDrawing = false;
        lastPos = null;
        updateProgress(true);
    }

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", endDraw);
    canvas.addEventListener("mouseleave", endDraw);

    canvas.addEventListener("touchstart", startDraw, { passive: false });
    canvas.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", endDraw);
    window.addEventListener("touchcancel", endDraw);

    function revealCard() {
        if (isRevealed) return;
        isRevealed = true;
        isDrawing = false;

        canvas.style.transition = "opacity .45s ease";
        canvas.style.opacity = "0";
        canvas.style.pointerEvents = "none";

        if (progressBar) progressBar.style.width = "100%";
        if (progressTxt) progressTxt.textContent = "100%";
        if (hint) {
            hint.innerHTML = '<span class="material-symbols-rounded">check_circle</span> Reward unlocked';
            hint.classList.add("is-done");
        }
        if (revealBtn) revealBtn.hidden = true;

        document.getElementById("modalPrizeIcon").textContent = reward.icon;
        document.getElementById("modalPrizeName").textContent = reward.sub;
        document.getElementById("modalPrizeMeta").textContent = reward.validity;

        saveToWallet(reward);

        setTimeout(function () {
            window.SKP.openModal(modal);
        }, 480);
    }

    if (revealBtn) revealBtn.addEventListener("click", revealCard);

    function saveToWallet(item) {
        try {
            const wallet = JSON.parse(localStorage.getItem("skp_wallet") || "[]");
            const code = "KR" + Math.random().toString(36).slice(2, 8).toUpperCase();
            wallet.unshift({
                code: code,
                icon: item.icon,
                title: item.sub,
                value: item.value,
                validity: item.validity,
                status: "active",
                wonOn: new Date().toISOString()
            });
            localStorage.setItem("skp_wallet", JSON.stringify(wallet));
            sessionStorage.removeItem("skp_pending_reward");
        } catch (e) {}
    }

    let resizeTimer = null;
    window.addEventListener("resize", function () {
        if (isRevealed) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            const rect = container.getBoundingClientRect();
            if (Math.abs(rect.width - cssW) < 8) return;
            paintCover();
            if (progressBar) progressBar.style.width = "0%";
            if (progressTxt) progressTxt.textContent = "0%";
        }, 250);
    });

    paintCover();
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
            if (!isRevealed && scratchedPercent() < 1) paintCover();
        });
    }
});
