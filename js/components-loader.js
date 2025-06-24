// Components Loader
class ComponentsLoader {
  constructor() {
    this.loadComponents();
  }

  async loadComponents() {
    try {
      // טען את קובץ הרכיבים המשותפים
      const response = await fetch('shared-components.html');
      const text = await response.text();
      
      // צור אלמנט זמני להחזיק את התוכן
      const temp = document.createElement('div');
      temp.innerHTML = text;
      
      // הוסף את כל ה-templates לדף
      const templates = temp.querySelectorAll('template');
      templates.forEach(template => {
        document.body.appendChild(template.cloneNode(true));
      });
      
      // טען את הרכיבים
      this.loadHeader();
      this.loadSidebar();
      this.loadFooter();
      
      // אתחל את ההתנהגות
      this.initializeMenuBehavior();
      
    } catch (error) {
      console.error('Error loading components:', error);
    }
  }

  loadHeader() {
    const template = document.getElementById('header-template');
    if (template && !document.getElementById('header')) {
      const headerContent = template.content.cloneNode(true);
      document.body.insertBefore(headerContent, document.body.firstChild);
    }
  }

  loadSidebar() {
    const template = document.getElementById('sidebar-template');
    if (template && !document.getElementById('sidebar')) {
      const sidebarContent = template.content.cloneNode(true);
      const header = document.getElementById('header');
      if (header) {
        header.insertAdjacentElement('afterend', sidebarContent.firstElementChild);
        header.insertAdjacentElement('afterend', sidebarContent.lastElementChild);
      }
    }
  }

  loadFooter() {
    const template = document.getElementById('footer-template');
    const existingFooter = document.querySelector('footer');
    
    if (template && !existingFooter) {
      const footerContent = template.content.cloneNode(true);
      document.body.appendChild(footerContent);
    }
  }

  initializeMenuBehavior() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (hamburger && sidebar && overlay) {
      hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
      });

      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      });

      // סגור תפריט בלחיצה על קישור
      const sidebarLinks = sidebar.querySelectorAll('a');
      sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
          sidebar.classList.remove('open');
          overlay.classList.remove('active');
        });
      });
    }
  }
}

// טען רכיבים כשהדף נטען
document.addEventListener('DOMContentLoaded', () => {
  new ComponentsLoader();
});

// ייצא לשימוש במודולים אחרים
window.ComponentsLoader = ComponentsLoader;