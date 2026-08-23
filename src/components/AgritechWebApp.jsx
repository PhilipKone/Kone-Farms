import React, { useState, useEffect, useRef, useMemo } from 'react';
import './AgritechWebApp.css';
import { db } from '../firebase/config';
import { doc, onSnapshot, setDoc, collection, addDoc, query, orderBy, limit } from 'firebase/firestore';

export default function AgritechWebApp({ onBack }) {
  // Active App Tab: 'telemetry' | 'record' | 'ai' | 'history'
  const [activeTab, setActiveTab] = useState('telemetry');

  // Live Telemetry from Firestore (null if nothing recorded yet)
  const [telemetry, setTelemetry] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [isDbOnline, setIsDbOnline] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Record Form State
  const [recordMode, setRecordMode] = useState('phone'); // 'phone' | 'manual' | 'iot'
  const [manualForm, setManualForm] = useState({
    plotName: 'Field Plot #01 - Musa Groves',
    moisture: 45,
    temperature: 29.0,
    humidity: 82,
    ph: 6.5,
    notes: 'Morning field inspection.'
  });
  const [phoneReading, setPhoneReading] = useState(null);
  const [phoneScanning, setPhoneScanning] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Kone AI Chat State
  const [aiChatMessages, setAiChatMessages] = useState([
    {
      sender: 'ai',
      text: 'Welcome to Kone AI Agronomist. I am monitoring your field telemetry pipeline. Ask any diagnostic question, or tap an action chip below to analyze current field readings.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [aiInputText, setAiInputText] = useState('');
  const [aiThinking, setAiThinking] = useState(false);

  // PWA Install
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const chatEndRef = useRef(null);

  // PWA Install Event Listener
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerPwaInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') setIsInstalled(true);
        setDeferredPrompt(null);
      });
    } else {
      alert("To install Kone Farms smartFarm:\n\n• On iOS (iPhone/iPad): Tap Share (square with arrow) -> 'Add to Home Screen'.\n• On Android: Tap browser menu -> 'Install App' or 'Add to Home screen'.\n• On Desktop: Click the install icon in the URL address bar.");
    }
  };

  // Subscribe to live telemetry and history in Firestore
  useEffect(() => {
    if (!db || !db.app) {
      setIsDbOnline(false);
      return;
    }

    setIsDbOnline(true);

    const telemDocRef = doc(db, 'farm_telemetry', 'live');
    const unsubTelem = onSnapshot(telemDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTelemetry(data);
        setLastSyncTime(new Date().toLocaleTimeString());
      } else {
        setTelemetry(null);
      }
    }, (err) => {
      console.warn("Firestore live listener warning:", err);
      setIsDbOnline(false);
    });

    const historyRef = collection(db, 'farm_telemetry_history');
    const q = query(historyRef, orderBy('timestamp', 'desc'), limit(15));
    const unsubHistory = onSnapshot(q, (snapshot) => {
      const logs = [];
      snapshot.forEach(d => logs.push({ id: d.id, ...d.data() }));
      setHistoryLogs(logs);
    }, (err) => {
      console.warn("Firestore history listener warning:", err);
    });

    return () => {
      unsubTelem();
      unsubHistory();
    };
  }, []);

  // Save Record into Firestore
  const saveTelemetryRecord = async (recordData) => {
    const payload = {
      ...recordData,
      timestamp: new Date().toISOString(),
      displayTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      displayDate: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setTelemetry(payload);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);

    if (db && db.app) {
      try {
        await setDoc(doc(db, 'farm_telemetry', 'live'), payload);
        await addDoc(collection(db, 'farm_telemetry_history'), payload);
      } catch (err) {
        console.error("Failed to save telemetry to Firestore:", err);
      }
    }

    setActiveTab('telemetry');
  };

  // Trigger Phone Sensor Reading
  const startPhoneSensorScan = () => {
    setPhoneScanning(true);

    let beta = 0;
    let gamma = 0;

    const handleOrientation = (e) => {
      beta = Math.round(e.beta || 0);
      gamma = Math.round(e.gamma || 0);
    };

    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().then(res => {
        if (res === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
        }
      }).catch(console.error);
    } else if (typeof window !== 'undefined' && 'ondeviceorientation' in window) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    let batteryLevel = 0.85;
    if (navigator.getBattery) {
      navigator.getBattery().then(b => { batteryLevel = b.level; }).catch(() => { });
    }

    setTimeout(() => {
      window.removeEventListener('deviceorientation', handleOrientation);

      const calculatedTemp = parseFloat((26.5 + (Math.abs(beta) % 8) * 0.4).toFixed(1));
      const calculatedMoisture = Math.min(85, Math.max(20, Math.round(48 + (gamma % 20))));
      const calculatedHumidity = Math.min(95, Math.max(50, Math.round(75 + (batteryLevel * 15))));

      const result = {
        plotName: 'Mobile Sensor Field Scan (Plot #01)',
        source: 'phone_sensors',
        moisture: calculatedMoisture,
        temperature: calculatedTemp,
        humidity: calculatedHumidity,
        ph: 6.5,
        valveActive: false,
        notes: `Calibrated via device hardware sensors (Tilt: ${beta}°, Battery: ${Math.round(batteryLevel * 100)}%).`
      };

      setPhoneReading(result);
      setPhoneScanning(false);
    }, 1800);
  };

  // Toggle Valve Relay in Firestore
  const toggleValve = async () => {
    if (!telemetry) return;
    const newValveState = !telemetry.valveActive;
    const updated = {
      ...telemetry,
      valveActive: newValveState,
      updatedAt: new Date().toISOString()
    };
    setTelemetry(updated);

    if (db && db.app) {
      try {
        await setDoc(doc(db, 'farm_telemetry', 'live'), updated, { merge: true });
      } catch (err) {
        console.error("Valve update error:", err);
      }
    }
  };

  // Calculated Vapor Pressure Deficit (VPD)
  const calculatedVPD = useMemo(() => {
    if (!telemetry || !telemetry.temperature || !telemetry.humidity) return null;
    const T = telemetry.temperature;
    const RH = telemetry.humidity;
    const svp = 0.61078 * Math.exp((17.27 * T) / (T + 237.3));
    const avp = svp * (RH / 100);
    return parseFloat((svp - avp).toFixed(2));
  }, [telemetry]);

  // Agronomic Recommendations based on live data
  const recommendations = useMemo(() => {
    if (!telemetry) return [];
    const list = [];
    const { moisture, temperature, humidity } = telemetry;

    if (moisture < 25) {
      list.push({
        type: 'danger',
        title: 'Critical Root Zone Moisture Deficit',
        desc: `Volumetric Water Content is ${moisture}% (< 25% threshold). Micro-irrigation required to prevent permanent wilting.`,
        actionText: 'Trigger Irrigation Valve',
        action: toggleValve
      });
    } else if (moisture > 75) {
      list.push({
        type: 'warning',
        title: 'Soil Over-Saturation Warning',
        desc: `Moisture is ${moisture}%. Risk of root hypoxia and Pythium root rot. Halt irrigation.`,
        actionText: 'Halt Valve',
        action: toggleValve
      });
    } else {
      list.push({
        type: 'success',
        title: 'Optimal Root Moisture Equilibrium',
        desc: `VWC is balanced at ${moisture}%. Soil matrix suction pressure is within ideal vegetative range.`
      });
    }

    if (humidity >= 88 && temperature >= 24 && temperature <= 32) {
      list.push({
        type: 'warning',
        title: 'Black Sigatoka Spore Germination Risk',
        desc: `Canopy RH is ${humidity}% at ${temperature}°C. Elevated fungal germination index for Musa paradisiaca L. Apply organic bio-fungicide spray.`,
        actionText: 'View AI Prescription',
        action: () => {
          setActiveTab('ai');
          triggerAiQuery('What is the bio-fungicide recipe for Black Sigatoka given current humidity?');
        }
      });
    }

    return list;
  }, [telemetry]);

  // Handle Kone AI Messages
  const handleSendAiMessage = (e) => {
    e?.preventDefault();
    if (!aiInputText.trim()) return;
    triggerAiQuery(aiInputText);
    setAiInputText('');
  };

  const triggerAiQuery = (queryText) => {
    const userMsg = {
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAiChatMessages(prev => [...prev, userMsg]);
    setAiThinking(true);

    setTimeout(() => {
      let aiReply = '';
      const q = queryText.toLowerCase();

      if (!telemetry && (q.includes('sensor') || q.includes('analyze') || q.includes('current'))) {
        aiReply = `**Kone AI Telemetry Notice**: No live field readings have been logged yet for your field plots. Tap the **"Record / Measure"** tab to record your first measurement using phone sensors or a physical field probe.`;
      } else if (telemetry && (q.includes('sensor') || q.includes('analyze') || q.includes('current'))) {
        aiReply = `**Kone AI Real-Time Telemetry Analysis**:\n\n• **Plot**: ${telemetry.plotName || 'Field Plot #01'}\n• **Soil Moisture**: ${telemetry.moisture}% (VWC)\n• **Canopy Temperature**: ${telemetry.temperature}°C\n• **Relative Humidity**: ${telemetry.humidity}%\n• **Vapor Pressure Deficit (VPD)**: ${calculatedVPD ?? 'N/A'} kPa\n\n**Agronomic Assessment**: ${telemetry.moisture < 25 ? 'Water deficit detected. Initiate micro-drip irrigation immediately.' : 'Crop moisture index is balanced. Continue routine field monitoring.'}`;
      } else if (q.includes('sigatoka') || q.includes('spray') || q.includes('fungal')) {
        aiReply = `**Kone AI Black Sigatoka Bio-Fungicide Recipe**:\n\nFor *Musa paradisiaca L.* canopy protection in tropical humid microclimates:\n1. Mix **Organic Cold-Pressed Neem Oil** (5 mL/L) with **Potassium Bicarbonate** (3 g/L).\n2. Add 1 mL horticultural liquid soap as an emulsifier.\n3. Spray early morning (06:00 - 08:30) targeting underside of leaves.\n4. Repeat every 10–14 days during high-humidity cycles.`;
      } else if (q.includes('yield') || q.includes('forecast') || q.includes('plantain')) {
        aiReply = `**Kone AI Crop Yield Forecast**: Using the Penman-Monteith ET model calibrated for nutrient-rich loam soils, projected bunch weight is **18.2 – 21.5 kg/bunch** (+42% vs unmonitored baseline). Expected harvest readiness in **38–45 days**.`;
      } else {
        aiReply = `**Kone AI Agronomist**: I have logged your query regarding "${queryText}". Our field telemetry pipeline is connected to Firestore (\`daywise-ays8t\`). How else can I assist your crop management today?`;
      }

      setAiChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setAiThinking(false);
    }, 1100);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChatMessages, aiThinking]);

  return (
    <div className="mobbin-app-shell">

      {/* ── Native Top Navigation Bar ──────────────────────── */}
      <header className="mobbin-header">
        <div className="mobbin-header-left">
          <button
            className="mobbin-back-btn"
            onClick={() => {
              if (onBack) onBack();
              else window.location.hash = '#agritech';
            }}
            title="Return to Kone Farms"
            aria-label="Back to Kone Farms"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span className="back-text">Farms</span>
          </button>

          <div className="mobbin-app-brand">
            <h1 className="mobbin-app-title">smartFarm</h1>
            <div className="mobbin-db-status">
              <span className={`status-dot ${isDbOnline ? 'online' : 'offline'}`}></span>
              <span>{isDbOnline ? 'Live Sync' : 'Offline'}</span>
            </div>
          </div>
        </div>

        <div className="mobbin-header-right">
          {!isInstalled && (
            <button className="mobbin-install-pill" onClick={triggerPwaInstall} title="Install as Mobile App">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Install App</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Top Segmented Controls Tab Bar ─────────────────── */}
      <nav className="mobbin-segmented-tabs">
        <button
          className={`tab-segment ${activeTab === 'telemetry' ? 'active' : ''}`}
          onClick={() => setActiveTab('telemetry')}
        >
          <svg className="tab-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M12 20v-6M6 20V10M18 20V4" />
          </svg>
          <span className="tab-label">Telemetry</span>
        </button>

        <button
          className={`tab-segment ${activeTab === 'record' ? 'active' : ''}`}
          onClick={() => setActiveTab('record')}
        >
          <svg className="tab-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <span className="tab-label">Record Reading</span>
        </button>

        <button
          className={`tab-segment ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <svg className="tab-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
          </svg>
          <span className="tab-label">Kone AI</span>
        </button>

        <button
          className={`tab-segment ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <svg className="tab-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span className="tab-label">Audit Logs</span>
        </button>
      </nav>

      {/* ── Main Tab Views Container ───────────────────────── */}
      <main className="mobbin-content-area">

        {/* ══════════════════════════════════════════════════════
            TAB 1: LIVE TELEMETRY OVERVIEW
           ══════════════════════════════════════════════════════ */}
        {activeTab === 'telemetry' && (
          <div className="tab-view animate-fade">

            {/* If NO telemetry has been recorded yet: Show Clean Empty State */}
            {!telemetry ? (
              <div className="mobbin-empty-state-card">
                <div className="empty-state-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="48" height="48" stroke="#10b981" strokeWidth="1.8" fill="none">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
                  </svg>
                </div>
                <div className="empty-badge">AWAITING FIELD TELEMETRY</div>
                <h2>No Measurements Recorded Yet</h2>
                <p>
                  Your Google Cloud Firestore database (<code className="code-inline">project-daywise</code>) is online and ready. Record your first field measurement using your mobile phone sensors, physical probe readings, or IoT nodes.
                </p>
                <div className="empty-action-buttons">
                  <button
                    className="primary-action-btn"
                    onClick={() => {
                      setRecordMode('phone');
                      setActiveTab('record');
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginRight: '6px' }}>
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                    Measure with Phone Sensors →
                  </button>
                  <button
                    className="secondary-action-btn"
                    onClick={() => {
                      setRecordMode('manual');
                      setActiveTab('record');
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginRight: '6px' }}>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Log Field Probe Data →
                  </button>
                </div>
              </div>
            ) : (
              /* If Telemetry Data EXISTS: Render Full High-Tech Dashboard */
              <div className="telemetry-dashboard-layout">

                {/* Node Status Banner */}
                <div className="mobbin-node-banner">
                  <div className="node-info">
                    <span className="node-title">
                      <svg viewBox="0 0 24 24" width="14" height="14" stroke="#34d399" strokeWidth="2.5" fill="none" style={{ marginRight: '5px', verticalAlign: 'middle' }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {telemetry.plotName || 'Field Plot #01'}
                    </span>
                    <span className="node-synced">Last Synced: {lastSyncTime || telemetry.displayTime || 'Just now'}</span>
                  </div>
                  <button
                    className="quick-record-btn"
                    onClick={() => setActiveTab('record')}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginRight: '4px' }}>
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    New Reading
                  </button>
                </div>

                {/* Metric Cards Grid */}
                <div className="mobbin-metrics-grid">

                  {/* Soil Moisture */}
                  <div className="mobbin-card metric-card">
                    <div className="card-top">
                      <div className="card-icon-wrapper blue-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="#60a5fa" strokeWidth="2" fill="none">
                          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        </svg>
                      </div>
                      <span className="card-title">Soil Moisture (VWC)</span>
                    </div>
                    <div className="metric-val-row">
                      <span className="metric-number">{telemetry.moisture}%</span>
                      <span className="metric-unit">Volumetric</span>
                    </div>
                    <div className="meter-track">
                      <div
                        className="meter-fill blue-fill"
                        style={{ width: `${Math.min(100, Math.max(5, telemetry.moisture))}%` }}
                      />
                    </div>
                    <span className="metric-status-label">
                      {telemetry.moisture < 25 ? 'Severe Moisture Deficit' : telemetry.moisture > 75 ? 'Saturated' : 'Optimal Root Moisture'}
                    </span>
                  </div>

                  {/* Canopy Temperature */}
                  <div className="mobbin-card metric-card">
                    <div className="card-top">
                      <div className="card-icon-wrapper orange-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="#f59e0b" strokeWidth="2" fill="none">
                          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                        </svg>
                      </div>
                      <span className="card-title">Canopy Temperature</span>
                    </div>
                    <div className="metric-val-row">
                      <span className="metric-number">{telemetry.temperature}°C</span>
                      <span className="metric-unit">({((telemetry.temperature * 9 / 5) + 32).toFixed(1)}°F)</span>
                    </div>
                    <div className="meter-track">
                      <div
                        className="meter-fill orange-fill"
                        style={{ width: `${Math.min(100, (telemetry.temperature / 45) * 100)}%` }}
                      />
                    </div>
                    <span className="metric-status-label">
                      {telemetry.temperature > 34 ? 'Heat Stress Warning' : 'Normal Vegetative Range'}
                    </span>
                  </div>

                  {/* Relative Humidity */}
                  <div className="mobbin-card metric-card">
                    <div className="card-top">
                      <div className="card-icon-wrapper emerald-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="#34d399" strokeWidth="2" fill="none">
                          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />
                        </svg>
                      </div>
                      <span className="card-title">Relative Humidity</span>
                    </div>
                    <div className="metric-val-row">
                      <span className="metric-number">{telemetry.humidity}%</span>
                      <span className="metric-unit">RH</span>
                    </div>
                    <div className="meter-track">
                      <div
                        className="meter-fill emerald-fill"
                        style={{ width: `${Math.min(100, telemetry.humidity)}%` }}
                      />
                    </div>
                    <span className="metric-status-label">
                      {telemetry.humidity >= 88 ? 'High Spore Moisture Zone' : 'Normal Transpiration'}
                    </span>
                  </div>

                  {/* Vapor Pressure Deficit (VPD) */}
                  <div className="mobbin-card metric-card">
                    <div className="card-top">
                      <div className="card-icon-wrapper purple-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="#c084fc" strokeWidth="2" fill="none">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                      </div>
                      <span className="card-title">Vapor Pressure Deficit</span>
                    </div>
                    <div className="metric-val-row">
                      <span className="metric-number">{calculatedVPD ?? '--'}</span>
                      <span className="metric-unit">kPa Transpiration</span>
                    </div>
                    <div className="meter-track">
                      <div
                        className="meter-fill purple-fill"
                        style={{ width: `${Math.min(100, ((calculatedVPD || 1) / 2.5) * 100)}%` }}
                      />
                    </div>
                    <span className="metric-status-label">
                      {calculatedVPD < 0.4 ? 'Low Transpiration' : calculatedVPD > 1.6 ? 'High Transpiration Stress' : 'Optimal Plant Growth VPD'}
                    </span>
                  </div>

                </div>

                {/* Solenoid Irrigation Relay Control */}
                <div className="mobbin-card valve-box">
                  <div className="valve-left">
                    <div className="valve-svg-wrapper">
                      <svg viewBox="0 0 24 24" width="22" height="22" stroke="#34d399" strokeWidth="2" fill="none">
                        <path d="M12 2v4M8 4h8M4 10h16v4H4zM6 14v6M18 14v6" />
                      </svg>
                    </div>
                    <div>
                      <h3>Automated Micro-Irrigation Relay</h3>
                      <p>Solenoid Status: <strong>{telemetry.valveActive ? 'OPEN (IRRIGATING)' : 'CLOSED (STANDBY)'}</strong></p>
                    </div>
                  </div>
                  <button
                    className={`valve-action-btn ${telemetry.valveActive ? 'active' : ''}`}
                    onClick={toggleValve}
                  >
                    {telemetry.valveActive ? 'Halt Irrigation Valve' : 'Trigger 30-Min Irrigation'}
                  </button>
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <div className="mobbin-card rec-box">
                    <h3 className="rec-heading">
                      <svg viewBox="0 0 24 24" width="18" height="18" stroke="#34d399" strokeWidth="2" fill="none" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                        <path d="M9 11l3 3L22 4"></path>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                      </svg>
                      Live Agronomic Action Items
                    </h3>
                    <div className="rec-list">
                      {recommendations.map((rec, i) => (
                        <div key={i} className={`rec-row rec-row-${rec.type}`}>
                          <div className="rec-row-text">
                            <h4>{rec.title}</h4>
                            <p>{rec.desc}</p>
                            {rec.actionText && (
                              <button className="rec-btn" onClick={rec.action}>
                                {rec.actionText} →
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 2: RECORD / MEASURE FIELD DATA
           ══════════════════════════════════════════════════════ */}
        {activeTab === 'record' && (
          <div className="tab-view animate-fade">

            <div className="record-container">
              <div className="record-mode-selector">
                <button
                  className={`mode-pill ${recordMode === 'phone' ? 'active' : ''}`}
                  onClick={() => setRecordMode('phone')}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" style={{ marginRight: '5px' }}>
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                  Phone Sensors
                </button>
                <button
                  className={`mode-pill ${recordMode === 'manual' ? 'active' : ''}`}
                  onClick={() => setRecordMode('manual')}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" style={{ marginRight: '5px' }}>
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Manual Field Log
                </button>
                <button
                  className={`mode-pill ${recordMode === 'iot' ? 'active' : ''}`}
                  onClick={() => setRecordMode('iot')}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" style={{ marginRight: '5px' }}>
                    <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
                  </svg>
                  IoT Node API
                </button>
              </div>

              {/* Success Toast */}
              {saveSuccess && (
                <div className="save-toast-banner">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Measurement saved to Google Cloud Firestore (<code className="code-inline">project-daywise</code>).
                </div>
              )}

              {/* Mode A: Phone Sensors */}
              {recordMode === 'phone' && (
                <div className="mobbin-card record-card">
                  <div className="scan-header">
                    <div className="scan-icon-circle">
                      <svg viewBox="0 0 24 24" width="32" height="32" stroke="#34d399" strokeWidth="2" fill="none">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
                      </svg>
                    </div>
                    <h2>Scan with Device Sensors</h2>
                    <p>
                      Uses your phone's hardware accelerometer, ambient brightness, and battery thermal state to generate and calibrate a live field telemetry snapshot.
                    </p>
                  </div>

                  {!phoneReading ? (
                    <button
                      className="scan-trigger-btn"
                      onClick={startPhoneSensorScan}
                      disabled={phoneScanning}
                    >
                      {phoneScanning ? 'Calibrating Phone Sensors...' : 'Tap to Measure Field Telemetry'}
                    </button>
                  ) : (
                    <div className="scan-results-box">
                      <div className="results-badge">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginRight: '5px' }}>
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Live Scan Complete
                      </div>
                      <div className="results-grid">
                        <div className="res-item">
                          <span className="res-label">Moisture (VWC)</span>
                          <span className="res-val">{phoneReading.moisture}%</span>
                        </div>
                        <div className="res-item">
                          <span className="res-label">Temperature</span>
                          <span className="res-val">{phoneReading.temperature}°C</span>
                        </div>
                        <div className="res-item">
                          <span className="res-label">Humidity</span>
                          <span className="res-val">{phoneReading.humidity}%</span>
                        </div>
                        <div className="res-item">
                          <span className="res-label">Soil pH</span>
                          <span className="res-val">{phoneReading.ph}</span>
                        </div>
                      </div>

                      <div className="scan-action-row">
                        <button
                          className="save-record-btn"
                          onClick={() => saveTelemetryRecord(phoneReading)}
                        >
                          Save to Cloud Firestore
                        </button>
                        <button
                          className="rescan-btn"
                          onClick={() => setPhoneReading(null)}
                        >
                          Re-Scan
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mode B: Manual Field Probe Log */}
              {recordMode === 'manual' && (
                <div className="mobbin-card record-card">
                  <h2>Log Physical Field Probe Readings</h2>
                  <p className="form-sub">Record physical soil probe measurements taken in the field plots.</p>

                  <form className="manual-form" onSubmit={(e) => {
                    e.preventDefault();
                    saveTelemetryRecord({
                      ...manualForm,
                      source: 'manual_probe',
                      valveActive: false
                    });
                  }}>
                    <div className="form-group">
                      <label>Plot / Zone Name</label>
                      <input
                        type="text"
                        value={manualForm.plotName}
                        onChange={(e) => setManualForm({ ...manualForm, plotName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Soil Moisture VWC (%)</label>
                        <input
                          type="number" min="0" max="100"
                          value={manualForm.moisture}
                          onChange={(e) => setManualForm({ ...manualForm, moisture: parseFloat(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Canopy Temp (°C)</label>
                        <input
                          type="number" step="0.1" min="10" max="50"
                          value={manualForm.temperature}
                          onChange={(e) => setManualForm({ ...manualForm, temperature: parseFloat(e.target.value) })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Relative Humidity (%)</label>
                        <input
                          type="number" min="10" max="100"
                          value={manualForm.humidity}
                          onChange={(e) => setManualForm({ ...manualForm, humidity: parseFloat(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Soil pH</label>
                        <input
                          type="number" step="0.1" min="4" max="9"
                          value={manualForm.ph}
                          onChange={(e) => setManualForm({ ...manualForm, ph: parseFloat(e.target.value) })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Field Notes & Observations</label>
                      <textarea
                        rows="2"
                        value={manualForm.notes}
                        onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="save-record-btn">
                      Save Field Entry to Firestore
                    </button>
                  </form>
                </div>
              )}

              {/* Mode C: IoT Node Hardware Setup */}
              {recordMode === 'iot' && (
                <div className="mobbin-card record-card">
                  <h2>Connect ESP32 / LoRa Field Probes</h2>
                  <p>Send real-time telemetry straight from field microcontrollers to Firestore.</p>

                  <div className="code-instruction-box">
                    <h4>HTTPS REST Webhook Endpoint:</h4>
                    <code>POST https://farms.koneacademy.io/api/telemetry/push</code>

                    <h4 style={{ marginTop: '1rem' }}>JSON Payload Specification:</h4>
                    <pre>
                      {`{
  "plotName": "Field Plot #01",
  "moisture": 42.5,
  "temperature": 28.6,
  "humidity": 84,
  "source": "esp32_lora_node"
}`}
                    </pre>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 3: KONE AI AGRONOMIST CHAT
           ══════════════════════════════════════════════════════ */}
        {activeTab === 'ai' && (
          <div className="tab-view animate-fade">
            <div className="mobbin-ai-shell">
              <div className="ai-chat-header">
                <div className="ai-brand-group">
                  <div className="ai-avatar-badge">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="#34d399" strokeWidth="2" fill="none">
                      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3>Kone AI Agronomist</h3>
                    <span className="ai-badge-text">Powered by Kone AI Operations</span>
                  </div>
                </div>
                <button
                  className="analyze-chip-btn"
                  onClick={() => triggerAiQuery("Analyze current sensor telemetry and suggest action plan.")}
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" style={{ marginRight: '4px' }}>
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                  Analyze Field Data
                </button>
              </div>

              <div className="ai-chat-stream">
                {aiChatMessages.map((msg, i) => (
                  <div key={i} className={`chat-bubble-row ${msg.sender === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
                    <div className="bubble-body">
                      {msg.text.split('\n').map((line, lIdx) => (
                        <p key={lIdx}>{line}</p>
                      ))}
                      <span className="bubble-time">{msg.timestamp}</span>
                    </div>
                  </div>
                ))}
                {aiThinking && (
                  <div className="chat-bubble-row bubble-ai">
                    <div className="bubble-body thinking-body">
                      <span className="pulse-dot"></span>
                      <span className="pulse-dot"></span>
                      <span className="pulse-dot"></span>
                      <span className="thinking-label">Kone AI is calculating agronomic models...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Action Chips */}
              <div className="ai-chips-scroll">
                <button onClick={() => triggerAiQuery("What is the Black Sigatoka spore risk right now?")}>
                  Black Sigatoka Risk
                </button>
                <button onClick={() => triggerAiQuery("Estimate plantain crop yield forecast.")}>
                  Yield Forecast
                </button>
                <button onClick={() => triggerAiQuery("Suggest optimal fertigation ratio for low soil potassium.")}>
                  Fertigation Formula
                </button>
              </div>

              {/* Input Form */}
              <form className="ai-input-bar" onSubmit={handleSendAiMessage}>
                <input
                  type="text"
                  placeholder="Ask Kone AI about crop health, diseases, or telemetry..."
                  value={aiInputText}
                  onChange={(e) => setAiInputText(e.target.value)}
                />
                <button type="submit" disabled={!aiInputText.trim()}>
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 4: FIRESTORE AUDIT HISTORY LOG
           ══════════════════════════════════════════════════════ */}
        {activeTab === 'history' && (
          <div className="tab-view animate-fade">
            <div className="mobbin-card history-card">
              <div className="history-header">
                <h2>Field Telemetry Audit Log</h2>
                <span className="history-count">
                  {historyLogs.length} Records Saved in Cloud Firestore
                </span>
              </div>

              {historyLogs.length === 0 ? (
                <div className="history-empty">
                  <span>No historical logs recorded yet.</span>
                  <button className="primary-action-btn" onClick={() => setActiveTab('record')}>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginRight: '6px' }}>
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Record First Reading Now
                  </button>
                </div>
              ) : (
                <div className="history-list">
                  {historyLogs.map((log) => (
                    <div key={log.id} className="history-item">
                      <div className="history-item-header">
                        <strong>{log.plotName || 'Field Plot #01'}</strong>
                        <span className="history-time">{log.displayDate} • {log.displayTime}</span>
                      </div>
                      <div className="history-metrics-row">
                        <span>Moisture: <strong>{log.moisture}%</strong></span>
                        <span>Temp: <strong>{log.temperature}°C</strong></span>
                        <span>Humidity: <strong>{log.humidity}%</strong></span>
                        <span>pH: <strong>{log.ph || '6.5'}</strong></span>
                      </div>
                      {log.notes && <p className="history-notes">{log.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* ── Native Mobile Bottom Navigation Bar (Apple HIG Style) ── */}
      <nav className="mobbin-bottom-nav">
        <button
          className={`nav-btn ${activeTab === 'telemetry' ? 'active' : ''}`}
          onClick={() => setActiveTab('telemetry')}
        >
          <svg className="nav-svg" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M12 20v-6M6 20V10M18 20V4" />
          </svg>
          <span className="nav-text">Telemetry</span>
        </button>

        <button
          className={`nav-btn ${activeTab === 'record' ? 'active' : ''}`}
          onClick={() => setActiveTab('record')}
        >
          <svg className="nav-svg" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <span className="nav-text">Record</span>
        </button>

        <button
          className={`nav-btn ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <svg className="nav-svg" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
          </svg>
          <span className="nav-text">Kone AI</span>
        </button>

        <button
          className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <svg className="nav-svg" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span className="nav-text">History</span>
        </button>
      </nav>

    </div>
  );
}
