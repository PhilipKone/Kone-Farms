import React from 'react';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page animate-fade-in">
      <div className="home-container">
        
        {/* Banner Title */}
        <div className="home-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="#34d399" strokeWidth="2.5" fill="none">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          Sustainable Agriculture & Food Security
        </div>
        <h1 className="home-headline">
          Software & Science in Service of the Soil
        </h1>
        <p className="home-subheadline">
          Empowering Ghana's agricultural future by combining IoT automation, software monitoring, smallholder family farm sourcing, and organic premium processing.
        </p>

        {/* Division Selector Grid */}
        <div className="divisions-grid">
          
          {/* Card 1: Farms & Sourcing */}
          <a href="#farms" className="div-card card-farms">
            <div className="div-icon-wrapper">
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="#34d399" strokeWidth="2" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h2 className="div-h3">Farms & Sourcing</h2>
            <p className="div-desc">
              Discover our local farming partnerships and regional clusters. Browse our organic crops (Scotch Bonnet, Shallots) and read our strict 100% Non-GMO standard policy.
            </p>
            <div className="div-btn">
              Explore Sourcing
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginLeft: '6px' }}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </a>

          {/* Card 2: Kone Food Division */}
          <a href="#food" className="div-card card-food">
            <div className="div-icon-wrapper">
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="#fbbf24" strokeWidth="2" fill="none">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <h2 className="div-h3">Kone Food & Snacks</h2>
            <p className="div-desc">
              Artisanal organic snacks & cuisine catalog. Explore our new <strong>Kone Chips</strong> (Plantain, Yam & Potato) and signature <strong>Kone Shito</strong>, check audited batch logs, or calculate distributor wholesale pricing.
            </p>
            <div className="div-btn">
              Explore Food & Snacks
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginLeft: '6px' }}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </a>

          {/* Card 3: Agritech / smartFarm Telemetry */}
          <a href="#agritech" className="div-card card-agritech">
            <div className="div-icon-wrapper">
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="#60a5fa" strokeWidth="2" fill="none">
                <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
              </svg>
            </div>
            <h2 className="div-h3">smartFarm Telemetry</h2>
            <p className="div-desc">
              Monitor live IoT field sensors tracking soil moisture, temperature, and sunlight. Test the real-time two-way sync console by overriding telemetry values directly to Firestore.
            </p>
            <div className="div-btn">
              Open Telemetry
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginLeft: '6px' }}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </a>

        </div>

      </div>
    </div>
  );
}
