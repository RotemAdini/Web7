// forest-game.js - אנימציית כוכבים לדף היער הקסום

// יצירת כוכבים מנצנצים
function createStars() {
  // בדיקה אם הקנבס כבר קיים
  if (document.getElementById('stars')) {
    console.log('Canvas already exists');
    return;
  }
  
  console.log('Creating stars canvas...');
  
  const canvas = document.createElement('canvas');
  canvas.id = 'stars';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';
  
  // הוספת הקנבס לתחילת ה-body
  document.body.insertBefore(canvas, document.body.firstChild);
  
  const ctx = canvas.getContext('2d');
  
  // התאמת גודל הקנבס
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // יצירת כוכבים
  const stars = [];
  const numStars = 200;
  
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random(),
      speed: Math.random() * 0.5 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.005
    });
  }
  
  // אנימציית הכוכבים
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
      // עדכון שקיפות (נצנוץ)
      star.opacity += star.twinkleSpeed;
      if (star.opacity > 1 || star.opacity < 0) {
        star.twinkleSpeed *= -1;
      }
      
      // הגבלת השקיפות
      star.opacity = Math.max(0, Math.min(1, star.opacity));
      
      // ציור הכוכב
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
      
      // הוספת זוהר לכוכבים גדולים
      if (star.size > 1.5) {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.3})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  console.log('Stars animation started');
}

// הפעלת האנימציה כשהדף נטען
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, creating stars...');
  createStars();
});

// גיבוי - אם ה-DOM כבר נטען
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  createStars();
}