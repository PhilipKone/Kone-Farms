import React, { useState, useMemo } from 'react';
import './VwcCalculator.css';

export default function VwcCalculator() {
  const [substrate, setSubstrate] = useState('tropical-loam');
  const [rawAdc, setRawAdc] = useState(2200);
  const [airBaseline, setAirBaseline] = useState(3200);
  const [waterBaseline, setWaterBaseline] = useState(1350);
  const [sleepInterval, setSleepInterval] = useState(15); // minutes

  // Substrate compensation coefficients
  const substrates = {
    'tropical-loam': { name: 'Tropical Sandy Loam', optimalMin: 18, optimalMax: 32 },
    'ashanti-clay': { name: 'Ashanti Clay Loam', optimalMin: 22, optimalMax: 38 },
    'eastern-peat': { name: 'Eastern Peat Substrate', optimalMin: 25, optimalMax: 45 },
    'coco-coir': { name: 'Greenhouse Coco Coir', optimalMin: 30, optimalMax: 50 }
  };

  // VWC Formula Calculation
  const vwcPercentage = useMemo(() => {
    if (airBaseline <= waterBaseline) return 0;
    const numerator = airBaseline - rawAdc;
    const denominator = airBaseline - waterBaseline;
    const rawVwc = (numerator / denominator) * 100;
    return Math.min(Math.max(Math.round(rawVwc), 0), 100);
  }, [rawAdc, airBaseline, waterBaseline]);

  const currentSubstrate = substrates[substrate];

  // Evaluate Hydration Status
  const hydrationStatus = useMemo(() => {
    if (vwcPercentage < currentSubstrate.optimalMin) {
      return {
        level: 'Dry / Stress State',
        color: '#ef4444',
        bgColor: 'rgba(239, 68, 68, 0.15)',
        borderColor: '#f87171',
        icon: (
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="#f87171" strokeWidth="2" fill="none">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        ),
        action: 'Critical Water Stress! Recommend triggering LoRa automated solenoid valve for 20-25 mins.'
      };
    } else if (vwcPercentage <= currentSubstrate.optimalMax) {
      return {
        level: 'Optimal Hydration',
        color: '#34d399',
        bgColor: 'rgba(16, 185, 129, 0.15)',
        borderColor: '#10b981',
        icon: (
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="#34d399" strokeWidth="2" fill="none">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        ),
        action: 'Perfect root zone moisture! Maintain current 15-minute solar telemetry cycle.'
      };
    } else {
      return {
        level: 'Over-Saturated',
        color: '#38bdf8',
        bgColor: 'rgba(56, 189, 248, 0.15)',
        borderColor: '#38bdf8',
        icon: (
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="#38bdf8" strokeWidth="2" fill="none">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
          </svg>
        ),
        action: 'Soil is waterlogged. Halt automated irrigation to prevent root hypoxia and fungal rot.'
      };
    }
  }, [vwcPercentage, currentSubstrate]);

  // Battery Power Budget Estimation (18650 3400mAh LiFePO4)
  const batteryLifeDays = useMemo(() => {
    const activeCurrentmA = 120; // ESP32 + LoRa broadcast active current
    const activeDurationSec = 1.2;
    const sleepCurrentuA = 15.4; // ESP32 deep sleep current

    const sleepSec = sleepInterval * 60;
    const totalCycleSec = activeDurationSec + sleepSec;
    const activeChargeAs = activeCurrentmA * activeDurationSec; // mA·s
    const sleepChargeAs = (sleepCurrentuA / 1000) * sleepSec; // mA·s

    const avgCurrentmA = (activeChargeAs + sleepChargeAs) / totalCycleSec;
    const batteryCapmAh = 3400;

    const hours = batteryCapmAh / avgCurrentmA;
    return Math.round(hours / 24);
  }, [sleepInterval]);

  return (
    <div className="vwc-calculator-card">
      <div className="calc-header">
        <div className="calc-title-row">
          <span className="calc-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            INTERACTIVE AGRITECH TOOL
          </span>
          <h2 className="calc-headline">Soil Hydration & Solar Node Calculator</h2>
        </div>
        <p className="calc-subtitle">
          Interactive tool to calculate soil hydration percentage and estimate solar sensor battery life across different farmland soil types.
        </p>
      </div>

      <div className="calc-body-grid">
        {/* Controls Column */}
        <div className="calc-inputs-col">
          
          {/* Substrate Selector */}
          <div className="input-group">
            <label className="input-label">Farmland Soil Type:</label>
            <select 
              value={substrate} 
              onChange={(e) => setSubstrate(e.target.value)}
              className="calc-select-input"
            >
              {Object.keys(substrates).map(key => (
                <option key={key} value={key}>
                  {substrates[key].name} (Optimal: {substrates[key].optimalMin}% - {substrates[key].optimalMax}%)
                </option>
              ))}
            </select>
          </div>

          {/* Raw ADC Input Slider */}
          <div className="input-group">
            <div className="slider-label-row">
              <label className="input-label">Soil Sensor Signal (Digital Probe):</label>
              <span className="adc-value-pill">{rawAdc} Signal</span>
            </div>
            <input 
              type="range" 
              min="1350" 
              max="3500" 
              value={rawAdc}
              onChange={(e) => setRawAdc(Number(e.target.value))}
              className="calc-slider"
            />
            <div className="slider-range-labels">
              <span>Wet / Saturated (1350)</span>
              <span>Dry Soil (3200)</span>
            </div>
          </div>

          {/* Baseline Calibrations */}
          <div className="baselines-row">
            <div className="input-group">
              <label className="input-label-sm">Dry Soil Baseline:</label>
              <input 
                type="number" 
                value={airBaseline}
                onChange={(e) => setAirBaseline(Number(e.target.value))}
                className="calc-number-input"
              />
            </div>
            <div className="input-group">
              <label className="input-label-sm">Wet Soil Baseline:</label>
              <input 
                type="number" 
                value={waterBaseline}
                onChange={(e) => setWaterBaseline(Number(e.target.value))}
                className="calc-number-input"
              />
            </div>
          </div>

          {/* Telemetry Sleep Duty Cycle */}
          <div className="input-group">
            <div className="slider-label-row">
              <label className="input-label">Sensor Sync Frequency:</label>
              <span className="adc-value-pill" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                Every {sleepInterval} Mins
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="60" 
              value={sleepInterval}
              onChange={(e) => setSleepInterval(Number(e.target.value))}
              className="calc-slider"
            />
          </div>
        </div>

        {/* Results Column */}
        <div className="calc-results-col">
          {/* Main VWC Readout Gauge */}
          <div className="vwc-gauge-box">
            <span className="gauge-label">Volumetric Water Content (VWC)</span>
            <div className="gauge-number-row">
              <span className="vwc-big-percent" style={{ color: hydrationStatus.color }}>
                {vwcPercentage}%
              </span>
              <span className="vwc-unit">VWC</span>
            </div>

            {/* Visual Moisture Bar */}
            <div className="vwc-bar-track">
              <div 
                className="vwc-bar-fill"
                style={{ 
                  width: `${vwcPercentage}%`,
                  background: hydrationStatus.color,
                  boxShadow: `0 0 12px ${hydrationStatus.color}`
                }}
              />
            </div>
          </div>

          {/* Action Directive Card */}
          <div 
            className="hydration-status-card"
            style={{ 
              background: hydrationStatus.bgColor, 
              borderColor: hydrationStatus.borderColor 
            }}
          >
            <div className="status-header-row">
              <span className="status-icon">{hydrationStatus.icon}</span>
              <span className="status-level-text" style={{ color: hydrationStatus.color }}>
                {hydrationStatus.level}
              </span>
            </div>
            <p className="status-action-text">{hydrationStatus.action}</p>
          </div>

          {/* Power Budget Battery Lifespan Card */}
          <div className="power-budget-box">
            <div className="power-icon-row">
              <div className="power-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="#34d399" strokeWidth="2" fill="none">
                  <rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect>
                  <line x1="23" y1="13" x2="23" y2="11"></line>
                </svg>
              </div>
              <div className="power-text-meta">
                <span className="power-title">Solar Telemetry Battery Lifespan</span>
                <span className="power-desc">18650 LiFePO4 (3400mAh) with zero solar recharge:</span>
              </div>
            </div>
            <div className="power-days-highlight">
              ~{batteryLifeDays} Days <span className="days-label">Continuous Field Operation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
