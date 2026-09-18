import React, { useState } from 'react';
import './Food.css';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

// Fallback verified demo batches for instant interactive tracing
const demoBatches = {
  'KC-CHIPS-BATCH-2026': {
    batchId: 'KC-CHIPS-BATCH-2026',
    productName: 'Kone Chips (Plantain, Yam & Potato)',
    pesticideLevel: '0.0% (Non-GMO)',
    moistureLevel: '1.8% (Optimal Crisp)',
    scovilleHeat: 'Mild-Zesty Seasoning',
    certification: 'Organic Farm Direct & ISO-Food Safe',
    farmerName: 'Kwame & Efua Asare',
    farmerMeta: 'Smallholder Plantain Groves & Central Yam Co-op',
    farmerQuote: '"Our plantains and yams are sun-ripened on organic soil and harvested within 24 hours of kettle frying for unmatched crunch."',
    trail: [
      { date: 'June 02, 2026', text: 'Organic grove harvest & natural ripeness check', status: 'active' },
      { date: 'June 03, 2026', text: 'Precision kettle-cooking in cold-pressed oil', status: 'active' },
      { date: 'June 04, 2026', text: 'Sealed in airtight fresh-lock foil pouches', status: 'active' },
      { date: 'June 05, 2026', text: 'Quality & crispness verified, packaged & dispatched', status: 'current' }
    ]
  },
  'KS-SHITO-BATCH-2026': {
    batchId: 'KS-SHITO-BATCH-2026',
    productName: 'Kone Shito (Black Pepper Sauce)',
    pesticideLevel: '0.0%',
    moistureLevel: '12%',
    scovilleHeat: '85,000 SHU',
    certification: 'Organic Standard',
    farmerName: 'Kofi Mensah',
    farmerMeta: 'Field operations manager (Organic Crop Cluster)',
    farmerQuote: '"We feed our Scotch Bonnet pepper crop pure organic compost. No chemical fertilizer is ever allowed."',
    trail: [
      { date: 'May 24, 2026', text: 'Harvested from partner plots & quality checked', status: 'active' },
      { date: 'May 25, 2026', text: 'Slow sun-drying & moisture calibration', status: 'active' },
      { date: 'May 27, 2026', text: 'Dispatched to Accra packaging kitchen', status: 'active' },
      { date: 'May 29, 2026', text: 'Bottled, vacuum-sealed & shipped', status: 'current' }
    ]
  }
};

export default function Food() {
  const [productTab, setProductTab] = useState('chips');

  // Chips variety state
  const [chipVariety, setChipVariety] = useState('plantain');

  // Batch Search States
  const [showTraceModal, setShowTraceModal] = useState(false);
  const [searchBatchId, setSearchBatchId] = useState('');
  const [batchData, setBatchData] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [isLoadingBatch, setIsLoadingBatch] = useState(false);

  // Chip Varieties Configuration
  const chipVarieties = {
    plantain: {
      id: 'plantain',
      name: 'Golden Plantain Chips',
      scientific: 'Musa paradisiaca L.',
      origin: 'Partner Smallholder Groves, Ghana',
      tag: 'Flagship Snack',
      image: '/assets/products/plantain-chips.jpg',
      desc: 'Thinly sliced sun-drenched organic plantains kettle-cooked in cold-pressed oil. Incredibly light, crisp, and naturally rich in potassium and micronutrients.',
      tastingNotes: 'Crisp caramelized natural sweetness with a savory roasted salt finish.',
      nutrition: { crunchScore: '99.8%', oilAbsorption: 'Zero Trans Fat', shelfLife: '9 Months', calories: '140 kcal / serving' },
      colorAccent: '#eab308',
      badge: 'Golden Plantain',
      format: '150g Foil Pouch',
      packSpec: 'Kettle Cooked • Fresh-Lock Nitrogen'
    },
    yam: {
      id: 'yam',
      name: 'Crispy Yam Chips',
      scientific: 'Dioscorea alata',
      origin: 'Central Belt Farmlands, Ghana',
      tag: 'Savory Favorite',
      image: '/assets/products/yam-chips.jpg',
      desc: 'Authentic Ghanaian white yam sliced into ultra-crisp chips, kettle-fried and seasoned with roasted sea salt, cracked black pepper, and wild rosemary.',
      tastingNotes: 'Earthy, robust crunch with delicate herbal notes and clean roasted yam aroma.',
      nutrition: { crunchScore: '98.5%', oilAbsorption: 'Zero Cholesterol', shelfLife: '9 Months', calories: '135 kcal / serving' },
      colorAccent: '#f97316',
      badge: 'Ghanaian Yam',
      format: '150g Foil Pouch',
      packSpec: 'Slow Kettle Fried • Sea Salt & Herbs'
    },
    potato: {
      id: 'potato',
      name: 'Rustic Potato Crisps',
      scientific: 'Solanum tuberosum',
      origin: 'Highland Farms Cooperative',
      tag: 'Classic Crunch',
      image: '/assets/products/potato-chips.jpg',
      desc: 'Farm-fresh highland potatoes, slow kettle-cooked with skins on for authentic rustic crunch and seasoned with aromatic Ghanaian chili paprika.',
      tastingNotes: 'Deep golden potato flavor with a zesty, smoky paprika kick.',
      nutrition: { crunchScore: '99.2%', oilAbsorption: 'Cold-Pressed Oil Only', shelfLife: '9 Months', calories: '145 kcal / serving' },
      colorAccent: '#38bdf8',
      badge: 'Highland Potato',
      format: '150g Foil Pouch',
      packSpec: 'Skin-On Crisp • Ghanaian Chili Paprika'
    },
    trio: {
      id: 'trio',
      name: 'Kone Trio Variety Box',
      scientific: 'Musa + Dioscorea + Solanum Blend',
      origin: 'Multi-Hub Collective, Ghana',
      tag: 'Master Sampler',
      image: '/assets/products/trio-box.jpg',
      desc: 'The ultimate Ghanaian snacking experience. Includes Golden Plantain, Crispy Yam, and Rustic Potato packs in one presentation-grade gift and party box.',
      tastingNotes: 'The complete trifecta of sweet, savory, and rustic crunches in one premium package.',
      nutrition: { crunchScore: '100%', oilAbsorption: '100% Non-GMO', shelfLife: '9 Months', calories: '3 x 150g Packs' },
      colorAccent: '#ec4899',
      badge: '3-in-1 Combo',
      format: '3 x 150g Gift Box',
      packSpec: 'Gift Edition • Triple Harvest Sampler'
    }
  };

  const currentChip = chipVarieties[chipVariety];

  const executeTraceLookup = async (batchCode) => {
    const queryId = (batchCode || searchBatchId).trim().toUpperCase();
    if (!queryId) return;

    setSearchBatchId(queryId);
    setIsLoadingBatch(true);
    setSearchError('');

    if (demoBatches[queryId]) {
      setBatchData(demoBatches[queryId]);
      setShowTraceModal(true);
      setIsLoadingBatch(false);
      return;
    }

    if (db && db.app) {
      try {
        const batchDocRef = doc(db, 'farm_batches', queryId);
        const docSnap = await getDoc(batchDocRef);
        if (docSnap.exists()) {
          setBatchData({ batchId: queryId, ...docSnap.data() });
          setShowTraceModal(true);
        } else {
          setSearchError(`Batch ID "${queryId}" not found. Try "KC-CHIPS-BATCH-2026" or "KS-SHITO-BATCH-2026".`);
        }
      } catch (err) {
        console.error("Firestore batch query error:", err);
        setSearchError("Connection error while tracing batch. Please try again.");
      }
    } else {
      setSearchError(`Batch ID "${queryId}" not found. Try "KC-CHIPS-BATCH-2026" or "KS-SHITO-BATCH-2026".`);
    }
    setIsLoadingBatch(false);
  };

  const handleBatchSearch = (e) => {
    e.preventDefault();
    executeTraceLookup(searchBatchId);
  };

  return (
    <div className="food-div-page animate-fade-in">
      <div className="food-container">
        
        {/* Market & Gourmet Storefront Header */}
        <div className="food-header-section">
          <div className="farms-title-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge-pulse-dot" />
            100% Non-GMO Artisanal Pantry & Snacks
          </div>
          <h1 className="farms-headline">
            Ghanaian Flavor & <br className="desktop-break" />
            <span className="emerald-luminance">Precision Agro-Processing.</span>
          </h1>
          <p className="farms-subheadline">
            Farm-to-pantry excellence from Ghanaian smallholder partner farms. Handcrafted <strong>Kone Chips</strong> kettle-cooked to golden crispness and our authentic <strong>Kone Shito</strong> slow-cooked with organic Scotch Bonnet peppers.
          </p>

          {/* Product Category Segmented Control */}
          <div className="segmented-control-wrapper">
            <div className="segmented-control">
              <button 
                className={`segment-btn ${productTab === 'chips' ? 'active' : ''}`}
                onClick={() => setProductTab('chips')}
              >
                Kone Chips <span className="new-pill">NEW</span>
              </button>
              <button 
                className={`segment-btn ${productTab === 'shito' ? 'active' : ''}`}
                onClick={() => setProductTab('shito')}
              >
                Kone Shito
              </button>
              <button 
                className={`segment-btn ${productTab === 'all' ? 'active' : ''}`}
                onClick={() => setProductTab('all')}
              >
                View Both
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SHOWCASE 1: KONE CHIPS (Plantain, Yam & Potato) */}
        {/* ========================================================================= */}
        {(productTab === 'chips' || productTab === 'all') && (
          <div className="product-showcase-wrapper animate-fade-in">
            
            <div className="farms-card chips-showcase-card">
              
              {/* Showcase Top Bar */}
              <div className="showcase-top-bar">
                <div className="showcase-badges-group">
                  <span className="featured-badge chips-badge">★ New Product Line</span>
                  <span className="source-origin-tag">100% Non-GMO Organic Crop Sourced</span>
                </div>
                <span className="process-highlight-pill">
                  Kettle Cooked • Zero Trans Fat • 150g Nitrogen Pouch
                </span>
              </div>

              <div className="chips-container">
                
                {/* Photo Pouch Column with Realistic Photography */}
                <div className="chips-visual-column">
                  <div 
                    className="pouch-glow" 
                    style={{ background: `radial-gradient(circle, ${currentChip.colorAccent}45 0%, transparent 70%)` }}
                  />
                  
                  {/* Photo Display Card */}
                  <div className="photo-product-chassis">
                    <div className="photo-frame-wrapper">
                      <img 
                        src={currentChip.image} 
                        alt={currentChip.name} 
                        className="photo-product-img"
                        loading="eager"
                      />
                      <div className="photo-overlay-gradient"></div>
                      
                      <div className="photo-floating-badge" style={{ borderColor: currentChip.colorAccent, color: currentChip.colorAccent }}>
                        {currentChip.badge}
                      </div>

                      <div className="photo-spec-tag">
                        <span className="spec-format">{currentChip.format}</span>
                        <span className="spec-sub">{currentChip.packSpec}</span>
                      </div>
                    </div>
                  </div>

                  {/* Crop Variety Switcher */}
                  <div className="variety-selector-wrapper">
                    <span className="dist-label">Select Crop Base:</span>
                    <div className="variety-btn-grid">
                      <button 
                        className={`variety-btn ${chipVariety === 'plantain' ? 'active' : ''}`}
                        onClick={() => setChipVariety('plantain')}
                        style={{ '--active-border': '#eab308' }}
                      >
                        Plantain
                      </button>
                      <button 
                        className={`variety-btn ${chipVariety === 'yam' ? 'active' : ''}`}
                        onClick={() => setChipVariety('yam')}
                        style={{ '--active-border': '#f97316' }}
                      >
                        Yam
                      </button>
                      <button 
                        className={`variety-btn ${chipVariety === 'potato' ? 'active' : ''}`}
                        onClick={() => setChipVariety('potato')}
                        style={{ '--active-border': '#38bdf8' }}
                      >
                        Potato
                      </button>
                      <button 
                        className={`variety-btn ${chipVariety === 'trio' ? 'active' : ''}`}
                        onClick={() => setChipVariety('trio')}
                        style={{ '--active-border': '#ec4899' }}
                      >
                        Trio Box
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Info & Flavor Customizer Column */}
                <div className="chips-details-column">
                  <div className="product-title-row">
                    <span className="product-scientific-tag">{currentChip.scientific}</span>
                    <span className="origin-pill">📍 {currentChip.origin}</span>
                  </div>

                  <h2 className="product-main-heading">
                    {currentChip.name}
                  </h2>
                  
                  <p className="product-lead-desc">
                    {currentChip.desc}
                  </p>

                  <div className="tasting-notes-strip">
                    <strong>Tasting Notes:</strong> {currentChip.tastingNotes}
                  </div>

                  {/* Verified Quality & Processing Standards */}
                  <div className="flavor-selection-panel">
                    <span className="dist-label">Artisanal Quality & Processing Standards:</span>
                    <div className="flavor-options-grid">
                      <div className="flavor-choice-card">
                        <strong>✓ Kettle-Cooked Thin Cut</strong>
                        <small>Small-batch fried for optimal natural crunch</small>
                      </div>
                      <div className="flavor-choice-card">
                        <strong>✓ Cold-Pressed Vegetable Oil</strong>
                        <small>Zero trans fat and zero artificial frying agents</small>
                      </div>
                      <div className="flavor-choice-card">
                        <strong>✓ Natural Mineral Sea Salt</strong>
                        <small>Unrefined Ada coastal crystals and natural spices</small>
                      </div>
                      <div className="flavor-choice-card">
                        <strong>✓ Nitrogen Fresh Foil Seal</strong>
                        <small>Airtight multi-layer barrier locking in 9-month crispness</small>
                      </div>
                    </div>
                  </div>

                  {/* Nutrition & Crunch Metrics */}
                  <div className="chips-metrics-bar">
                    <div className="metric-box">
                      <span className="metric-value" style={{ color: currentChip.colorAccent }}>{currentChip.nutrition.crunchScore}</span>
                      <span className="metric-label">Crispness Index</span>
                    </div>
                    <div className="metric-box">
                      <span className="metric-value">1.8%</span>
                      <span className="metric-label">Moisture Checked</span>
                    </div>
                    <div className="metric-box">
                      <span className="metric-value">{currentChip.nutrition.shelfLife}</span>
                      <span className="metric-label">Foil Retention</span>
                    </div>
                  </div>

                  {/* Chip Batch Trace Hint Bar */}
                  <div 
                    className="chips-trace-hint"
                    onClick={() => executeTraceLookup('KC-CHIPS-BATCH-2026')}
                    style={{ cursor: 'pointer' }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" style={{ marginRight: '6px' }}>
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <span>Trace your chip bag telemetry: Tap to verify batch <strong>KC-CHIPS-BATCH-2026</strong> ➔</span>
                  </div>

                </div>

              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SHOWCASE 2: KONE SHITO */}
        {/* ========================================================================= */}
        {(productTab === 'shito' || productTab === 'all') && (
          <div className="product-showcase-wrapper animate-fade-in">
            
            <div className="farms-card shito-showcase-card">
              
              {/* Showcase Top Bar */}
              <div className="showcase-top-bar">
                <div className="showcase-badges-group">
                  <span className="featured-badge shito-badge">★ Culinary Heritage</span>
                  <span className="source-origin-tag">Ghanaian Organic Sourced</span>
                </div>
                <span className="process-highlight-pill" style={{ color: '#fca5a5', borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.1)' }}>
                  Slow Cooked • 100% Non-GMO • 350g Glass Jar
                </span>
              </div>

              <div className="shito-container">
                
                {/* Photo Display Card for Shito */}
                <div className="shito-visual-column">
                  <div className="photo-product-chassis">
                    <div className="photo-frame-wrapper">
                      <img 
                        src="/assets/products/shito-jar.jpg" 
                        alt="Kone Shito Premium Black Pepper Sauce" 
                        className="photo-product-img"
                        loading="eager"
                      />
                      <div className="photo-overlay-gradient"></div>
                      
                      <div className="photo-floating-badge" style={{ borderColor: '#ef4444', color: '#f87171' }}>
                        Authentic Shito
                      </div>

                      <div className="photo-spec-tag">
                        <span className="spec-format">350g Glass Jar</span>
                        <span className="spec-sub" style={{ background: 'rgba(153, 27, 27, 0.65)', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#fca5a5' }}>
                          Slow-Simmered Umami
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Authentic Formulation Profile */}
                  <div className="spice-meter">
                    <span className="dist-label">Authentic Culinary Profile:</span>
                    <div className="spice-slider" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                      <div className="flavor-choice-card" style={{ textAlign: 'center', padding: '0.65rem 0.4rem' }}>
                        <strong style={{ color: '#ef4444' }}>85,000 SHU</strong>
                        <small>Scotch Bonnet Heat</small>
                      </div>
                      <div className="flavor-choice-card" style={{ textAlign: 'center', padding: '0.65rem 0.4rem' }}>
                        <strong style={{ color: '#fbbf24' }}>Smoked Fish</strong>
                        <small>Herring & Shrimp</small>
                      </div>
                      <div className="flavor-choice-card" style={{ textAlign: 'center', padding: '0.65rem 0.4rem' }}>
                        <strong style={{ color: '#34d399' }}>Zero Additives</strong>
                        <small>100% Non-GMO</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product story */}
                <div className="chips-details-column">
                  <div className="product-title-row">
                    <span className="product-scientific-tag">Capsicum chinense + Allium cepa</span>
                    <span className="origin-pill">📍 Ghana Sourced</span>
                  </div>

                  <h2 className="product-main-heading">
                    Kone Authentic Shito
                  </h2>
                  
                  <p className="product-lead-desc">
                    Our signature black pepper sauce is slow-cooked over low flame using organic Scotch Bonnet peppers, pink shallots, wild dried herring, and smoked shrimp sourced directly from Ghanaian smallholder family farms.
                  </p>

                  <div className="tasting-notes-strip" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.06)' }}>
                    <strong>Flavor Profile:</strong> Deep smoky umami with a fiery, lingering caramelized chili finish.
                  </div>

                  <div className="shito-features-grid">
                    <div className="shito-feature-pill">85,000 Scoville Heat</div>
                    <div className="shito-feature-pill">Wild Caught Smoked Herring</div>
                    <div className="shito-feature-pill">100% Chemical-Free</div>
                    <div className="shito-feature-pill">Vacuum-Sealed Glass Jars</div>
                  </div>

                  {/* Culinary Companion Callout */}
                  <div className="culinary-pairing-card">
                    <strong style={{ color: '#fca5a5', display: 'block', marginBottom: '0.35rem' }}>Chef's Pairing Tip:</strong>
                    <span style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                      Dip our <strong>Kone Crispy Yam Chips</strong> or <strong>Golden Plantain Chips</strong> directly into Kone Shito for an irresistible Ghanaian street food experience at home.
                    </span>
                  </div>

                  {/* Shito Batch Trace Hint */}
                  <div 
                    className="chips-trace-hint"
                    onClick={() => executeTraceLookup('KS-SHITO-BATCH-2026')}
                    style={{ cursor: 'pointer', borderColor: '#f87171', background: 'rgba(239, 68, 68, 0.08)', marginTop: '1.5rem' }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" style={{ marginRight: '6px' }}>
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <span>Trace your shito jar telemetry: Tap to verify batch <strong>KS-SHITO-BATCH-2026</strong> ➔</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* UNIFIED BATCH TRACEABILITY CONSOLE */}
        {/* ========================================================================= */}
        <div className="farms-card trace-console-card animate-fade-in">
          <div className="trace-console-grid">
            <div style={{ textAlign: 'left' }}>
              <div className="farms-title-badge" style={{ background: 'rgba(245, 158, 11, 0.12)', borderColor: 'rgba(245, 158, 11, 0.25)', color: '#fbbf24', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="#fbbf24" strokeWidth="2.5" fill="none">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Quality & Agritech Assurance
              </div>
              <h2 style={{ color: 'white', fontSize: '1.8rem', margin: '0.5rem 0' }}>
                Trace Your Food Batch
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
                Every bag of <strong>Kone Chips</strong> and jar of <strong>Kone Shito</strong> has an authenticated batch code laser-printed on the packaging. Enter your code to view verified harvest dates, soil telemetry logs, and laboratory food-safety reports.
              </p>

              <div className="sample-batch-tags">
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>1-Click Instant Audit:</span>
                <button 
                  type="button" 
                  className="quick-code-btn"
                  onClick={() => executeTraceLookup('KC-CHIPS-BATCH-2026')}
                >
                  KC-CHIPS-BATCH-2026 (Chips)
                </button>
                <button 
                  type="button" 
                  className="quick-code-btn"
                  onClick={() => executeTraceLookup('KS-SHITO-BATCH-2026')}
                >
                  KS-SHITO-BATCH-2026 (Shito)
                </button>
              </div>
            </div>

            <div className="trace-input-column">
              <form onSubmit={handleBatchSearch}>
                <label htmlFor="batch-search-input" className="dist-label">Enter Printed Batch ID:</label>
                <div className="trace-input-group">
                  <input
                    id="batch-search-input"
                    type="text"
                    aria-label="Enter batch ID"
                    value={searchBatchId}
                    onChange={(e) => setSearchBatchId(e.target.value)}
                    placeholder="e.g. KC-CHIPS-BATCH-2026"
                    className="dist-input"
                  />
                  <button 
                    type="submit" 
                    className="farms-submit-btn trace-action-btn" 
                    aria-label="Trace batch"
                    disabled={isLoadingBatch}
                  >
                    {isLoadingBatch ? 'Auditing...' : 'Audit Batch ➔'}
                  </button>
                </div>
              </form>
              
              {searchError && (
                <div style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '0.75rem', fontWeight: 700 }}>
                  {searchError}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* KONE MARKET STOREFRONT BRIDGE BANNER */}
        {/* ========================================================================= */}
        <div id="distributor-hub-section" className="market-bridge-card">
          <div className="market-bridge-inner">
            <div className="market-badge-pill" style={{ borderColor: 'rgba(234, 179, 8, 0.4)', color: '#fef08a' }}>
              ✦ Official Kone Storefront & Wholesale Hub
            </div>
            <h3 className="market-bridge-title">
              Looking to Order Wholesale Cartons or Stock Kone Foods?
            </h3>
            <p className="market-bridge-desc">
              All commercial ordering, volume carton calculators, retail margin projections, and direct WhatsApp invoice dispatches are now centralized in <strong>The Kone Market</strong>.
            </p>
            <div className="market-bridge-actions">
              <a href="#market" className="farms-submit-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Open The Kone Market ➔
              </a>
              <a 
                href="https://wa.me/233240000000?text=Hello%20Kone%20Farms%20Logistics%2C%20I%20would%20like%20to%20inquire%20about%20ordering%20wholesale%20cartons." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="market-btn-secondary" 
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                Inquire on WhatsApp
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* --- Batch QR Trace smartphone popup modal --- */}
      {showTraceModal && batchData && (
        <div className="trace-modal-overlay animate-fade-in" onClick={() => setShowTraceModal(false)}>
          <div className="smartphone-chassis animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="smartphone-bezel">
              <div className="phone-camera-notch"></div>
              <button 
                className="phone-close-btn"
                aria-label="Close trace details"
                onClick={() => setShowTraceModal(false)}
              >
                ✕
              </button>

              <div className="smartphone-screen-scroll">
                <div className="phone-brand-header">
                  <span>KONE AGRITECH TELEMETRY</span>
                </div>

                <div className="trace-verified-seal">
                  <div className="verified-seal-badge">✓ BATCH TELEMETRY VERIFIED</div>
                  <h3 className="verified-batch-id">Batch #{batchData.batchId}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 700, margin: '0.2rem 0' }}>
                    {batchData.productName || 'Kone Food Product'}
                  </div>
                  <p className="verified-purity">Purity Audit: {batchData.pesticideLevel || '0.0% Detected'}</p>
                </div>

                <div className="phone-info-section">
                  <h5 className="phone-sect-label">Agricultural Crop Source</h5>
                  <div className="farmer-card-bubble">
                    <div className="farmer-avatar-emoji">
                      <svg viewBox="0 0 24 24" width="22" height="22" stroke="#34d399" strokeWidth="2" fill="none">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </div>
                    <div>
                      <strong className="farmer-bubble-name">{batchData.farmerName || 'Partner Grower'}</strong>
                      <span className="farmer-bubble-meta">{batchData.farmerMeta || 'Organic Field Cluster'}</span>
                      <p className="farmer-bubble-quote">
                        {batchData.farmerQuote || '"We prioritize soil health and organic principles."'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="phone-info-section">
                  <h5 className="phone-sect-label">Laboratory & Crispness Audit</h5>
                  <div className="diagnostics-bubble-grid">
                    <div className="diag-bubble">
                      <span className="diag-b-val">{batchData.moistureLevel || '1.8%'}</span>
                      <span className="diag-b-lbl">Moisture</span>
                    </div>
                    <div className="diag-bubble">
                      <span className="diag-b-val">{batchData.scovilleHeat || 'Mild-Zesty'}</span>
                      <span className="diag-b-lbl">Seasoning</span>
                    </div>
                    <div className="diag-bubble">
                      <span className="diag-b-val">{batchData.certification || 'Organic'}</span>
                      <span className="diag-b-lbl">Standard</span>
                    </div>
                  </div>
                </div>

                <div className="phone-info-section">
                  <h5 className="phone-sect-label">Supply Chain & Logistics Trail</h5>
                  <div className="timeline-trail-bubble">
                    {batchData.trail && batchData.trail.map((node, i) => (
                      <div key={i} className={`trail-node ${node.status || 'active'}`}>
                        <div className="trail-dot"></div>
                        <div className="trail-text">
                          <strong>{node.date}</strong>
                          <p>{node.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  className="farms-submit-btn" 
                  style={{ width: '100%', marginTop: '1rem' }}
                  onClick={() => setShowTraceModal(false)}
                >
                  Close Telemetry Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
