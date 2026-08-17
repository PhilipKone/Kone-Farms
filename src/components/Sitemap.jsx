import React, { useEffect } from 'react';
import './Sitemap.css';

const Sitemap = ({ onBack }) => {
  useEffect(() => {
    const SCHEMA_ID = 'sitemap-breadcrumb-jsonld';
    let script = document.getElementById(SCHEMA_ID);
    if (script) script.remove();

    script = document.createElement('script');
    script.id = SCHEMA_ID;
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Kone Farms",
          "item": "https://farms.koneacademy.io/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Sitemap",
          "item": "https://farms.koneacademy.io/#sitemap"
        }
      ]
    });
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(SCHEMA_ID);
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, []);

  return (
    <div className="farms-sitemap-page">
      {/* Header action bar */}
      <div className="farms-sitemap-header">
        <button onClick={onBack} className="farms-sitemap-back-btn">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back
        </button>
        <span className="farms-sitemap-brand">Kone Farms Index</span>
      </div>

      <div className="farms-sitemap-container">
        <div className="farms-sitemap-card">
          <h1 className="farms-sitemap-title">Kone Farms Sitemap</h1>
          <p className="farms-sitemap-subtitle">
            Local platform index for automated irrigation telemetry, smallholder farmer markets, and agritech soil intelligence.
          </p>

          <div className="farms-sitemap-grid">
            {/* Column 1: Core Farms Views */}
            <div className="farms-sitemap-column">
              <div className="farms-sitemap-col-header">
                <span style={{ fontSize: '1.4rem', marginRight: '8px' }}>🌱</span>
                <h2>Platform Modules</h2>
              </div>
              <div className="farms-sitemap-list">
                <div className="farms-sitemap-item">
                  <a href="#home" className="farms-sitemap-link">
                    Agriculture Homepage
                  </a>
                  <p className="farms-sitemap-desc">Kone Farms overview detailing agricultural automation, telemetry, and smallholder small networks.</p>
                </div>
                <div className="farms-sitemap-item">
                  <a href="#farms" className="farms-sitemap-link">
                    Smart Farms Dashboard
                  </a>
                  <p className="farms-sitemap-desc">IoT telemetry console displaying live soil data, electric fence voltages, and automated crop yields.</p>
                </div>
                <div className="farms-sitemap-item">
                  <a href="#food" className="farms-sitemap-link">
                    Kone Food (Supply Network)
                  </a>
                  <p className="farms-sitemap-desc">Sourcing premium organic ingredients (Volta Region) directly to consumers and shops.</p>
                </div>
                <div className="farms-sitemap-item">
                  <a href="#agritech" className="farms-sitemap-link">
                    Agritech Systems
                  </a>
                  <p className="farms-sitemap-desc">Hardware specs for microcontroller soil nodes, sensor arrays, and solar telemetry modules.</p>
                </div>
                <div className="farms-sitemap-item">
                  <a href="#agritech/webapp" className="farms-sitemap-link">
                    Agritech Native WebApp
                  </a>
                  <p className="farms-sitemap-desc">Standalone PWA dashboard with real-time LoRa telemetry, hardware sensor status, and Kone AI crop intelligence.</p>
                </div>
                <div className="farms-sitemap-item">
                  <a href="#blog" className="farms-sitemap-link">
                    Agritech Research Blog
                  </a>
                  <p className="farms-sitemap-desc">Deep-dive engineering research, solar telemetry node circuit schematics, and sensor calibration guides.</p>
                </div>
              </div>
            </div>

            {/* Column 2: Ecosystem & Academy Links */}
            <div className="farms-sitemap-column">
              <div className="farms-sitemap-col-header">
                <span style={{ fontSize: '1.4rem', marginRight: '8px' }}>🌐</span>
                <h2>Ecosystem & Resources</h2>
              </div>
              <div className="farms-sitemap-list">
                <div className="farms-sitemap-item">
                  <a href="https://www.koneacademy.io" className="farms-sitemap-link" target="_blank" rel="noopener noreferrer">
                    Academy Home
                    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', opacity: 0.6 }}>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                  <p className="farms-sitemap-desc">Parent company landing page containing central index protocols and specs.</p>
                </div>
                <div className="farms-sitemap-item">
                  <a href="https://www.koneacademy.io/sitemap" className="farms-sitemap-link" target="_blank" rel="noopener noreferrer">
                    Central Sitemap Hub
                    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', opacity: 0.6 }}>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                  <p className="farms-sitemap-desc">Central link directory connecting all 11 subdomains.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
