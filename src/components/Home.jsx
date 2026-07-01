import React from 'react';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page animate-fade-in">
      {/* Organic floating decorative particles */}
      <div className="floating-particle p1">🌿</div>
      <div className="floating-particle p2">🍃</div>
      <div className="floating-particle p3">🌱</div>
      <div className="floating-particle p4">✨</div>
      <div className="floating-particle p5">🌿</div>

      <div className="home-container">
        
        {/* Banner Title */}
        <div className="home-badge">
          🌾 sustainable agriculture & food security
        </div>
        <h1 className="home-headline">
          Software & Science in Service of the Soil
        </h1>
        <p className="home-subheadline">
          Empowering Ghana's agricultural future by combining IoT automation, software monitoring, Volta Region family farm sourcing, and organic premium processing.
        </p>

        {/* Division Selector Grid */}
        <div className="divisions-grid">
          
          {/* Card 1: Farms & Sourcing */}
          <a href="#farms" className="div-card card-farms">
            <div className="div-icon-wrapper">🌾</div>
            <h3 className="div-h3">Farms & Sourcing</h3>
            <p className="div-desc">
              Discover our local farming partnerships in the Volta Region. Browse our organic crops (Scotch Bonnet, Shallots) and read our strict 100% Non-GMO standard policy.
            </p>
            <div className="div-btn">
              Explore Sourcing ➔
            </div>
          </a>

          {/* Card 2: Kone Food Division */}
          <a href="#food" className="div-card card-food">
            <div className="div-icon-wrapper">🥫</div>
            <h3 className="div-h3">Kone Food</h3>
            <p className="div-desc">
              Premium organic foods catalog. Explore our featured authentic black pepper sauce (Kone Shito), check audited batch logs, or apply as a distributor for our upcoming food line.
            </p>
            <div className="div-btn">
              View Food Division ➔
            </div>
          </a>

          {/* Card 3: Agritech / smartFarm Telemetry */}
          <a href="#agritech" className="div-card card-agritech">
            <div className="div-icon-wrapper">📡</div>
            <h3 className="div-h3">smartFarm Telemetry</h3>
            <p className="div-desc">
              Monitor live IoT field sensors tracking soil moisture, temperature, and sunlight. Test the real-time two-way sync console by overriding telemetry values directly to Firestore.
            </p>
            <div className="div-btn">
              Open Telemetry ➔
            </div>
          </a>

        </div>

      </div>
    </div>
  );
}
