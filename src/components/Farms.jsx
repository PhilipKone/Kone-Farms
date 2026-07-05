import React, { useState, useEffect } from 'react';
import './Farms.css';
import L from 'leaflet';

export default function Farms() {
  const [activeRegion, setActiveRegion] = useState('volta'); // 'volta' | 'accra'

  // Initialize Leaflet Map
  useEffect(() => {
    // Center at Ghana [6.8, -0.9] with zoom 7 initially
    const map = L.map('farms-leaflet-map', {
      center: [6.8, -0.9],
      zoom: 7,
      zoomControl: true,
      scrollWheelZoom: false, // Prevent page scrolling hijacking
    });

    // Dark Matter tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CartoDB',
      minZoom: 6,
      maxZoom: 11,
    }).addTo(map);

    // Custom glowing HTML markers html generator
    const createGlowingPin = (color) => `
      <div class="custom-marker-glowing" style="--pin-color: ${color};">
        <div class="pin-core"></div>
        <div class="pin-ring"></div>
      </div>
    `;

    // Coordinates definition
    const locations = [
      { id: 'accra', name: 'Accra Packaging Kitchen', coords: [5.6, -0.18], color: '#60a5fa' },
      { id: 'volta', name: 'Volta Sourcing District', coords: [6.6, 0.6], color: '#fbbf24' },
      { id: 'kumasi', name: 'Kumasi Agro-forestry Hub', coords: [6.69, -1.62], color: '#10b981' },
      { id: 'tamale', name: 'Tamale Shea & Grain Cooperative', coords: [9.40, -0.84], color: '#f97316' },
    ];

    const markerInstances = [];

    locations.forEach((loc) => {
      const icon = L.divIcon({
        html: createGlowingPin(loc.color),
        className: 'leaflet-custom-marker-wrapper',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker(loc.coords, { icon }).addTo(map);
      marker.on('click', () => {
        setActiveRegion(loc.id);
      });
      markerInstances.push(marker);
    });

    // Fit map bounds automatically to frame all 4 pins beautifully with padding
    const group = L.featureGroup(markerInstances);
    map.fitBounds(group.getBounds().pad(0.18));

    // Logistics Polylines flowing towards Accra Packaging Kitchen [5.6, -0.18]
    const routeOptions = (color) => ({
      color: color,
      weight: 2.5,
      opacity: 0.65,
      dashArray: '8, 8',
      className: 'logistics-route'
    });

    // Outlying hubs -> Accra Packaging Kitchen
    const accraCoords = [5.6, -0.18];
    const voltaCoords = [6.6, 0.6];
    const kumasiCoords = [6.69, -1.62];
    const tamaleCoords = [9.40, -0.84];

    L.polyline([voltaCoords, accraCoords], routeOptions('#fbbf24')).addTo(map);
    L.polyline([kumasiCoords, accraCoords], routeOptions('#10b981')).addTo(map);
    L.polyline([tamaleCoords, accraCoords], routeOptions('#f97316')).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

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
    },
    kumasi: {
      id: 'kumasi',
      tag: 'Agro-forestry Hub',
      title: 'Kumasi Agro-forestry Hub',
      desc: 'Located in the heart of the Ashanti Region, this hub focuses on sustainable multi-tier organic cocoa shade-cropping, black pepper vine inter-cropping, and natural composting research. We host soil regeneration workshops for regional farming cooperatives here.',
      crops: ['🍫 Organic Cocoa', '🪵 Composting Research', '🌿 Black Pepper Vines', '🍌 Plantain Shade-crops']
    },
    tamale: {
      id: 'tamale',
      tag: 'Arid Farming & Cooperative',
      title: 'Tamale Shea & Grain Cooperative',
      desc: 'Our northernmost cooperative specializing in wild-harvested organic shea butter extraction, drought-resistant pearl millet cultivation, and solar dehydration processing. It operates as a women-led cooperative supporting 80 households.',
      crops: ['🧴 Organic Shea Butter', '🌾 Pearl Millet', '☀️ Solar Dehydration', '🥜 Roasted Groundnuts']
    }
  };

  const currentRegion = regions[activeRegion] || regions.volta;

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
            {/* Leaflet Real Geographical Map */}
            <div className="map-svg-container" style={{ padding: 0, overflow: 'hidden' }}>
              <div id="farms-leaflet-map" style={{ width: '100%', height: '450px', zIndex: 1 }}></div>
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
        <div className="gmo-policy-banner">
          <span style={{ fontSize: '2.5rem' }}>🛡️</span>
          <div>
            <strong className="gmo-policy-title">100% Non-GMO & Organic Standard</strong>
            <span className="gmo-policy-desc">
              Kone Farms enforces strict pesticide-free standards. We protect native biodiversity, prevent chemical run-offs, and ensure the pure, bold flavor profiles of Kone Food products.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
