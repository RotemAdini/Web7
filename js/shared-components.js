// shared-components.js - מערכת רכיבים משותפים לאתר רותם עדיני

class SharedComponents {
  constructor() {
    this.init();
  }

  init() {
    // טען את הרכיבים כשהדף נטען
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.loadComponents());
    } else {
      this.loadComponents();
    }
  }

  loadComponents() {
    // הוסף את הרכיבים לדף
    this.createHeader();
    this.createSidebar();
    this.createFooter();
    
    // אתחל את הפונקציונליות
    this.initializeMenuBehavior();
    this.markCurrentPage();
    this.initializePageTransitions();
  }

  createHeader() {
    // בדוק אם כבר קיים header
    if (document.getElementById('header')) return;

    const header = document.createElement('header');
    header.id = 'header';
    header.innerHTML = `
      <div class="hamburger" id="hamburger">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <h1>רותם עדיני</h1>
    `;

    // הוסף את ה-header לתחילת ה-body
    document.body.insertBefore(header, document.body.firstChild);
  }

  createSidebar() {
    // בדוק אם כבר קיים sidebar
    if (document.getElementById('sidebar')) return;

    // צור sidebar
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';
    sidebar.id = 'sidebar';
    sidebar.innerHTML = `
      <a href="index.html">🏠 דף הבית</a>
      <a href="recipes.html">🍰 מתכונים</a>
      <a href="couples.html">💑 זוגיות</a>
      <a href="games.html">🎲 משחקים</a>
      <a href="about.html">💜 עליי</a>
      <a href="contact.html">📞 צור קשר</a>
      <a href="terms.html">📋 תקנון</a>
    `;

    // צור overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'overlay';

    // הוסף אחרי ה-header
    const header = document.getElementById('header');
    header.insertAdjacentElement('afterend', sidebar);
    header.insertAdjacentElement('afterend', overlay);
  }

  createFooter() {
    // בדוק אם כבר קיים footer
    if (document.querySelector('footer')) return;

    const footer = document.createElement('footer');
    footer.innerHTML = `
      <p>© כל הזכויות שמורות לרותם עדיני | 2025</p>
      <div class="social">
        <a href="https://www.instagram.com/rotem_adini?igsh=MTFrd3VlOXdqdDVubQ%3D%3D&utm_source=qr" target="_blank" class="instagram" aria-label="אינסטגרם">
          <i class="fab fa-instagram"></i>
        </a>
        <a href="https://www.facebook.com/share/16WJDMpdpV/?mibextid=wwXIfr" target="_blank" class="facebook" aria-label="פייסבוק">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a href="https://www.tiktok.com/@rotem_adini?_t=ZS-8xCVScFHbYF&_r=1" target="_blank" class="tiktok" aria-label="טיקטוק">
          <i class="fab fa-tiktok"></i>
        </a>
        <a href="https://www.youtube.com/@rotemadini" target="_blank" class="youtube" aria-label="יוטיוב">
          <i class="fab fa-youtube"></i>
        </a>
      </div>
    `;

    // הוסף בסוף ה-body
    document.body.appendChild(footer);
  }

  initializeMenuBehavior() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (!hamburger || !sidebar || !overlay) return;

    // Toggle menu
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      hamburger.classList.toggle('active');
      overlay.classList.toggle('active');
    });

    // Close menu on overlay click
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      hamburger.classList.remove('active');
      overlay.classList.remove('active');
    });

    // Close menu on link click (mobile)
    if (window.innerWidth <= 768) {
      const links = sidebar.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', () => {
          sidebar.classList.remove('open');
          hamburger.classList.remove('active');
          overlay.classList.remove('active');
        });
      });
    }

    // Header scroll effect
    window.addEventListener('scroll', () => {
      const header = document.getElementById('header');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  markCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const sidebar = document.getElementById('sidebar');
    
    if (!sidebar) return;

    const links = sidebar.querySelectorAll('a');
    links.forEach(link => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
        link.style.background = 'var(--gradient-primary)';
        link.style.color = 'white';
      }
    });
  }

  initializePageTransitions() {
    // Smooth page transitions
    const links = document.querySelectorAll('a[href$=".html"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        // Skip if Ctrl/Cmd is pressed
        if (e.ctrlKey || e.metaKey) return;
        
        // Skip if it's an external link
        if (this.hostname !== window.location.hostname) return;
        
        e.preventDefault();
        const href = this.href;
        
        // Fade out
        document.body.style.opacity = '0';
        
        // Navigate after animation
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      });
    });

    // Preload pages on hover
    const preloadedPages = new Set();
    links.forEach(link => {
      link.addEventListener('mouseenter', function() {
        const href = this.href;
        if (!preloadedPages.has(href) && this.hostname === window.location.hostname) {
          const prefetch = document.createElement('link');
          prefetch.rel = 'prefetch';
          prefetch.href = href;
          document.head.appendChild(prefetch);
          preloadedPages.add(href);
        }
      });
    });
  }

  // מתודה להתאמת כותרת הדף
  updatePageTitle(pageTitle) {
    const header = document.querySelector('#header h1');
    if (header && pageTitle) {
      header.textContent = `רותם עדיני - ${pageTitle}`;
    }
  }
}

// צור instance יחיד של הרכיבים המשותפים
const sharedComponents = new SharedComponents();

// ייצא לשימוש גלובלי
window.sharedComponents = sharedComponents;