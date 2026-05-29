import React, { useState } from 'react';
import './KoneFarms.css';

const MASCOT_POOL = [
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯'
];

export default function KoneFarms({ onBack }) {
  const [spiceLevel, setSpiceLevel] = useState('Hot 🌶️🌶️');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [distributorName, setDistributorName] = useState('');
  const [distributorEmail, setDistributorEmail] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [showTraceModal, setShowTraceModal] = useState(false);

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!distributorName || !distributorEmail) return;
    setOrderSubmitted(true);
    setTimeout(() => {
      setOrderSubmitted(false);
      setDistributorName('');
      setDistributorEmail('');
      setOrderQuantity(1);
    }, 4000);
  };

  // Get active glow style class based on heat level
  const getGlowClass = () => {
    if (spiceLevel.includes('Mild')) return 'mild';
    if (spiceLevel.includes('Extra Hot')) return 'extra-hot';
    return 'hot';
  };

  // Particle generator for Extra Hot CSS animations
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
    <div className="farms-page">
      {/* Floating Brand Header */}
      <header className="farms-nav-header">
        <div className="farms-brand">
          <img src="/logos/logo.svg" className="farms-logo" alt="Kone Farms Logo" />
          <span className="farms-brand-name">Kone Farms</span>
        </div>
        <button className="back-btn-farms" onClick={onBack}>
          <svg className="back-arrow-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Kone Academy
        </button>
      </header>

      <div className="farms-container">
        
        {/* Header Block */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="farms-title-badge">
            🌾 Kone Farms & Agritech
          </div>
          <h1 className="farms-headline">
            Pioneering <span className="text-gradient-green">Sustainable Agriculture</span> & <span className="text-gradient-gold">Food Security</span> Through Modern Agritech
          </h1>
          <p className="farms-subheadline">
            Applying the power of software engineering, IoT automation, and local community sourcing to cultivate a self-reliant future.
          </p>
        </div>

        {/* Section 1: Kone Agritech & smartFarm */}
        <div className="farms-grid-2">
          
          {/* Left Panel: smartFarm Dashboard */}
          <div className="farms-card">
            <div className="smartfarm-header">
              <h3 className="smartfarm-title">
                🖥️ smartFarm telemetry
              </h3>
              <span style={{ fontSize: '0.8rem', background: '#059669', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '8px', fontWeight: 800 }}>
                LIVE CONNECTION
              </span>
            </div>

            {/* Live Metrics */}
            <div className="telemetry-grid">
              <div className="telemetry-item">
                <div className="telemetry-val">48%</div>
                <div className="telemetry-label">Soil Moisture 💧</div>
              </div>
              <div className="telemetry-item">
                <div className="telemetry-val">29.5°C</div>
                <div className="telemetry-label">Temperature 🌡️</div>
              </div>
              <div className="telemetry-item">
                <div className="telemetry-val">82%</div>
                <div className="telemetry-label">Sunlight ☀️</div>
              </div>
            </div>

            {/* Live Telemetry Trend Chart */}
            <div className="telemetry-chart-container">
              <div className="chart-header">
                <span className="chart-title">24H Telemetry Trends</span>
                <span className="chart-legend">
                  <span className="legend-dot moisture"></span> Moisture
                  <span className="legend-dot temp"></span> Temperature
                </span>
              </div>
              <svg className="telemetry-svg" viewBox="0 0 400 120">
                <defs>
                  <linearGradient id="moistureGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="tempGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {/* Grid lines */}
                <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                {/* Moisture area and line */}
                <path
                  d="M 0 80 Q 50 95, 100 65 T 200 45 T 300 90 T 400 55 L 400 120 L 0 120 Z"
                  fill="url(#moistureGlow)"
                />
                <path
                  d="M 0 80 Q 50 95, 100 65 T 200 45 T 300 90 T 400 55"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  className="telemetry-polyline"
                />

                {/* Temperature area and line */}
                <path
                  d="M 0 50 Q 60 30, 120 60 T 240 40 T 360 70 T 400 55 L 400 120 L 0 120 Z"
                  fill="url(#tempGlow)"
                />
                <path
                  d="M 0 50 Q 60 30, 120 60 T 240 40 T 360 70 T 400 55"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  className="telemetry-polyline-temp"
                />
              </svg>
            </div>

            {/* Cultivation Timeline */}
            <div className="pipeline-title">Land Cultivation Pipeline</div>
            <div className="pipeline-steps">
              <div className="pipeline-step active">
                <span className="pipeline-step-num">1</span>
                <div>
                  <strong style={{ display: 'block', color: 'white' }}>Soil Preparation & Testing</strong>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>pH Balanced, enriched with organic compost</span>
                </div>
              </div>
              <div className="pipeline-step active">
                <span className="pipeline-step-num">2</span>
                <div>
                  <strong style={{ display: 'block', color: 'white' }}>Smart Seed Planting</strong>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Direct seed insertion with geolocation mapping</span>
                </div>
              </div>
              <div className="pipeline-step pending">
                <span className="pipeline-step-num">3</span>
                <div>
                  <strong style={{ display: 'block', color: 'white' }}>Sensor-Driven Watering (smartTools)</strong>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Real-time automated drip irrigation active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Crops & smartTools */}
          <div className="farms-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="smartfarm-header">
                <h3 className="smartfarm-title">
                  🌱 Crops & Sourcing
                </h3>
              </div>
              
              <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 800 }}>Local Crops (Shito Ingredients)</h4>
                <div style={{ marginBottom: '1.25rem' }}>
                  <span className="crop-badge">🌶️ Scotch Bonnet Pepper</span>
                  <span className="crop-badge">🧅 Shallots</span>
                  <span className="crop-badge">🧄 Organic Garlic</span>
                  <span className="crop-badge">🐟 Smoked Herring</span>
                  <span className="crop-badge">🦐 Dried Shrimp</span>
                </div>

                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 800 }}>Exotic Crops</h4>
                <div style={{ marginBottom: '1.25rem' }}>
                  <span className="crop-badge" style={{ color: '#60a5fa', background: 'rgba(96, 165, 250, 0.1)', borderColor: 'rgba(96, 165, 250, 0.2)' }}>🌿 Aromatic Basil</span>
                  <span className="crop-badge" style={{ color: '#60a5fa', background: 'rgba(96, 165, 250, 0.1)', borderColor: 'rgba(96, 165, 250, 0.2)' }}>🌿 Sweet Oregano</span>
                </div>
              </div>
            </div>

            <div className="gmo-policy-banner">
              <span style={{ fontSize: '2rem' }}>🛡️</span>
              <div>
                <strong style={{ display: 'block', color: '#fff' }}>100% Non-GMO & Organic Standard</strong>
                <span style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>We enforce strict pesticide-free cultivation to protect local ecosystems and provide wholesome, healthy ingredients.</span>
              </div>
            </div>
          </div>

        </div>

        {/* smartTools Showcase */}
        <div className="farms-card" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <h3 className="smartfarm-title" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
            🛠️ smartTools Technology Suite
          </h3>
          <div className="tools-grid">
            <div className="tool-card">
              <div className="tool-icon">💧</div>
              <h4 className="tool-title">IoT Water Valve</h4>
              <p className="tool-desc">Micro-controlled drip irrigation valves that turn on/off based on real-time soil hydration data.</p>
            </div>
            <div className="tool-card">
              <div className="tool-icon">📡</div>
              <h4 className="tool-title">Telemetry Hub</h4>
              <p className="tool-desc">Wireless node sending temperature, atmospheric pressure, and moisture readings directly to the cloud.</p>
            </div>
            <div className="tool-card">
              <div className="tool-icon">🔋</div>
              <h4 className="tool-title">Solar Power Grid</h4>
              <p className="tool-desc">100% solar-driven field units with battery backup, making our field monitoring completely grid-independent.</p>
            </div>
          </div>
        </div>

        {/* Section 2: Kone Food & Kone Shito */}
        <div className="farms-card" style={{ padding: '3.5rem 3rem', marginBottom: '4rem' }}>
          <div className="shito-container">
            
            {/* Left: Jar Visual and Slider */}
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
                {/* Floating embers inside jar during Extra Hot */}
                {renderFireParticles()}
              </div>

              {/* Spice Meter selector */}
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

            {/* Right: Product Story and Batch QR trace */}
            <div style={{ textAlign: 'left' }}>
              <div className="farms-title-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171', marginBottom: '1rem' }}>
                🥫 Kone Food Production
              </div>
              <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: '2.5rem', color: 'white', margin: '0 0 1rem' }}>
                Kone Shito
              </h2>
              <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                Our premium black pepper sauce is handcrafted using organic Scotch Bonnet peppers, smoked herring, dried shrimp, and rich spices sourced directly from local family farms. Every jar tells a story of local partnership and smart agricultural science.
              </p>

              {/* Interactive QR Code Trace Flow */}
              <div 
                className="trace-card pointer hover-card-border" 
                onClick={() => setShowTraceModal(true)}
                title="Click to trace harvest logs"
              >
                <div className="qr-code-mock">
                  <div className="qr-dot corner" style={{ background: '#ef4444' }}></div>
                  <div className="qr-dot"></div>
                  <div className="qr-dot"></div>
                  <div className="qr-dot corner" style={{ background: '#ef4444' }}></div>
                  
                  <div className="qr-dot"></div>
                  <div className="qr-dot" style={{ background: '#ef4444' }}></div>
                  <div className="qr-dot"></div>
                  <div className="qr-dot"></div>
                  
                  <div className="qr-dot"></div>
                  <div className="qr-dot"></div>
                  <div className="qr-dot" style={{ background: '#ef4444' }}></div>
                  <div className="qr-dot"></div>
                  
                  <div className="qr-dot corner" style={{ background: '#ef4444' }}></div>
                  <div className="qr-dot"></div>
                  <div className="qr-dot"></div>
                  <div className="qr-dot corner" style={{ background: '#ef4444' }}></div>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 0.25rem', color: '#f59e0b', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    Trace Your Shito Jar 🔍 <span className="tap-badge">TAP TO TEST</span>
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.4 }}>
                    Every jar has a batch QR code. Click here to instantly simulate a scan and view harvest logs, packaging date, and the Volta region farmers!
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Section 3: B2B Distributors Registration & Order Calculator */}
        <div className="farms-grid-2">
          
          {/* Left Panel: Store/Distributor Application */}
          <div className="farms-card">
            <h3 className="smartfarm-title" style={{ marginBottom: '1rem' }}>
              📦 Retailer & Distributor Registration
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem', textAlign: 'left', lineHeight: 1.5 }}>
              Register your grocery store, hotel, or retail shop as an official Kone Food stockist. We offer direct wholesale rates, priority shipping, and marketing flyers!
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

          {/* Right Panel: Simulated Calculator */}
          <div className="farms-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 className="smartfarm-title" style={{ marginBottom: '1.5rem' }}>
                🚚 Logistics & Price Calculator
              </h3>
              
              {/* Savings Alert Badge */}
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
              <span style={{ fontSize: '1.5rem' }}>🌍</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
                Logistics are managed via our dedicated central distribution hub, shipping locally within 48 hours to retail shelves across the country.
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* --- Batch QR Trace smartphone popup modal --- */}
      {showTraceModal && (
        <div className="trace-modal-overlay animate-fade-in" onClick={() => setShowTraceModal(false)}>
          <div className="smartphone-chassis animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="phone-screen-frame">
              {/* Phone ear speaker & notch */}
              <div className="phone-camera-notch">
                <div className="camera-dot"></div>
                <div className="speaker-grill"></div>
              </div>
              
              {/* Trace Diagnostics Content */}
              <div className="phone-screen-content custom-scrollbar">
                <div className="phone-brand-title">
                  <img src="/logos/logo.svg" className="phone-logo-img" alt="Kone Farms Logo" />
                  <span>KONE TRACE HUB</span>
                </div>

                <div className="trace-verified-seal">
                  <div className="verified-seal-badge">✓ BATCH LOGS VERIFIED</div>
                  <h3 className="verified-batch-id">Batch #KS-VOLTA-2026</h3>
                  <p className="verified-purity">Pesticide Audit: 0.0% Detected (pure organic)</p>
                </div>

                <div className="phone-info-section">
                  <h5 className="phone-sect-label">👨‍🌾 Volta Crop Source</h5>
                  <div className="farmer-card-bubble">
                    <div className="farmer-avatar-emoji">👨‍🌾</div>
                    <div>
                      <strong className="farmer-bubble-name">Kofi Mensah</strong>
                      <span className="farmer-bubble-meta">Volta Region field manager</span>
                      <p className="farmer-bubble-quote">
                        "We feed our Scotch Bonnet pepper crop pure organic compost. No chemical fertilizer is ever allowed."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="phone-info-section">
                  <h5 className="phone-sect-label">🧪 Lab Quality Check</h5>
                  <div className="diagnostics-bubble-grid">
                    <div className="diag-bubble">
                      <span className="diag-b-val">12%</span>
                      <span className="diag-b-lbl">Moisture Level</span>
                    </div>
                    <div className="diag-bubble">
                      <span className="diag-b-val">85K SHU</span>
                      <span className="diag-b-lbl">Scoville Heat</span>
                    </div>
                    <div className="diag-bubble">
                      <span className="diag-b-val">Organic</span>
                      <span className="diag-b-lbl">Cert Standard</span>
                    </div>
                  </div>
                </div>

                <div className="phone-info-section">
                  <h5 className="phone-sect-label">📍 Blockchain Journey Trail</h5>
                  <div className="timeline-trail-bubble">
                    <div className="trail-node active">
                      <div className="trail-node-dot"></div>
                      <div>
                        <strong>May 24, 2026</strong>
                        <span>Harvested & telemetry checks passed</span>
                      </div>
                    </div>
                    <div className="trail-node active">
                      <div className="trail-node-dot"></div>
                      <div>
                        <strong>May 25, 2026</strong>
                        <span>Dehydration & moisture auditing</span>
                      </div>
                    </div>
                    <div className="trail-node active">
                      <div className="trail-node-dot"></div>
                      <div>
                        <strong>May 27, 2026</strong>
                        <span>Dispatched to Accra packaging kitchen</span>
                      </div>
                    </div>
                    <div className="trail-node current">
                      <div className="trail-node-dot"></div>
                      <div>
                        <strong>May 29, 2026</strong>
                        <span>Bottled, vacuum-sealed & shipped</span>
                      </div>
                    </div>
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
