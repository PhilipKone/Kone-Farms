import React from 'react';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page animate-fade-in">
      <div className="home-container">
        
        {/* Banner Pill Badge with Live Indicator */}
        <div className="home-badge-container">
          <span className="home-badge">
            <span className="badge-pulse-dot" />
            <span className="badge-text-desktop">SUSTAINABLE AGRI-TECH & SMALLHOLDER SOURCING</span>
            <span className="badge-text-mobile">AGRI-TECH & SMALLHOLDER SOURCING</span>
          </span>
        </div>

        {/* Hero Headline & Subtitle */}
        <h1 className="home-headline">
          Science & Software in <br className="desktop-break" />
          <span className="emerald-luminance">Service of African Soil.</span>
        </h1>
        
        <p className="home-subheadline">
          Empowering Ghanaian agriculture through <strong>smart farm technology</strong>, solar drip irrigation, fair-trade smallholder sourcing, and organic artisanal foods.
        </p>

        {/* Dual Primary & Secondary Hero CTAs */}
        <div className="home-cta-group">
          <a href="#divisions" className="btn-primary-farms">
            <span>Explore Agricultural Divisions</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>

          <a href="#agritech" className="btn-secondary-farms">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
            </svg>
            <span>smartFarm Telemetry</span>
          </a>
        </div>

        {/* 4-Pillar Impact Metrics Capsule Bar */}
        <div className="impact-metrics-bar">
          <div className="impact-metric-pill">
            <div className="metric-icon-wrap">🌱</div>
            <div className="metric-info">
              <span className="metric-label">100% Non-GMO</span>
              <span className="metric-sub">Golden Plantains & Yams</span>
            </div>
          </div>

          <div className="impact-metric-pill">
            <div className="metric-icon-wrap">☀️</div>
            <div className="metric-info">
              <span className="metric-label">24/7 Field Telemetry</span>
              <span className="metric-sub">Soil Moisture & Climate</span>
            </div>
          </div>

          <div className="impact-metric-pill">
            <div className="metric-icon-wrap">🤝</div>
            <div className="metric-info">
              <span className="metric-label">Fair-Trade Sourcing</span>
              <span className="metric-sub">Guaranteed Farmer Income</span>
            </div>
          </div>

          <div className="impact-metric-pill">
            <div className="metric-icon-wrap">📦</div>
            <div className="metric-info">
              <span className="metric-label">0% Preservatives</span>
              <span className="metric-sub">Batch-Traceable Food</span>
            </div>
          </div>
        </div>

        {/* Division Selector Grid */}
        <div className="divisions-grid" id="divisions">
          
          {/* Card 1: Farms & Sourcing */}
          <a href="#farms" className="div-card card-farms">
            <div className="div-card-media">
              <img 
                src="/assets/home/division-farms.jpg" 
                alt="Ghanaian Organic Farmlands" 
                className="div-card-img" 
                loading="lazy" 
              />
              <div className="div-card-overlay"></div>
              <span className="card-tag tag-farms div-card-floating-badge">Ghanaian Sourcing</span>
              <div className="div-icon-wrapper div-card-floating-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="#34d399" strokeWidth="2.2" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
            </div>

            <div className="div-card-body">
              <h2 className="div-h3">Farms & Sourcing</h2>
              <p className="div-desc">
                Direct farming partnerships across Ghana's fertile agricultural belts. Cultivating Golden Plantain, White Yam, and Scotch Bonnet peppers under 100% organic standards.
              </p>

              <div className="card-deliverables">
                <span className="card-deliv-item">✓ Smallholder Contract Farming</span>
                <span className="card-deliv-item">✓ Guaranteed Fair-Trade Pricing</span>
                <span className="card-deliv-item">✓ Regenerative Soil Care</span>
              </div>

              <div className="div-btn">
                <span>Explore Sourcing Network</span>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </a>

          {/* Card 2: Kone Food Division */}
          <a href="#food" className="div-card card-food">
            <div className="div-card-media">
              <img 
                src="/assets/home/division-food.jpg" 
                alt="Handcrafted Kone Chips & Shito" 
                className="div-card-img" 
                loading="lazy" 
              />
              <div className="div-card-overlay"></div>
              <span className="card-tag tag-food div-card-floating-badge">Artisanal Processing</span>
              <div className="div-icon-wrapper div-card-floating-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="#fbbf24" strokeWidth="2.2" fill="none">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
            </div>

            <div className="div-card-body">
              <h2 className="div-h3">Kone Food & Snacks</h2>
              <p className="div-desc">
                Premium packaged Ghanaian foods. Featuring crisp kettle-cooked <strong>Kone Chips</strong> (Plantain, Yam & Potato) and savory <strong>Kone Shito</strong> with QR batch traceability.
              </p>

              <div className="card-deliverables">
                <span className="card-deliv-item">✓ QR-Code Batch Verification</span>
                <span className="card-deliv-item">✓ Zero Chemical Additives</span>
                <span className="card-deliv-item">✓ Fresh Local & Export Supply</span>
              </div>

              <div className="div-btn">
                <span>Explore Packaged Foods</span>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </a>

          {/* Card 3: Agritech / smartFarm Telemetry */}
          <a href="#agritech" className="div-card card-agritech">
            <div className="div-card-media">
              <img 
                src="/assets/home/division-agritech.jpg" 
                alt="Solar-Powered smartFarm Telemetry" 
                className="div-card-img" 
                loading="lazy" 
              />
              <div className="div-card-overlay"></div>
              <span className="card-tag tag-agritech div-card-floating-badge">Live Telemetry</span>
              <div className="div-icon-wrapper div-card-floating-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="#60a5fa" strokeWidth="2.2" fill="none">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
                </svg>
              </div>
            </div>

            <div className="div-card-body">
              <h2 className="div-h3">smartFarm Telemetry</h2>
              <p className="div-desc">
                Intelligent agricultural automation. Real-time field sensors monitor root-zone moisture and sunlight to power automated, solar-driven micro-drip irrigation.
              </p>

              <div className="card-deliverables">
                <span className="card-deliv-item">✓ Solar-Powered Field Sensors</span>
                <span className="card-deliv-item">✓ Smart Automated Drip Irrigation</span>
                <span className="card-deliv-item">✓ Precision Water Conservation</span>
              </div>

              <div className="div-btn">
                <span>Open Live Telemetry</span>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </a>

        </div>

        {/* Wholesale & Partnership Banner Card */}
        <div className="wholesale-banner-card">
          <div className="wholesale-banner-content">
            <span className="wholesale-badge">PARTNER WITH KONE FARMS</span>
            <h3 className="wholesale-headline">Bulk Supply & Farming Partnerships</h3>
            <p className="wholesale-text">
              Looking for bulk organic crops, retail snacks, or custom farming partnerships? Connect directly with our operations desk.
            </p>
          </div>
          <div className="wholesale-banner-actions">
            <a 
              href="https://wa.me/233551993820?text=Hi%20Kone%20Farms%2C%20I'd%20like%20to%20inquire%20about%20wholesale%20supply%20and%20farming%20partnerships."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-farms"
            >
              <span>Contact Wholesale Desk</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
