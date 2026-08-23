import React, { useState, useEffect } from 'react';
import './Farms.css';
import L from 'leaflet';
import { db } from '../firebase/config';
import { collection, addDoc, doc, onSnapshot } from 'firebase/firestore';

export default function Farms() {
  const [activeRegion, setActiveRegion] = useState('eastern');
  const [selectedCropFilter, setSelectedCropFilter] = useState('all');
  
  // Live Telemetry state (null when no live measurements recorded yet)
  const [telemetry, setTelemetry] = useState(null);
  const [isDbOnline, setIsDbOnline] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Outgrower registration state
  const [farmerName, setFarmerName] = useState('');
  const [farmerContact, setFarmerContact] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmAcreage, setFarmAcreage] = useState('5-10');
  const [cropType, setCropType] = useState('plantain');
  const [outgrowerSubmitted, setOutgrowerSubmitted] = useState(false);

  // Subscribe to live field telemetry
  useEffect(() => {
    if (!db || !db.app) {
      setIsDbOnline(false);
      return;
    }
    setIsDbOnline(true);
    const telemDocRef = doc(db, 'farm_telemetry', 'live');
    const unsubscribe = onSnapshot(telemDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTelemetry(data);
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } else {
        setTelemetry(null);
      }
    }, (err) => {
      console.warn("Firestore telemetry listener in Farms:", err);
      setIsDbOnline(false);
    });
    return () => unsubscribe();
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    const mapContainer = document.getElementById('farms-leaflet-map');
    if (!mapContainer) return;

    const map = L.map('farms-leaflet-map', {
      center: [6.8, -0.9],
      zoom: 7,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CartoDB',
      minZoom: 6,
      maxZoom: 11,
    }).addTo(map);

    const createGlowingPin = (color) => `
      <div class="custom-marker-glowing" style="--pin-color: ${color};">
        <div class="pin-core"></div>
        <div class="pin-ring"></div>
      </div>
    `;

    const locations = [
      { id: 'accra', name: 'Accra Packaging Kitchen', coords: [5.6, -0.18], color: '#60a5fa' },
      { id: 'eastern', name: 'Organic Plantain & Root Crops District', coords: [6.6, 0.6], color: '#fbbf24' },
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

    const group = L.featureGroup(markerInstances);
    map.fitBounds(group.getBounds().pad(0.18));

    const routeOptions = (color) => ({
      color: color,
      weight: 2.5,
      opacity: 0.65,
      dashArray: '8, 8',
      className: 'logistics-route'
    });

    const accraCoords = [5.6, -0.18];
    const easternCoords = [6.6, 0.6];
    const kumasiCoords = [6.69, -1.62];
    const tamaleCoords = [9.40, -0.84];

    L.polyline([easternCoords, accraCoords], routeOptions('#fbbf24')).addTo(map);
    L.polyline([kumasiCoords, accraCoords], routeOptions('#10b981')).addTo(map);
    L.polyline([tamaleCoords, accraCoords], routeOptions('#f97316')).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  const regions = {
    eastern: {
      id: 'eastern',
      tag: 'Main Agricultural & Chips Sourcing Hub',
      title: 'Organic Plantain & Root Crops District',
      desc: 'Spanning nutrient-rich fertile loam soils. This district delivers sun-ripened organic plantains, Ghanaian white yams, and fiery Scotch Bonnet peppers. Powered by smart IoT telemetry, solar drip irrigation, and ethical fair-trade farmer contracts.',
      crops: ['Golden Plantains', 'Ghanaian White Yam', 'Scotch Bonnet Pepper', 'Sweet Pink Shallots', 'Organic Garlic'],
      stats: { farmers: '45+ Smallholders', soilHealth: '98% Organic Purity', acreage: '280 Hectares' }
    },
    accra: {
      id: 'accra',
      tag: 'Agro-Processing & Cold Packaging Kitchen',
      title: 'Accra Packaging & Quality Hub',
      desc: 'Our centralized agro-processing facility and laboratory quality audit center. Fresh harvests from partner farms arrive within 24 hours to undergo precision kettle-frying in cold-pressed oil, nitrogen-sealed packaging for Kone Chips, and slow-cooking for Kone Shito.',
      crops: ['Nitrogen Foil Packaging', 'Shito Slow-Cooking', 'Moisture Auditing', 'Wholesale Pallet Freight'],
      stats: { farmers: 'Central Distribution', soilHealth: 'ISO 22000 Certified', acreage: 'Food Processing Hub' }
    },
    kumasi: {
      id: 'kumasi',
      tag: 'Agro-forestry & Soil Research',
      title: 'Kumasi Agro-Forestry Hub',
      desc: 'Located in the Ashanti rainforest belt. Specializes in shade-grown cocoa, root composting research, multi-canopy agroforestry, and indigenous seed conservation.',
      crops: ['Organic Cocoa', 'Forest Composting', 'Wild Herbal Plots', 'Plantain Agro-Canopy'],
      stats: { farmers: '30 Cooperatives', soilHealth: 'Regenerative Loam', acreage: '140 Hectares' }
    },
    tamale: {
      id: 'tamale',
      tag: 'Savannah Climate & Grains Co-op',
      title: 'Tamale Shea & Grains Collective',
      desc: 'Operating across Northern Ghana savannah soils. Focused on drought-resilient pearl millet, solar dehydration processing, and wild organic shea butter.',
      crops: ['Organic Shea Butter', 'Pearl Millet', 'Solar Dehydration', 'Roasted Groundnuts'],
      stats: { farmers: '80 Women Households', soilHealth: 'Solar Regenerative', acreage: '350 Hectares' }
    }
  };

  const currentRegion = regions[activeRegion] || regions.eastern;

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
              alt="Organic Farmlands & Smart Agtech Groves" 
              className="farm-hero-img"
            />
            <div className="farm-hero-gradient-overlay"></div>
            
            <div className="farm-hero-content">
              <div className="farms-title-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="#34d399" strokeWidth="2.5" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Sustainable Agriculture & Smart Agtech
              </div>
              <h1 className="farms-headline">Cultivating the Future, Respecting the Soil</h1>
              <p className="farms-subheadline" style={{ color: '#e2e8f0', maxWidth: '680px' }}>
                We combine organic smallholder cultivation with precision IoT telemetry. Sun-drenched organic plantain groves, rich white yam mounds, and highland potato fields powering our artisanal food division.
              </p>
            </div>
          </div>
        </div>

        {/* Live IoT Agro-Telemetry Stream Bar */}
        <div className="telemetry-bar-card">
          <div className="telemetry-bar-header">
            <div className="telemetry-live-indicator">
              <span className={telemetry ? "pulse-dot-green" : "status-dot offline"}></span>
              <strong>{telemetry ? 'LIVE FIELD AGRO-TELEMETRY' : 'STATUS: STANDBY • AWAITING FIELD TELEMETRY'}</strong>
            </div>
            <span className="telemetry-station-id">
              {telemetry ? `Field Node #01 • Synced: ${lastSyncTime || 'Just now'}` : 'Cloud Telemetry Active • Awaiting Field Probe Readings'}
            </span>
          </div>

          <div className="telemetry-sensors-row">
            <div className="t-sensor-item">
              <span className="t-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#60a5fa" strokeWidth="2" fill="none">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
              </span>
              <div className="t-data">
                <span className="t-val">{telemetry?.moisture !== undefined ? `${telemetry.moisture}%` : '-- %'}</span>
                <span className="t-label">{telemetry ? 'Soil Moisture' : 'Moisture (Awaiting Probe)'}</span>
              </div>
            </div>
            <div className="t-sensor-item">
              <span className="t-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#34d399" strokeWidth="2" fill="none">
                  <path d="M10 2v7.31L4.41 18.9A2 2 0 0 0 6.13 22h11.74a2 2 0 0 0 1.72-3.1L14 9.31V2"/>
                  <line x1="8.5" y1="2" x2="15.5" y2="2"/>
                </svg>
              </span>
              <div className="t-data">
                <span className="t-val">{telemetry?.ph !== undefined ? `${telemetry.ph} pH` : '-- pH'}</span>
                <span className="t-label">{telemetry ? 'Soil Loam pH' : 'Soil pH (Awaiting Sample)'}</span>
              </div>
            </div>
            <div className="t-sensor-item">
              <span className="t-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#fbbf24" strokeWidth="2" fill="none">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                </svg>
              </span>
              <div className="t-data">
                <span className="t-val">{telemetry?.sunlight !== undefined ? `${telemetry.sunlight} W/m²` : '-- W/m²'}</span>
                <span className="t-label">{telemetry ? 'Solar Irradiance' : 'Solar (Awaiting Sensor)'}</span>
              </div>
            </div>
            <div className="t-sensor-item">
              <span className="t-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#f59e0b" strokeWidth="2" fill="none">
                  <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                </svg>
              </span>
              <div className="t-data">
                <span className="t-val">{telemetry?.temperature !== undefined ? `${telemetry.temperature}°C` : '-- °C'}</span>
                <span className="t-label">{telemetry ? 'Ambient Field Temp' : 'Temp (Awaiting Sensor)'}</span>
              </div>
            </div>
            <div className="t-sensor-item">
              <span className="t-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#10b981" strokeWidth="2" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </span>
              <div className="t-data">
                <span className="t-val">{telemetry?.ndvi !== undefined ? `${telemetry.ndvi} NDVI` : '-- NDVI'}</span>
                <span className="t-label">{telemetry ? 'Canopy Health' : 'Canopy (Awaiting Data)'}</span>
              </div>
            </div>
          </div>

          {!telemetry && (
            <div className="telemetry-standby-cta-bar">
              <p>📡 Ready for field node telemetry input or manual soil probe sampling.</p>
              <a href="#agritech/webapp" className="telemetry-standby-link">
                Launch smartFarm WebApp to Record First Field Reading →
              </a>
            </div>
          )}
        </div>

        {/* Organic Farmlands & Crops Section */}
        <div className="farms-card crops-section">
          <div className="section-head-flex">
            <div>
              <div className="farms-title-badge" style={{ background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.25)', color: '#34d399', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Regenerative Botanical Portfolio
              </div>
              <h2 className="smartfarm-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Farmland Crops & Sourcing Groves
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: '0.25rem 0 1.5rem', textAlign: 'left', maxWidth: '720px' }}>
                Explore the biological varieties cultivated across our Ghanaian partner farm clusters with full botanical specifications, soil profiles, and end-use traceability.
              </p>
            </div>

            <div className="crop-filter-chips">
              {[
                { id: 'all', label: 'All Farmlands', count: 6 },
                { id: 'chips', label: 'Chips Crops', count: 3 },
                { id: 'shito', label: 'Shito Spices', count: 2 },
                { id: 'agroforestry', label: 'Agro-Forestry', count: 1 }
              ].map((filter) => (
                <button
                  key={filter.id}
                  className={`filter-chip-btn ${selectedCropFilter === filter.id ? 'active' : ''}`}
                  onClick={() => setSelectedCropFilter(filter.id)}
                >
                  {filter.label} <span className="chip-count-pill">{filter.count}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="crop-grid">
            {[
              {
                id: 'plantain',
                category: 'chips',
                categoryLabel: 'Chips Harvest',
                name: 'Golden Plantain',
                scientific: 'Musa paradisiaca L.',
                color: '#eab308',
                gradient: 'rgba(234, 179, 8, 0.15)',
                desc: 'Grown under multi-tier agroforestry canopy. Naturally high in potassium and slow-release complex carbohydrates, harvested at peak starch-to-sugar equilibrium for artisanal kettle frying.',
                region: 'Eastern & Ashanti Groves',
                irrigation: 'Drip Micro-Irrigation',
                targetProduct: 'Kone Plantain Chips',
                tags: ['Partner Groves', 'Drip Irrigated', '100% Non-GMO', 'Peak Starch']
              },
              {
                id: 'yam',
                category: 'chips',
                categoryLabel: 'Root Tuber Harvest',
                name: 'Ghanaian White Yam',
                scientific: 'Dioscorea alata',
                color: '#f97316',
                gradient: 'rgba(249, 115, 22, 0.15)',
                desc: 'Cultivated in deeply aerated alluvial mounds. Produces crisp, fiber-rich root tubers with dense texture and clean nutty roasted flavor for traditional and salted yam chips.',
                region: 'Eastern Alluvial Farmlands',
                irrigation: 'Seasonal Monitored Rain',
                targetProduct: 'Kone White Yam Chips',
                tags: ['Mound Grown', 'High Inulin Fiber', 'Aerated Soil', 'Non-GMO']
              },
              {
                id: 'potato',
                category: 'chips',
                categoryLabel: 'Highland Tuber',
                name: 'Highland Russet Potato',
                scientific: 'Solanum tuberosum',
                color: '#38bdf8',
                gradient: 'rgba(56, 189, 248, 0.15)',
                desc: 'Farm-fresh potatoes slow-grown in cooler highland soils for maximum dry matter density, lower moisture absorption, and golden crispy frying performance.',
                region: 'Highland Partner Co-ops',
                irrigation: 'Precision Sprinklers',
                targetProduct: 'Kone Crisps & Gourmet Fries',
                tags: ['Highland Canopy', 'Skin-On Processing', 'Dense Starch', 'Pesticide-Free']
              },
              {
                id: 'scotch-bonnet',
                category: 'shito',
                categoryLabel: 'Artisanal Spice',
                name: 'Scotch Bonnet Pepper',
                scientific: 'Capsicum chinense',
                color: '#ef4444',
                gradient: 'rgba(239, 68, 68, 0.15)',
                desc: 'Fiery organic Scotch Bonnet peppers harvested at 85,000–120,000 Scoville Heat Units (SHU). Sun-ripened on organic compost beds and lab-audited for zero pesticide residues.',
                region: 'Volta & Central Farmlands',
                irrigation: 'Drip Telemetry',
                targetProduct: 'Kone Shito Hot Sauce',
                tags: ['85,000+ SHU', 'Sun-Ripened', 'Zero Pesticides', 'Lab Audited']
              },
              {
                id: 'shallots',
                category: 'shito',
                categoryLabel: 'Alluvial Aromatics',
                name: 'Sweet Pink Shallots',
                scientific: 'Allium cepa var. aggregatum',
                color: '#c084fc',
                gradient: 'rgba(192, 132, 252, 0.15)',
                desc: 'Cultivated in coastal sandy loam soils. Delivers concentrated natural sweetness, rich sulfur allicin compounds, and deep umami depth to our slow-simmered Kone Shito base.',
                region: 'Coastal Sandy Loam Hubs',
                irrigation: 'Micro-Spray Drip',
                targetProduct: 'Kone Shito Umami Base',
                tags: ['Coastal Farmlands', 'Natural Sweetness', 'Hand Harvested', 'Allicin-Rich']
              },
              {
                id: 'garlic-herbs',
                category: 'agroforestry',
                categoryLabel: 'Agro-Forestry Companion',
                name: 'Organic Garlic & Wild Herbs',
                scientific: 'Allium sativum & Ocimum',
                color: '#10b981',
                gradient: 'rgba(16, 185, 129, 0.15)',
                desc: 'Inter-cropped as botanical companion plants beneath plantain canopies to naturally deter insect pests while providing wild African herbal seasonings for our marinades and chips.',
                region: 'Kumasi Rainforest Belt',
                irrigation: 'Rainforest Canopy Moisture',
                targetProduct: 'Herbal Seasoning & Oil Infusions',
                tags: ['Companion Cropped', 'Natural Pest Deterrent', 'Wild Herbal', 'Regenerative']
              }
            ]
              .filter(crop => selectedCropFilter === 'all' || crop.category === selectedCropFilter)
              .map((crop) => (
                <article key={crop.id} className="crop-card" style={{ '--crop-accent': crop.color }}>
                  <div className="crop-card-top">
                    <div className="crop-avatar-svg" style={{ color: crop.color, background: crop.gradient, borderColor: `${crop.color}40` }}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.2" fill="none">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </div>
                    <div className="crop-heading-group">
                      <span className="crop-cat-pill" style={{ color: crop.color, background: `${crop.color}18`, borderColor: `${crop.color}35` }}>
                        {crop.categoryLabel}
                      </span>
                      <h3 className="crop-name">{crop.name}</h3>
                      <span className="crop-scientific">{crop.scientific}</span>
                    </div>
                  </div>

                  <p className="crop-desc">{crop.desc}</p>

                  <div className="crop-specs-strip">
                    <div className="crop-spec-item">
                      <span className="spec-label">Zone</span>
                      <strong className="spec-val">{crop.region}</strong>
                    </div>
                    <div className="crop-spec-item">
                      <span className="spec-label">Product</span>
                      <strong className="spec-val" style={{ color: crop.color }}>{crop.targetProduct}</strong>
                    </div>
                  </div>

                  <div className="crop-meta-tags">
                    {crop.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="crop-tag-item">#{tag}</span>
                    ))}
                  </div>
                </article>
              ))}
          </div>
        </div>

        {/* Interactive Map Section */}
        <div className="map-section">
          <div className="farms-header-section" style={{ marginBottom: '2.5rem' }}>
            <div className="farms-title-badge" style={{ background: 'rgba(59, 130, 246, 0.12)', borderColor: 'rgba(59, 130, 246, 0.25)', color: '#60a5fa', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="#60a5fa" strokeWidth="2.5" fill="none">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Geographic Trail
            </div>
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
                  color: currentRegion.id === 'eastern' ? '#fbbf24' : '#60a5fa',
                  background: currentRegion.id === 'eastern' ? 'rgba(245,158,11,0.12)' : 'rgba(59,130,246,0.12)',
                  borderColor: currentRegion.id === 'eastern' ? 'rgba(245,158,11,0.25)' : 'rgba(59,130,246,0.25)',
                }}>
                  {currentRegion.tag}
                </span>
                <h3 className="region-h4">{currentRegion.title}</h3>
                <p className="region-desc">{currentRegion.desc}</p>
                
                <h4 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 800 }}>Primary Crops & Activities:</h4>
                <div className="region-crops-list">
                  {currentRegion.crops.map((c, i) => (
                    <span key={i} className="region-crop-tag" style={{
                      color: currentRegion.id === 'eastern' ? '#f59e0b' : '#3b82f6',
                      background: currentRegion.id === 'eastern' ? 'rgba(245,158,11,0.08)' : 'rgba(59,130,246,0.08)',
                      borderColor: currentRegion.id === 'eastern' ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.2)',
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
            <div className="farms-title-badge" style={{ background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.25)', color: '#34d399', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="#34d399" strokeWidth="2.5" fill="none">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              Agro-Ecology Standards
            </div>
            <h2 className="farms-headline" style={{ fontSize: '2rem' }}>How We Protect the Soil & Farmers</h2>
          </div>

          <div className="principles-grid">
            <div className="principle-item">
              <span className="p-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="#34d399" strokeWidth="2" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </span>
              <h4>100% Regenerative Soil</h4>
              <p>We use rich natural organic compost derived from plantain biomass and fallen leaves, keeping heavy chemicals and artificial nitrates out of the soil.</p>
            </div>
            <div className="principle-item">
              <span className="p-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="#60a5fa" strokeWidth="2" fill="none">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
              </span>
              <h4>Solar Drip Micro-Irrigation</h4>
              <p>Precision water sensors monitor root depth hydration, utilizing gravity and solar pumps with zero wastewater runoff.</p>
            </div>
            <div className="principle-item">
              <span className="p-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="#fbbf24" strokeWidth="2" fill="none">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M16 8l-8 8"></path>
                  <path d="M8 8l8 8"></path>
                </svg>
              </span>
              <h4>Fair-Trade Guaranteed Floor</h4>
              <p>We contract directly with smallholder farmers, guaranteeing pre-harvest floor purchase prices 25% above volatile open commodity market rates.</p>
            </div>
            <div className="principle-item">
              <span className="p-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="#c084fc" strokeWidth="2" fill="none">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
                </svg>
              </span>
              <h4>Digital Harvest Traceability</h4>
              <p>Every harvested crate is assigned an RFID telemetry tag linking field coordinates, soil logs, and farmer signatures directly to consumer QR codes.</p>
            </div>
          </div>
        </div>

        {/* Outgrower Network & Contract Farming Registration */}
        <div className="farms-card outgrower-section animate-fade-in">
          <div className="outgrower-grid">
            <div style={{ textAlign: 'left' }}>
              <div className="farms-title-badge" style={{ background: 'rgba(234, 179, 8, 0.12)', borderColor: 'rgba(234, 179, 8, 0.25)', color: '#facc15', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="#facc15" strokeWidth="2.5" fill="none">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Ghanaian Farmer Partnership
              </div>
              <h2 style={{ color: 'white', fontSize: '1.8rem', margin: '0.5rem 0' }}>
                Join the Kone Outgrower Network
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Are you a Ghanaian farmer cultivating plantains, white yams, potatoes, or Scotch Bonnet peppers? Partner with Kone Food Division for guaranteed off-take contracts, agronomy training, and precision smart soil sensors.
              </p>

              <div className="outgrower-perks-list">
                <div className="perk-row">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="#34d399" strokeWidth="2.5" fill="none" style={{ marginRight: '8px' }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Guaranteed purchasing contract before harvest
                </div>
                <div className="perk-row">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="#34d399" strokeWidth="2.5" fill="none" style={{ marginRight: '8px' }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Free soil fertility and moisture audit telemetry
                </div>
                <div className="perk-row">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="#34d399" strokeWidth="2.5" fill="none" style={{ marginRight: '8px' }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Access to certified non-GMO planting suckers & organic inputs
                </div>
              </div>
            </div>

            <div className="outgrower-form-wrapper">
              {outgrowerSubmitted ? (
                <div className="submit-success-banner">
                  <div style={{ margin: '0 auto 1rem', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="#34d399" strokeWidth="2" fill="none">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <strong style={{ display: 'block', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Farm Application Received!</strong>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>An agronomist from our Field Operations team will reach out to inspect soil logs and schedule an onboarding visit.</p>
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
                      placeholder="e.g. Asuogyaman District, Eastern Region"
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
                        <option value="plantain">Golden Plantain</option>
                        <option value="yam">White Yam</option>
                        <option value="potato">Highland Potato</option>
                        <option value="pepper">Scotch Bonnet</option>
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
