// recipes.js - מערכת מתכונים עם תצוגת רשימה ומתכון מלא

// משתנה גלובלי לשמירת המתכונים
let allRecipes = [];
let currentView = 'list'; // 'list' או 'full'
let selectedRecipe = null;

// טעינת המתכונים
async function loadRecipes() {
    try {
        // קודם נסה לטעון מ-JSON
        const response = await fetch('data/recipes.json');
        if (response.ok) {
            const data = await response.json();
            allRecipes = data;
            console.log('מתכונים נטענו מ-JSON:', allRecipes.length);
            displayRecipesList(allRecipes);
            return;
        }
    } catch (error) {
        console.log('לא הצלחנו לטעון מ-JSON, נסה מהקוד:', error);
    }

    // אם JSON לא עובד, נסה מ-recipesData
    if (typeof recipesData !== 'undefined') {
        console.log('טוען מתכונים מ-recipesData');
        allRecipes = recipesData;
        displayRecipesList(allRecipes);
        return;
    }

    // אם שום דבר לא עובד - הצג שגיאה
    console.error('לא הצלחנו לטעון מתכונים');
    document.getElementById('recipe-list').innerHTML = `
        <div class="recipe-card" style="text-align: center; padding: 40px;">
            <h2 style="color: #e74c3c;">⚠️ שגיאה בטעינת המתכונים</h2>
            <p>אנא וודאי שקובץ <code>data/recipes.json</code> קיים</p>
            <p>או שקובץ <code>js/recipes-data.js</code> טעון</p>
        </div>
    `;
}

// הצגת רשימת המתכונים (תצוגה קצרה)
function displayRecipesList(recipes) {
    currentView = 'list';
    const container = document.getElementById('recipe-list');
    
    if (!recipes || recipes.length === 0) {
        container.innerHTML = `
            <div class="recipe-card" style="text-align: center; padding: 40px;">
                <h2>🍽️ אין מתכונים להצגה</h2>
                <p>המתכונים שלי בדרך אליכם...</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recipes.map(recipe => `
        <div class="recipe-card-preview" data-category="${recipe.category || ''}" data-id="${recipe.id || ''}">
            <div class="recipe-image-container">
                <img src="imagesrecipes/recipe-${recipe.id}.jpg" 
                     alt="${recipe.title}" 
                     onerror="this.src='imagesrecipes/default-recipe.jpg'; this.onerror=null;"
                     loading="lazy">
                <div class="recipe-category-badge">${recipe.category || 'מתכון'}</div>
            </div>
            
            <div class="recipe-preview-content">
                <h2>${recipe.title}</h2>
                
                ${recipe.description ? `
                    <p class="recipe-description">
                        ${recipe.description}
                    </p>
                ` : ''}
                
                <div class="recipe-meta">
                    ${recipe.time ? `<span class="meta-item">⏱️ ${recipe.time} דקות</span>` : ''}
                    ${recipe.servings ? `<span class="meta-item">👥 ${recipe.servings} מנות</span>` : ''}
                </div>
                
                <button class="read-more-btn" onclick="showFullRecipe(${recipe.id})">
                    קרא עוד
                    <i class="fas fa-arrow-left"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // הוסף אנימציות
    setTimeout(addRecipeAnimations, 100);
}

// הצגת מתכון מלא
function showFullRecipe(recipeId) {
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    selectedRecipe = recipe;
    currentView = 'full';
    const container = document.getElementById('recipe-list');
    
    container.innerHTML = `
        <div class="full-recipe-container">
            <button class="back-to-list-btn" onclick="backToList()">
                <i class="fas fa-arrow-right"></i>
                חזור לרשימת המתכונים
            </button>
            
            <div class="full-recipe-card">
                <div class="recipe-header">
                    <div class="recipe-image-full">
                        <img src="imagesrecipes/recipe-${recipe.id}.jpg" 
                             alt="${recipe.title}" 
                             onerror="this.src='imagesrecipes/default-recipe.jpg'; this.onerror=null;">
                        <div class="recipe-category-badge-full">${recipe.category || 'מתכון'}</div>
                    </div>
                    
                    <div class="recipe-title-section">
                        <h1>${recipe.title}</h1>
                        ${recipe.description ? `<p class="recipe-subtitle">${recipe.description}</p>` : ''}
                        
                        <div class="recipe-stats">
                            ${recipe.time ? `<div class="stat-item"><i class="fas fa-clock"></i><span>זמן הכנה</span><strong>${recipe.time} דקות</strong></div>` : ''}
                            ${recipe.servings ? `<div class="stat-item"><i class="fas fa-users"></i><span>כמות מנות</span><strong>${recipe.servings} מנות</strong></div>` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="recipe-content">
                    ${recipe.ingredients ? renderIngredients(recipe.ingredients) : ''}
                    ${recipe.instructions ? renderInstructions(recipe.instructions) : ''}
                    
                    ${recipe.nutrition ? `
                        <div class="nutrition-info">
                            <h3><i class="fas fa-chart-pie"></i> ערכים תזונתיים</h3>
                            <p>${recipe.nutrition}</p>
                        </div>
                    ` : ''}
                    
                    ${recipe.tips ? `
                        <div class="recipe-tips">
                            <h3><i class="fas fa-lightbulb"></i> טיפ מיוחד</h3>
                            <p>${recipe.tips}</p>
                        </div>
                    ` : ''}
                    
                    ${recipe.link ? `
                        <div class="recipe-actions">
                            <a href="${recipe.link}" target="_blank" class="instagram-btn">
                                <i class="fab fa-instagram"></i>
                                צפו במתכון באינסטגרם
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    // גלילה לראש הדף
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// חזרה לרשימת המתכונים
function backToList() {
    if (document.querySelector('#search-results-count')?.textContent) {
        // אם יש חיפוש פעיל, הצג את תוצאות החיפוש
        const searchInput = document.querySelector('.recipe-search');
        if (searchInput && searchInput.value.trim()) {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const filtered = allRecipes.filter(recipe => {
                return recipe.title.toLowerCase().includes(searchTerm) ||
                       (recipe.description && recipe.description.toLowerCase().includes(searchTerm)) ||
                       (recipe.category && recipe.category.toLowerCase().includes(searchTerm)) ||
                       (recipe.ingredients && JSON.stringify(recipe.ingredients).toLowerCase().includes(searchTerm));
            });
            displayRecipesList(filtered);
            return;
        }
    }
    
    // אם יש פילטר פעיל
    const activeFilter = document.querySelector('.recipe-filters button.active');
    if (activeFilter && !activeFilter.getAttribute('onclick')?.includes("'all'")) {
        const category = activeFilter.getAttribute('onclick').match(/'([^']+)'/)[1];
        const filtered = allRecipes.filter(recipe => recipe.category === category);
        displayRecipesList(filtered);
    } else {
        displayRecipesList(allRecipes);
    }
}

// הצגת מצרכים
function renderIngredients(ingredients) {
    if (Array.isArray(ingredients)) {
        return `
            <div class="ingredients-section">
                <h3><i class="fas fa-shopping-cart"></i> מצרכים</h3>
                <ul class="ingredients-list">
                    ${ingredients.map(ingredient => `<li><i class="fas fa-check"></i>${ingredient}</li>`).join('')}
                </ul>
            </div>
        `;
    } else if (typeof ingredients === 'object') {
        let html = '<div class="ingredients-section"><h3><i class="fas fa-shopping-cart"></i> מצרכים</h3>';
        for (const [category, items] of Object.entries(ingredients)) {
            html += `
                <div class="ingredient-category">
                    <h4>${category}</h4>
                    <ul class="ingredients-list">
                        ${items.map(item => `<li><i class="fas fa-check"></i>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        html += '</div>';
        return html;
    }
    return '';
}

// הצגת הוראות הכנה
function renderInstructions(instructions) {
    if (!Array.isArray(instructions)) return '';
    
    return `
        <div class="instructions-section">
            <h3><i class="fas fa-list-ol"></i> אופן הכנה</h3>
            <ol class="instructions-list">
                ${instructions.map((step, index) => `
                    <li>
                        <span class="step-number">${index + 1}</span>
                        <span class="step-text">${step}</span>
                    </li>
                `).join('')}
            </ol>
        </div>
    `;
}

// פונקציית סינון מתכונים
function filterRecipes(category) {
    // עדכון כפתורים פעילים
    const buttons = document.querySelectorAll('.recipe-filters button');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick')?.includes(`'${category}'`)) {
            btn.classList.add('active');
        }
    });
    
    // סינון והצגה
    if (category === 'all') {
        displayRecipesList(allRecipes);
    } else {
        const filtered = allRecipes.filter(recipe => 
            recipe.category === category || 
            (recipe.categories && recipe.categories.includes(category))
        );
        displayRecipesList(filtered);
    }
    
    // נקה תיבת חיפוש
    const searchInput = document.querySelector('.recipe-search');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // נקה מונה תוצאות חיפוש
    const resultsCounter = document.getElementById('search-results-count');
    if (resultsCounter) {
        resultsCounter.textContent = '';
    }
}

// הוספת חיפוש משופר
function setupSearch() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '🔍 חפש מתכון... (לדוגמה: בורקס, שוקולד, קינמון)';
    searchInput.className = 'recipe-search';
    
    // פונקציית חיפוש משופרת
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            displayRecipesList(allRecipes);
            document.getElementById('search-results-count').textContent = '';
            return;
        }
        
        const filtered = allRecipes.filter(recipe => {
            // חיפוש בכותרת
            if (recipe.title.toLowerCase().includes(searchTerm)) return true;
            
            // חיפוש בתיאור
            if (recipe.description && recipe.description.toLowerCase().includes(searchTerm)) return true;
            
            // חיפוש בקטגוריה
            if (recipe.category && recipe.category.toLowerCase().includes(searchTerm)) return true;
            
            // חיפוש במצרכים
            if (recipe.ingredients) {
                const ingredientsText = JSON.stringify(recipe.ingredients).toLowerCase();
                if (ingredientsText.includes(searchTerm)) return true;
            }
            
            // חיפוש בהוראות
            if (recipe.instructions) {
                const instructionsText = recipe.instructions.join(' ').toLowerCase();
                if (instructionsText.includes(searchTerm)) return true;
            }
            
            // חיפוש בטיפים
            if (recipe.tips && recipe.tips.toLowerCase().includes(searchTerm)) return true;
            
            return false;
        });
        
        displayRecipesList(filtered);
        
        // הצגת מספר תוצאות
        const resultsCount = document.getElementById('search-results-count');
        if (resultsCount) {
            resultsCount.textContent = `נמצאו ${filtered.length} מתכונים`;
        }
        
        // נקה פילטרים פעילים
        const buttons = document.querySelectorAll('.recipe-filters button');
        buttons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.recipe-filters button[onclick*="all"]').classList.add('active');
    });
    
    // הוספת מונה תוצאות
    const resultsCounter = document.createElement('div');
    resultsCounter.id = 'search-results-count';
    resultsCounter.className = 'search-results-count';
    
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(resultsCounter);
    
    // הוסף את תיבת החיפוש לפני הפילטרים
    const filters = document.querySelector('.recipe-filters');
    if (filters) {
        filters.parentNode.insertBefore(searchContainer, filters);
    }
}

// הוספת אנימציות למתכונים
function addRecipeAnimations() {
    const recipeCards = document.querySelectorAll('.recipe-card-preview, .full-recipe-card');
    
    recipeCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// מעקב אחר ביצועים
function trackPerformance() {
    console.log(`📊 נטענו ${allRecipes.length} מתכונים בהצלחה`);
    
    const categories = [...new Set(allRecipes.map(r => r.category))];
    console.log(`📂 קטגוריות: ${categories.join(', ')}`);
}

// אתחול כשהדף נטען
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 מתחיל לטעון מתכונים...');
    
    // הצגת הודעת טעינה
    document.getElementById('recipe-list').innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner">🍽️</div>
            <h2>טוען מתכונים טעימים...</h2>
            <p>רק רגע קטן, המתכונים שלי בדרך אליכם!</p>
        </div>
    `;
    
    try {
        await loadRecipes();
        setupSearch();
        trackPerformance();
        
    } catch (error) {
        console.error('❌ שגיאה באתחול:', error);
        document.getElementById('recipe-list').innerHTML = `
            <div class="recipe-card" style="text-align: center; padding: 40px;">
                <h2 style="color: #e74c3c;">😅 אופס! משהו השתבש</h2>
                <p>נסו לרענן את הדף או חזרו אחר כך</p>
            </div>
        `;
    }
});

// הפוך פונקציות לגלובליות לשימוש בדף
window.filterRecipes = filterRecipes;
window.showFullRecipe = showFullRecipe;
window.backToList = backToList;
window.allRecipes = allRecipes;
