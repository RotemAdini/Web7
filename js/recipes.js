// recipes.js - טעינת וניהול מתכונים מתוקן

// משתנה גלובלי לשמירת המתכונים
let allRecipes = [];

// טעינת המתכונים
async function loadRecipes() {
    try {
        // קודם נסה לטעון מ-JSON
        const response = await fetch('data/recipes.json');
        if (response.ok) {
            const data = await response.json();
            allRecipes = data;
            console.log('מתכונים נטענו מ-JSON:', allRecipes.length);
            displayRecipes(allRecipes);
            return;
        }
    } catch (error) {
        console.log('לא הצלחנו לטעון מ-JSON, נסה מהקוד:', error);
    }

    // אם JSON לא עובד, נסה מ-recipesData
    if (typeof recipesData !== 'undefined') {
        console.log('טוען מתכונים מ-recipesData');
        allRecipes = recipesData;
        displayRecipes(allRecipes);
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

// הצגת המתכונים
function displayRecipes(recipes) {
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
        <div class="recipe-card" data-category="${recipe.category || ''}" data-id="${recipe.id || ''}">
            ${recipe.image ? `
                <img src="${recipe.image}" alt="${recipe.title}" 
                     onerror="this.style.display='none'"
                     loading="lazy">
            ` : ''}
            
            <h2>${recipe.title}</h2>
            
            ${recipe.description ? `
                <p style="color:#666; margin-bottom:15px; font-style:italic;">
                    ${recipe.description}
                </p>
            ` : ''}
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                ${recipe.time ? `<span style="background:#e8f5e8; padding:5px 10px; border-radius:15px; font-size:14px;">⏱️ ${recipe.time} דקות</span>` : ''}
                ${recipe.servings ? `<span style="background:#e8f5e8; padding:5px 10px; border-radius:15px; font-size:14px;">👥 ${recipe.servings} מנות</span>` : ''}
                ${recipe.category ? `<span style="background:#f0e8ff; padding:5px 10px; border-radius:15px; font-size:14px;">${recipe.category}</span>` : ''}
            </div>
            
            ${recipe.ingredients ? renderIngredients(recipe.ingredients) : ''}
            ${recipe.instructions ? renderInstructions(recipe.instructions) : ''}
            
            ${recipe.nutrition ? `
                <div style="background:#f8f9fa; padding:15px; border-radius:10px; margin:20px 0;">
                    <strong>📊 ערכים תזונתיים:</strong><br>
                    ${recipe.nutrition}
                </div>
            ` : ''}
            
            ${recipe.tips ? `
                <div style="background:#fff3cd; padding:15px; border-radius:10px; margin:20px 0; border-left:4px solid #ffc107;">
                    <strong>💡 טיפ:</strong> ${recipe.tips}
                </div>
            ` : ''}
            
            ${recipe.link ? `
                <a href="${recipe.link}" target="_blank" class="button" 
                   style="margin-top:20px; display:inline-block; background:#E1306C; color:white; padding:12px 25px; text-decoration:none; border-radius:25px; font-weight:600;">
                    📱 צפו באינסטגרם
                </a>
            ` : ''}
        </div>
    `).join('');
}

// הצגת מצרכים
function renderIngredients(ingredients) {
    if (Array.isArray(ingredients)) {
        return `
            <div style="margin-bottom: 25px;">
                <h3 style="color:#6a1b9a; margin-bottom:10px;">🛒 מצרכים:</h3>
                <ul style="line-height:1.8; color:#333;">
                    ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
        `;
    } else if (typeof ingredients === 'object') {
        // אם המצרכים מחולקים לקטגוריות
        let html = '<div style="margin-bottom: 25px;"><h3 style="color:#6a1b9a; margin-bottom:15px;">🛒 מצרכים:</h3>';
        for (const [category, items] of Object.entries(ingredients)) {
            html += `
                <h4 style="color:#8e44ad; margin:15px 0 8px 0;">${category}:</h4>
                <ul style="line-height:1.8; color:#333; margin-bottom:15px;">
                    ${items.map(item => `<li>${item}</li>`).join('')}
                </ul>
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
        <div style="margin-bottom: 25px;">
            <h3 style="color:#6a1b9a; margin-bottom:15px;">👨‍🍳 אופן הכנה:</h3>
            <ol style="line-height:1.8; color:#333; padding-right:20px;">
                ${instructions.map(step => `<li style="margin-bottom:10px;">${step}</li>`).join('')}
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
        displayRecipes(allRecipes);
    } else {
        const filtered = allRecipes.filter(recipe => 
            recipe.category === category || 
            (recipe.categories && recipe.categories.includes(category))
        );
        displayRecipes(filtered);
    }
}

// הוספת חיפוש משופר
function setupSearch() {
    const searchContainer = document.createElement('div');
    searchContainer.style.cssText = `
        max-width: 600px;
        margin: 20px auto;
        padding: 0 20px;
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '🔍 חפש מתכון... (לדוגמה: בורקס, שוקולד, קינמון)';
    searchInput.className = 'recipe-search';
    searchInput.style.cssText = `
        width: 100%;
        padding: 15px 25px;
        border: 2px solid #ddd;
        border-radius: 30px;
        font-size: 16px;
        text-align: center;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        background: white;
    `;
    
    // אפקטים על החיפוש
    searchInput.addEventListener('focus', function() {
        this.style.borderColor = '#6a1b9a';
        this.style.boxShadow = '0 0 0 3px rgba(106, 27, 154, 0.1)';
        this.style.transform = 'scale(1.02)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.style.borderColor = '#ddd';
        this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        this.style.transform = 'scale(1)';
    });
    
    // פונקציית חיפוש משופרת
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            displayRecipes(allRecipes);
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
        
        displayRecipes(filtered);
        
        // הצגת מספר תוצאות
        const resultsCount = document.getElementById('search-results-count');
        if (resultsCount) {
            resultsCount.textContent = `נמצאו ${filtered.length} מתכונים`;
        }
    });
    
    // הוספת מונה תוצאות
    const resultsCounter = document.createElement('div');
    resultsCounter.id = 'search-results-count';
    resultsCounter.style.cssText = `
        text-align: center;
        margin-top: 10px;
        color: #666;
        font-size: 14px;
    `;
    
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(resultsCounter);
    
    // הוסף את תיבת החיפוש לפני הפילטרים
    const filters = document.querySelector('.recipe-filters');
    if (filters) {
        filters.parentNode.insertBefore(searchContainer, filters);
    }
}

// עדכון הפילטרים להתאים למתכונים שלך
function updateFilters() {
    const filtersContainer = document.querySelector('.recipe-filters');
    if (!filtersContainer) return;
    
    filtersContainer.innerHTML = `
        <button onclick="filterRecipes('all')" class="active">הכל</button>
        <button onclick="filterRecipes('בורקס')">בורקס</button>
        <button onclick="filterRecipes('עוגות')">עוגות</button>
        <button onclick="filterRecipes('עוגיות')">עוגיות</button>
        <button onclick="filterRecipes('קינוחים')">קינוחים</button>
        <button onclick="filterRecipes('מנות עיקריות')">מנות עיקריות</button>
    `;
}

// הוספת אנימציות למתכונים
function addRecipeAnimations() {
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    // אנימציה בכניסה
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
    
    // סטטיסטיקות מעניינות
    const categories = [...new Set(allRecipes.map(r => r.category))];
    console.log(`📂 קטגוריות: ${categories.join(', ')}`);
    
    const withImages = allRecipes.filter(r => r.image).length;
    console.log(`🖼️ מתכונים עם תמונות: ${withImages}/${allRecipes.length}`);
}

// אתחול כשהדף נטען
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 מתחיל לטעון מתכונים...');
    
    // הצגת הודעת טעינה
    document.getElementById('recipe-list').innerHTML = `
        <div class="recipe-card" style="text-align: center; padding: 40px;">
            <div style="font-size: 48px; margin-bottom: 20px;">🍽️</div>
            <h2>טוען מתכונים טעימים...</h2>
            <p>רק רגע קטן, המתכונים שלי בדרך אליכם!</p>
        </div>
    `;
    
    try {
        await loadRecipes();
        setupSearch();
        updateFilters();
        trackPerformance();
        
        // אנימציות רק אחרי שהכל נטען
        setTimeout(addRecipeAnimations, 100);
        
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
window.allRecipes = allRecipes;