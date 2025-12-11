// Verdant - Product Discovery JavaScript

// Application Version Configuration
const APP_VERSION = {
  number: 9,
  codename: 'Apple',
  get full() {
    return `v${this.number} · ${this.codename}`;
  }
};

// Update version in header on page load
function updateVersionDisplay() {
  const versionElements = document.querySelectorAll('.logo-version');
  versionElements.forEach(el => {
    el.textContent = APP_VERSION.full;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateVersionDisplay();
  setActiveNav();
});

// Set active navigation link based on current page
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    link.classList.remove('active');

    const href = link.getAttribute('href');
    // Check if the link matches the current page
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
}

// Call on page load
document.addEventListener('DOMContentLoaded', setActiveNav);

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
      if (filters.thcRange === 'medium' && (thc < 10 || thc >= 20)) return false;
      if (filters.thcRange === 'high' && thc < 20) return false;
    }
    
    // CBD range filter
    if (filters.cbdRange) {
      const cbd = parseFloat(product.cbd);
      if (filters.cbdRange === 'low' && cbd > 5) return false;
      if (filters.cbdRange === 'medium' && (cbd < 5 || cbd >= 15)) return false;
      if (filters.cbdRange === 'high' && cbd < 15) return false;
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
  if (!container || !Array.isArray(products)) return;
  
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

// Handle search input with autosuggest
function setupSearch(activeFilters, applyFiltersCallback, products = null, category = null) {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  // Prevent duplicate listener setup
  if (searchInput.dataset.searchSetup === 'true') {
    return;
  }
  searchInput.dataset.searchSetup = 'true';

  // Check for URL search parameter
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('q');
  if (searchQuery) {
    searchInput.value = searchQuery;
    activeFilters.search = searchQuery;
  }

  searchInput.addEventListener('input', (e) => {
    activeFilters.search = e.target.value;
    if (products) {
      updateAutosuggest(searchInput, products, category);
    }
    applyFiltersCallback();
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      applyFiltersCallback();
      closeAutosuggest(searchInput);
    }
  });

  searchInput.addEventListener('focus', (e) => {
    if (products && e.target.value.length > 0) {
      updateAutosuggest(searchInput, products, category);
    }
  });

  // Close autosuggest when clicking outside (single listener on document)
  const handleClickOutside = (e) => {
    if (!e.target.closest('.search-container')) {
      closeAutosuggest(searchInput);
    }
  };
  document.addEventListener('click', handleClickOutside);
}

// Update autosuggest dropdown
function updateAutosuggest(searchInput, products, category) {
  const searchValue = searchInput.value.toLowerCase();
  let dropdown = document.getElementById('autosuggestDropdown');

  // Create dropdown if it doesn't exist
  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.id = 'autosuggestDropdown';
    dropdown.className = 'autosuggest-dropdown';
    searchInput.closest('.search-container').appendChild(dropdown);
  }

  // Hide if search is empty
  if (searchValue.length === 0) {
    dropdown.classList.remove('active');
    return;
  }

  // Filter products based on search input
  const suggestions = products.filter(product => {
    const name = product.name.toLowerCase();
    const type = product.type.toLowerCase();
    const effects = (product.effects || []).map(e => e.toLowerCase());
    const mood = (product.mood || []).map(m => m.toLowerCase());
    const conditions = (product.conditions || []).map(c => c.toLowerCase());
    const slang = (product.slang || []).map(s => s.toLowerCase());

    return (
      name.includes(searchValue) ||
      type.includes(searchValue) ||
      effects.some(e => e.includes(searchValue)) ||
      mood.some(m => m.includes(searchValue)) ||
      conditions.some(c => c.includes(searchValue)) ||
      slang.some(s => s.includes(searchValue))
    );
  }).slice(0, 8); // Limit to 8 suggestions

  // Render suggestions
  if (suggestions.length === 0) {
    dropdown.innerHTML = `<div class="autosuggest-no-results">No products found</div>`;
  } else {
    dropdown.innerHTML = suggestions.map(product => {
      const safeName = escapeHtml(product.name);
      const safeType = escapeHtml(product.type);
      const safeId = escapeHtml(product.id);
      const safeCat = escapeHtml(category);
      return `
      <div class="autosuggest-item" onclick="selectSuggestion('${safeName}', '${safeId}', '${safeCat}')">
        <div class="autosuggest-item-icon">🌿</div>
        <div class="autosuggest-item-content">
          <div class="autosuggest-item-name">${safeName}</div>
          <div class="autosuggest-item-meta">${safeType}</div>
        </div>
      </div>
    `;
    }).join('');
  }

  dropdown.classList.add('active');
}

// Close autosuggest dropdown
function closeAutosuggest(searchInput) {
  const dropdown = document.getElementById('autosuggestDropdown');
  if (dropdown) {
    dropdown.classList.remove('active');
  }
}

// Escape HTML special characters for safe DOM insertion
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Handle suggestion selection
function selectSuggestion(productName, productId, category) {
  const searchInput = document.getElementById('searchInput') || document.getElementById('heroSearch');
  if (searchInput) {
    searchInput.value = productName;
    closeAutosuggest(searchInput);
  }

  // Validate inputs before navigation
  if (productId && category && typeof productId === 'string' && typeof category === 'string') {
    window.location.href = `product.html?id=${encodeURIComponent(productId)}&category=${encodeURIComponent(category)}`;
  }
}

// Navigate to product detail page
function viewProduct(productId, category) {
  if (productId && category && typeof productId === 'string' && typeof category === 'string') {
    window.location.href = `product.html?id=${encodeURIComponent(productId)}&category=${encodeURIComponent(category)}`;
  }
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

// Parse and apply URL filters from guided flow
function applyURLFilters(activeFilters) {
  const urlParams = new URLSearchParams(window.location.search);

  // Check if this came from guided flow
  const isFromGuidedFlow = urlParams.get('guided') === '1';

  // Parse array filters
  if (urlParams.has('conditions')) {
    activeFilters.conditions = urlParams.get('conditions').split(',').map(v => v.trim());
  }

  if (urlParams.has('effects')) {
    activeFilters.effects = urlParams.get('effects').split(',').map(v => v.trim());
  }

  if (urlParams.has('format')) {
    activeFilters.format = urlParams.get('format').split(',').map(v => v.trim());
  }

  if (urlParams.has('type')) {
    activeFilters.type = urlParams.get('type').split(',').map(v => v.trim());
  }

  // Parse single value filters
  if (urlParams.has('cbdRange')) {
    activeFilters.cbdRange = urlParams.get('cbdRange');
  }

  if (urlParams.has('thcRange')) {
    activeFilters.thcRange = urlParams.get('thcRange');
  }

  // Show notification if from guided flow
  if (isFromGuidedFlow) {
    setTimeout(() => {
      showGuidedFlowNotification();
    }, 300);
  }

  return activeFilters;
}

// Activate filter tags based on active filters
function activateFilterTags(activeFilters) {
  const filterTags = document.querySelectorAll('.filter-tag');

  filterTags.forEach(tag => {
    const filterType = tag.dataset.filter;
    const filterValue = tag.dataset.value;

    if (activeFilters[filterType]) {
      if (Array.isArray(activeFilters[filterType])) {
        if (activeFilters[filterType].includes(filterValue)) {
          tag.classList.add('active');
        }
      } else if (activeFilters[filterType] === filterValue) {
        tag.classList.add('active');
      }
    }
  });
}

// Show notification that filters have been applied from guided flow
function showGuidedFlowNotification() {
  const notification = document.createElement('div');
  notification.className = 'guided-notification';
  notification.innerHTML = `
    <div class="guided-notification-content">
      <span class="guided-notification-icon">✓</span>
      <span class="guided-notification-text">Filters applied based on your preferences</span>
      <button class="guided-notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('active');
  }, 10);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove('active');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
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
  getSentimentBadge,
  applyURLFilters,
  activateFilterTags,
  showGuidedFlowNotification
};
