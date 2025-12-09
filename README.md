# Verdant - Cannabis Discovery Platform Prototype

A premium minimalist cannabis discovery platform prototype showcasing product aggregation, search, filtering, and comparison features.

## Features

- **Landing Page**: Hero section with clear value proposition and path selection (Learn, Medical, Recreational)
- **Educational Content**: Comprehensive cannabis education covering cannabinoids, consumption methods, strain types, dosing, and safety
- **Product Discovery**: 
  - 15 medical CBD-focused products
  - 35 recreational THC products
  - Real strain names and realistic data
- **Advanced Filtering**: Separate filter sets for medical (conditions, CBD content) and recreational (effects, mood, THC potency)
- **Product Detail Pages**: Aggregated reviews, sentiment analysis, and links to source platforms (Leafly, Weedmaps, Reddit)
- **Comparison Tool**: Side-by-side comparison of up to 3 products
- **Premium Design**: Refined minimalist aesthetic with sage/eucalyptus color palette

## File Structure

```
verdant-prototype/
├── index.html           # Landing page
├── learn.html           # Educational content
├── medical.html         # Medical products browse
├── recreational.html    # Recreational products browse
├── product.html         # Product detail page
├── compare.html         # Product comparison tool
├── css/
│   └── main.css        # All styles
├── js/
│   └── main.js         # Product filtering & interaction
└── data/
    └── products.json   # 50 products (15 medical, 35 recreational)
```

## Setup Instructions

### Option 1: Local Development (Quickest)

1. Unzip the prototype folder
2. Open `index.html` directly in your browser
3. Navigate through the prototype

**Note**: Some browsers may block local file loading. If you see issues, use Option 2.

### Option 2: Local Web Server (Recommended)

If you have Python installed:

```bash
cd verdant-prototype
python3 -m http.server 8000
```

Then open: http://localhost:8000

If you have Node.js installed:

```bash
npx serve verdant-prototype
```

### Option 3: Deploy to Web (For Investor Demo)

**Vercel** (Recommended - Free):
1. Sign up at vercel.com
2. Install Vercel CLI: `npm install -g vercel`
3. Run `vercel` in the project folder
4. Get a live URL in seconds

**Netlify** (Alternative):
1. Sign up at netlify.com
2. Drag and drop the entire folder into Netlify's dashboard
3. Get a live URL instantly

## Key Features to Demonstrate

1. **Landing Page**: Show the three clear paths and search functionality
2. **Medical Products**: Demonstrate CBD-focused filtering by condition (e.g., "chronic pain")
3. **Recreational Products**: Show THC potency filtering and mood-based search
4. **Product Detail**: Click any product to see aggregated data and source links
5. **Comparison Tool**: Add 2-3 products to compare side-by-side
6. **Educational Content**: Comprehensive cannabis 101 for new users

## Product Data

All 50 products include:
- Real strain names (Blue Dream, OG Kush, Charlotte's Web, etc.)
- Realistic THC/CBD percentages
- Multiple effects/conditions
- Simulated review data
- Links to actual Leafly/Weedmaps product pages (will work if products exist there)

## Technology Stack

- Pure HTML/CSS/JavaScript (no frameworks)
- Responsive design
- Modern CSS with CSS variables for theming
- JSON-based product data
- Client-side filtering and search

## Customization

To modify the platform name from "Verdant":
1. Search/replace "Verdant" in all HTML files
2. Update the `.logo` class content in CSS if needed

To add more products:
1. Edit `data/products.json`
2. Follow the existing product structure
3. Add to either `medical` or `recreational` arrays

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Fully responsive

## Notes for Investor Pitch

- Emphasize the **aggregation** aspect - not a marketplace, just discovery
- Highlight **transparent sourcing** - all data linked to original platforms
- Show the **dual-audience** approach - medical and recreational clearly separated
- Demonstrate **filter sophistication** - users can narrow by very specific needs
- Point out **scalability** - structure supports thousands of products
- Mention **no liability** - informational only, users redirected to established platforms

## Market Positioning

- **Not competitors**: Leafly, Weedmaps (we send them traffic)
- **Value prop**: Single discovery layer across all platforms
- **Revenue model**: TBD (referral fees, advertising, data/analytics)
- **Initial market**: Start in one jurisdiction (e.g., Germany) to validate

## Contact & Support

This is a demonstration prototype. For production deployment:
- Backend API integration needed
- Real-time data scraping/aggregation pipeline
- User accounts and preferences
- Legal compliance per jurisdiction
- Payment integration (if applicable)

---

Built for investor demonstration - showcasing product vision and UX direction.
