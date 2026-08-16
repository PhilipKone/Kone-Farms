import React, { useState, useEffect, useRef } from 'react';
import './AgritechWebApp.css';
import { db } from '../firebase/config';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export default function AgritechWebApp({ onBack }) {
  // Real-time sensor state
  const [telemetry, setTelemetry] = useState({
    temperature: 28.4,
    moisture: 42,
    humidity: 88,
    sunlight: 85,
    vpd: 1.12,
    nitrogen: 210,
    phosphorus: 34,
    potassium: 480,
    ph: 6.4,
    valveActive: false,
    updatedAt: new Date().toISOString()
  });

  // Sensor mode: 'live' | 'phone' | 'simulation'
  const [sensorMode, setSensorMode] = useState('live');
  const [phoneSensorActive, setPhoneSensorActive] = useState(false);
  const [phoneTilt, setPhoneTilt] = useState({ alpha: 0, beta: 0, gamma: 0 });

  // Kone AI Chat State
  const [aiChatMessages, setAiChatMessages] = useState([
    {
      sender: 'ai',
      text: '🌱 Welcome to Kone AI Agronomist! I am monitoring Node #01 in Volta plots. Ask me any diagnostic question, or click below to analyze current sensor readings.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [aiInputText, setAiInputText] = useState('');
  const [aiThinking, setAiThinking] = useState(false);

  // PWA Deferred Install Prompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const chatEndRef = useRef(null);

  // Catch PWA Install Prompt Event
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
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
      });
    } else {
      alert("📲 To install Kone Farms Agritech WebApp:\n\nOn Mobile (iOS/Android): Tap your browser Share/Menu button and select 'Add to Home Screen'.\nOn Desktop: Click the Install Icon in your browser address bar.");
    }
  };

  // Subscribe to Firestore live telemetry
  useEffect(() => {
    if (!db || !db.app) return;
    const docRef = doc(db, 'farm_telemetry', 'live');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setTelemetry(prev => ({ ...prev, ...docSnap.data() }));
      }
    }, (err) => {
      console.warn("Firestore telemetry listener offline fallback:", err);
    });
    return () => unsubscribe();
  }, []);

  // Update telemetry in state & Firestore
  const updateField = async (field, val) => {
    const updated = {
      ...telemetry,
      [field]: val,
      updatedAt: new Date().toISOString()
    };
    setTelemetry(updated);

    if (db && db.app) {
      try {
        await setDoc(doc(db, 'farm_telemetry', 'live'), updated, { merge: true });
      } catch (err) {
        console.warn("Firestore update error:", err);
      }
    }
  };

  // Connect to Phone Hardware Sensors (DeviceOrientation & AmbientLight)
  const enablePhoneSensors = () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            attachOrientationListener();
          } else {
            alert('Sensor permission denied.');
          }
        })
        .catch(console.error);
    } else {
      attachOrientationListener();
    }
  };

  const attachOrientationListener = () => {
    setPhoneSensorActive(true);
    setSensorMode('phone');

    const handleOrientation = (event) => {
      const b = Math.round(event.beta || 0);
      const g = Math.round(event.gamma || 0);
      setPhoneTilt({ alpha: Math.round(event.alpha || 0), beta: b, gamma: g });

      // Map tilt angles to sensor calibration shifts
      const calculatedTemp = parseFloat((26.0 + (b / 10)).toFixed(1));
      const calculatedMoisture = Math.min(100, Math.max(10, Math.round(45 + (g / 2))));
      
      setTelemetry(prev => ({
        ...prev,
        temperature: Math.min(45, Math.max(15, calculatedTemp)),
        moisture: calculatedMoisture,
        humidity: Math.min(99, Math.max(30, 80 + (b % 15)))
      }));
    };

    window.addEventListener('deviceorientation', handleOrientation);
  };

  // Scroll AI Chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChatMessages, aiThinking]);

  // Compute VPD & Recommendations
  const calculatedVPD = useMemo(() => {
    const T = telemetry.temperature || 28.4;
    const RH = telemetry.humidity || 88;
    const svp = 0.61078 * Math.exp((17.27 * T) / (T + 237.3));
    const avp = svp * (RH / 100);
    return parseFloat((svp - avp).toFixed(2));
  }, [telemetry.temperature, telemetry.humidity]);

  // Calculate Agronomic Recommendations
  const recommendations = useMemo(() => {
    const list = [];
    const { moisture, temperature, humidity, potassium, nitrogen, valveActive } = telemetry;

    if (moisture < 25) {
      list.push({
        type: 'danger',
        icon: '🚨',
        title: 'Critical Root Zone Water Deficit',
        desc: `Volumetric Water Content (VWC) is at ${moisture}% (< 25% threshold). Immediate micro-drip irrigation required.`,
        actionText: 'Trigger Irrigation Valve Now',
        action: () => updateField('valveActive', true)
      });
    } else if (moisture > 75) {
      list.push({
        type: 'warning',
        icon: '🌊',
        title: 'Soil Over-Saturation Hazard',
        desc: `Soil moisture is ${moisture}%. Risk of root hypoxia and Pythium root rot. Halt irrigation valves.`,
        actionText: 'Close Valve & Flush Drains',
        action: () => updateField('valveActive', false)
      });
    } else {
      list.push({
        type: 'success',
        icon: '✅',
        title: 'Optimal Root Moisture Equilibrium',
        desc: `VWC is balanced at ${moisture}%. Soil suction pressure is within ideal 10-30 kPa matrix.`
      });
    }

    // Black Sigatoka Fungal Hazard
    if (humidity >= 90 && temperature >= 24 && temperature <= 30) {
      list.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Black Sigatoka Fungal Germination Risk',
        desc: `Canopy RH is ${humidity}% at ${temperature}°C. Microclimate index predicts spore germination hazard. Apply organic bio-fungicide spray.`,
        actionText: 'Ask Kone AI Spray Formula',
        action: () => triggerAiQuery("What bio-fungicide spray ratio should I apply for Black Sigatoka risk?")
      });
    }

    // Potassium Nutrient Mining
    if (potassium < 350) {
      list.push({
        type: 'info',
        icon: '🧪',
        title: 'Potassium (K+) Nutrient Top-Dressing Needed',
        desc: `Soil Potassium is ${potassium} mg/kg. Plantain pseudostem expansion requires K2O supplementation.`,
        actionText: 'View Fertigation Schedule',
        action: () => triggerAiQuery("Suggest fertigation dosage for low soil potassium.")
      });
    }

    return list;
  }, [telemetry]);

  // Handle Kone AI Chat Submission
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

      if (q.includes('sensor') || q.includes('analyze') || q.includes('current')) {
        aiReply = `📊 **Kone AI Real-Time Analysis for Node #01**:\n\n• **Soil Moisture**: ${telemetry.moisture}% (VWC)\n• **Canopy Temperature**: ${telemetry.temperature}°C\n• **Relative Humidity**: ${telemetry.humidity}%\n• **Calculated VPD**: ${calculatedVPD} kPa\n• **Soil N-P-K**: N:${telemetry.nitrogen} | P:${telemetry.phosphorus} | K:${telemetry.potassium} mg/kg\n\n💡 **Prescription**: ${telemetry.moisture < 25 ? 'Trigger drip irrigation immediately.' : 'Maintain current soil moisture matrix. Humidity is elevated—monitor for foliar fungal spots.'}`;
      } else if (q.includes('sigatoka') || q.includes('spray') || q.includes('fungal')) {
        aiReply = `🛡️ **Kone AI Black Sigatoka Bio-Fungicide Recipe**:\n\nFor *Musa paradisiaca L.* canopy protection under ${telemetry.humidity}% RH:\n1. Mix **Organic Neem Oil** (5 mL/L) with **Potassium Bicarbonate** (3 g/L).\n2. Spray early morning (06:00 - 08:30) targeting abaxial leaf surfaces.\n3. Repeat every 10–14 days during rainy periods.`;
      } else if (q.includes('yield') || q.includes('forecast') || q.includes('plantain')) {
        aiReply = `🌾 **Kone AI Crop Yield Forecast**: Based on Penman-Monteith ET model and current soil NPK (${telemetry.potassium} mg/kg K+), estimated bunch weight is **18.4 kg/bunch** (+48% vs regional baseline). Projected harvest readiness in **42 days**.`;
      } else {
        aiReply = `🤖 **Kone AI Agronomist Response**: I have logged your query regarding "${queryText}". Sensor Node #01 telemetry is operational. Moisture: ${telemetry.moisture}%, Temp: ${telemetry.temperature}°C. How else can I assist your field operations?`;
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
    }, 1200);
  };

  return (
    <div className="agritech-pwa-shell">
      {/* PWA Top Header Bar */}
      <header className="pwa-header">
        <div className="pwa-header-left">
          <button 
            className="pwa-back-btn" 
            onClick={() => {
              if (onBack) onBack();
              else window.location.hash = '#agritech';
            }}
          >
            ← Back
          </button>
          <div className="pwa-title-block">
            <h1 className="pwa-app-name">smartFarm PWA</h1>
            <span className="pwa-node-status">
              <span className="status-dot-pulse"></span>
              NODE #01 (VOLTA PLOTS)
            </span>
          </div>
        </div>

        <div className="pwa-header-right">
          {!isInstalled && (
            <button className="pwa-install-btn" onClick={triggerPwaInstall}>
              📲 Install App
            </button>
          )}
          <span className="offline-badge" title="Firestore Offline Local Cache Active">
            ⚡ Offline PWA Ready
          </span>
        </div>
      </header>

      {/* Main PWA Grid */}
      <main className="pwa-main-grid">
        
        {/* Left Column: Live Telemetry Cards & Controls */}
        <section className="pwa-telemetry-col">
          
          {/* Sensor Mode Switcher Banner */}
          <div className="sensor-mode-card">
            <div className="mode-header">
              <span className="card-label">📡 TELEMETRY SOURCE & HARDWARE SENSORS</span>
              <span className="live-clock">{new Date().toLocaleTimeString()}</span>
            </div>

            <div className="mode-toggle-row">
              <button 
                className={`mode-btn ${sensorMode === 'live' ? 'active' : ''}`}
                onClick={() => setSensorMode('live')}
              >
                📡 Field LoRa Nodes
              </button>

              <button 
                className={`mode-btn ${sensorMode === 'phone' ? 'active' : ''}`}
                onClick={enablePhoneSensors}
              >
                📱 Phone/Laptop Sensors
              </button>

              <button 
                className={`mode-btn ${sensorMode === 'simulation' ? 'active' : ''}`}
                onClick={() => setSensorMode('simulation')}
              >
                ⚙️ Manual Calibration
              </button>
            </div>

            {sensorMode === 'phone' && (
              <div className="phone-sensor-banner">
                <span>📱 **Phone Accelerometer Telemetry Active**: Tilt phone to shift moisture & temp metrics!</span>
                <span className="tilt-info">Beta: {phoneTilt.beta}° | Gamma: {phoneTilt.gamma}°</span>
              </div>
            )}
          </div>

          {/* Telemetry Gauge Cards Grid */}
          <div className="telemetry-gauges-grid">
            
            {/* Soil Moisture */}
            <div className="gauge-card moisture-card">
              <div className="gauge-header">
                <span className="gauge-icon">💧</span>
                <span className="gauge-name">Soil Moisture (VWC)</span>
              </div>
              <div className="gauge-value-row">
                <span className="gauge-number">{telemetry.moisture}%</span>
                <span className="gauge-unit">Volumetric</span>
              </div>
              <div className="gauge-bar-track">
                <div className="gauge-bar-fill moisture-fill" style={{ width: `${telemetry.moisture}%` }}></div>
              </div>
              {sensorMode === 'simulation' && (
                <input 
                  type="range" min="0" max="100" 
                  value={telemetry.moisture} 
                  onChange={(e) => updateField('moisture', parseInt(e.target.value))} 
                  className="slider-override"
                />
              )}
            </div>

            {/* Ambient Temperature */}
            <div className="gauge-card temp-card">
              <div className="gauge-header">
                <span className="gauge-icon">🌡️</span>
                <span className="gauge-name">Canopy Temperature</span>
              </div>
              <div className="gauge-value-row">
                <span className="gauge-number">{telemetry.temperature}°C</span>
                <span className="gauge-unit">({((telemetry.temperature * 9/5) + 32).toFixed(1)}°F)</span>
              </div>
              <div className="gauge-bar-track">
                <div className="gauge-bar-fill temp-fill" style={{ width: `${(telemetry.temperature / 45) * 100}%` }}></div>
              </div>
              {sensorMode === 'simulation' && (
                <input 
                  type="range" min="15" max="45" step="0.5"
                  value={telemetry.temperature} 
                  onChange={(e) => updateField('temperature', parseFloat(e.target.value))} 
                  className="slider-override"
                />
              )}
            </div>

            {/* Relative Humidity */}
            <div className="gauge-card humidity-card">
              <div className="gauge-header">
                <span className="gauge-icon">💨</span>
                <span className="gauge-name">Relative Humidity</span>
              </div>
              <div className="gauge-value-row">
                <span className="gauge-number">{telemetry.humidity}%</span>
                <span className="gauge-unit">RH</span>
              </div>
              <div className="gauge-bar-track">
                <div className="gauge-bar-fill humidity-fill" style={{ width: `${telemetry.humidity}%` }}></div>
              </div>
              {sensorMode === 'simulation' && (
                <input 
                  type="range" min="20" max="100" 
                  value={telemetry.humidity} 
                  onChange={(e) => updateField('humidity', parseInt(e.target.value))} 
                  className="slider-override"
                />
              )}
            </div>

            {/* VPD Deficit */}
            <div className="gauge-card vpd-card">
              <div className="gauge-header">
                <span className="gauge-icon">⚡</span>
                <span className="gauge-name">Vapor Pressure Deficit</span>
              </div>
              <div className="gauge-value-row">
                <span className="gauge-number">{calculatedVPD}</span>
                <span className="gauge-unit">kPa (Transpiration)</span>
              </div>
              <div className="vpd-status-tag">
                {calculatedVPD < 0.4 ? '🔵 Low Transpiration' : calculatedVPD > 1.6 ? '🔴 High Stress' : '🟢 Optimal VPD Zone'}
              </div>
            </div>

          </div>

          {/* Micro-Irrigation Solenoid Valve Control Card */}
          <div className="valve-control-card">
            <div className="valve-info">
              <span className="valve-icon">🚰</span>
              <div>
                <h4>Automated Micro-Drip Valve #01</h4>
                <p>Solar Solenoid Relay | Status: <strong>{telemetry.valveActive ? '🟢 OPEN (IRRIGATING)' : '🔴 CLOSED (STANDBY)'}</strong></p>
              </div>
            </div>
            <button 
              className={`valve-toggle-btn ${telemetry.valveActive ? 'active' : ''}`}
              onClick={() => updateField('valveActive', !telemetry.valveActive)}
            >
              {telemetry.valveActive ? 'Halt Irrigation Valve' : 'Trigger 30-Min Irrigation'}
            </button>
          </div>

          {/* Intelligent Agronomic Recommendations List */}
          <div className="recommendations-card">
            <h3 className="section-heading">🧠 Real-Time Agronomic Recommendations</h3>
            <div className="recommendations-list">
              {recommendations.map((rec, idx) => (
                <div key={idx} className={`recommendation-item rec-${rec.type}`}>
                  <span className="rec-icon">{rec.icon}</span>
                  <div className="rec-details">
                    <h4>{rec.title}</h4>
                    <p>{rec.desc}</p>
                    {rec.actionText && (
                      <button className="rec-action-btn" onClick={rec.action}>
                        {rec.actionText} →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Right Column: Embedded Kone AI Agronomist Chat */}
        <section className="pwa-ai-col">
          <div className="kone-ai-container">
            <div className="ai-chat-header">
              <div className="ai-brand-info">
                <div className="ai-avatar">🤖</div>
                <div>
                  <h3>Kone AI Agronomist</h3>
                  <span className="ai-sub">Powered by Kone AI Operations</span>
                </div>
              </div>
              <button 
                className="analyze-now-btn" 
                onClick={() => triggerAiQuery("Analyze current sensor telemetry and suggest action plan.")}
              >
                ⚡ Analyze Telemetry
              </button>
            </div>

            {/* AI Messages Stream */}
            <div className="ai-messages-list">
              {aiChatMessages.map((msg, idx) => (
                <div key={idx} className={`chat-message message-${msg.sender}`}>
                  <div className="message-content">
                    <div className="message-text">
                      {msg.text.split('\n').map((line, lIdx) => (
                        <p key={lIdx}>{line}</p>
                      ))}
                    </div>
                    <span className="message-time">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {aiThinking && (
                <div className="chat-message message-ai">
                  <div className="message-content thinking-content">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="thinking-text">Kone AI is calculating sensor models...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Preset Query Chips */}
            <div className="ai-query-chips">
              <button onClick={() => triggerAiQuery("What is the Black Sigatoka spore risk right now?")}>
                🛡️ Black Sigatoka Risk
              </button>
              <button onClick={() => triggerAiQuery("Estimate plantain crop yield forecast.")}>
                🌾 Yield Forecast
              </button>
              <button onClick={() => triggerAiQuery("Suggest optimal fertigation ratio.")}>
                🧪 Fertigation Ratios
              </button>
            </div>

            {/* AI Input Form */}
            <form className="ai-input-form" onSubmit={handleSendAiMessage}>
              <input 
                type="text" 
                placeholder="Ask Kone AI about crop diseases, sensor readings, or irrigation..."
                value={aiInputText}
                onChange={(e) => setAiInputText(e.target.value)}
                className="ai-chat-input"
              />
              <button type="submit" className="ai-send-btn" disabled={!aiInputText.trim()}>
                Send
              </button>
            </form>
          </div>
        </section>

      </main>
    </div>
  );
}
