import React, { useState, useEffect } from 'react';
import './Agritech.css';
import { db } from '../firebase/config';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export default function Agritech() {
  // Telemetry state
  const [telemetry, setTelemetry] = useState({
    moisture: 48,
    temperature: 29.5,
    sunlight: 82,
    valveActive: false
  });

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // Subscribe to live telemetry configurations in Firestore
  useEffect(() => {
    if (!db || !db.app) {
      console.warn("Firebase/Firestore is not initialized. Starting mock telemetry standby.");
      return;
    }
    const telemDocRef = doc(db, 'farm_telemetry', 'live');
    const unsubscribe = onSnapshot(telemDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setTelemetry(docSnap.data());
      } else {
        const defaults = {
          moisture: 48,
          temperature: 29.5,
          sunlight: 82,
          valveActive: false,
          updatedAt: new Date().toISOString()
        };
        setDoc(telemDocRef, defaults).catch(err => console.error("Firestore telem init error:", err));
        setTelemetry(defaults);
      }
    }, (err) => {
      console.warn("Firestore listener failed: switching to offline telemetry mock", err);
    });

    return () => unsubscribe();
  }, []);

  // Update telemetry fields in Firestore & local state
  const updateTelemetry = async (field, value) => {
    const nextTelemetry = {
      ...telemetry,
      [field]: value,
      updatedAt: new Date().toISOString()
    };
    
    // Optimistically update local state
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

  const moistureVal = telemetry.moisture ?? 48;
  const tempVal = telemetry.temperature ?? 29.5;
  const sunlightVal = telemetry.sunlight ?? 82;
  const valveActive = telemetry.valveActive ?? false;

  // Chart shifts based on telemetry overrides
  const moistureShift = (moistureVal - 48) * 0.4;
  const tempShift = (tempVal - 29.5) * 1.2;

  const moisturePathD = `M 0 ${80 - moistureShift} Q 50 ${95 - moistureShift}, 100 ${65 - moistureShift} T 200 ${45 - moistureShift} T 300 ${90 - moistureShift} T 400 ${55 - moistureShift}`;
  const tempPathD = `M 0 ${50 - tempShift} Q 60 ${30 - tempShift}, 120 ${60 - tempShift} T 240 ${40 - tempShift} T 360 ${70 - tempShift} T 400 ${55 - tempShift}`;

  const isDbOnline = db && db.app;

  return (
    <div className="agritech-div-page animate-fade-in">
      <div className="agritech-container">
        
        {/* Header */}
        <div className="agritech-header-section">
          <div className="farms-title-badge" style={{ background: 'rgba(59, 130, 246, 0.12)', borderColor: 'rgba(59, 130, 246, 0.25)', color: '#60a5fa' }}>📡 smartFarm Agritech</div>
          <h1 className="farms-headline">Precision Agriculture & Field Telemetry</h1>
          <p className="farms-subheadline" style={{ margin: '0 auto' }}>
            We deploy software engineering, solar-driven field units, and wireless telemetry sensors directly into Volta plots. Real-time atmospheric statistics drive automated micro-irrigation valves to conserve water.
          </p>
        </div>

        {/* Telemetry Dashboard Grid */}
        <div className="farms-grid-2">
          
          {/* Dashboard and Chart */}
          <div className="farms-card">
            <div className="smartfarm-header">
              <h3 className="smartfarm-title">🖥️ live telemetry</h3>
              <span className={`live-badge-glow ${valveActive ? '' : 'mild'}`} style={{ background: isDbOnline ? '#059669' : '#475569' }}>
                {isDbOnline ? 'LIVE SYNC' : 'STANDBY MODE'}
              </span>
            </div>

            {/* Live Metrics */}
            <div className="telemetry-grid">
              <div className="telemetry-item">
                <div className="telemetry-val">{moistureVal}%</div>
                <div className="telemetry-label">Soil Moisture 💧</div>
              </div>
              <div className="telemetry-item">
                <div className="telemetry-val">{tempVal}°C</div>
                <div className="telemetry-label">Temperature 🌡️</div>
              </div>
              <div className="telemetry-item">
                <div className="telemetry-val">{sunlightVal}%</div>
                <div className="telemetry-label">Sunlight ☀️</div>
              </div>
            </div>

            {/* SVG Live Bezier Trend Chart */}
            <div className="telemetry-chart-container">
              <div className="chart-header">
                <span className="chart-title">24H Sensor Trend (Dynamic)</span>
                <span className="chart-legend">
                  <span className="legend-dot moisture"></span> Moisture
                  <span className="legend-dot temp"></span> Temp
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

          {/* Cultivation pipeline */}
          <div className="farms-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="smartfarm-header">
                <h3 className="smartfarm-title">⚙️ Irrigation Pipeline</h3>
              </div>
              <div className="pipeline-title" style={{ marginTop: '0.5rem' }}>Land Cultivation Pipeline</div>
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
                <div className={`pipeline-step ${valveActive ? 'active' : 'pending'}`}>
                  <span className="pipeline-step-num">3</span>
                  <div>
                    <strong style={{ display: 'block', color: 'white' }}>Automated Water Valve {valveActive ? '🟢' : '⚪'}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {valveActive ? 'Drip irrigation valve open - watering field' : 'Valve closed - Standby mode'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.15)', padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left', marginTop: '1.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🤖</span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                Our autonomous rules trigger drip water valves when moisture drops below 40%, shutting them off once hydration reaches 55%.
              </span>
            </div>
          </div>

        </div>

        {/* --- Two-Way Telemetry Override Controller --- */}
        {isAdmin && (
          <div className="control-panel-card">
            <div className="smartfarm-header" style={{ borderBottomColor: 'rgba(59, 130, 246, 0.2)' }}>
              <h3 className="smartfarm-title" style={{ color: '#60a5fa' }}>🛠️ Telemetry Control Console (Sandbox)</h3>
              <span className={`db-status-badge ${isDbOnline ? 'online' : ''}`}>
                Firestore {isDbOnline ? 'Connected' : 'Offline Mode'}
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'left', margin: '0.5rem 0 2rem', lineHeight: 1.5 }}>
              Adjust these sliders to simulate real-time sensor updates in Volta plots. If Firestore is active, your changes will sync two-way instantly and update the trend chart above.
            </p>

            <div className="controls-grid">
              <div className="control-group">
                <label className="dist-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Soil Moisture 💧</span>
                  <strong style={{ color: '#34d399' }}>{moistureVal}%</strong>
                </label>
                <input 
                  type="range" 
                  min="20" 
                  max="90" 
                  value={moistureVal} 
                  className="control-slider"
                  style={{ accentColor: '#34d399' }}
                  onChange={(e) => updateTelemetry('moisture', Number(e.target.value))}
                />
              </div>

              <div className="control-group">
                <label className="dist-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Temperature 🌡️</span>
                  <strong style={{ color: '#fbbf24' }}>{tempVal}°C</strong>
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max="45" 
                  step="0.5"
                  value={tempVal} 
                  className="control-slider"
                  style={{ accentColor: '#f59e0b' }}
                  onChange={(e) => updateTelemetry('temperature', Number(e.target.value))}
                />
              </div>

              <div className="control-group">
                <label className="dist-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Sunlight Intensity ☀️</span>
                  <strong style={{ color: '#60a5fa' }}>{sunlightVal}%</strong>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sunlightVal} 
                  className="control-slider"
                  style={{ accentColor: '#3b82f6' }}
                  onChange={(e) => updateTelemetry('sunlight', Number(e.target.value))}
                />
              </div>

              <div className="control-group">
                <label className="dist-label">Water Irrigation Valve</label>
                <button 
                  className={`valve-toggle-btn ${valveActive ? 'valve-active' : ''}`}
                  onClick={() => updateTelemetry('valveActive', !valveActive)}
                >
                  {valveActive ? '🟢 Valve Open (Watering)' : '🔴 Valve Closed (Standby)'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* smartTools Showcase */}
        <div className="farms-card" style={{ textAlign: 'center' }}>
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

      </div>
    </div>
  );
}
