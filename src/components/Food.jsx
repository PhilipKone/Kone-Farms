import React, { useState } from 'react';
import './Food.css';
import { db } from '../firebase/config';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

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
      { date: 'June 02, 2026', text: 'Organic grove harvest & sugar-brix indexing', status: 'active' },
      { date: 'June 03, 2026', text: 'Precision kettle-frying in cold-pressed oil', status: 'active' },
      { date: 'June 04, 2026', text: 'Nitrogen-flushed vacuum sealed foil pouches', status: 'active' },
      { date: 'June 05, 2026', text: 'Quality checked (99.8% crispness index) & dispatched', status: 'current' }
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
      { date: 'May 24, 2026', text: 'Harvested & telemetry checks passed', status: 'active' },
      { date: 'May 25, 2026', text: 'Dehydration & moisture auditing', status: 'active' },
      { date: 'May 27, 2026', text: 'Dispatched to Accra packaging kitchen', status: 'active' },
      { date: 'May 29, 2026', text: 'Bottled, vacuum-sealed & shipped', status: 'current' }
    ]
  }
};

export default function Food() {
  const [productTab, setProductTab] = useState('chips');

  // Shito states
  const [spiceLevel, setSpiceLevel] = useState('Hot');

  // Chips states
  const [chipVariety, setChipVariety] = useState('plantain');
  const [chipFlavor, setChipFlavor] = useState('Savory Chili & Garlic');
  const [chipCut, setChipCut] = useState('Kettle Thin');

  // Wholesaler / Distributor states
  const [selectedProductLine, setSelectedProductLine] = useState('chips');
  const [orderQuantity, setOrderQuantity] = useState(2);
  const [distributorName, setDistributorName] = useState('');
  const [distributorEmail, setDistributorEmail] = useState('');
  const [distributorPhone, setDistributorPhone] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);

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
      retailPrice: 'GHS 8.00',
      cartonPrice: 'GHS 140 (24 packs)'
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
      retailPrice: 'GHS 8.00',
      cartonPrice: 'GHS 140 (24 packs)'
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
      retailPrice: 'GHS 8.00',
      cartonPrice: 'GHS 140 (24 packs)'
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
      retailPrice: 'GHS 24.00',
      cartonPrice: 'GHS 210 (10 boxes)'
    }
  };

  const currentChip = chipVarieties[chipVariety];

  const storeCatalog = [
    {
      id: 'plantain',
      name: 'Kone Golden Plantain Chips',
      category: 'chips',
      image: '/assets/products/plantain-chips.jpg',
      size: '150g Foil Pouch',
      unitPrice: 8.0,
      badge: 'Bestseller',
      badgeColor: '#eab308',
      rating: 4.9,
      reviewsCount: 128,
      ingredients: 'Sun-ripened Organic Plantains, Cold-Pressed Vegetable Oil, Sea Salt, Natural Spices',
      tags: ['100% Vegan', 'Gluten-Free', 'Non-GMO']
    },
    {
      id: 'yam',
      name: 'Kone Crispy Yam Chips',
      category: 'chips',
      image: '/assets/products/yam-chips.jpg',
      size: '150g Foil Pouch',
      unitPrice: 8.0,
      badge: 'Savory Hit',
      badgeColor: '#f97316',
      rating: 4.8,
      reviewsCount: 94,
      ingredients: 'Ghanaian White Yam, Cold-Pressed Vegetable Oil, Cracked Black Pepper, Rosemary, Sea Salt',
      tags: ['100% Vegan', 'Gluten-Free', 'High Fiber']
    },
    {
      id: 'potato',
      name: 'Kone Rustic Potato Crisps',
      category: 'chips',
      image: '/assets/products/potato-chips.jpg',
      size: '150g Foil Pouch',
      unitPrice: 8.0,
      badge: 'Zesty Crunch',
      badgeColor: '#38bdf8',
      rating: 4.9,
      reviewsCount: 86,
      ingredients: 'Highland Potatoes (Skin-on), Cold-Pressed Oil, Ghanaian Chili Paprika, Sea Salt',
      tags: ['Gluten-Free', 'Slow Kettle Fried', 'Zero Trans Fat']
    },
    {
      id: 'trio',
      name: 'Kone Trio Variety Box',
      category: 'bundles',
      image: '/assets/products/trio-box.jpg',
      size: '3 x 150g Gift Box',
      unitPrice: 24.0,
      badge: 'Party Pack',
      badgeColor: '#ec4899',
      rating: 5.0,
      reviewsCount: 62,
      ingredients: 'Complete selection: Golden Plantain, Crispy Yam, and Rustic Potato packs',
      tags: ['Gift Box', '3 Flavour Blend', 'Party Ready']
    },
    {
      id: 'shito',
      name: 'Kone Authentic Shito Sauce',
      category: 'shito',
      image: '/assets/products/shito-jar.jpg',
      size: '350g Glass Jar',
      unitPrice: 20.0,
      badge: 'Signature Umami',
      badgeColor: '#ef4444',
      rating: 4.95,
      reviewsCount: 215,
      ingredients: 'Organic Scotch Bonnet, Artisanal Pink Shallots, Wild Smoked Herring, Dried Shrimp, Ginger, Vegetable Oil',
      tags: ['85K SHU Heat', 'Smoked Seafood', 'Vacuum Sealed']
    }
  ];

  const productPricingConfig = {
    chips: {
      unitName: 'Carton of 24 Pouches (150g)',
      basePrice: 140,
      itemLabel: 'Cartons (24 packs each)',
      suggestedRetailPerUnit: 8.0,
      unitsPerBox: 24,
      shippingFlat: 20
    },
    shito: {
      unitName: 'Box of 12 Jars (350g)',
      basePrice: 180,
      itemLabel: 'Boxes (12 jars each)',
      suggestedRetailPerUnit: 20.0,
      unitsPerBox: 12,
      shippingFlat: 25
    },
    combo: {
      unitName: 'Merchant Pallet (12 Jars Shito + 12 Chip Pouches)',
      basePrice: 160,
      itemLabel: 'Combo Bundles',
      suggestedRetailPerUnit: 18.0,
      unitsPerBox: 24,
      shippingFlat: 25
    }
  };

  const activePricing = productPricingConfig[selectedProductLine];

  const getPricingTier = (qty, config) => {
    if (qty >= 10) {
      const discount = 0.1;
      const price = Math.round(config.basePrice * (1 - discount));
      return { price, discountPercent: 10, label: 'Tier 3 Wholesale (10% Off + Free Shipping)', shipping: 0 };
    } else if (qty >= 5) {
      const discount = 0.05;
      const price = Math.round(config.basePrice * (1 - discount));
      return { price, discountPercent: 5, label: 'Tier 2 Bulk (5% Off)', shipping: config.shippingFlat };
    } else {
      return { price: config.basePrice, discountPercent: 0, label: 'Standard Wholesale Rate', shipping: config.shippingFlat };
    }
  };

  const currentTier = getPricingTier(orderQuantity, activePricing);
  const subtotal = orderQuantity * currentTier.price;
  const totalCost = subtotal + currentTier.shipping;
  const totalUnits = orderQuantity * activePricing.unitsPerBox;
  const estimatedRetailRevenue = totalUnits * activePricing.suggestedRetailPerUnit;
  const estimatedDistributorProfit = estimatedRetailRevenue - totalCost;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!distributorName || !distributorEmail) return;
    setOrderSubmitted(true);

    if (db && db.app) {
      try {
        await addDoc(collection(db, 'farm_distributors'), {
          name: distributorName.trim(),
          email: distributorEmail.trim(),
          phone: distributorPhone.trim(),
          productLine: selectedProductLine,
          quantity: Number(orderQuantity),
          totalCost: totalCost,
          status: 'Pending',
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Firestore B2B submission error:", err);
      }
    }

    setTimeout(() => {
      setOrderSubmitted(false);
      setDistributorName('');
      setDistributorEmail('');
      setDistributorPhone('');
      setOrderQuantity(2);
    }, 4000);
  };

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

  const scrollToDistributor = (lineKey) => {
    if (lineKey) setSelectedProductLine(lineKey);
    const element = document.getElementById('distributor-hub-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="food-div-page animate-fade-in">
      <div className="food-container">
        
        {/* Market & Gourmet Storefront Header */}
        <div className="food-header-section">
          <div className="farms-title-badge" style={{ background: 'rgba(239, 68, 68, 0.12)', borderColor: 'rgba(239, 68, 68, 0.25)', color: '#f87171', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#f87171" strokeWidth="2.5" fill="none">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            Artisanal Food Market & Pantry Store
          </div>
          <h1 className="farms-headline">Kone Gourmet Snacks & Fine Foods</h1>
          <p className="farms-subheadline">
            Farm-to-pantry excellence from Ghanaian smallholder partner farms. Handcrafted <strong>Kone Chips</strong> kettle-cooked to golden crispness and our authentic <strong>Kone Shito</strong> black pepper sauce. Audited by digital batch telemetry.
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
                className={`segment-btn ${productTab === 'store' ? 'active' : ''}`}
                onClick={() => setProductTab('store')}
              >
                Pantry Store Catalog
              </button>
              <button 
                className={`segment-btn ${productTab === 'all' ? 'active' : ''}`}
                onClick={() => setProductTab('all')}
              >
                View Everything
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

                      <div className="photo-price-tag">
                        <span className="single-price">{currentChip.retailPrice}</span>
                        <span className="carton-sub">{currentChip.cartonPrice}</span>
                      </div>
                    </div>

                    <div className="photo-quick-actions">
                      <button 
                        className="photo-order-btn"
                        onClick={() => scrollToDistributor('chips')}
                      >
                        Order Wholesale Carton (24 Packs)
                      </button>
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

                  {/* Flavor / Seasoning Selection Bar */}
                  <div className="flavor-selection-panel">
                    <span className="dist-label">Choose Artisanal Seasoning:</span>
                    <div className="flavor-options-grid">
                      {[
                        { label: 'Savory Chili & Garlic', desc: 'Infused with organic Scotch Bonnet' },
                        { label: 'Roasted Sea Salt', desc: 'Pure Ada coastal mineral salt crunch' },
                        { label: 'Sweet Cinnamon & Cane', desc: 'Caramelized natural raw cane sugar' },
                        { label: 'Smoked Onion & Herb', desc: 'Aromatic Ghanaian wild forest herbs' }
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => setChipFlavor(item.label)}
                          className={`flavor-choice-card ${chipFlavor === item.label ? 'active' : ''}`}
                        >
                          <strong>{item.label}</strong>
                          <small>{item.desc}</small>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cut / Style Selector */}
                  <div className="cut-selector-row">
                    <span className="dist-label">Slice Cut:</span>
                    <div className="cut-pill-group">
                      {['Kettle Thin', 'Crinkle Cut', 'Wavy Ridge'].map((cut) => (
                        <button
                          key={cut}
                          onClick={() => setChipCut(cut)}
                          className={`cut-pill-btn ${chipCut === cut ? 'active' : ''}`}
                        >
                          {cut}
                        </button>
                      ))}
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

                      <div className="photo-price-tag">
                        <span className="single-price">GHS 20.00</span>
                        <span className="carton-sub">Box of 12: GHS 180</span>
                      </div>
                    </div>

                    <div className="photo-quick-actions">
                      <button 
                        className="photo-order-btn" 
                        style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', borderColor: '#ef4444' }}
                        onClick={() => scrollToDistributor('shito')}
                      >
                        Order Wholesale Box (12 Jars)
                      </button>
                    </div>
                  </div>

                  {/* Heat selector */}
                  <div className="spice-meter">
                    <span className="dist-label">Select Heat Intensity:</span>
                    <div className="spice-slider">
                      {['Mild', 'Hot', 'Extra Hot'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setSpiceLevel(level)}
                          aria-label={`Select heat level ${level}`}
                          className={`spice-btn ${spiceLevel === level ? 'active' : ''}`}
                        >
                          {level}
                        </button>
                      ))}
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
        {/* PANTRY STORE & MARKETPLACE SHELF GRID */}
        {/* ========================================================================= */}
        {(productTab === 'store' || productTab === 'all') && (
          <div className="storefront-section animate-fade-in">
            <div className="farms-header-section" style={{ marginBottom: '2rem', textAlign: 'left' }}>
              <div className="farms-title-badge" style={{ background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.25)', color: '#34d399', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="#34d399" strokeWidth="2.5" fill="none">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                Gourmet Store & Retail Catalog
              </div>
              <h2 className="farms-headline" style={{ fontSize: '2rem' }}>Browse the Complete Shelf</h2>
              <p className="farms-subheadline" style={{ margin: 0, fontSize: '0.95rem' }}>
                Order direct retail packs, sample variety boxes, or volume wholesale cartons for your supermarket or hotel pantry.
              </p>
            </div>

            <div className="store-products-grid">
              {storeCatalog.map((item) => (
                <div key={item.id} className="store-product-card">
                  <div className="store-img-wrapper">
                    <img src={item.image} alt={item.name} className="store-card-img" />
                    <span className="store-card-badge" style={{ background: item.badgeColor }}>
                      {item.badge}
                    </span>
                    <span className="store-size-tag">{item.size}</span>
                  </div>

                  <div className="store-card-body">
                    <div className="store-rating-row">
                      <span className="rating-stars">★★★★★</span>
                      <span className="rating-num">{item.rating} ({item.reviewsCount} reviews)</span>
                    </div>

                    <h3 className="store-product-name">{item.name}</h3>

                    <div className="store-ingredients-preview">
                      <strong>Ingredients:</strong> {item.ingredients}
                    </div>

                    <div className="store-tags-flex">
                      {item.tags.map((t, idx) => (
                        <span key={idx} className="store-tag-pill">{t}</span>
                      ))}
                    </div>

                    <div className="store-card-footer">
                      <div className="store-price-block">
                        <span className="unit-label">Retail Price</span>
                        <strong className="unit-val">GHS {item.unitPrice.toFixed(2)}</strong>
                      </div>

                      <button 
                        className="store-action-btn"
                        onClick={() => {
                          if (item.id === 'shito') {
                            scrollToDistributor('shito');
                          } else {
                            scrollToDistributor('chips');
                          }
                        }}
                      >
                        Order / Stock ➔
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
        {/* WHOLESALER & DISTRIBUTOR HUB */}
        {/* ========================================================================= */}
        <div id="distributor-hub-section" className="b2b-distributors-grid">
          
          {/* Left panel: Registration form */}
          <div className="farms-card">
            <h3 className="smartfarm-title" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="#34d399" strokeWidth="2" fill="none">
                <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              Retailer & Distributor Registration
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'left', lineHeight: 1.5 }}>
              Stock <strong>Kone Chips</strong> and <strong>Kone Shito</strong> in your supermarket, grocery store, school snack lounge, hotel, or retail chain. Direct wholesale margins, shelf display materials, and scheduled delivery.
            </p>

            {orderSubmitted ? (
              <div className="submit-success-banner">
                <div style={{ margin: '0 auto 1rem', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" width="28" height="28" stroke="#34d399" strokeWidth="2" fill="none">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <strong style={{ display: 'block', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Application Submitted!</strong>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Thank you for joining our distribution network. Our logistics team will email your account credentials and merchant delivery schedule.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div className="dist-form-group">
                  <label htmlFor="dist-partner-name" className="dist-label">Store / Business Name</label>
                  <input
                    id="dist-partner-name"
                    type="text"
                    required
                    aria-label="Store or partner name"
                    value={distributorName}
                    onChange={(e) => setDistributorName(e.target.value)}
                    placeholder="e.g. Prime Fresh Mart & Supermarket"
                    className="dist-input"
                  />
                </div>
                <div className="dist-form-group">
                  <label htmlFor="dist-email" className="dist-label">Business Email Address</label>
                  <input
                    id="dist-email"
                    type="email"
                    required
                    aria-label="Email address"
                    value={distributorEmail}
                    onChange={(e) => setDistributorEmail(e.target.value)}
                    placeholder="manager@yourstore.com"
                    className="dist-input"
                  />
                </div>
                <div className="dist-form-group">
                  <label htmlFor="dist-phone" className="dist-label">Contact Phone / WhatsApp</label>
                  <input
                    id="dist-phone"
                    type="tel"
                    aria-label="Phone number"
                    value={distributorPhone}
                    onChange={(e) => setDistributorPhone(e.target.value)}
                    placeholder="+233 24 000 0000"
                    className="dist-input"
                  />
                </div>

                {/* Product line selection */}
                <div className="dist-form-group">
                  <label htmlFor="dist-product-line" className="dist-label">Select Primary Inventory Line</label>
                  <select
                    id="dist-product-line"
                    aria-label="Select product inventory line"
                    value={selectedProductLine}
                    onChange={(e) => setSelectedProductLine(e.target.value)}
                    className="dist-input select-farms-option"
                  >
                    <option value="chips">Kone Chips (Cartons of 24 Pouches - 150g)</option>
                    <option value="shito">Kone Shito (Boxes of 12 Jars - 350g)</option>
                    <option value="combo">Merchant Starter Pallet (12 Jars Shito + 12 Chip Pouches)</option>
                  </select>
                </div>

                <div className="dist-form-group">
                  <label htmlFor="dist-quantity-select" className="dist-label">
                    Select Volume ({activePricing.itemLabel})
                  </label>
                  <select
                    id="dist-quantity-select"
                    aria-label="Select volume"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Number(e.target.value))}
                    className="dist-input select-farms-option"
                  >
                    {[1, 2, 5, 10, 20, 50, 100].map((num) => (
                      <option key={num} value={num}>
                        {num} {activePricing.itemLabel} {num >= 10 ? '(10% Off + Free Shipping)' : num >= 5 ? '(5% Bulk Discount)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="farms-submit-btn" style={{ width: '100%', marginTop: '1rem' }}>
                  Submit Wholesaler Application ➔
                </button>
              </form>
            )}
          </div>

          {/* Right panel: Live B2B margin calculator */}
          <div className="farms-card">
            <h3 className="smartfarm-title" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="#34d399" strokeWidth="2" fill="none">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              Merchant Margin & Invoice Calculator
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'left', lineHeight: 1.5 }}>
              Real-time wholesale breakdown for your retail store shelf or food service establishment.
            </p>

            <div className="pricing-calculator-box">
              <div className="calc-row">
                <span>Selected Line:</span>
                <strong>{activePricing.unitName}</strong>
              </div>
              <div className="calc-row">
                <span>Volume Tier:</span>
                <span className="calc-tier-badge">{currentTier.label}</span>
              </div>
              <div className="calc-row">
                <span>Price per Carton/Box:</span>
                <strong>
                  {currentTier.discountPercent > 0 && (
                    <s style={{ color: '#ef4444', marginRight: '0.5rem' }}>GHS {activePricing.basePrice}</s>
                  )}
                  GHS {currentTier.price}.00
                </strong>
              </div>
              <div className="calc-row">
                <span>Total Units on Order:</span>
                <strong style={{ color: '#facc15' }}>{totalUnits} Units</strong>
              </div>
              <div className="calc-row">
                <span>Logistics & Freight:</span>
                <span>{currentTier.shipping === 0 ? <strong style={{ color: '#10b981' }}>FREE</strong> : `GHS ${currentTier.shipping}.00`}</span>
              </div>

              <div className="calc-total-row">
                <span>Total Wholesale Invoice:</span>
                <span className="calc-total-amount">GHS {totalCost}.00</span>
              </div>

              {/* Retail Margin Projection */}
              <div className="profit-projection-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Est. Consumer Retail Revenue:</span>
                  <strong style={{ color: '#38bdf8' }}>GHS {estimatedRetailRevenue}.00</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Est. Merchant Profit Margin:</span>
                  <strong style={{ color: '#10b981' }}>+GHS {estimatedDistributorProfit}.00 ({Math.round((estimatedDistributorProfit / totalCost) * 100)}% ROI)</strong>
                </div>
              </div>

              <div style={{ textAlign: 'left', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginTop: '1rem' }}>
                <strong style={{ display: 'block', color: 'white', marginBottom: '0.25rem' }}>Volume Incentive Tiers:</strong>
                <ul>
                  <li>Order <strong>5 - 9 cartons/boxes</strong>: Save <strong>5%</strong> on whole invoice.</li>
                  <li>Order <strong>10+ cartons/boxes</strong>: Save <strong>10%</strong> + <strong>100% Free Nationwide Freight</strong>!</li>
                </ul>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(16, 185, 129, 0.15)', paddingTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left', marginTop: '1rem' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="#34d399" strokeWidth="2" fill="none" style={{ flexShrink: 0 }}>
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
                Products are packaged in moisture-barrier nitrogen foil and dispatched directly from our packaging facility to stockists within 24-48 hours.
              </span>
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
