import React, { useState } from 'react';
import './Food.css';
import { db } from '../firebase/config';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

// Default fallback demo batch details (100% accurate description of a Volta batch)
const demoBatch = {
  batchId: 'KS-VOLTA-2026',
  pesticideLevel: '0.0%',
  moistureLevel: '12%',
  scovilleHeat: '85,000 SHU',
  certification: 'Organic Standard',
  farmerName: 'Kofi Mensah',
  farmerMeta: 'Volta Region field manager',
  farmerQuote: '"We feed our Scotch Bonnet pepper crop pure organic compost. No chemical fertilizer is ever allowed."',
  trail: [
    { date: 'May 24, 2026', text: 'Harvested & telemetry checks passed', status: 'active' },
    { date: 'May 25, 2026', text: 'Dehydration & moisture auditing', status: 'active' },
    { date: 'May 27, 2026', text: 'Dispatched to Accra packaging kitchen', status: 'active' },
    { date: 'May 29, 2026', text: 'Bottled, vacuum-sealed & shipped', status: 'current' }
  ]
};

export default function Food() {
  const [spiceLevel, setSpiceLevel] = useState('Hot 🌶️🌶️');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [distributorName, setDistributorName] = useState('');
  const [distributorEmail, setDistributorEmail] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  
  // Batch Search States
  const [showTraceModal, setShowTraceModal] = useState(false);
  const [searchBatchId, setSearchBatchId] = useState('');
  const [batchData, setBatchData] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [isLoadingBatch, setIsLoadingBatch] = useState(false);

  // Multi-tier wholesale pricing calculator
  const getPricingTier = (qty) => {
    if (qty >= 10) {
      return { price: 162, discountPercent: 10, label: 'Tier 3 Wholesale (10% Off + Free Shipping)', shipping: 0 };
    } else if (qty >= 5) {
      return { price: 171, discountPercent: 5, label: 'Tier 2 Bulk (5% Off)', shipping: 25 };
    } else {
      return { price: 180, discountPercent: 0, label: 'Standard Rate', shipping: 25 };
    }
  };

  const currentTier = getPricingTier(orderQuantity);
  const subtotal = orderQuantity * currentTier.price;
  const totalCost = subtotal + currentTier.shipping;
  const normalCostAtStandard = orderQuantity * 180 + 25;
  const totalSavings = normalCostAtStandard - totalCost;

  const handleSpiceSelect = (level) => {
    setSpiceLevel(level);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!distributorName || !distributorEmail) return;
    setOrderSubmitted(true);

    if (db && db.app) {
      try {
        await addDoc(collection(db, 'farm_distributors'), {
          name: distributorName.trim(),
          email: distributorEmail.trim(),
          quantity: Number(orderQuantity),
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
      setOrderQuantity(1);
    }, 4000);
  };

  const handleBatchSearch = async (e) => {
    e.preventDefault();
    const queryId = searchBatchId.trim().toUpperCase();
    if (!queryId) return;

    setIsLoadingBatch(true);
    setSearchError('');

    // Check demo code fallback
    if (queryId === 'KS-VOLTA-2026') {
      setBatchData(demoBatch);
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
          setSearchError(`Batch ID "${queryId}" not found. Verify the code printed on your jar label, or search "KS-VOLTA-2026" for a demo.`);
        }
      } catch (err) {
        console.error("Firestore batch query error:", err);
        setSearchError("Connection error while tracing batch. Please try again.");
      }
    } else {
      setSearchError(`Batch ID "${queryId}" not found (Database offline). Try searching "KS-VOLTA-2026".`);
    }
    setIsLoadingBatch(false);
  };

  const getGlowClass = () => {
    if (spiceLevel.includes('Mild')) return 'mild';
    if (spiceLevel.includes('Extra Hot')) return 'extra-hot';
    return 'hot';
  };

  const renderFireParticles = () => {
    if (!spiceLevel.includes('Extra Hot')) return null;
    return (
      <div className="fire-particles-emitter">
        {[...Array(12)].map((_, i) => {
          const delay = i * 0.4;
          const left = Math.random() * 80 + 10;
          const size = Math.random() * 6 + 4;
          return (
            <span
              key={i}
              className="fire-particle"
              style={{
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="food-div-page animate-fade-in">
      <div className="food-container">
        
        {/* Header */}
        <div className="food-header-section">
          <div className="farms-title-badge" style={{ background: 'rgba(239, 68, 68, 0.12)', borderColor: 'rgba(239, 68, 68, 0.25)', color: '#f87171' }}>🥫 Food Division</div>
          <h1 className="farms-headline">Premium Culinary Catalog</h1>
          <p className="farms-subheadline" style={{ margin: '0 auto' }}>
            Bringing authentic, organic Ghanaian flavours to tables worldwide, crafted from sustainable ingredients and backed by precision supply-chain traceability.
          </p>
        </div>

        {/* Featured Product Label */}
        <div style={{ textAlign: 'left', marginBottom: '1.5rem', paddingLeft: '1rem' }}>
          <span style={{ fontSize: '0.8rem', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)', color: '#fbbf24', padding: '0.3rem 0.85rem', borderRadius: '6px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ★ Featured Product
          </span>
        </div>

        {/* Showcase Area */}
        <div className="farms-card shito-showcase-card" style={{ marginTop: 0 }}>
          <div className="shito-container">
            
            {/* Interactive Jar visual */}
            <div className="shito-visual">
              <div className={`jar-glow ${getGlowClass()}`}></div>
              <div className="shito-jar-lid"></div>
              <div className="shito-jar-graphic">
                <div className="shito-label-inner">
                  <h4 className="shito-label-title">KONE</h4>
                  <div className="shito-label-sub">Premium Shito</div>
                  <div style={{ borderTop: '2px solid #b45309', margin: '0.5rem 0' }}></div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>AUTHENTIC RECIPE</div>
                </div>
                {renderFireParticles()}
              </div>

              {/* Heat selector */}
              <div className="spice-meter">
                <span className="dist-label">Select Heat Intensity</span>
                <div className="spice-slider">
                  {['Mild 🌶️', 'Hot 🌶️🌶️', 'Extra Hot 🌶️🌶️🌶️'].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleSpiceSelect(level)}
                      className={`spice-btn ${spiceLevel === level ? 'active' : ''}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product story and trace details */}
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: '2.2rem', color: 'white', margin: '0 0 1rem' }}>
                Kone Shito
              </h2>
              <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                Our premium black pepper sauce is handcrafted using organic Scotch Bonnet peppers, shallots, dried herring, and shrimp sourced directly from Volta Region family farms. Every jar tells a story of sustainable partnership and strict culinary standards.
              </p>

              {/* Real Batch Lookup Form Card */}
              <div className="trace-card" style={{ display: 'block', padding: '1.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem', color: '#f59e0b', fontSize: '1.1rem', fontWeight: 800 }}>
                  Trace Your Shito Jar 🔍
                </h4>
                <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  Each physical jar of Kone Shito features a batch code printed on its label. Enter it below to load verified harvest logs, Scoville heat levels, and laboratory diagnostics.
                </p>

                <form onSubmit={handleBatchSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={searchBatchId}
                    onChange={(e) => setSearchBatchId(e.target.value)}
                    placeholder="e.g. KS-VOLTA-2026"
                    className="dist-input"
                    style={{ flex: 1, minWidth: '180px', height: '44px', background: 'rgba(0,0,0,0.5)', borderColor: 'rgba(251, 191, 36, 0.25)' }}
                  />
                  <button 
                    type="submit" 
                    className="farms-submit-btn" 
                    style={{ width: 'auto', padding: '0 1.5rem', height: '44px', boxShadow: 'none' }}
                    disabled={isLoadingBatch}
                  >
                    {isLoadingBatch ? 'Searching...' : 'Trace Batch ➔'}
                  </button>
                </form>
                
                {searchError && (
                  <div style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '0.75rem', fontWeight: 700 }}>
                    ⚠️ {searchError}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Wholesaler Signup & Pricing Calculator */}
        <div className="b2b-distributors-grid">
          
          {/* Left panel: Registration form */}
          <div className="farms-card">
            <h3 className="smartfarm-title" style={{ marginBottom: '1rem' }}>
              📦 Retailer & Distributor Registration
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem', textAlign: 'left', lineHeight: 1.5 }}>
              Register your grocery store, hotel, or retail shop as an official Kone Food stockist. We offer direct wholesale rates, priority shipping, and marketing support.
            </p>

            {orderSubmitted ? (
              <div className="submit-success-banner">
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🎉</span>
                <strong style={{ display: 'block', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Application Submitted!</strong>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Thank you for joining our network. Our logistics team will email your welcome package shortly!</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div className="dist-form-group">
                  <label className="dist-label">Store / Partner Name</label>
                  <input
                    type="text"
                    required
                    value={distributorName}
                    onChange={(e) => setDistributorName(e.target.value)}
                    placeholder="e.g. Westside Supermarket"
                    className="dist-input"
                  />
                </div>
                <div className="dist-form-group">
                  <label className="dist-label">Email Address</label>
                  <input
                    type="email"
                    required
                    value={distributorEmail}
                    onChange={(e) => setDistributorEmail(e.target.value)}
                    placeholder="partner@yourstore.com"
                    className="dist-input"
                  />
                </div>
                <div className="dist-form-group">
                  <label className="dist-label">Select Volume (Boxes of 12 jars)</label>
                  <select
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Number(e.target.value))}
                    className="dist-input select-farms-option"
                  >
                    {[1, 2, 5, 10, 20, 50].map((num) => (
                       <option key={num} value={num}>
                         {num} Box{num > 1 ? 'es' : ''} ({num * 12} jars)
                       </option>
                    ))}
                  </select>
                </div>
                
                <button
                  type="submit"
                  className="farms-submit-btn"
                >
                  Apply to Distribute 🚀
                </button>
              </form>
            )}
          </div>

          {/* Right panel: Calculator */}
          <div className="farms-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 className="smartfarm-title" style={{ marginBottom: '1.5rem' }}>
                🚚 Logistics & Price Calculator
              </h3>
              
              {currentTier.discountPercent > 0 && (
                <div className="savings-badge-glow">
                  🔥 {currentTier.label} unlocked! Saved GHS {totalSavings}.00!
                </div>
              )}

              <div className="calc-card">
                <div className="calc-row">
                  <span>Distributor Price (Per Box)</span>
                  <strong style={{ color: 'white' }}>GHS {currentTier.price}.00</strong>
                </div>
                <div className="calc-row">
                  <span>Selected Boxes ({orderQuantity * 12} Jars)</span>
                  <strong style={{ color: 'white' }}>{orderQuantity} Box{orderQuantity > 1 ? 'es' : ''}</strong>
                </div>
                <div className="calc-row">
                  <span>Subtotal</span>
                  <strong style={{ color: 'white' }}>GHS {subtotal}.00</strong>
                </div>
                <div className="calc-row">
                  <span>Flat-rate Priority Shipping</span>
                  <strong style={{ color: 'white' }}>
                    {currentTier.shipping === 0 ? <span className="free-shipping-tag">FREE</span> : `GHS ${currentTier.shipping}.00`}
                  </strong>
                </div>
                <div className="calc-row calc-total">
                  <span>ESTIMATED TOTAL</span>
                  <span>GHS {totalCost}.00</span>
                </div>
              </div>

              <div style={{ textAlign: 'left', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                <strong style={{ display: 'block', color: 'white', marginBottom: '0.25rem' }}>💡 Bulk Discount Tiers:</strong>
                <ul>
                  <li>Buy <strong>5 - 9 boxes</strong> to save <strong>5%</strong> on box invoice.</li>
                  <li>Buy <strong>10+ boxes</strong> to save <strong>10%</strong> and get <strong>100% Free Shipping</strong>!</li>
                </ul>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(16, 185, 129, 0.15)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left', marginTop: '1rem' }}>
              <span>🌍</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
                Logistics are managed via our dedicated central distribution hub, shipping locally within 48 hours to retail shelves across the country.
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* --- Batch QR Trace smartphone popup modal (dynamically loaded from Firestore) --- */}
      {showTraceModal && batchData && (
        <div className="trace-modal-overlay animate-fade-in" onClick={() => setShowTraceModal(false)}>
          <div className="smartphone-chassis animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="phone-screen-frame">
              <div className="phone-camera-notch">
                <div className="camera-dot"></div>
                <div className="speaker-grill"></div>
              </div>
              
              <div className="phone-screen-content custom-scrollbar">
                <div className="phone-brand-title">
                  <img src="/logos/logo.svg" className="phone-logo-img" alt="Kone Farms Logo" />
                  <span>KONE TRACE HUB</span>
                </div>

                <div className="trace-verified-seal">
                  <div className="verified-seal-badge">✓ BATCH LOGS VERIFIED</div>
                  <h3 className="verified-batch-id">Batch #{batchData.batchId}</h3>
                  <p className="verified-purity">Pesticide Audit: {batchData.pesticideLevel || '0.0%'} Detected</p>
                </div>

                <div className="phone-info-section">
                  <h5 className="phone-sect-label">👨‍🌾 Volta Crop Source</h5>
                  <div className="farmer-card-bubble">
                    <div className="farmer-avatar-emoji">👨‍🌾</div>
                    <div>
                      <strong className="farmer-bubble-name">{batchData.farmerName || 'Sourcing Partner'}</strong>
                      <span className="farmer-bubble-meta">{batchData.farmerMeta || 'Volta Region field manager'}</span>
                      <p className="farmer-bubble-quote">
                        {batchData.farmerQuote || '"We prioritize soil health and organic principles."'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="phone-info-section">
                  <h5 className="phone-sect-label">🧪 Lab Quality Check</h5>
                  <div className="diagnostics-bubble-grid">
                    <div className="diag-bubble">
                      <span className="diag-b-val">{batchData.moistureLevel || '12%'}</span>
                      <span className="diag-b-lbl">Moisture Level</span>
                    </div>
                    <div className="diag-bubble">
                      <span className="diag-b-val">{batchData.scovilleHeat || '85K SHU'}</span>
                      <span className="diag-b-lbl">Scoville Heat</span>
                    </div>
                    <div className="diag-bubble">
                      <span className="diag-b-val">{batchData.certification || 'Organic'}</span>
                      <span className="diag-b-lbl">Cert Standard</span>
                    </div>
                  </div>
                </div>

                <div className="phone-info-section">
                  <h5 className="phone-sect-label">📍 Blockchain Journey Trail</h5>
                  <div className="timeline-trail-bubble">
                    {batchData.trail && batchData.trail.map((node, i) => (
                      <div key={i} className={`trail-node ${node.status || 'active'}`}>
                        <div className="trail-node-dot"></div>
                        <div>
                          <strong>{node.date}</strong>
                          <span>{node.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="phone-exit-btn" onClick={() => setShowTraceModal(false)}>
                  Close Trace Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
