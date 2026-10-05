import React from 'react';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page animate-fade-in">
      <div className="home-container">
        

        {/* Hero Headline & Subtitle */}
        <h1 className="home-headline">
          Science & Software in <br className="desktop-break" />
          <span className="emerald-luminance">Service of African Soil.</span>
        </h1>
        
        <p className="home-subheadline">
          Empowering Ghanaian smallholder farms, artisanal food production, and open-source agritech research.
        </p>

        {/* Division Showcase Grid */}
        <div className="divisions-grid" id="divisions">
          
          {/* Card 1: Farms */}
          <a href="#farms" className="div-card card-farms">
            <div className="div-card-media">
              <img 
                src="/assets/home/division-farms.jpg" 
                alt="Ghanaian Organic Farmlands" 
                className="div-card-img" 
                loading="lazy" 
              />
              <div className="div-card-overlay"></div>
              <span className="card-tag tag-farms">Organic Sourcing</span>
            </div>

            <div className="div-card-body">
              <h2 className="div-h3">Farms</h2>
              <p className="div-desc">
                Direct farming partnerships across Ghana. Cultivating Golden Plantain, White Yam, and Scotch Bonnet peppers under 100% fair-trade standards.
              </p>

              <div className="div-btn">
                <span>Explore Sourcing Network</span>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </a>

          {/* Card 2: Food */}
          <a href="#food" className="div-card card-food">
            <div className="div-card-media">
              <img 
                src="/assets/home/division-food.jpg" 
                alt="Handcrafted Kone Chips & Shito" 
                className="div-card-img" 
                loading="lazy" 
              />
              <div className="div-card-overlay"></div>
              <span className="card-tag tag-food">Artisanal Food</span>
            </div>

            <div className="div-card-body">
              <h2 className="div-h3">Food</h2>
              <p className="div-desc">
                Premium packaged foods. Featuring crisp kettle-cooked plantain, yam, and potato chips paired with authentic savory Kone Shito sauce.
              </p>

              <div className="div-btn">
                <span>View Packaged Foods</span>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </a>

          {/* Card 3: Agritech Research & IoT Blueprints */}
          <a href="#blog" className="div-card card-agritech">
            <div className="div-card-media">
              <img 
                src="/assets/home/division-agritech.jpg" 
                alt="Solar-Powered smartFarm Telemetry Blueprint" 
                className="div-card-img" 
                loading="lazy" 
              />
              <div className="div-card-overlay"></div>
              <span className="card-tag tag-agritech">Research & Blueprints</span>
            </div>

            <div className="div-card-body">
              <h2 className="div-h3">Agritech Research & Blueprints</h2>
              <p className="div-desc">
                Open-source engineering and IoT blueprints for tropical agriculture. Researching solar telemetry, precision soil moisture sensing, and low-waste irrigation.
              </p>

              <div className="div-btn">
                <span>Read Research Papers</span>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </a>

        </div>

        {/* Wholesale & Supply Inquiries Strip */}
        <div className="wholesale-banner-card">
          <div className="wholesale-banner-content">
            <div className="wholesale-badge-row">
              <span className="wholesale-pill">
                <span className="status-live-dot" />
                <span>OPERATIONS DESK ACTIVE</span>
              </span>
              <span className="wholesale-metric-tag">⚡ Direct B2B • Avg Response &lt; 2h</span>
            </div>
            <h3 className="wholesale-headline">Bulk Supply & Farming Inquiries</h3>
            <p className="wholesale-text">
              Direct B2B supply of organic crops, packaged retail snacks, and contract agricultural partnerships with container export freight.
            </p>
          </div>
          <div className="wholesale-banner-actions">
            <a 
              href="https://wa.me/233551993820?text=Hi%20Kone%20Farms%2C%20I'd%20like%20to%20inquire%20about%20wholesale%20supply%20and%20farming%20partnerships."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-farms"
            >
              <span>Contact Operations Desk</span>
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
