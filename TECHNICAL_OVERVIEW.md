# Verdant - Technical Overview

## Current Prototype

**Technology**: Pure HTML/CSS/JavaScript
**Purpose**: Rapid investor demonstration
**Data**: 50 sample products in JSON format
**Hosting**: Can run locally or deploy to Vercel/Netlify instantly

---

## Production Architecture (Proposed)

### Frontend
- **Framework**: React or Next.js
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context or Redux for complex filtering
- **Mobile**: Progressive Web App (PWA) for app-like mobile experience

### Backend
- **API**: Node.js with Express or Nest.js
- **Database**: PostgreSQL for product data, user preferences
- **Caching**: Redis for frequently accessed product data
- **Search**: Elasticsearch for advanced filtering and full-text search

### Data Pipeline
- **Scraping**: Python with Scrapy/BeautifulSoup
- **Schedule**: Daily updates via cron jobs
- **Quality**: Data validation, deduplication, conflict resolution
- **Storage**: Raw scraped data in S3, processed data in PostgreSQL

### Infrastructure
- **Hosting**: AWS or Vercel (backend + frontend)
- **CDN**: CloudFront or Vercel Edge for fast global delivery
- **Monitoring**: Sentry for errors, DataDog for performance
- **Analytics**: Mixpanel or Amplitude for user behavior

---

## Data Model

### Products Table
```
- id (UUID)
- name (string)
- type (string: 'medical' | 'recreational')
- strain_type (string: 'sativa' | 'indica' | 'hybrid')
- thc_percentage (decimal)
- cbd_percentage (decimal)
- format (string: 'flower' | 'oil' | 'edible' | etc)
- effects (array)
- conditions (array) // for medical
- mood_tags (array) // for recreational
- description (text)
- average_rating (decimal)
- total_reviews (integer)
- price_range (string)
- created_at, updated_at (timestamps)
```

### Sources Table
```
- id (UUID)
- product_id (foreign key)
- platform (string: 'leafly' | 'weedmaps' | 'reddit')
- url (string)
- sentiment (string: 'positive' | 'neutral' | 'negative')
- last_scraped (timestamp)
```

### User Preferences (Future)
```
- user_id (UUID)
- preferred_category (string)
- saved_products (array)
- filter_presets (JSON)
```

---

## Scraping Strategy

### Phase 1: Manual Data Entry
- Initial launch with 100-200 manually curated products
- Focus on quality over quantity
- Validate market fit before heavy engineering

### Phase 2: Automated Scraping
- Target platforms: Leafly, Weedmaps, Reddit (r/trees, r/CBD)
- Scraping frequency: Daily for new products, weekly for review updates
- Challenges to address:
  - Rate limiting
  - CAPTCHA handling
  - Structure changes in source sites
  - Data deduplication (same product across platforms)

### Phase 3: Partnerships
- Negotiate API access with Leafly/Weedmaps
- Cleaner data, faster updates, no scraping maintenance
- Revenue share or partnership terms

---

## Search & Filtering Technical Approach

### Current (Prototype)
- Client-side JavaScript filtering
- Works for <1000 products
- Fast, no backend required

### Production
- Server-side filtering with Elasticsearch
- Faceted search (filter by multiple criteria)
- Autocomplete suggestions
- Fuzzy matching for strain names
- Ranking algorithm:
  1. Exact name match
  2. Effects/conditions match
  3. High user ratings
  4. Recent reviews

---

## Scalability Considerations

### Performance
- **Problem**: 10,000+ products slow to filter client-side
- **Solution**: Backend API with pagination, indexed database queries

### Data Freshness
- **Problem**: Daily scraping of 10,000 products is slow
- **Solution**: Prioritize popular products, scrape less popular ones weekly

### Legal Compliance
- **Problem**: Different regulations per market/country
- **Solution**: Market-specific product catalogs, compliance flags in database

### Search Accuracy
- **Problem**: Slang terms, misspellings ("OG Kush" vs "Original Gangster")
- **Solution**: Synonym mapping, fuzzy search, user feedback loop

---

## Security & Privacy

### Data Protection
- No user data collection initially (anonymous browsing)
- If accounts added: email only, no personal info required
- GDPR compliance for EU markets (cookie consent, data deletion)

### Scraping Ethics
- Respect robots.txt
- Rate limiting to avoid overloading source sites
- Credit all sources clearly
- Remove data if requested by source platform

---

## Development Timeline (with $100k seed funding)

### Month 1: Foundation
- Set up production infrastructure (AWS/Vercel)
- Build React frontend with design system
- Create database schema and backend API
- Manual data entry: 100 products

### Month 2: Core Features
- Implement advanced filtering and search
- Build product detail pages with source aggregation
- Comparison tool
- Educational content CMS

### Month 3: Data Pipeline
- Build scraping infrastructure for Leafly/Weedmaps
- Implement data quality checks
- Set up automated daily updates
- Expand to 500+ products

### Month 4: Testing & Launch
- Beta testing with 50-100 users
- Bug fixes and UX refinement
- Legal review and compliance
- Soft launch in target market

### Ongoing: Iteration
- User feedback incorporation
- Performance optimization
- Data accuracy improvements
- New features based on usage patterns

---

## Cost Breakdown (Monthly, Post-Launch)

**Infrastructure**
- Hosting (AWS/Vercel): $100-200
- Database (PostgreSQL): $50-100
- CDN & Bandwidth: $50-100
- Monitoring tools: $50

**Data & Operations**
- Scraping infrastructure: $100-200
- Data storage: $50
- Email (if notifications): $20

**Development**
- 2 full-time developers: $10k-15k
- Designer (part-time): $2k-3k
- Product lead: $5k-8k

**Total**: ~$18k-27k/month for a small team

**Note**: This drops significantly with open-source tools and lean operations. Prototype to MVP can be done much cheaper with 1-2 people hustling.

---

## Technical Risks & Mitigation

### Risk 1: Source sites block scraping
**Impact**: High - data pipeline breaks
**Mitigation**: 
- Build partnerships early
- Diversify sources (don't depend on one platform)
- Offer value to sources (traffic referrals)

### Risk 2: Data accuracy issues
**Impact**: High - users lose trust
**Mitigation**:
- Manual review process for flagged data
- User reporting system for errors
- Multiple source cross-verification

### Risk 3: Legal/regulatory challenges
**Impact**: High - could shut down
**Mitigation**:
- Legal review before each market entry
- Clear disclaimers (informational only)
- No medical claims or advice
- Geo-blocking for restricted markets

### Risk 4: Competition
**Impact**: Medium - Leafly could add similar feature
**Mitigation**:
- Move fast, build network effects
- Better UX than incumbents
- Focus on niches (medical patients, first-timers)

---

## Why This Technical Approach Works

1. **Proven Stack**: React + Node + PostgreSQL is battle-tested, hire-able, scalable
2. **Fast MVP**: Can ship production v1 in 3-4 months
3. **Lean Operations**: Small team can maintain once data pipeline is stable
4. **Flexible**: Easy to pivot features based on user feedback
5. **Scalable**: Architecture handles 10k products as easily as 100k

---

## Open Questions for Discussion

1. **Data partnerships**: Try to partner with Leafly/Weedmaps from the start, or build scraping first and negotiate later?
2. **Monetization**: Wait until product-market fit, or build revenue features (ads, premium) from day one?
3. **Geographic focus**: Single market (Germany? California?) or multi-market launch?
4. **Mobile**: PWA or native apps? Mobile web is likely sufficient for MVP.

---

This prototype demonstrates the vision. With proper funding and a small technical team, we can have a production-ready platform in 4 months.
