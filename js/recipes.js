// recipes.js - לוגיקה היררכית ללא תגיות על התמונות

// משתנים גלובליים
let allRecipes = [];
let currentMainCategory = 'all';
let currentSubCategory = 'all';

// הגדרת תת-קטגוריות לכל קטגוריה ראשית
const categoryHierarchy = {
  'חגים': ['פורים', 'פסח', 'ראש השנה', 'חנוכה', 'יום העצמאות'],
  'עוגות': ['עוגות גבינה', 'עוגות שוקולד', 'עוגות פירות', 'עוגות יום הולדת'],
  'עוגיות': ['עוגיות חמאה', 'עוגיות שוקולד', 'עוגיות מלוחות'],
  'קינוחים': ['מוס וסופלה', 'קינוחי כוסות', 'קרמים', 'פרפה'],
  'מנות עיקריות': ['בשר ועוף', 'דגים', 'צמחוני', 'פסטה', 'סלטים'],
  'מאפים': ['לחמים', 'מאפי בוקר', 'פיתות'],
  'בורקס': ['בורקס גבינות', 'בורקס תפוחי אדמה', 'בורקס ירקות'],
  'חטיפים': ['עוגיות מלוחות', 'חטיפי בריאות', 'נשנושים']
};

// פונקציה לחילוץ קטגוריה מהמתכון
function getRecipeCategory(recipe) {
  if (typeof recipe.category === 'string') {
    return recipe.category;
  }
  if (recipe.category && recipe.category.main) {
    return recipe.category.main;
  }
  return 'כללי';
}

// פונקציה לחילוץ תת-קטגוריה
function getRecipeSubCategory(recipe) {
  if (typeof recipe.category === 'object' && recipe.category.sub) {
    return recipe.category.sub;
  }
  return null;
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
    try {
      const response = await fetch('data/recipes.json');
      if (response.ok) {
        allRecipes = await response.json();
        console.log('Loaded recipes from JSON');
      } else {
        throw new Error('JSON not found');
      }
    } catch (jsonError) {
      if (window.recipesData) {
        allRecipes = window.recipesData;
        console.log('Loaded recipes from JS data');
      } else {
        throw new Error('No recipe data found');
      }
    }

    displayRecipes(allRecipes);
    updateResultsCount(allRecipes.length, allRecipes.length);
  } catch (error) {
    console.error('Error loading recipes:', error);
    document.getElementById('recipe-list').innerHTML = `
      <div class="recipe-card" style="text-align: center; padding: 40px;">
        <p>שגיאה בטעינת המתכונים</p>
      </div>
    `;
  }
}

// הצגת קטגוריה ראשית
function showMainCategory(category) {
  currentMainCategory = category;
  currentSubCategory = 'all';
  
  // עדכון כפתורים ראשיים
  document.querySelectorAll('.main-filters button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-category="${category}"]`).classList.add('active');

  // הצגת תת-מסננים
  showSubFilters(category);
  
  // סינון מתכונים
  filterRecipesByCategories();
}

// הצגת תת-מסננים
function showSubFilters(mainCategory) {
  const subFiltersContainer = document.getElementById('sub-filters');
  
  if (mainCategory === 'all') {
    // הסתרת תת-מסננים
    subFiltersContainer.style.display = 'none';
    return;
  }

  // יצירת תת-מסננים
  const subCategories = categoryHierarchy[mainCategory] || [];
  
  if (subCategories.length === 0) {
    subFiltersContainer.style.display = 'none';
    return;
  }

  // הצגת תת-מסננים
  subFiltersContainer.style.display = 'flex';
  
  let buttonsHtml = '<button onclick="showSubCategory(\'all\')" class="active sub-all">הכל</button>';
  
  subCategories.forEach(subCat => {
    buttonsHtml += `<button onclick="showSubCategory('${subCat}')" data-subcategory="${subCat}">${subCat}</button>`;
  });
  
  subFiltersContainer.innerHTML = buttonsHtml;
}

// הצגת תת-קטגוריה
function showSubCategory(subCategory) {
  currentSubCategory = subCategory;
  
  // עדכון כפתורי תת-קטגוריות
  document.querySelectorAll('.sub-filters button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  if (subCategory === 'all') {
    document.querySelector('.sub-all').classList.add('active');
  } else {
    document.querySelector(`[data-subcategory="${subCategory}"]`).classList.add('active');
  }
  
  // סינון מתכונים
  filterRecipesByCategories();
}

// סינון מתכונים לפי שתי רמות
function filterRecipesByCategories() {
  let filteredRecipes = allRecipes;

  // סינון לפי קטגוריה ראשית
  if (currentMainCategory !== 'all') {
    filteredRecipes = filteredRecipes.filter(recipe => {
      const mainCat = getRecipeCategory(recipe);
      const allCats = getRecipeAllCategories(recipe);
      return mainCat === currentMainCategory || allCats.includes(currentMainCategory);
    });
  }

  // סינון לפי תת-קטגוריה
  if (currentSubCategory !== 'all') {
    filteredRecipes = filteredRecipes.filter(recipe => {
      const subCat = getRecipeSubCategory(recipe);
      const allCats = getRecipeAllCategories(recipe);
      return subCat === currentSubCategory || allCats.includes(currentSubCategory);
    });
  }

  displayRecipes(filteredRecipes);
  updateResultsCount(filteredRecipes.length, allRecipes.length);
}

// הצגת המתכונים - ללא תגיות על התמונות
function displayRecipes(recipes) {
  const container = document.getElementById('recipe-list');
  if (!container) return;

  if (recipes.length === 0) {
    container.innerHTML = `
      <div class="recipe-card" style="text-align: center; padding: 40px;">
        <p>לא נמצאו מתכונים בקטגוריה זו</p>
        <button onclick="showMainCategory('all')" class="read-more-btn" style="margin-top: 20px;">
          חזרה להכל
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = recipes.map(recipe => {
    return `
      <div class="recipe-card-preview fade-in" data-id="${recipe.id}">
        <div class="recipe-image-container">
          <img src="${recipe.images?.thumbnail || 'images/recipes/default.jpg'}" 
               alt="${recipe.title}" 
               onerror="this.src='images/recipes/default.jpg'">
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

// עדכון מספר תוצאות
function updateResultsCount(current, total) {
  let countElement = document.querySelector('.search-results-count');
  if (!countElement) return;
  
  let text = '';
  if (currentMainCategory === 'all') {
    text = `מציג ${total} מתכונים`;
  } else {
    let categoryText = currentMainCategory;
    if (currentSubCategory !== 'all') {
      categoryText += ` > ${currentSubCategory}`;
    }
    text = `${categoryText}: ${current} מתכונים`;
  }
  
  countElement.textContent = text;
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
              <h3><i class="fas fa-chart-pie"></i> ערכים תזונתיים</h3>
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
  filterRecipesByCategories();
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
        filterRecipesByCategories();
      } else {
        searchRecipes(searchTerm);
      }
    });
  }
});

// ייצוא פונקציות לשימוש גלובלי
window.showMainCategory = showMainCategory;
window.showSubCategory = showSubCategory;
window.showFullRecipe = showFullRecipe;
window.backToList = backToList;
