import React, { useState, useEffect } from 'react';
import './Farms.css';
import L from 'leaflet';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

export default function Farms() {
  const [activeRegion, setActiveRegion] = useState('volta'); // 'volta' | 'accra' | 'kumasi' | 'tamale'
  const [selectedCropFilter, setSelectedCropFilter] = useState('all');
  
  // Outgrower registration state
  const [farmerName, setFarmerName] = useState('');
  const [farmerContact, setFarmerContact] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmAcreage, setFarmAcreage] = useState('5-10');
  const [cropType, setCropType] = useState('plantain');
  const [outgrowerSubmitted, setOutgrowerSubmitted] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    const mapContainer = document.getElementById('farms-leaflet-map');
    if (!mapContainer) return;

    // Center at Ghana [6.8, -0.9] with zoom 7 initially
    const map = L.map('farms-leaflet-map', {
      center: [6.8, -0.9],
      zoom: 7,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    // Dark Matter tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CartoDB',
      minZoom: 6,
      maxZoom: 11,
    }).addTo(map);

    // Custom glowing HTML markers generator
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

    // Fit map bounds automatically to frame all pins with padding
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
      tag: 'Main Agricultural & Chips Sourcing Hub',
      title: 'Volta Basin Sourcing District',
      desc: 'Spanning the nutrient-rich fertile soils of the Volta Region (Kpando, Hohoe, Anloga). This district delivers sun-ripened organic plantains, Ghanaian white yams, and fiery Scotch Bonnet peppers. Powered by smart IoT telemetry, solar drip irrigation, and ethical fair-trade farmer contracts.',
      crops: ['🍌 Golden Plantains', '🍠 Ghanaian White Yam', '🌶️ Scotch Bonnet Pepper', '🧅 Anloga Shallots', '🧄 Organic Garlic'],
      stats: { farmers: '45+ Smallholders', soilHealth: '98% Organic Purity', acreage: '280 Hectares' }
    },
    accra: {
      id: 'accra',
      tag: 'Agro-Processing & Cold Packaging Kitchen',
      title: 'Accra Packaging & Quality Hub',
      desc: 'Our centralized agro-processing facility and laboratory quality audit center. Fresh harvests from the Volta basin arrive within 24 hours to undergo precision kettle-frying in cold-pressed oil, nitrogen-sealed packaging for Kone Chips, and slow-cooking for Kone Shito.',
      crops: ['🍌 Nitrogen Foil Packaging', '🥫 Shito Slow-Cooking', '🧪 Moisture Auditing', '📦 Wholesale Pallet Freight'],
      stats: { farmers: 'Central Distribution', soilHealth: 'ISO 22000 Certified', acreage: 'Food Processing Hub' }
    },
    kumasi: {
      id: 'kumasi',
      tag: 'Agro-forestry & Soil Research',
      title: 'Kumasi Agro-Forestry Hub',
      desc: 'Located in the Ashanti rainforest belt. Specializes in shade-grown cocoa, root composting research, multi-canopy agroforestry, and indigenous seed conservation.',
      crops: ['🍫 Organic Cocoa', '🪵 Forest Composting', '🌿 Wild Herbal Plots', '🍌 Plantain Agro-Canopy'],
      stats: { farmers: '30 Cooperatives', soilHealth: 'Regenerative Loam', acreage: '140 Hectares' }
    },
    tamale: {
      id: 'tamale',
      tag: 'Savannah Climate & Grains Co-op',
      title: 'Tamale Shea & Grains Collective',
      desc: 'Operating across Northern Ghana savannah soils. Focused on drought-resilient pearl millet, solar dehydration processing, and wild organic shea butter.',
      crops: ['🧴 Organic Shea Butter', '🌾 Pearl Millet', '☀️ Solar Dehydration', '🥜 Roasted Groundnuts'],
      stats: { farmers: '80 Women Households', soilHealth: 'Solar Regenerative', acreage: '350 Hectares' }
    }
  };

  const currentRegion = regions[activeRegion] || regions.volta;

  const handleOutgrowerSubmit = async (e) => {
    e.preventDefault();
    if (!farmerName || !farmerContact) return;
    setOutgrowerSubmitted(true);

    if (db && db.app) {
      try {
        await addDoc(collection(db, 'farm_outgrowers'), {
          name: farmerName.trim(),
          contact: farmerContact.trim(),
          location: farmLocation.trim(),
          acreage: farmAcreage,
          cropType: cropType,
          status: 'Under Review',
          submittedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Firestore outgrower submission error:", err);
      }
    }

    setTimeout(() => {
      setOutgrowerSubmitted(false);
      setFarmerName('');
      setFarmerContact('');
      setFarmLocation('');
    }, 4000);
  };

  return (
    <div className="farms-div-page animate-fade-in">
      <div className="farms-container">
        
        {/* Farmland Hero Section with Realistic Farm Photography */}
        <div className="farm-hero-banner">
          <div className="farm-hero-img-wrapper">
            <img 
              src="/assets/farms/volta-groves.jpg" 
              alt="Volta Organic Farmlands & Smart Agtech Groves" 
              className="farm-hero-img"
            />
            <div className="farm-hero-gradient-overlay"></div>
            
            <div className="farm-hero-content">
              <div className="farms-title-badge">🌾 Sustainable Agriculture & Smart Agtech</div>
              <h1 className="farms-headline">Cultivating the Future, Respecting the Soil</h1>
              <p className="farms-subheadline" style={{ color: '#e2e8f0', maxWidth: '680px' }}>
                We combine organic smallholder cultivation with precision IoT telemetry. Sun-drenched Volta plantain groves, rich white yam mounds, and highland potato fields powering our artisanal food division.
              </p>
            </div>
          </div>
        </div>

        {/* Live IoT Agro-Telemetry Stream Bar */}
        <div className="telemetry-bar-card">
          <div className="telemetry-bar-header">
            <div className="live-indicator">
              <span className="live-dot pulse"></span>
              <strong>LIVE VOLTA FIELD TELEMETRY</strong>
            </div>
            <span className="telemetry-timestamp">Station #VOLTA-AG-04 • Last Synced: 2 mins ago</span>
          </div>

          <div className="telemetry-grid">
            <div className="telemetry-metric-item">
              <span className="t-icon">💧</span>
              <div>
                <span className="t-val">28.4%</span>
                <span className="t-lbl">Soil Moisture (Optimal)</span>
              </div>
            </div>
            <div className="telemetry-metric-item">
              <span className="t-icon">🧪</span>
              <div>
                <span className="t-val">6.4 pH</span>
                <span className="t-lbl">Volta Loam Soil pH</span>
              </div>
            </div>
            <div className="telemetry-metric-item">
              <span className="t-icon">☀️</span>
              <div>
                <span className="t-val">865 W/m²</span>
                <span className="t-lbl">Solar Irradiance</span>
              </div>
            </div>
            <div className="telemetry-metric-item">
              <span className="t-icon">🌡️</span>
              <div>
                <span className="t-val">29.5°C</span>
                <span className="t-lbl">Ambient Field Temp</span>
              </div>
            </div>
            <div className="telemetry-metric-item">
              <span className="t-icon">🌿</span>
              <div>
                <span className="t-val">0.92 NDVI</span>
                <span className="t-lbl">Canopy Health Index</span>
              </div>
            </div>
          </div>
        </div>

        {/* Organic Farmlands & Crops Section */}
        <div className="farms-card crops-section">
          <div className="section-head-flex">
            <div>
              <h2 className="smartfarm-title">🌱 Farmland Crops & Sourcing Groves</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.25rem 0 1.5rem', textAlign: 'left' }}>
                Explore the biological varieties cultivated across our Ghanaian partner farm clusters.
              </p>
            </div>
            <div className="crop-filter-chips">
              {['all', 'chips', 'shito', 'agroforestry'].map((filter) => (
                <button
                  key={filter}
                  className={`filter-chip-btn ${selectedCropFilter === filter ? 'active' : ''}`}
                  onClick={() => setSelectedCropFilter(filter)}
                >
                  {filter === 'all' && 'All Farmlands'}
                  {filter === 'chips' && '🍌 Chips Crops'}
                  {filter === 'shito' && '🌶️ Shito Spices'}
                  {filter === 'agroforestry' && '🌿 Agro-Forestry'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="farms-crops-grid">
            {(selectedCropFilter === 'all' || selectedCropFilter === 'chips') && (
              <>
                <div className="farm-crop-box">
                  <div className="crop-box-top">
                    <span className="crop-avatar">🍌</span>
                    <div>
                      <h4 className="crop-name">Golden Plantain</h4>
                      <span className="crop-scientific">Musa paradisiaca L.</span>
                    </div>
                  </div>
                  <p className="crop-desc">
                    Grown in Kpando & Hohoe under multi-tier canopy cover. Naturally high in potassium and slow-release carbohydrates, harvested at peak starch-to-sugar balance for Kone Chips.
                  </p>
                  <div className="crop-meta-tags">
                    <span>📍 Volta Groves</span>
                    <span>💧 Drip Irrigated</span>
                    <span>🌿 100% Non-GMO</span>
                  </div>
                </div>

                <div className="farm-crop-box">
                  <div className="crop-box-top">
                    <span className="crop-avatar">🍠</span>
                    <div>
                      <h4 className="crop-name">Ghanaian White Yam</h4>
                      <span className="crop-scientific">Dioscorea alata</span>
                    </div>
                  </div>
                  <p className="crop-desc">
                    Cultivated in aerated alluvial mounds in the Volta Basin. Produces crisp, fiber-rich root tubers with dense texture and clean roasted flavor.
                  </p>
                  <div className="crop-meta-tags">
                    <span>📍 Central & Volta Basin</span>
                    <span>🌱 Mound Grown</span>
                    <span>✨ High Fiber</span>
                  </div>
                </div>

                <div className="farm-crop-box">
                  <div className="crop-box-top">
                    <span className="crop-avatar">🥔</span>
                    <div>
                      <h4 className="crop-name">Highland Russet Potato</h4>
                      <span className="crop-scientific">Solanum tuberosum</span>
                    </div>
                  </div>
                  <p className="crop-desc">
                    Farm-fresh potatoes slow-grown in cooler highland soils for maximum starch density and golden frying performance.
                  </p>
                  <div className="crop-meta-tags">
                    <span>📍 Highland Co-ops</span>
                    <span>🌿 Skin-On Processing</span>
                    <span>🥔 Rich Potassium</span>
                  </div>
                </div>
              </>
            )}

            {(selectedCropFilter === 'all' || selectedCropFilter === 'shito') && (
              <>
                <div className="farm-crop-box">
                  <div className="crop-box-top">
                    <span className="crop-avatar">🌶️</span>
                    <div>
                      <h4 className="crop-name">Scotch Bonnet Pepper</h4>
                      <span className="crop-scientific">Capsicum chinense</span>
                    </div>
                  </div>
                  <p className="crop-desc">
                    Fiery Volta Scotch Bonnet peppers harvested at 85,000 Scoville Heat units. Sun-ripened on organic soil beds and cold-audited for pesticide purity.
                  </p>
                  <div className="crop-meta-tags">
                    <span>📍 Anloga Fields</span>
                    <span>🔥 85,000 SHU</span>
                    <span>🚫 Zero Pesticides</span>
                  </div>
                </div>

                <div className="farm-crop-box">
                  <div className="crop-box-top">
                    <span className="crop-avatar">🧅</span>
                    <div>
                      <h4 className="crop-name">Anloga Pink Shallots</h4>
                      <span className="crop-scientific">Allium cepa var. aggregatum</span>
                    </div>
                  </div>
                  <p className="crop-desc">
                    Grown in coastal sandy loam near the Keta lagoon. Imparts deep aromatic sweetness and umami foundation to our slow-cooked Kone Shito sauce.
                  </p>
                  <div className="crop-meta-tags">
                    <span>📍 Keta/Anloga Coast</span>
                    <span>🍯 Natural Sweetness</span>
                    <span>🧅 Hand Harvested</span>
                  </div>
                </div>
              </>
            )}

            {(selectedCropFilter === 'all' || selectedCropFilter === 'agroforestry') && (
              <div className="farm-crop-box">
                <div className="crop-box-top">
                  <span className="crop-avatar">🌿</span>
                  <div>
                    <h4 className="crop-name">Organic Garlic & Herbs</h4>
                    <span className="crop-scientific">Allium sativum & Ocimum</span>
                  </div>
                </div>
                <p className="crop-desc">
                  Inter-cropped alongside plantains to deter pests naturally while providing wild herbal seasonings for our artisanal chips and sauces.
                </p>
                <div className="crop-meta-tags">
                  <span>📍 Kumasi & Volta Hubs</span>
                  <span>🌿 Companion Cropped</span>
                  <span>🧄 Wild Seasoning</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Map Section */}
        <div className="map-section">
          <div className="farms-header-section" style={{ marginBottom: '2.5rem' }}>
            <div className="farms-title-badge" style={{ background: 'rgba(59, 130, 246, 0.12)', borderColor: 'rgba(59, 130, 246, 0.25)', color: '#60a5fa' }}>📍 Geographic Trail</div>
            <h2 className="farms-headline" style={{ fontSize: '2rem' }}>Trace the Ghanaian Harvest Path</h2>
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
                <h3 className="region-h4">{currentRegion.title}</h3>
                <p className="region-desc">{currentRegion.desc}</p>
                
                <h4 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 800 }}>Primary Crops & Activities:</h4>
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

                {currentRegion.stats && (
                  <div className="region-stats-strip">
                    <div className="r-stat">
                      <strong>{currentRegion.stats.farmers}</strong>
                      <small>Network</small>
                    </div>
                    <div className="r-stat">
                      <strong>{currentRegion.stats.soilHealth}</strong>
                      <small>Purity</small>
                    </div>
                    <div className="r-stat">
                      <strong>{currentRegion.stats.acreage}</strong>
                      <small>Coverage</small>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sustainable Ecological Farming Principles */}
        <div className="farms-card ecological-principles-card">
          <div className="farms-header-section" style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <div className="farms-title-badge" style={{ background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.25)', color: '#34d399' }}>
              🌍 Agro-Ecology Standards
            </div>
            <h2 className="farms-headline" style={{ fontSize: '2rem' }}>How We Protect the Soil & Farmers</h2>
          </div>

          <div className="principles-grid">
            <div className="principle-item">
              <span className="p-icon">🌱</span>
              <h4>100% Regenerative Soil</h4>
              <p>We use rich natural organic compost derived from plantain biomass and fallen leaves, keeping heavy chemicals and artificial nitrates out of the soil.</p>
            </div>
            <div className="principle-item">
              <span className="p-icon">💧</span>
              <h4>Solar Drip Micro-Irrigation</h4>
              <p>Precision water sensors monitor root depth hydration, utilizing gravity and solar pumps from the Volta River basin with zero wastewater runoff.</p>
            </div>
            <div className="principle-item">
              <span className="p-icon">⚖️</span>
              <h4>Fair-Trade Guaranteed Floor</h4>
              <p>We contract directly with smallholder farmers, guaranteeing pre-harvest floor purchase prices 25% above volatile open commodity market rates.</p>
            </div>
            <div className="principle-item">
              <span className="p-icon">📡</span>
              <h4>Digital Harvest Traceability</h4>
              <p>Every harvested crate is assigned an RFID telemetry tag linking field coordinates, soil logs, and farmer signatures directly to consumer QR codes.</p>
            </div>
          </div>
        </div>

        {/* Outgrower Network & Contract Farming Registration */}
        <div className="farms-card outgrower-section animate-fade-in">
          <div className="outgrower-grid">
            <div style={{ textAlign: 'left' }}>
              <div className="farms-title-badge" style={{ background: 'rgba(234, 179, 8, 0.12)', borderColor: 'rgba(234, 179, 8, 0.25)', color: '#facc15' }}>
                🤝 Ghanaian Farmer Partnership
              </div>
              <h2 style={{ color: 'white', fontSize: '1.8rem', margin: '0.5rem 0' }}>
                Join the Kone Outgrower Network
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Are you a Ghanaian farmer cultivating plantains, white yams, potatoes, or Scotch Bonnet peppers? Partner with Kone Food Division for guaranteed off-take contracts, agronomy training, and precision smart soil sensors.
              </p>

              <div className="outgrower-perks-list">
                <div className="perk-row">✓ Guaranteed purchasing contract before harvest</div>
                <div className="perk-row">✓ Free soil fertility and moisture audit telemetry</div>
                <div className="perk-row">✓ Access to certified non-GMO planting suckers & organic inputs</div>
              </div>
            </div>

            <div className="outgrower-form-wrapper">
              {outgrowerSubmitted ? (
                <div className="submit-success-banner">
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🌱</span>
                  <strong style={{ display: 'block', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Farm Application Received!</strong>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>An agronomist from our Volta Field Cluster will reach out to inspect soil logs and schedule an onboarding visit.</p>
                </div>
              ) : (
                <form onSubmit={handleOutgrowerSubmit}>
                  <div className="dist-form-group">
                    <label className="dist-label">Farmer / Co-op Lead Name</label>
                    <input
                      type="text"
                      required
                      value={farmerName}
                      onChange={(e) => setFarmerName(e.target.value)}
                      placeholder="e.g. Kwame Mensah"
                      className="dist-input"
                    />
                  </div>

                  <div className="dist-form-group">
                    <label className="dist-label">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      required
                      value={farmerContact}
                      onChange={(e) => setFarmerContact(e.target.value)}
                      placeholder="+233 24 123 4567"
                      className="dist-input"
                    />
                  </div>

                  <div className="dist-form-group">
                    <label className="dist-label">Farmland Location / District</label>
                    <input
                      type="text"
                      required
                      value={farmLocation}
                      onChange={(e) => setFarmLocation(e.target.value)}
                      placeholder="e.g. Kpando District, Volta Region"
                      className="dist-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="dist-form-group">
                      <label className="dist-label">Estimated Acreage</label>
                      <select 
                        value={farmAcreage} 
                        onChange={(e) => setFarmAcreage(e.target.value)}
                        className="dist-input select-farms-option"
                      >
                        <option value="1-4">1 - 4 Acres</option>
                        <option value="5-10">5 - 10 Acres</option>
                        <option value="10-25">10 - 25 Acres</option>
                        <option value="25+">25+ Acres</option>
                      </select>
                    </div>

                    <div className="dist-form-group">
                      <label className="dist-label">Primary Crop</label>
                      <select 
                        value={cropType} 
                        onChange={(e) => setCropType(e.target.value)}
                        className="dist-input select-farms-option"
                      >
                        <option value="plantain">🍌 Golden Plantain</option>
                        <option value="yam">🍠 White Yam</option>
                        <option value="potato">🥔 Highland Potato</option>
                        <option value="pepper">🌶️ Scotch Bonnet</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="farms-submit-btn" style={{ width: '100%', marginTop: '0.75rem' }}>
                    Apply as Outgrower Partner ➔
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
