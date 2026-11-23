/* ==========================================================================
   SMART KRISHI PORTAL - KRISHI GYAN (Videos & Shorts)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const shortsCarousel = document.getElementById("shortsCarousel");
    const videoGrid = document.getElementById("videoGrid");
    const videoCategories = document.querySelectorAll(".category-chip");
    const emptyState = document.getElementById("emptyState");
    const videoModal = document.getElementById("videoModal");
    const shortsModal = document.getElementById("shortsModal");
    const shortsSlider = document.getElementById("shortsSlider");
    const shortsPrev = document.getElementById("shortsPrev");
    const shortsNext = document.getElementById("shortsNext");
    const viewAllShortsBtn = document.getElementById("viewAllShortsBtn");
    
    // Carousel Arrows
    const carouselPrev = document.getElementById("shortsCarouselPrev");
    const carouselNext = document.getElementById("shortsCarouselNext");

    let currentCategory = "all";
    let currentShortIndex = 0;

    /* ---------------------- 1. Videos Data ---------------------- */
    const videos = [
        { id: 1, title: "How to Increase Wheat Yield by 30%", category: "crop-management", categoryLabel: "Crop Management", duration: "00:29", views: "45.2K", thumbnail: "assets/images/video-wheat.png", description: "Learn proven techniques to boost your wheat production using modern farming methods.", type: "local", url: "assets/videos/wheat-yield.mp4" },
        { id: 2, title: "PM-KISAN Scheme: Complete Guide 2026", category: "government-schemes", categoryLabel: "Government Schemes", duration: "00:30", views: "128K", thumbnail: "assets/images/video-pmkisan.png", description: "Everything you need to know about the PM-KISAN scheme eligibility.", type: "local", url: "assets/videos/pmkisan-guide.mp4" },
        { id: 3, title: "Organic Pest Control Methods", category: "pest-control", categoryLabel: "Pest Control", duration: "00:10", views: "32.8K", thumbnail: "assets/images/video-pest.png", description: "Discover natural and organic ways to protect your crops from pests.", type: "local", url: "assets/videos/organic-pest.mp4" },
        { id: 4, title: "Understanding Weather Patterns", category: "weather", categoryLabel: "Weather Updates", duration: "00:14", views: "28.5K", thumbnail: "assets/images/video-weather.png", description: "Learn how to read weather forecasts and plan your farming activities.", type: "local", url: "assets/videos/weather-patterns.mp4" },
        { id: 5, title: "Success Story: From 2 Acres to 20 Acres", category: "success-stories", categoryLabel: "Success Stories", duration: "00:11", views: "89.3K", thumbnail: "assets/images/video-success.png", description: "Inspiring journey of a farmer who transformed his small land.", type: "local", url: "assets/videos/success-story.mp4" },
        { id: 6, title: "Today's Mandi Prices", category: "market-prices", categoryLabel: "Market Prices", duration: "00:10", views: "67.1K", thumbnail: "assets/images/video-mandi.png", description: "Daily update on crop prices across major mandis.", type: "local", url: "assets/videos/mandi-prices.mp4" },
        { id: 7, title: "Drip Irrigation: Save Water", category: "crop-management", categoryLabel: "Crop Management", duration: "00:15", views: "41.6K", thumbnail: "assets/images/video-drip.png", description: "Complete guide to installing and maintaining drip irrigation systems.", type: "local", url: "assets/videos/drip-irrigation.mp4" },
        { id: 8, title: "Soil Health Card Guide", category: "government-schemes", categoryLabel: "Government Schemes", duration: "00:11", views: "54.9K", thumbnail: "assets/images/video-soil.png", description: "Understanding your soil health card report and how to use it.", type: "local", url: "assets/videos/soil-health-card.mp4" }
    ];

    /* ---------------------- 2. Shorts Data ---------------------- */
    const shorts = [
        { id: 1, title: "3 Tips for Healthy Tomato Plants", views: "12.5K", thumbnail: "assets/images/short-tomato.png", description: "Quick tips to grow healthy and productive tomato plants in your farm.", type: "local", url: "assets/videos/short-tomato.mp4" },
        { id: 2, title: "Quick Guide: Organic Fertilizer", views: "8.3K", thumbnail: "assets/images/short-fertilizer.png", description: "Learn how to make organic fertilizer at home using farm waste.", type: "local", url: "assets/videos/short-organic-fertilizer.mp4" },
        { id: 3, title: "Monsoon Preparation Checklist", views: "15.7K", thumbnail: "assets/images/short-monsoon.png", description: "Essential checklist to prepare your farm for the monsoon season.", type: "local", url: "assets/videos/short-monsoon-prep.mp4" },
        { id: 4, title: "Best Time to Harvest Wheat", views: "9.8K", thumbnail: "assets/images/short-wheat.png", description: "Know the perfect time to harvest wheat for maximum yield.", type: "local", url: "assets/videos/short-wheat-harvest.mp4" },
        { id: 5, title: "Pest Identification Guide", views: "11.2K", thumbnail: "assets/images/short-pest.png", description: "Identify common crop pests and learn how to manage them.", type: "local", url: "assets/videos/short-pest-guide.mp4" }
    ];

    /* ---------------------- 3. Render Shorts Carousel ---------------------- */
    function renderShortsCarousel() {
        shortsCarousel.innerHTML = "";
        shorts.forEach(function (short, index) {
            const card = document.createElement("div");
            card.className = "short-card";
            card.dataset.shortId = short.id;
            card.innerHTML = `
                <img src="${short.thumbnail}" alt="${short.title}" onerror="this.src='https://via.placeholder.com/200x356/8B5A2B/FFFFFF?text=Short'">
                <div class="short-overlay">
                    <div class="short-type-badge">
                        <span class="material-symbols-rounded" style="font-size: 12px;">${short.type === 'youtube' ? 'smart_display' : 'video_file'}</span>
                    </div>
                    <div class="short-title">${short.title}</div>
                    <div class="short-views">
                        <span class="material-symbols-rounded" style="font-size: 12px;">visibility</span>
                        ${short.views} views
                    </div>
                </div>
            `;
            card.addEventListener("click", function () {
                openShortsModal(index);
            });
            shortsCarousel.appendChild(card);
        });
        // Update carousel arrows after rendering
        setTimeout(updateCarouselArrows, 100);
    }

    /* ---------------------- 4. Render Videos Grid ---------------------- */
    function renderVideos() {
        const filtered = currentCategory === "all" ? videos : videos.filter(v => v.category === currentCategory);
        videoGrid.innerHTML = "";
        
        if (filtered.length === 0) {
            emptyState.hidden = false;
            return;
        }
        emptyState.hidden = true;

        filtered.forEach(function (video) {
            const card = document.createElement("div");
            card.className = "video-card";
            card.dataset.videoId = video.id;
            card.innerHTML = `
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}" onerror="this.src='https://via.placeholder.com/400x225/8B5A2B/FFFFFF?text=Video'">
                    <div class="video-type-badge">
                        <span class="material-symbols-rounded" style="font-size: 14px;">${video.type === 'youtube' ? 'smart_display' : 'video_file'}</span>
                    </div>
                    <div class="video-duration">${video.duration}</div>
                    <div class="video-play-btn">
                        <div class="video-play-icon"><span class="material-symbols-rounded">play_arrow</span></div>
                    </div>
                </div>
                <div class="video-info">
                    <div class="video-category">${video.categoryLabel}</div>
                    <div class="video-title">${video.title}</div>
                    <div class="video-meta">
                        <div class="video-meta-item">
                            <span class="material-symbols-rounded">visibility</span>
                            ${video.views} views
                        </div>
                    </div>
                </div>
            `;
            card.addEventListener("click", function () { openVideoModal(video); });
            videoGrid.appendChild(card);
        });
    }

    /* ---------------------- 5. Video Modal ---------------------- */
    function openVideoModal(video) {
        const container = document.getElementById("videoPlayerContainer");
        container.innerHTML = "";
        if (video.type === "local") {
            container.innerHTML = `
                <video controls autoplay muted playsinline poster="${video.thumbnail}" style="width: 100%; height: 100%; object-fit: contain; background: #000;">
                    <source src="${video.url}" type="video/mp4">
                </video>
            `;
        }
        document.getElementById("modalVideoTitle").textContent = video.title;
        document.getElementById("modalVideoCategory").textContent = video.categoryLabel;
        document.getElementById("modalVideoDuration").textContent = video.duration;
        document.getElementById("modalVideoViews").textContent = video.views + " views";
        document.getElementById("modalVideoDescription").textContent = video.description;
        window.SKP.openModal(videoModal);
    }

    /* ---------------------- 6. Shorts Modal (Slider) ---------------------- */
    function openShortsModal(startIndex) {
        currentShortIndex = startIndex || 0;
        renderShortsSlider();
        updateShortsInfo();
        window.SKP.openModal(shortsModal);
        setTimeout(() => scrollToShort(currentShortIndex, false), 50);
    }

    function renderShortsSlider() {
        shortsSlider.innerHTML = "";
        shorts.forEach(function (short, index) {
            const slide = document.createElement("div");
            slide.className = "short-slide";
            slide.dataset.index = index;

            if (short.type === "local") {
                const autoplayAttr = index === currentShortIndex ? 'autoplay' : '';
                slide.innerHTML = `
                    <video ${autoplayAttr} loop muted playsinline controls poster="${short.thumbnail}" style="width: 100%; height: 100%; max-width: 420px; max-height: 100vh; object-fit: cover; background: #000;">
                        <source src="${short.url}" type="video/mp4">
                    </video>
                `;
            }
            shortsSlider.appendChild(slide);
        });
    }

    function updateShortsInfo() {
        const short = shorts[currentShortIndex];
        if (!short) return;
        document.getElementById("shortsInfoTitle").textContent = short.title;
        document.getElementById("shortsInfoViews").textContent = short.views + " views";
        document.getElementById("shortsInfoDescription").textContent = short.description;
        document.getElementById("shortsCounter").textContent = `${currentShortIndex + 1} / ${shorts.length}`;
    }

    // FIXED: Proper vertical snapping and video play/pause management
    function scrollToShort(index, smooth = true) {
        if (index < 0 || index >= shorts.length) return;
        
        // Pause current video
        const currentSlide = shortsSlider.children[currentShortIndex];
        if (currentSlide) {
            const currentVideo = currentSlide.querySelector('video');
            if (currentVideo) currentVideo.pause();
        }

        currentShortIndex = index;
        const newSlide = shortsSlider.children[currentShortIndex];
        
        if (newSlide) {
            // FIXED: Use "start" for reliable vertical snapping
            newSlide.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
            
            // Play new video
            const newVideo = newSlide.querySelector('video');
            if (newVideo) {
                newVideo.muted = true; // Required for autoplay
                newVideo.play().catch(() => {});
            }
        }
        
        updateShortsInfo();
        updateNavArrows();
    }

    function updateNavArrows() {
        if (!shortsPrev || !shortsNext) return;
        shortsPrev.style.opacity = currentShortIndex === 0 ? "0.3" : "1";
        shortsPrev.style.pointerEvents = currentShortIndex === 0 ? "none" : "auto";
        shortsNext.style.opacity = currentShortIndex === shorts.length - 1 ? "0.3" : "1";
        shortsNext.style.pointerEvents = currentShortIndex === shorts.length - 1 ? "none" : "auto";
    }

    if (shortsPrev) shortsPrev.addEventListener("click", function () { if (currentShortIndex > 0) scrollToShort(currentShortIndex - 1); });
    if (shortsNext) shortsNext.addEventListener("click", function () { if (currentShortIndex < shorts.length - 1) scrollToShort(currentShortIndex + 1); });

    // FIXED: Scroll listener now correctly detects active slide and manages playback
    let scrollTimeout;
    shortsSlider.addEventListener("scroll", function () {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function () {
            const sliderRect = shortsSlider.getBoundingClientRect();
            let closestIndex = currentShortIndex;
            let closestDistance = Infinity;

            Array.from(shortsSlider.children).forEach(function (slide, index) {
                const slideRect = slide.getBoundingClientRect();
                const distance = Math.abs(slideRect.top - sliderRect.top); // Vertical distance check
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            if (closestIndex !== currentShortIndex) {
                // Pause old
                const oldVideo = shortsSlider.children[currentShortIndex]?.querySelector('video');
                if (oldVideo) oldVideo.pause();
                
                currentShortIndex = closestIndex;
                updateShortsInfo();
                updateNavArrows();
                
                // Play new
                const newVideo = shortsSlider.children[currentShortIndex]?.querySelector('video');
                if (newVideo) {
                    newVideo.muted = true;
                    newVideo.play().catch(() => {});
                }
            }
        }, 150);
    });

    // Keyboard navigation
    document.addEventListener("keydown", function (e) {
        if (!shortsModal.classList.contains("is-open")) return;
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
            e.preventDefault();
            if (currentShortIndex > 0) scrollToShort(currentShortIndex - 1);
        } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            e.preventDefault();
            if (currentShortIndex < shorts.length - 1) scrollToShort(currentShortIndex + 1);
        }
    });

    if (viewAllShortsBtn) {
        viewAllShortsBtn.addEventListener("click", function () { openShortsModal(0); });
    }

    /* ---------------------- 7. Category Filtering ---------------------- */
    videoCategories.forEach(function (chip) {
        chip.addEventListener("click", function () {
            videoCategories.forEach(c => c.classList.remove("active"));
            this.classList.add("active");
            currentCategory = this.dataset.category;
            renderVideos();
        });
    });

    /* ---------------------- 8. Cleanup on modal close ---------------------- */
    function cleanupModal(modal) {
        const vids = modal.querySelectorAll("video");
        vids.forEach(v => v.pause());
        const iframes = modal.querySelectorAll("iframe");
        iframes.forEach(iframe => iframe.remove());
    }

    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === "attributes" && mutation.attributeName === "class") {
                const modal = mutation.target;
                if (!modal.classList.contains("is-open")) cleanupModal(modal);
            }
        });
    });
    observer.observe(videoModal, { attributes: true });
    observer.observe(shortsModal, { attributes: true });

    /* ---------------------- 9. Desktop Carousel Arrows Logic ---------------------- */
    function updateCarouselArrows() {
        if (!carouselPrev || !carouselNext || !shortsCarousel) return;
        const isAtStart = shortsCarousel.scrollLeft <= 10;
        const isAtEnd = shortsCarousel.scrollLeft + shortsCarousel.clientWidth >= shortsCarousel.scrollWidth - 10;
        carouselPrev.disabled = isAtStart;
        carouselNext.disabled = isAtEnd;
    }

    if (carouselPrev && carouselNext && shortsCarousel) {
        const scrollAmount = 230; // Card width + gap
        carouselPrev.addEventListener("click", () => shortsCarousel.scrollBy({ left: -scrollAmount, behavior: "smooth" }));
        carouselNext.addEventListener("click", () => shortsCarousel.scrollBy({ left: scrollAmount, behavior: "smooth" }));
        shortsCarousel.addEventListener("scroll", updateCarouselArrows);
        window.addEventListener("resize", updateCarouselArrows);
    }

    /* ---------------------- 10. Initialize ---------------------- */
    renderShortsCarousel();
    renderVideos();
});