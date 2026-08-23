import React, { useState, useEffect } from 'react';
import './Agritech.css';
import { db } from '../firebase/config';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

import VwcCalculator from './VwcCalculator';

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
      console.warn("Firebase/Firestore is not initialized.");
      return;
    }
    const telemDocRef = doc(db, 'farm_telemetry', 'live');
    const unsubscribe = onSnapshot(telemDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setTelemetry(docSnap.data());
      } else {
        setTelemetry(null);
      }
    }, (err) => {
      console.warn("Firestore listener in Agritech:", err);
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

  const hasData = !!telemetry;
  const moistureVal = telemetry?.moisture;
  const tempVal = telemetry?.temperature;
  const sunlightVal = telemetry?.sunlight;
  const valveActive = telemetry?.valveActive ?? false;

  const moistureShift = moistureVal !== undefined ? (moistureVal - 48) * 0.4 : 0;
  const tempShift = tempVal !== undefined ? (tempVal - 29.5) * 1.2 : 0;

  const moisturePathD = `M 0 ${80 - moistureShift} Q 50 ${95 - moistureShift}, 100 ${65 - moistureShift} T 200 ${45 - moistureShift} T 300 ${90 - moistureShift} T 400 ${55 - moistureShift}`;
  const tempPathD = `M 0 ${50 - tempShift} Q 60 ${30 - tempShift}, 120 ${60 - tempShift} T 240 ${40 - tempShift} T 360 ${70 - tempShift} T 400 ${55 - tempShift}`;

  const isDbOnline = db && db.app;

  return (
    <div className="agritech-div-page animate-fade-in">
      <div className="agritech-container">

        {/* Header */}
        <div className="agritech-header-section">
          <div className="farms-title-badge" style={{ background: 'rgba(59, 130, 246, 0.12)', borderColor: 'rgba(59, 130, 246, 0.25)', color: '#60a5fa', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
              <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
            </svg>
            smartFarm Agritech
          </div>
          <h1 className="farms-headline">Precision Agriculture & Field Telemetry</h1>
          <p className="farms-subheadline" style={{ margin: '0 auto 1.5rem' }}>
            We deploy software engineering, solar-driven field units, and wireless telemetry sensors directly into field plots. Real-time atmospheric statistics drive automated micro-irrigation valves to conserve water.
          </p>

          <div className="agritech-pwa-launch-banner">
            <div className="pwa-banner-text">
              <h3>Agritech App</h3>
              <p>Live soil temp, VWC %, humidity, phone sensor reads, automated recommendations & Kone AI integration.</p>
            </div>
            <a href="#agritech/webapp" className="pwa-launch-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginRight: '6px' }}>
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              Launch App →
            </a>
          </div>
        </div>

        {/* Telemetry Dashboard Grid */}
        <div className="farms-grid-2">

          {/* Dashboard and Chart */}
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
                {isDbOnline ? 'LIVE SYNC' : 'STANDBY MODE'}
              </span>
            </div>

            {/* Live Metrics */}
            <div className="telemetry-grid">
              <div className="telemetry-item">
                <div className="telemetry-val">{hasData && moistureVal !== undefined ? `${moistureVal}%` : '-- %'}</div>
                <div className="telemetry-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Soil Moisture {hasData ? '' : '(Standby)'}
                  <svg viewBox="0 0 24 24" width="13" height="13" stroke="#60a5fa" strokeWidth="2" fill="none">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                </div>
              </div>
              <div className="telemetry-item">
                <div className="telemetry-val">{hasData && tempVal !== undefined ? `${tempVal}°C` : '-- °C'}</div>
                <div className="telemetry-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Temperature {hasData ? '' : '(Standby)'}
                  <svg viewBox="0 0 24 24" width="13" height="13" stroke="#f59e0b" strokeWidth="2" fill="none">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                  </svg>
                </div>
              </div>
              <div className="telemetry-item">
                <div className="telemetry-val">{hasData && sunlightVal !== undefined ? `${sunlightVal}%` : '-- %'}</div>
                <div className="telemetry-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Sunlight {hasData ? '' : '(Standby)'}
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
                <h2 className="smartfarm-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#34d399" strokeWidth="2" fill="none">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  Irrigation Pipeline
                </h2>
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
                    <strong style={{ display: 'block', color: 'white' }}>
                      Automated Water Valve ({valveActive ? 'Active' : 'Standby'})
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {valveActive ? 'Drip irrigation valve open - watering field' : 'Valve closed - Standby mode'}
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
                Our autonomous rules trigger drip water valves when moisture drops below 40%, shutting them off once hydration reaches 55%.
              </span>
            </div>
          </div>

        </div>

        {/* --- Two-Way Telemetry Override Controller --- */}
        {isAdmin && (
          <div className="control-panel-card">
            <div className="smartfarm-header" style={{ borderBottomColor: 'rgba(59, 130, 246, 0.2)' }}>
              <h3 className="smartfarm-title" style={{ color: '#60a5fa', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="#60a5fa" strokeWidth="2" fill="none">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
                Interactive Field Sensor Simulator
              </h3>
              <span className={`db-status-badge ${isDbOnline ? 'online' : ''}`}>
                {isDbOnline ? 'Live Sync Connected' : 'Local Mode'}
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'left', margin: '0.5rem 0 2rem', lineHeight: 1.5 }}>
              Adjust the sliders below to test how our smart automated irrigation and field sensors react to changing soil moisture and temperature in real time.
            </p>

            <div className="controls-grid">
              <div className="control-group">
                <label className="dist-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Soil Moisture</span>
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
                  <span>Temperature</span>
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
                  <span>Sunlight Intensity</span>
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
                  {valveActive ? 'Valve Open (Watering)' : 'Valve Closed (Standby)'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Interactive Precision Telemetry & VWC Calculator --- */}
        <VwcCalculator />

        {/* Engineering Background Section */}
        <div className="farms-card" style={{ textAlign: 'left', background: 'rgba(59, 130, 246, 0.03)', border: '1px solid rgba(59, 130, 246, 0.1)', padding: '2rem' }}>
          <h2 className="smartfarm-title" style={{ color: '#60a5fa', margin: '0 0 1rem 0', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="#60a5fa" strokeWidth="2" fill="none">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            The Engineering Behind smartFarm
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
            Our smartFarm agricultural monitoring system is a product of multidisciplinary collaboration at Kone Academy.
            The solar telemetry hardware nodes and micro-controllers are designed and prototyped by researchers at the
            <a href="https://lab.koneacademy.io" target="_blank" rel="noopener noreferrer" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: 600, margin: '0 4px' }}>Kone Lab</a>
            engineering division, while the automated database sync channels and telemetry dashboard logic are programmed in collaboration with the
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
              <p className="tool-desc">Micro-controlled drip irrigation valves that turn on/off based on real-time soil hydration data.</p>
            </div>
            <div className="tool-card">
              <div className="tool-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" stroke="#60a5fa" strokeWidth="2" fill="none">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
                </svg>
              </div>
              <h4 className="tool-title">Telemetry Hub</h4>
              <p className="tool-desc">Wireless node sending temperature, atmospheric pressure, and moisture readings directly to the cloud.</p>
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

      </div>
    </div>
  );
}
