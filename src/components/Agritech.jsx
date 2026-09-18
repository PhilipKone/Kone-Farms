import React, { useState, useEffect, useMemo } from 'react';
import './Agritech.css';
import { db } from '../firebase/config';
import { doc, onSnapshot, setDoc, collection, addDoc } from 'firebase/firestore';

export default function Agritech() {
  // Live Telemetry State from Firestore
  const [telemetry, setTelemetry] = useState({
    moisture: 46,
    temperature: 29.2,
    sunlight: 820,
    valveActive: false
  });
  const [isDbOnline, setIsDbOnline] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Crop Hydration & Irrigation Simulator State
  const [selectedCrop, setSelectedCrop] = useState('plantain');
  const [simMoisture, setSimMoisture] = useState(42);

  // Field Agronomy Inspection Logger Form State
  const [inspectorName, setInspectorName] = useState('');
  const [plotLocation, setPlotLocation] = useState('Field Plot #01 - Musa Plantain Groves');
  const [soilCondition, setSoilCondition] = useState('Optimal Hydration');
  const [foliarHealth, setFoliarHealth] = useState('Vigorous Leaf Growth');
  const [notes, setNotes] = useState('');
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);
  const [logSubmitted, setLogSubmitted] = useState(false);

  // Crop Agronomic Profiles & Moisture Thresholds
  const cropProfiles = {
    plantain: {
      name: 'Golden Plantain',
      scientific: 'Musa paradisiaca L.',
      optimalMin: 35,
      optimalMax: 55,
      idealSoil: 'Fertile Humus Loam (pH 6.0 - 7.0)',
      irrigationMethod: 'Pulsed Root-Zone Micro-Drip',
      summary: 'High vegetative transpiration demands consistent hydration. Solenoid triggers below 35% VWC to protect fruit finger caliber and prevent pseudo-stem water stress.'
    },
    yam: {
      name: 'Ghanaian White Yam',
      scientific: 'Dioscorea alata',
      optimalMin: 40,
      optimalMax: 60,
      idealSoil: 'Aerated Alluvial Sandy Loam (pH 6.2 - 6.8)',
      irrigationMethod: 'Mound Deep-Penetration Drip',
      summary: 'Requires deep root hydration in well-aerated mounds. Excessive moisture above 60% causes tuber rot, while moisture below 40% arrests subterranean starch bulking.'
    },
    pepper: {
      name: 'Scotch Bonnet Pepper',
      scientific: 'Capsicum chinense',
      optimalMin: 30,
      optimalMax: 45,
      idealSoil: 'Organic Compost Loam (pH 6.5 - 7.2)',
      irrigationMethod: 'Targeted Sub-Surface Emitters',
      summary: 'Controlled mild moisture stress (30% - 40% VWC) maximizes capsaicin heat synthesis (85,000+ SHU). Waterlogging triggers rapid root hypoxia and blossom drop.'
    },
    potato: {
      name: 'Highland Russet Potato',
      scientific: 'Solanum tuberosum',
      optimalMin: 45,
      optimalMax: 65,
      idealSoil: 'Highland Cool Loam (pH 5.5 - 6.5)',
      irrigationMethod: 'Low-Pressure Micro-Sprinklers',
      summary: 'Consistent, stable soil hydration is vital during tuber initiation. Uneven hydration cycles cause growth cracking and knobby tuber defects.'
    }
  };

  const currentCrop = cropProfiles[selectedCrop];

  // Simulator Dynamic Valve Reaction Logic
  const simValveStatus = useMemo(() => {
    if (simMoisture < currentCrop.optimalMin) {
      return {
        state: 'open',
        label: 'Solenoid Valve OPEN',
        headline: 'Automated Micro-Drip Active',
        desc: `Soil moisture (${simMoisture}%) is below the required ${currentCrop.name} threshold (${currentCrop.optimalMin}% VWC). The solar ESP32 controller latches the 12V solenoid valve open to deliver targeted root hydration.`,
        badgeClass: 'open',
        cardClass: 'valve-open'
      };
    } else if (simMoisture <= currentCrop.optimalMax) {
      return {
        state: 'closed',
        label: 'Valve CLOSED (Standby)',
        headline: 'Optimal Root Zone Hydration',
        desc: `Soil moisture (${simMoisture}%) is perfectly balanced within the optimal range (${currentCrop.optimalMin}% – ${currentCrop.optimalMax}% VWC). Solenoid valve remains closed to conserve water and prevent nutrient leaching.`,
        badgeClass: 'closed',
        cardClass: 'valve-closed'
      };
    } else {
      return {
        state: 'saturated',
        label: 'Valve INACTIVE (Lockout)',
        headline: 'Soil Saturated / Rain Event',
        desc: `Soil moisture (${simMoisture}%) exceeds the safe threshold (${currentCrop.optimalMax}% VWC). Automated irrigation is locked out to protect roots from hypoxia, waterlogging, and fungal blight.`,
        badgeClass: 'saturated',
        cardClass: 'valve-saturated'
      };
    }
  }, [simMoisture, currentCrop]);

  // Subscribe to live telemetry configurations in Firestore
  useEffect(() => {
    if (!db || !db.app) {
      setIsDbOnline(false);
      return;
    }
    setIsDbOnline(true);
    const telemDocRef = doc(db, 'farm_telemetry', 'live');
    const unsubscribe = onSnapshot(telemDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setTelemetry(docSnap.data());
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    }, (err) => {
      console.warn("Firestore listener in Agritech:", err);
      setIsDbOnline(false);
    });

    return () => unsubscribe();
  }, []);

  // Update telemetry fields in Firestore & local state
  const updateTelemetry = async (field, value) => {
    const nextTelemetry = {
      ...(telemetry || {}),
      [field]: value,
      updatedAt: new Date().toISOString()
    };

    setTelemetry(nextTelemetry);

    if (db && db.app) {
      try {
        const telemDocRef = doc(db, 'farm_telemetry', 'live');
        await setDoc(telemDocRef, nextTelemetry);
      } catch (err) {
        console.error("Firestore telemetry update error:", err);
      }
    }
  };

  const handleFieldLogSubmit = async (e) => {
    e.preventDefault();
    if (!inspectorName.trim()) return;
    setIsSubmittingLog(true);

    if (db && db.app) {
      try {
        await addDoc(collection(db, 'farm_field_logs'), {
          inspector: inspectorName.trim(),
          plot: plotLocation,
          crop: currentCrop.name,
          soilCondition: soilCondition,
          foliarHealth: foliarHealth,
          notes: notes.trim(),
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.warn("Firestore field log save error:", err);
      }
    }

    setIsSubmittingLog(false);
    setLogSubmitted(true);
    setTimeout(() => {
      setLogSubmitted(false);
      setNotes('');
      setInspectorName('');
    }, 4500);
  };

  const moistureVal = telemetry?.moisture ?? 46;
  const tempVal = telemetry?.temperature ?? 29.2;
  const sunlightVal = telemetry?.sunlight ?? 820;
  const valveActive = telemetry?.valveActive ?? false;

  const moistureShift = (moistureVal - 46) * 0.4;
  const tempShift = (tempVal - 29.2) * 1.2;

  const moisturePathD = `M 0 ${80 - moistureShift} Q 50 ${95 - moistureShift}, 100 ${65 - moistureShift} T 200 ${45 - moistureShift} T 300 ${90 - moistureShift} T 400 ${55 - moistureShift}`;
  const tempPathD = `M 0 ${50 - tempShift} Q 60 ${30 - tempShift}, 120 ${60 - tempShift} T 240 ${40 - tempShift} T 360 ${70 - tempShift} T 400 ${55 - tempShift}`;

  return (
    <div className="agritech-div-page animate-fade-in">
      <div className="agritech-container">

        {/* Header */}
        <div className="agritech-header-section">
          <div className="farms-title-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge-pulse-dot" />
            Solar-Powered IoT Sensors & Micro-Irrigation
          </div>
          <h1 className="farms-headline">
            Autonomous Field Telemetry & <br className="desktop-break" />
            <span className="emerald-luminance">Precision Soil Science.</span>
          </h1>
          <p className="farms-subheadline" style={{ margin: '0 auto' }}>
            Deploying solar-powered ESP32 wireless sensor mesh nodes across Ghanaian partner farmlands. Continuous volumetric root hydrology triggers automated micro-drip valves, maximizing yield and conserving water.
          </p>
        </div>

        {/* 3-Pillar Physical Architecture */}
        <div className="arch-grid">
          <div className="arch-card">
            <div className="arch-header">
              <div className="arch-icon-wrap">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="#34d399" strokeWidth="2.2" fill="none">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
              </div>
              <div>
                <h3 className="arch-title">Root-Zone Probes</h3>
                <span className="arch-sub">Capacitive Hydrology</span>
              </div>
            </div>
            <p className="arch-desc">
              Multi-depth probes measuring Volumetric Water Content (VWC %) directly in the rhizosphere (10cm to 30cm deep) without corrosive DC electrolysis.
            </p>
            <div className="arch-badge-strip">
              <span className="arch-spec-pill">±2% VWC Precision</span>
              <span className="arch-spec-pill">Gold Immersion PCB</span>
              <span className="arch-spec-pill">Soil Salinity Comp</span>
            </div>
          </div>

          <div className="arch-card">
            <div className="arch-header">
              <div className="arch-icon-wrap">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="#60a5fa" strokeWidth="2.2" fill="none">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
                </svg>
              </div>
              <div>
                <h3 className="arch-title">Solar Mesh Nodes</h3>
                <span className="arch-sub">Ultra-Low Power IoT</span>
              </div>
            </div>
            <p className="arch-desc">
              Field-hardened IP67 nodes powered by monocrystalline solar panels and LiFePO4 batteries, transmitting telemetry via LoRa 868MHz to local gateways.
            </p>
            <div className="arch-badge-strip">
              <span className="arch-spec-pill">15.4 µA Deep Sleep</span>
              <span className="arch-spec-pill">3.2km LoRa Range</span>
              <span className="arch-spec-pill">100% Grid Free</span>
            </div>
          </div>

          <div className="arch-card">
            <div className="arch-header">
              <div className="arch-icon-wrap">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="#fbbf24" strokeWidth="2.2" fill="none">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </div>
              <div>
                <h3 className="arch-title">Automated Valves</h3>
                <span className="arch-sub">Pulse-Latching Solenoid</span>
              </div>
            </div>
            <p className="arch-desc">
              12V zero-loss latching valves opened only during verified water stress windows, directing micro-drip hydration directly to roots with zero evaporative waste.
            </p>
            <div className="arch-badge-strip">
              <span className="arch-spec-pill">45% Water Saved</span>
              <span className="arch-spec-pill">Zero Runoff</span>
              <span className="arch-spec-pill">Auto Cut-Off</span>
            </div>
          </div>
        </div>

        {/* Live Telemetry Dashboard Grid */}
        <div className="farms-grid-2">

          {/* Dashboard and Trend Chart */}
          <div className="farms-card">
            <div className="smartfarm-header">
              <h2 className="smartfarm-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#34d399" strokeWidth="2" fill="none">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                Live Field Telemetry
              </h2>
              <span className={`live-badge-glow ${valveActive ? '' : 'mild'}`} style={{ background: isDbOnline ? '#059669' : '#475569' }}>
                {isDbOnline ? (lastSyncTime ? `SYNCED ${lastSyncTime}` : 'LIVE SYNC') : 'CALIBRATED BASELINE'}
              </span>
            </div>

            {/* Live Metrics */}
            <div className="telemetry-grid">
              <div className="telemetry-item">
                <div className="telemetry-val">{moistureVal}%</div>
                <div className="telemetry-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Soil Moisture (VWC)
                  <svg viewBox="0 0 24 24" width="13" height="13" stroke="#60a5fa" strokeWidth="2" fill="none">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                </div>
              </div>
              <div className="telemetry-item">
                <div className="telemetry-val">{tempVal}°C</div>
                <div className="telemetry-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Root Temp
                  <svg viewBox="0 0 24 24" width="13" height="13" stroke="#f59e0b" strokeWidth="2" fill="none">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                  </svg>
                </div>
              </div>
              <div className="telemetry-item">
                <div className="telemetry-val">{sunlightVal} W/m²</div>
                <div className="telemetry-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Solar Index
                  <svg viewBox="0 0 24 24" width="13" height="13" stroke="#fbbf24" strokeWidth="2" fill="none">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                </div>
              </div>
            </div>

            {/* SVG Live Bezier Trend Chart */}
            <div className="telemetry-chart-container">
              <div className="chart-header">
                <span className="chart-title">24H Sensor Trend (Dynamic)</span>
                <span className="chart-legend">
                  <span className="legend-dot moisture"></span> Soil Moisture (VWC)
                  <span className="legend-dot temp"></span> Root Temp
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
                <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                <path d={`${moisturePathD} L 400 120 L 0 120 Z`} fill="url(#moistureGlow)" />
                <path d={moisturePathD} fill="none" stroke="#10b981" strokeWidth="3" style={{ transition: 'all 0.5s' }} />

                <path d={`${tempPathD} L 400 120 L 0 120 Z`} fill="url(#tempGlow)" />
                <path d={tempPathD} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" style={{ transition: 'all 0.5s' }} />
              </svg>
            </div>
          </div>

          {/* Autonomous Irrigation Pipeline Execution */}
          <div className="farms-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="smartfarm-header">
                <h2 className="smartfarm-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#34d399" strokeWidth="2" fill="none">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  Automated Irrigation Logic
                </h2>
              </div>
              <div className="pipeline-title" style={{ marginTop: '0.5rem' }}>Field Pipeline Workflow</div>
              <div className="pipeline-steps">
                <div className="pipeline-step active">
                  <span className="pipeline-step-num">1</span>
                  <div>
                    <strong style={{ display: 'block', color: 'white' }}>Capacitive Volumetric Sensing</strong>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Measures dielectric permittivity in root rhizosphere</span>
                  </div>
                </div>
                <div className="pipeline-step active">
                  <span className="pipeline-step-num">2</span>
                  <div>
                    <strong style={{ display: 'block', color: 'white' }}>Agronomic Threshold Evaluation</strong>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Crop-specific moisture curves (Plantain 35%, Yam 40%)</span>
                  </div>
                </div>
                <div className={`pipeline-step ${valveActive ? 'active' : 'pending'}`}>
                  <span className="pipeline-step-num">3</span>
                  <div>
                    <strong style={{ display: 'block', color: 'white' }}>
                      Solenoid Valve ({valveActive ? 'Active' : 'Standby'})
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {valveActive ? 'Micro-drip line pressurized – hydrating root zone' : 'Valve closed – optimal moisture reached'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.15)', padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left', marginTop: '1.5rem' }}>
              <svg viewBox="0 0 24 24" width="22" height="22" stroke="#60a5fa" strokeWidth="2" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                <strong>Water-Saving Principle:</strong> Drip valves activate only when root moisture drops below minimum crop tolerance, shutting off automatically when target hydration is restored.
              </span>
            </div>
          </div>

        </div>

        {/* ── Interactive Crop Irrigation Simulator ── */}
        <div className="crop-sim-card">
          <div className="smartfarm-header" style={{ borderBottomColor: 'rgba(59, 130, 246, 0.2)' }}>
            <h3 className="smartfarm-title" style={{ color: '#60a5fa', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="#60a5fa" strokeWidth="2" fill="none">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
              Crop-Specific Irrigation Threshold Simulator
            </h3>
            <span className="db-status-badge online">
              Interactive Logic
            </span>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.75rem 0 1.25rem', lineHeight: 1.6 }}>
            Select a Ghanaian farm crop below, then drag the soil moisture slider to test how our automated ESP32 solenoid valve acts in real-time.
          </p>

          {/* Crop Selector Tabs */}
          <div className="crop-tabs-row">
            {Object.keys(cropProfiles).map((cropKey) => {
              const crop = cropProfiles[cropKey];
              return (
                <button
                  key={cropKey}
                  className={`crop-tab-btn ${selectedCrop === cropKey ? 'active' : ''}`}
                  onClick={() => setSelectedCrop(cropKey)}
                >
                  <span>{crop.name}</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({crop.optimalMin}%–{crop.optimalMax}%)</span>
                </button>
              );
            })}
          </div>

          <div className="crop-sim-layout">
            {/* Interactive Moisture Slider Box */}
            <div className="sim-slider-box">
              <div className="sim-slider-label">
                <span>Simulated Soil Moisture (VWC)</span>
                <strong style={{ color: simMoisture < currentCrop.optimalMin ? '#60a5fa' : (simMoisture <= currentCrop.optimalMax ? '#34d399' : '#38bdf8') }}>
                  {simMoisture}%
                </strong>
              </div>

              <input
                type="range"
                min="10"
                max="85"
                value={simMoisture}
                onChange={(e) => setSimMoisture(Number(e.target.value))}
                className="control-slider"
                style={{ accentColor: simMoisture < currentCrop.optimalMin ? '#3b82f6' : (simMoisture <= currentCrop.optimalMax ? '#10b981' : '#38bdf8') }}
              />

              <div className="sim-range-bar">
                <span>10% (Severe Drought)</span>
                <span style={{ color: '#34d399', fontWeight: 800 }}>Target: {currentCrop.optimalMin}% – {currentCrop.optimalMax}%</span>
                <span>85% (Waterlogged)</span>
              </div>

              <div className="sim-optimal-range-banner">
                <strong>Agronomic Guideline for {currentCrop.name}:</strong><br />
                {currentCrop.summary}
              </div>
            </div>

            {/* Dynamic Valve Reaction Status Card */}
            <div className={`sim-valve-card ${simValveStatus.cardClass}`}>
              <div className="valve-status-top">
                <span className="valve-status-title">Automated Action</span>
                <span className={`valve-status-badge ${simValveStatus.badgeClass}`}>
                  {simValveStatus.label}
                </span>
              </div>

              <div>
                <h4 className="valve-status-headline">{simValveStatus.headline}</h4>
                <p className="valve-status-desc">{simValveStatus.desc}</p>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem' }}>
                Soil Requirement: <span style={{ color: 'white' }}>{currentCrop.idealSoil}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Field Agronomy Inspection Logger ── */}
        <div className="field-logger-card">
          <div className="smartfarm-header" style={{ borderBottomColor: 'rgba(16, 185, 129, 0.2)' }}>
            <h3 className="smartfarm-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="#34d399" strokeWidth="2" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Agronomy Field Inspection Logger
            </h3>
            <span className="db-status-badge online">
              Cloud Audit Log
            </span>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.75rem 0 1rem', lineHeight: 1.6 }}>
            Kone Farms agronomists and partner field managers record physical crop and soil health audits directly into our centralized verification log.
          </p>

          {logSubmitted ? (
            <div className="submit-success-banner" style={{ marginTop: '1.5rem' }}>
              <div style={{ margin: '0 auto 1rem', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="28" height="28" stroke="#34d399" strokeWidth="2" fill="none">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <strong style={{ display: 'block', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Inspection Record Saved to Field Audit!</strong>
              <p style={{ fontSize: '0.85rem', margin: 0 }}>Your physical agronomy observations have been committed with timestamp and plot coordinates.</p>
            </div>
          ) : (
            <form onSubmit={handleFieldLogSubmit}>
              <div className="logger-form-grid">
                <div className="dist-form-group">
                  <label className="dist-label">Agronomist / Inspector Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kwame Mensah (Field Agronomist)"
                    value={inspectorName}
                    onChange={(e) => setInspectorName(e.target.value)}
                    className="dist-input"
                  />
                </div>

                <div className="dist-form-group">
                  <label className="dist-label">Plot Location</label>
                  <select
                    value={plotLocation}
                    onChange={(e) => setPlotLocation(e.target.value)}
                    className="dist-input select-farms-option"
                  >
                    <option value="Field Plot #01 - Musa Plantain Groves">Field Plot #01 - Musa Plantain Groves</option>
                    <option value="Field Plot #02 - White Yam Mounds (Central Belt)">Field Plot #02 - White Yam Mounds (Central Belt)</option>
                    <option value="Field Plot #03 - Scotch Bonnet Cluster (Volta)">Field Plot #03 - Scotch Bonnet Cluster (Volta)</option>
                    <option value="Field Plot #04 - Highland Russet Potato Beds">Field Plot #04 - Highland Russet Potato Beds</option>
                  </select>
                </div>

                <div className="dist-form-group">
                  <label className="dist-label">Physical Soil Condition</label>
                  <select
                    value={soilCondition}
                    onChange={(e) => setSoilCondition(e.target.value)}
                    className="dist-input select-farms-option"
                  >
                    <option value="Optimal Hydration">Optimal Hydration (Moist, crumbly structure)</option>
                    <option value="Dry / Surface Crusting">Dry / Surface Crusting (Irrigation required)</option>
                    <option value="High Moisture / Rain Saturated">High Moisture / Rain Saturated (Good drainage)</option>
                    <option value="Compacted Sub-layer">Compacted Sub-layer (Aeration recommended)</option>
                  </select>
                </div>

                <div className="dist-form-group">
                  <label className="dist-label">Canopy & Foliar Health</label>
                  <select
                    value={foliarHealth}
                    onChange={(e) => setFoliarHealth(e.target.value)}
                    className="dist-input select-farms-option"
                  >
                    <option value="Vigorous Leaf Growth">Vigorous Leaf Growth (Zero chlorosis)</option>
                    <option value="Mild Heat Stress">Mild Heat Stress (Midday leaf curl)</option>
                    <option value="Nutrient Deficiency Suspected">Nutrient Deficiency Suspected (Light yellowing)</option>
                    <option value="Pest / Foliar Spotting">Pest / Foliar Spotting (Biological control active)</option>
                  </select>
                </div>
              </div>

              <div className="dist-form-group" style={{ marginTop: '1rem' }}>
                <label className="dist-label">Observations & Action Recommendations</label>
                <textarea
                  rows="3"
                  placeholder="Record root depth observations, drip line emitter flow, or organic compost application notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="dist-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingLog}
                className="farms-submit-btn"
                style={{ marginTop: '1rem', width: 'auto', padding: '0.85rem 2rem' }}
              >
                {isSubmittingLog ? 'Saving to Cloud...' : 'Commit Field Inspection Log ➔'}
              </button>
            </form>
          )}
        </div>

        {/* Engineering Background Section */}
        <div className="farms-card" style={{ textAlign: 'left', background: 'rgba(59, 130, 246, 0.03)', border: '1px solid rgba(59, 130, 246, 0.1)', padding: '2rem', marginBottom: '3rem' }}>
          <h2 className="smartfarm-title" style={{ color: '#60a5fa', margin: '0 0 1rem 0', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="#60a5fa" strokeWidth="2" fill="none">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            The Engineering Behind smartFarm
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
            Our smartFarm agricultural monitoring system is a product of multidisciplinary collaboration across Kone Technologies.
            The solar telemetry hardware nodes and micro-controllers are engineered and field-tested by researchers at the
            <a href="https://lab.koneacademy.io" target="_blank" rel="noopener noreferrer" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: 600, margin: '0 4px' }}>Kone Lab</a>
            division, while the automated database sync channels and telemetry dashboard logic are maintained in collaboration with the
            <a href="https://code.koneacademy.io" target="_blank" rel="noopener noreferrer" style={{ color: '#22c55e', textDecoration: 'none', fontWeight: 600, margin: '0 4px' }}>Kone Code</a>
            software engineering branch.
          </p>
        </div>

        {/* smartTools Showcase */}
        <div className="farms-card" style={{ textAlign: 'center' }}>
          <h2 className="smartfarm-title" style={{ justifyContent: 'center', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="#34d399" strokeWidth="2" fill="none">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
            smartTools Technology Suite
          </h2>
          <div className="tools-grid">
            <div className="tool-card">
              <div className="tool-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" stroke="#34d399" strokeWidth="2" fill="none">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
              </div>
              <h4 className="tool-title">IoT Water Valve</h4>
              <p className="tool-desc">Micro-controlled drip irrigation valves that turn on/off based on real-time root zone soil hydration thresholds.</p>
            </div>
            <div className="tool-card">
              <div className="tool-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" stroke="#60a5fa" strokeWidth="2" fill="none">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
                </svg>
              </div>
              <h4 className="tool-title">Telemetry Hub</h4>
              <p className="tool-desc">Wireless node sending temperature, atmospheric solar irradiance, and moisture readings directly to the cloud.</p>
            </div>
            <div className="tool-card">
              <div className="tool-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" stroke="#fbbf24" strokeWidth="2" fill="none">
                  <rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect>
                  <line x1="23" y1="13" x2="23" y2="11"></line>
                </svg>
              </div>
              <h4 className="tool-title">Solar Power Grid</h4>
              <p className="tool-desc">100% solar-driven field units with battery backup, making our field monitoring completely grid-independent.</p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* KONE MARKET AGRITECH HARDWARE PROCUREMENT BANNER */}
        {/* ========================================================================= */}
        <div className="market-bridge-card" style={{ marginTop: '3.5rem' }}>
          <div className="market-bridge-inner">
            <div className="market-badge-pill" style={{ borderColor: 'rgba(6, 182, 212, 0.4)', color: '#22d3ee' }}>
              ⚡ smartFarm Field Hardware
            </div>
            <h3 className="market-bridge-title">
              Ready to Deploy Telemetry Nodes & Sensors on Your Farm?
            </h3>
            <p className="market-bridge-desc">
              Procure pre-calibrated LoRaWAN telemetry base stations, stainless steel soil moisture probes, and automated solar solenoid valve kits in The Kone Market.
            </p>
            <div className="market-bridge-actions">
              <a href="#market" className="farms-submit-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', color: '#032733' }}>
                Procure Hardware in Market ➔
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

