// main.js - קובץ JavaScript ראשי לאתר רותם עדיני

document.addEventListener('DOMContentLoaded', function() {
    console.log('Main.js loaded');

    // הסרת opacity animation איטית
    document.body.style.opacity = '1';
    document.body.classList.add('loaded');

    // אנימציות לכרטיסים
    const cards = document.querySelectorAll('.recipe-card, .service-card, .feature-card, .game-card, .card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // אנימציות לכפתורים
    document.querySelectorAll('.button, .btn-primary, .sections a').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // טיפול בטפסים
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // אם זה טופס חיצוני, תן לו לעבור
            if (this.action && this.action.includes('sendmsg.co.il')) return true;

            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#e74c3c';
                    isValid = false;
                } else {
                    field.style.borderColor = '';
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('אנא מלא/י את כל השדות הנדרשים');
            }
        });
    });

    // טעינת תמונות בצורה חלקה
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });

    // Smooth scroll לעוגנים
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Prefetch קבצי CSS ו-JS
    const criticalResources = [
        'css/main.css',
        'css/mobile-fixes.css',
        'js/shared-components.js',
        'js/main.js'
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.js') ? 'script' : 'style';
        document.head.appendChild(link);
    });
});

// הסרת אנימציית טעינה איטית
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});