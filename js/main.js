// Verdant - Product Discovery JavaScript

// Load product data
let allProducts = { medical: [], recreational: [] };

async function loadProducts() {
  try {
    const response = await fetch('data/products.json');
    allProducts = await response.json();
    return allProducts;
  } catch (error) {
    console.error('Error loading products:', error);
    return { medical: [], recreational: [] };
  }
}

// Filter products based on active filters
function filterProducts(products, filters) {
  return products.filter(product => {
    // Type filter
    if (filters.type && filters.type.length > 0) {
      if (!filters.type.includes(product.type)) return false;
    }
    
    // Format filter
    if (filters.format && filters.format.length > 0) {
      if (!filters.format.includes(product.format)) return false;
    }
    
    // Effects filter (for recreational)
    if (filters.effects && filters.effects.length > 0) {
      const hasEffect = filters.effects.some(effect => 
        product.effects?.includes(effect) || product.mood?.includes(effect)
      );
      if (!hasEffect) return false;
    }
    
    // Conditions filter (for medical)
    if (filters.conditions && filters.conditions.length > 0) {
      const hasCondition = filters.conditions.some(condition => 
        product.conditions?.includes(condition)
      );
      if (!hasCondition) return false;
    }
    
    // THC range filter
    if (filters.thcRange) {
      const thc = parseFloat(product.thc);
      if (filters.thcRange === 'low' && thc > 10) return false;
      if (filters.thcRange === 'medium' && (thc <= 10 || thc > 20)) return false;
      if (filters.thcRange === 'high' && thc <= 20) return false;
    }
    
    // CBD range filter
    if (filters.cbdRange) {
      const cbd = parseFloat(product.cbd);
      if (filters.cbdRange === 'low' && cbd > 5) return false;
      if (filters.cbdRange === 'medium' && (cbd <= 5 || cbd > 15)) return false;
      if (filters.cbdRange === 'high' && cbd <= 15) return false;
    }
    
    // Search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(searchLower);
      const matchesDescription = product.description?.toLowerCase().includes(searchLower);
      const matchesEffects = product.effects?.some(e => e.toLowerCase().includes(searchLower));
      const matchesConditions = product.conditions?.some(c => c.toLowerCase().includes(searchLower));
      const matchesSlang = product.slang?.some(s => s.toLowerCase().includes(searchLower));
      
      if (!(matchesName || matchesDescription || matchesEffects || matchesConditions || matchesSlang)) {
        return false;
      }
    }
    
    return true;
  });
}

// Render product card
function renderProductCard(product, category) {
  const effectsHTML = product.effects?.slice(0, 3).map(effect => 
    `<span class="effect-tag">${effect}</span>`
  ).join('') || '';
  
  const slangInfo = product.slang ? 
    `<div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 4px;">aka: ${product.slang.slice(0, 2).join(', ')}</div>` : '';
  
  return `
    <div class="product-card" onclick="viewProduct('${product.id}', '${category}')">
      <div class="product-image">🌿</div>
      <div class="product-info">
        <div class="product-type">${product.type}</div>
        <div class="product-name">${product.name}</div>
        ${slangInfo}
        <div class="product-meta">
          <span>THC: ${product.thc}</span>
          <span>CBD: ${product.cbd}</span>
          <span>${product.format}</span>
        </div>
        <div class="product-effects">${effectsHTML}</div>
      </div>
      <div class="product-footer">
        <div class="product-rating">
          <span>⭐</span>
          <span>${product.rating} (${product.reviews})</span>
        </div>
        <div class="product-price">${product.price}</div>
      </div>
    </div>
  `;
}

// Render products grid
function renderProducts(products, containerId, category) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  if (products.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-xl); color: var(--text-tertiary);">
        <h3>No products found</h3>
        <p style="margin-top: var(--space-sm);">Try adjusting your filters or search term</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = products.map(product => renderProductCard(product, category)).join('');
  
  // Update results count
  const countElement = document.getElementById('resultsCount');
  if (countElement) {
    countElement.textContent = `${products.length} products found`;
  }
}

// Handle filter tag clicks
function setupFilterTags(activeFilters, applyFiltersCallback) {
  const filterTags = document.querySelectorAll('.filter-tag');
  
  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const filterType = tag.dataset.filter;
      const filterValue = tag.dataset.value;
      
      // Toggle active state
      tag.classList.toggle('active');
      
      // Update filters object
      if (!activeFilters[filterType]) {
        activeFilters[filterType] = [];
      }
      
      const index = activeFilters[filterType].indexOf(filterValue);
      if (index > -1) {
        activeFilters[filterType].splice(index, 1);
      } else {
        activeFilters[filterType].push(filterValue);
      }
      
      // Apply filters
      applyFiltersCallback();
    });
  });
}

// Handle search input
function setupSearch(activeFilters, applyFiltersCallback) {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;
  
  // Check for URL search parameter
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('q');
  if (searchQuery) {
    searchInput.value = searchQuery;
    activeFilters.search = searchQuery;
  }
  
  searchInput.addEventListener('input', (e) => {
    activeFilters.search = e.target.value;
    applyFiltersCallback();
  });
  
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      applyFiltersCallback();
    }
  });
}

// Navigate to product detail page
function viewProduct(productId, category) {
  window.location.href = `product.html?id=${productId}&category=${category}`;
}

// Star rating display
function getStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = '⭐'.repeat(fullStars);
  if (hasHalfStar) stars += '½';
  return stars;
}

// Format number with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Sentiment badge
function getSentimentBadge(sentiment) {
  const colors = {
    positive: '#5F7A61',
    neutral: '#999',
    negative: '#C86060'
  };
  return `<span style="display: inline-block; padding: 4px 12px; background: ${colors[sentiment]}; color: white; border-radius: 12px; font-size: 0.8rem;">${sentiment}</span>`;
}

// Export functions for use in HTML pages
window.verdant = {
  loadProducts,
  filterProducts,
  renderProducts,
  setupFilterTags,
  setupSearch,
  viewProduct,
  getStarRating,
  formatNumber,
  getSentimentBadge
};
