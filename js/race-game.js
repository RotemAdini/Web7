// race-game.js - פונקציונליות לדף מירוץ האהבה

document.addEventListener('DOMContentLoaded', function() {
  // Smooth scroll to sections
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  
  scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const headerOffset = 80; // גובה ה-header
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Add animation to elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, observerOptions);

  // Observe all sections and cards
  const elementsToAnimate = document.querySelectorAll(
    '.challenge-card, .how-it-works-item, .benefit-card, .faq-item'
  );
  
  elementsToAnimate.forEach(el => {
    observer.observe(el);
  });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  .challenge-card,
  .how-it-works-item,
  .benefit-card,
  .faq-item {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  
  .fade-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* Stagger animation for grid items */
  .challenge-grid .fade-in:nth-child(1),
  .how-it-works-grid .fade-in:nth-child(1),
  .benefit-grid .fade-in:nth-child(1) {
    transition-delay: 0.1s;
  }
  
  .challenge-grid .fade-in:nth-child(2),
  .how-it-works-grid .fade-in:nth-child(2),
  .benefit-grid .fade-in:nth-child(2) {
    transition-delay: 0.2s;
  }
  
  .challenge-grid .fade-in:nth-child(3),
  .how-it-works-grid .fade-in:nth-child(3),
  .benefit-grid .fade-in:nth-child(3) {
    transition-delay: 0.3s;
  }
  
  .challenge-grid .fade-in:nth-child(4),
  .how-it-works-grid .fade-in:nth-child(4),
  .benefit-grid .fade-in:nth-child(4) {
    transition-delay: 0.4s;
  }
`;
document.head.appendChild(style);