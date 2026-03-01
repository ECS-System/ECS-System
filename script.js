document.addEventListener('DOMContentLoaded', () => {
    
    const body = document.body;
    
    // --- 1. THEME LOGIC (Handles Desktop & Mobile Toggles) ---
    // Select BOTH toggle buttons
    const themeToggles = document.querySelectorAll('.theme-btn');

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    }

    // Add click event to ALL theme buttons (Desktop + Mobile)
    themeToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            let newTheme = 'light';

            if (currentTheme === 'light') {
                newTheme = 'dark';
            }

            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    });


    // --- 2. MOBILE MENU LOGIC ---
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            // Toggle 'active' class on both button (for icon swap) and menu (for slide in)
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            // Optional: Prevent scrolling when menu is open
            if (mobileMenu.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = 'auto';
            }
        });
        
        // Close menu when a link is clicked
        const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.style.overflow = 'auto';
            });
        });
    }

    // --- 5. EXPANDABLE CARDS LOGIC (The Problem/Solution section) ---
    const expandCards = document.querySelectorAll('.expand-card');

    expandCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });


    // --- 3. DYNAMIC YEAR ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }


    // --- 4. AOS ANIMATION ---
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    // --- 5. CALENDLY BOOKING BUTTONS ---
    // const calendlyUrl = 'https://calendly.com/noah-useghan-agoldresourcing/30min';

    // function loadCalendlyScript(onLoad) {
    //     if (window.Calendly && typeof Calendly.initPopupWidget === 'function') {
    //         onLoad();
    //         return;
    //     }
    //     const s = document.createElement('script');
    //     s.src = 'https://assets.calendly.com/assets/external/widget.js';
    //     s.async = true;
    //     s.onload = onLoad;
    //     document.head.appendChild(s);
    // }

    // const bookButtons = document.querySelectorAll('.btn-book');
    // bookButtons.forEach(btn => {
    //     btn.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         const openWidget = () => {
    //             if (window.Calendly && typeof Calendly.initPopupWidget === 'function') {
    //                 Calendly.initPopupWidget({ url: calendlyUrl });
    //             } else {
    //                 console.error('Calendly is unavailable after script load.');
    //             }
    //         };

    //         if (window.Calendly && typeof Calendly.initPopupWidget === 'function') {
    //             openWidget();
    //         } else {
    //             loadCalendlyScript(openWidget);
    //         }
    //     });
    // });
});
