// recipes.js - לוגיקת המתכונים עם סינון מעודכן

// משתנים גלובליים
let allRecipes = [];
let currentFilter = 'all';

// פונקציה לחילוץ קטגוריה מהמתכון (תמיכה במבנה מעורב)
function getRecipeCategory(recipe) {
  if (typeof recipe.category === 'string') {
    return recipe.category;
  }
  if (recipe.category && recipe.category.main) {
    return recipe.category.main;
  }
  return 'כללי';
}

// פונקציה לחילוץ כל הקטגוריות והתגיות
function getRecipeAllCategories(recipe) {
  if (typeof recipe.category === 'string') {
    return [recipe.category];
  }
  
  const categories = [];
  if (recipe.category.main) categories.push(recipe.category.main);
  if (recipe.category.sub) categories.push(recipe.category.sub);
  if (recipe.category.tags) categories.push(...recipe.category.tags);
  
  return categories;
}

// טעינת המתכונים
async function loadRecipes() {
  try {
    // ניסיון לטעון מ-recipes.json קודם
    try {
      const response = await fetch('data/recipes.json');
      if (response.ok) {
        allRecipes = await response.json();
        console.log('Loaded recipes from JSON');
      } else {
        throw new Error('JSON not found');
      }
    } catch (jsonError) {
      // אם JSON לא נמצא, נשתמש ב-recipes-data.js
      if (window.recipesData) {
        allRecipes = window.recipesData;
        console.log('Loaded recipes from JS data');
      } else {
        throw new Error('No recipe data found');
      }
    }

    displayRecipes(allRecipes);
  } catch (error) {
    console.error('Error loading recipes:', error);
    document.getElementById('recipe-list').innerHTML = `
      <div class="recipe-card" style="text-align: center; padding: 40px;">
        <p>שגיאה בטעינת המתכונים</p>
      </div>
    `;
  }
}

// הצגת המתכונים
function displayRecipes(recipes) {
  const container = document.getElementById('recipe-list');
  if (!container) return;

  if (recipes.length === 0) {
    container.innerHTML = `
      <div class="recipe-card" style="text-align: center; padding: 40px;">
        <p>לא נמצאו מתכונים</p>
      </div>
    `;
    return;
  }

  container.innerHTML = recipes.map(recipe => {
    const category = getRecipeCategory(recipe);
    const nutrition = recipe.nutrition || recipe.nutritionPerServing || '';
    
    return `
      <div class="recipe-card-preview fade-in" data-id="${recipe.id}">
        <div class="recipe-image-container">
          <img src="${recipe.images?.thumbnail || 'images/recipes/default.jpg'}" 
               alt="${recipe.title}" 
               onerror="this.src='images/recipes/default.jpg'">
          <div class="recipe-category-badge">${category}</div>
        </div>
        <div class="recipe-preview-content">
          <h2>${recipe.title}</h2>
          <p class="recipe-description">${recipe.description}</p>
          <div class="recipe-meta">
            <span class="meta-item">
              <i class="fas fa-clock"></i> ${recipe.time} דקות
            </span>
            <span class="meta-item">
              <i class="fas fa-users"></i> ${recipe.servings} מנות
            </span>
            ${nutrition ? `<span class="meta-item"><i class="fas fa-calculator"></i> ${nutrition.split('|')[0]}</span>` : ''}
          </div>
          <button class="read-more-btn" onclick="showFullRecipe(${recipe.id})">
            קרא עוד <i class="fas fa-arrow-left"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // הוספת אנימציה
  setTimeout(() => {
    document.querySelectorAll('.recipe-card-preview').forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate');
      }, index * 100);
    });
  }, 100);
}

// סינון מתכונים
function filterRecipes(category) {
  currentFilter = category;
  
  // עדכון כפתורים
  document.querySelectorAll('.recipe-filters button').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  let filteredRecipes;
  
  if (category === 'all') {
    filteredRecipes = allRecipes;
  } else {
    filteredRecipes = allRecipes.filter(recipe => {
      const categories = getRecipeAllCategories(recipe);
      return categories.includes(category);
    });
  }

  displayRecipes(filteredRecipes);
  
  // עדכון מספר תוצאות
  updateResultsCount(filteredRecipes.length, allRecipes.length);
}

// עדכון מספר תוצאות
function updateResultsCount(current, total) {
  let countElement = document.querySelector('.search-results-count');
  if (!countElement) {
    countElement = document.createElement('div');
    countElement.className = 'search-results-count';
    document.querySelector('.recipe-filters').insertAdjacentElement('afterend', countElement);
  }
  
  if (currentFilter === 'all') {
    countElement.textContent = `מציג ${total} מתכונים`;
  } else {
    countElement.textContent = `מציג ${current} מתוך ${total} מתכונים`;
  }
}

// הצגת מתכון מלא
function showFullRecipe(recipeId) {
  const recipe = allRecipes.find(r => r.id === recipeId);
  if (!recipe) return;

  const container = document.getElementById('recipe-list');
  const category = getRecipeCategory(recipe);
  
  container.innerHTML = `
    <div class="full-recipe-container">
      <button class="back-to-list-btn" onclick="backToList()">
        <i class="fas fa-arrow-right"></i> חזרה לרשימה
      </button>
      
      <div class="full-recipe-card">
        <div class="recipe-header">
          <div class="recipe-image-full">
            <img src="${recipe.images?.main || recipe.images?.thumbnail || 'images/recipes/default.jpg'}" 
                 alt="${recipe.title}"
                 onerror="this.src='images/recipes/default.jpg'">
            <div class="recipe-category-badge-full">${category}</div>
          </div>
          
          <div class="recipe-title-section">
            <h1>${recipe.title}</h1>
            <p class="recipe-subtitle">${recipe.description}</p>
            
            <div class="recipe-stats">
              <div class="stat-item">
                <i class="fas fa-clock"></i>
                <span>זמן הכנה:</span>
                <strong>${recipe.time} דקות</strong>
              </div>
              <div class="stat-item">
                <i class="fas fa-users"></i>
                <span>כמות מנות:</span>
                <strong>${recipe.servings}</strong>
              </div>
              ${recipe.nutrition ? `
                <div class="stat-item">
                  <i class="fas fa-calculator"></i>
                  <span>תזונה למנה:</span>
                  <strong>${recipe.nutrition.split('|')[0]}</strong>
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="recipe-content">
          <div class="ingredients-section">
            <h3><i class="fas fa-list"></i> רכיבים</h3>
            ${formatIngredients(recipe.ingredients)}
          </div>

          <div class="instructions-section">
            <h3><i class="fas fa-tasks"></i> הוראות הכנה</h3>
            <ol class="instructions-list">
              ${recipe.instructions.map((instruction, index) => `
                <li>
                  <div class="step-number">${index + 1}</div>
                  <div class="step-text">${instruction}</div>
                </li>
              `).join('')}
            </ol>
          </div>

          ${recipe.nutrition ? `
            <div class="nutrition-info">
              <h3><i class="fas fa-chart-pie"></i> מידע תזונתי</h3>
              <p>${recipe.nutrition}</p>
            </div>
          ` : ''}

          ${recipe.tips ? `
            <div class="recipe-tips">
              <h3><i class="fas fa-lightbulb"></i> טיפים</h3>
              <p>${recipe.tips}</p>
            </div>
          ` : ''}

          <div class="recipe-actions">
            ${recipe.link ? `
              <a href="${recipe.link}" target="_blank" class="instagram-btn">
                <i class="fab fa-instagram"></i>
                צפה באינסטגרם
              </a>
            ` : `
              <a href="https://www.instagram.com/rotem.adini/" target="_blank" class="instagram-btn">
                <i class="fab fa-instagram"></i>
                עקבו באינסטגרם
              </a>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}

// פורמט רכיבים
function formatIngredients(ingredients) {
  if (Array.isArray(ingredients)) {
    return `
      <ul class="ingredients-list">
        ${ingredients.map(ingredient => `
          <li><i class="fas fa-circle"></i> ${ingredient}</li>
        `).join('')}
      </ul>
    `;
  }
  
  if (typeof ingredients === 'object') {
    return Object.entries(ingredients).map(([category, items]) => `
      <div class="ingredient-category">
        <h4>${category}</h4>
        <ul class="ingredients-list">
          ${items.map(ingredient => `
            <li><i class="fas fa-circle"></i> ${ingredient}</li>
          `).join('')}
        </ul>
      </div>
    `).join('');
  }
  
  return '<p>לא זמינים רכיבים</p>';
}

// חזרה לרשימה
function backToList() {
  if (currentFilter === 'all') {
    displayRecipes(allRecipes);
  } else {
    filterRecipes(currentFilter);
  }
}

// חיפוש מתכונים
function searchRecipes(searchTerm) {
  const filtered = allRecipes.filter(recipe => {
    const searchText = searchTerm.toLowerCase();
    return (
      recipe.title.toLowerCase().includes(searchText) ||
      recipe.description.toLowerCase().includes(searchText) ||
      getRecipeAllCategories(recipe).some(cat => 
        cat.toLowerCase().includes(searchText)
      ) ||
      (recipe.ingredients && JSON.stringify(recipe.ingredients).toLowerCase().includes(searchText))
    );
  });
  
  displayRecipes(filtered);
  updateResultsCount(filtered.length, allRecipes.length);
}

// אתחול דף המתכונים
document.addEventListener('DOMContentLoaded', function() {
  loadRecipes();
  
  // הוספת חיפוש אם יש תיבת חיפוש
  const searchInput = document.querySelector('.recipe-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.trim();
      if (searchTerm === '') {
        if (currentFilter === 'all') {
          displayRecipes(allRecipes);
        } else {
          filterRecipes(currentFilter);
        }
      } else {
        searchRecipes(searchTerm);
      }
    });
  }
});

// ייצוא פונקציות לשימוש גלובלי
window.filterRecipes = filterRecipes;
window.showFullRecipe = showFullRecipe;
window.backToList = backToList;
