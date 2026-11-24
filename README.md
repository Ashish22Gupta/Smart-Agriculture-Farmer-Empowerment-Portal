# 🌾 Smart Krishi Portal (Conceptual Prototype)
### Smart Agriculture & Farmer Empowerment Platform

> ⚠️ **DISCLAIMER:** This is a **personal learning and portfolio project**. It is **NOT** an official website of the Government of India, Ministry of Agriculture, or any affiliated organization. All scheme details, data, and branding are used strictly for educational and demonstration purposes to showcase frontend development skills.

A conceptual, fully responsive web portal prototype designed to demonstrate modern UI/UX principles, state management, and interactive frontend features in an AgriTech context.

![Version](https://img.shields.io/badge/Version-1.0.0-8B5A2B)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Portfolio%20Project-F4B400)
![Responsive](https://img.shields.io/badge/Responsive-Desktop%20%26%20Mobile-2D6A4F)

---

## ✨ Implemented Features (Prototype)

### 🧑‍🌾 Farmer Portal (B2C Flow)
- **Secure OTP Login** - Simulated Aadhaar-linked mobile verification with auto-advance inputs.
- **Dynamic Dashboard** - Overview of scheme benefits, rewards, and recent activity.
- **Crop Bill Upload** - 30-minute countdown timer with simulated geolocation verification.
- **Scratch & Win** - Interactive HTML5 Canvas scratch card with progress tracking and auto-reveal.
- **Digital Wallet** - LocalStorage-based voucher management (Active/Redeemed states) with copy-to-clipboard functionality.
- **Krishi Gyan Hub** - Video and Shorts gallery with category filtering, custom modals, and responsive sliders.
- **Experience Booking** - Complex form validation (weekend-only dates, file size limits, math CAPTCHA, accordions).
- **Scheme Details & FAQs** - Searchable, filterable informational pages with smooth accordion animations.

### 🎨 Dynamic Theming Engine
Built a custom CSS variable-based theming system with 3 distinct modes:
1. **Bhoomi (The Earth)** - Warm terracotta & gold (Default)
2. **Krishi Tech** - Professional teal (Field officer view)
3. **Harit (Organic)** - Fresh green (Sustainability view)

### 📱 Fully Responsive Design
- **Desktop:** Multi-column grid layouts with a persistent sidebar.
- **Tablet:** Adaptive 2-column layouts with collapsible navigation.
- **Mobile:** Touch-optimized, single-column layouts with slide-out drawer navigation and custom scrollbars.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic, accessible markup |
| **SCSS** | Modular, theme-aware styling with nested variables |
| **Vanilla JavaScript** | Zero-dependency, high-performance DOM manipulation |
| **Material Symbols** | Google's modern, lightweight icon library |
| **Nunito Font** | Friendly, highly readable typography |
| **LocalStorage / SessionStorage** | Client-side state persistence (wallet, themes, sessions) |
| **HTML5 Canvas API** | Interactive scratch card mechanics |
| **Geolocation API** | Simulated location-based bill verification |

---

## 📁 Project Structure

```text
agriculture-portal/
├── index.html                  # OTP Login
├── dashboard.html              # Farmer Dashboard
├── upload-bill.html            # Crop Sale Receipt Upload
├── scratch-card.html           # Gamified Reward Reveal
├── my-winnings.html            # Digital Voucher Wallet
├── krishi-gyan.html            # Videos & Shorts Hub
├── adventure-booking.html      # Drone Training Booking
├── scheme-details.html         # Government Schemes Info
├── faqs.html                   # Help & FAQs
│
├── styles/
│   └── styles.scss             # Master Stylesheet (All components & themes)
│
├── scripts/
│   ├── app.js                  # Global logic (OTP, sidebar, modals)
│   ├── theme.js                # Theme switching engine
│   ├── upload-bill.js          # Timer & geolocation logic
│   ├── scratch-card.js         # Canvas scratch mechanics
│   ├── my-winnings.js          # Wallet filtering & redemption
│   ├── krishi-gyan.js          # Video/shorts player & filtering
│   ├── adventure-booking.js    # Complex form validation
│   ├── scheme-details.js       # Scheme search & filtering
│   └── faqs.js                 # FAQ accordion logic
│
└── assets/
    ├── images/                 # Thumbnails, UI assets, and backgrounds
    └── videos/                 # Local MP4 videos for Krishi Gyan
