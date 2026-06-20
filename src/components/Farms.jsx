import React, { useState } from 'react';
import './Farms.css';

export default function Farms() {
  const [activeRegion, setActiveRegion] = useState('volta'); // 'volta' | 'accra'

  const regions = {
    volta: {
      id: 'volta',
      tag: 'Main Cultivation Hub',
      title: 'Volta Sourcing District',
      desc: 'Situated along the fertile plains of the Volta Region, this area provides the ideal tropical climate and rich, sandy-loam soil required for growing fiery Scotch Bonnet peppers, shallots, and organic ginger. We partner directly with 45 local family farms, ensuring ethical fair-wage labor and sustainable water practices.',
      crops: ['🌶️ Scotch Bonnet Pepper', '🧅 Shallots', '🧄 Organic Garlic', '🌿 Exotic Basil', '🌿 Sweet Oregano']
    },
    accra: {
      id: 'accra',
      tag: 'Logistics & Cooking Hub',
      title: 'Accra Packaging Kitchen',
      desc: 'Our state-of-the-art kitchen and audit center located in Greater Accra. Fresh crops harvested from the Volta Region are transported here within 24 hours. The ingredients undergo strict quality checks (moisture auditing, purity tests) before being slow-cooked in small batches, bottled, vacuum-sealed, and shipped to stockists.',
      crops: ['🥫 Shito Processing', '🧪 Purity Auditing', '📦 Wholesale Shipping', '🐟 Smoked Herring', '🦐 Dried Shrimp']
    }
  };

  const currentRegion = regions[activeRegion];

  return (
    <div className="farms-div-page animate-fade-in">
      <div className="farms-container">
        
        {/* Header */}
        <div className="farms-header-section">
          <div className="farms-title-badge">🌾 Sourcing & Cultivation</div>
          <h1 className="farms-headline">Cultivating the Future, Respecting the Soil</h1>
          <p className="farms-subheadline" style={{ margin: '0 auto' }}>
            We believe that premium food starts with healthy soil and respected communities. Our sourcing model pairs ecological farming standards with direct, fair-trade support for Ghanaian family farmers.
          </p>
        </div>

        {/* Crops & Sourcing Section */}
        <div className="farms-card crops-section">
          <h3 className="smartfarm-title" style={{ marginBottom: '2rem' }}>🌱 Our Organic Crops</h3>
          
          <div className="crops-category">
            <h4 className="crops-category-title">🥫 Volta Region Staples (Shito Ingredients)</h4>
            <div className="crops-flex">
              <div className="crop-card-detailed">
                <span>🌶️</span> Scotch Bonnet Pepper
              </div>
              <div className="crop-card-detailed">
                <span>🧅</span> Shallots
              </div>
              <div className="crop-card-detailed">
                <span>🧄</span> Organic Garlic
              </div>
              <div className="crop-card-detailed">
                <span>🐟</span> Smoked Herring
              </div>
              <div className="crop-card-detailed">
                <span>🦐</span> Dried Shrimp
              </div>
            </div>
          </div>

          <div className="crops-category" style={{ marginBottom: 0 }}>
            <h4 className="crops-category-title" style={{ color: '#60a5fa' }}>🌿 Exotic Herb Plots</h4>
            <div className="crops-flex">
              <div className="crop-card-detailed exotic">
                <span>🌿</span> Aromatic Basil
              </div>
              <div className="crop-card-detailed exotic">
                <span>🌿</span> Sweet Oregano
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Map Section */}
        <div className="map-section">
          <div className="farms-header-section" style={{ marginBottom: '2.5rem' }}>
            <div className="farms-title-badge" style={{ background: 'rgba(59, 130, 246, 0.12)', borderColor: 'rgba(59, 130, 246, 0.25)', color: '#60a5fa' }}>📍 Geographic Trail</div>
            <h2 className="farms-headline" style={{ fontSize: '2rem' }}>Trace the Harvest Path</h2>
            <p className="farms-subheadline" style={{ fontSize: '0.95rem', margin: '0 auto', maxWidth: '600px' }}>
              Hover or tap the glowing region pins on our interactive map of Ghana to explore where our ingredients are cultivated and prepared.
            </p>
          </div>

          <div className="map-layout-grid">
            {/* SVG Map of Ghana */}
            <div className="map-svg-container">
              <svg className="map-svg" viewBox="0 0 350 450" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Ghana Map Outline (Stylized Path) */}
                <path 
                  d="M 120 40 L 190 20 L 260 50 L 280 120 L 310 180 L 290 260 L 295 320 L 280 370 L 210 380 L 180 375 L 140 370 L 120 340 L 90 320 L 70 240 L 95 180 L 80 120 L 100 80 Z" 
                  fill="rgba(16, 185, 129, 0.05)" 
                  stroke="rgba(16, 185, 129, 0.3)" 
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                
                {/* Grid lines for coordinate grid feel */}
                <line x1="50" y1="0" x2="50" y2="450" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="150" y1="0" x2="150" y2="450" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="250" y1="0" x2="250" y2="450" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="100" x2="350" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="200" x2="350" y2="200" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="300" x2="350" y2="300" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                {/* Region boundary: Volta Region (East/Right side) */}
                <path 
                  d="M 230 180 L 270 200 L 290 260 L 295 320 L 270 340 L 245 280 L 235 240 Z" 
                  fill={activeRegion === 'volta' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.02)'} 
                  stroke="rgba(245, 158, 11, 0.25)" 
                  strokeWidth="1.5" 
                  style={{ transition: 'all 0.3s' }}
                />

                {/* Region: Greater Accra (South Coast) */}
                <path 
                  d="M 180 375 L 210 380 L 240 372 L 250 350 L 205 350 Z" 
                  fill={activeRegion === 'accra' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.02)'} 
                  stroke="rgba(59, 130, 246, 0.25)" 
                  strokeWidth="1.5" 
                  style={{ transition: 'all 0.3s' }}
                />

                {/* Connective Route Line */}
                <path 
                  d="M 265 260 Q 240 310, 215 362" 
                  fill="none" 
                  stroke="rgba(16, 185, 129, 0.4)" 
                  strokeWidth="2.5" 
                  strokeDasharray="5 4" 
                />

                {/* Pin 1: Volta Region Cultivation Hub */}
                <g 
                  className="map-pin" 
                  style={{ color: '#f59e0b' }} 
                  onClick={() => setActiveRegion('volta')}
                >
                  <circle cx="265" cy="260" r="16" fill="rgba(245, 158, 11, 0.2)" />
                  <circle cx="265" cy="260" r="7" fill="#f59e0b" className={activeRegion === 'volta' ? 'live-badge-glow' : ''} />
                  <text x="285" y="265" fill="#f59e0b" fontSize="12" fontWeight="800">Volta Sourcing</text>
                </g>

                {/* Pin 2: Accra Processing Kitchen */}
                <g 
                  className="map-pin" 
                  style={{ color: '#3b82f6' }} 
                  onClick={() => setActiveRegion('accra')}
                >
                  <circle cx="215" cy="362" r="16" fill="rgba(59, 130, 246, 0.2)" />
                  <circle cx="215" cy="362" r="7" fill="#3b82f6" className={activeRegion === 'accra' ? 'live-badge-glow' : ''} />
                  <text x="100" y="367" fill="#60a5fa" fontSize="12" fontWeight="800">Accra Kitchen</text>
                </g>
              </svg>
            </div>

            {/* Region details panel */}
            <div className="map-details-card">
              <div className="region-detail-box">
                <span className="region-tag" style={{
                  color: currentRegion.id === 'volta' ? '#fbbf24' : '#60a5fa',
                  background: currentRegion.id === 'volta' ? 'rgba(245,158,11,0.12)' : 'rgba(59,130,246,0.12)',
                  borderColor: currentRegion.id === 'volta' ? 'rgba(245,158,11,0.25)' : 'rgba(59,130,246,0.25)',
                }}>
                  {currentRegion.tag}
                </span>
                <h4 className="region-h4">{currentRegion.title}</h4>
                <p className="region-desc">{currentRegion.desc}</p>
                
                <h5 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 800 }}>Associated Activities/Crops:</h5>
                <div className="region-crops-list">
                  {currentRegion.crops.map((c, i) => (
                    <span key={i} className="region-crop-tag" style={{
                      color: currentRegion.id === 'volta' ? '#f59e0b' : '#3b82f6',
                      background: currentRegion.id === 'volta' ? 'rgba(245,158,11,0.08)' : 'rgba(59,130,246,0.08)',
                      borderColor: currentRegion.id === 'volta' ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.2)',
                    }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sourcing Principles & Guidelines Section */}
        <div className="farmers-section">
          <div className="farms-header-section" style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <div className="farms-title-badge">🤝 Partnership Guidelines</div>
            <h2 className="farms-headline" style={{ fontSize: '2rem' }}>Our Sourcing Commitments</h2>
            <p className="farms-subheadline" style={{ margin: 0, fontSize: '0.95rem', color: '#94a3b8' }}>
              We build long-term relationships with smallholder family farms in Ghana, combining generations of agricultural craftsmanship with modern technical auditing.
            </p>
          </div>

          <div className="farmers-grid">
            <div className="farmer-spotlight-card">
              <div className="farmer-header">
                <span className="farmer-avatar">⚖️</span>
                <div className="farmer-meta">
                  <span className="farmer-name">Fair-Trade Standards</span>
                  <span className="farmer-title">Community Commitments</span>
                </div>
              </div>
              <p className="farmer-quote">
                We guarantee fair, above-market pricing directly to local growers. By eliminating brokers, we keep economic value within the Volta Region's farming communities.
              </p>
              <div className="farmer-specialty">
                <span className="specialty-tag">Ethical Wages</span>
                <span className="specialty-tag">Volta Region</span>
              </div>
            </div>

            <div className="farmer-spotlight-card">
              <div className="farmer-header">
                <span className="farmer-avatar">🌾</span>
                <div className="farmer-meta">
                  <span className="farmer-name">Ecological Stewardship</span>
                  <span className="farmer-title">Soil Protection Rules</span>
                </div>
              </div>
              <p className="farmer-quote">
                Every farm partner enforces strict pesticide-free protocols. Enriching soil with organic compost prevents chemical runoff into local rivers and safeguards the water tables.
              </p>
              <div className="farmer-specialty">
                <span className="specialty-tag">Pesticide-Free</span>
                <span className="specialty-tag">Organic Compost</span>
              </div>
            </div>

            <div className="farmer-spotlight-card">
              <div className="farmer-header">
                <span className="farmer-avatar">📡</span>
                <div className="farmer-meta">
                  <span className="farmer-name">Agritech Integration</span>
                  <span className="farmer-title">Data Sharing Program</span>
                </div>
              </div>
              <p className="farmer-quote">
                We share wireless telemetry insights with our partners, providing moisture alerts and weather forecasts to optimize sowing, land irrigation, and harvest timings.
              </p>
              <div className="farmer-specialty">
                <span className="specialty-tag">IoT Insights</span>
                <span className="specialty-tag">Smart Harvests</span>
              </div>
            </div>
          </div>
        </div>

        {/* GMO banner */}
        <div className="gmo-policy-banner" style={{ padding: '2rem', justifyContent: 'center' }}>
          <span style={{ fontSize: '2.5rem' }}>🛡️</span>
          <div>
            <strong style={{ display: 'block', color: '#fff', fontSize: '1.1rem', marginBottom: '0.25rem' }}>100% Non-GMO & Organic Standard</strong>
            <span style={{ fontSize: '0.85rem', color: '#a7f3d0', lineHeight: 1.4 }}>
              Kone Farms enforces strict pesticide-free standards. We protect native biodiversity, prevent chemical run-offs, and ensure the pure, bold flavor profiles of Kone Food products.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
