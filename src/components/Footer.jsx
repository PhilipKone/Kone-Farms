import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="farms-footer">
      <div className="footer-container">
        
        {/* Brand Column */}
        <div className="footer-brand">
          <div className="footer-logo-title">
            <img src="/logos/logo.svg" className="footer-logo" alt="Kone Farms Logo" />
            <span className="footer-brand-name">Kone Farms</span>
          </div>
          <p className="footer-tagline">
            Cultivating self-reliance through sustainable agriculture, IoT-powered telemetry, and organic community collaborations.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="footer-links-col">
          <h4 className="footer-h4">Explore</h4>
          <div className="footer-links">
            <a href="#home" className="footer-link">Overview</a>
            <a href="#farms" className="footer-link">Farms & Sourcing</a>
            <a href="#food" className="footer-link">Kone Shito Sauce</a>
            <a href="#agritech" className="footer-link">Smart telemetry</a>
          </div>
        </div>

        {/* Ecosystem Column */}
        <div className="footer-links-col">
          <h4 className="footer-h4">Ecosystem</h4>
          <div className="footer-links">
            <a href="https://www.koneacademy.io" className="footer-link">Academy Home</a>
            <a href="https://code.koneacademy.io" className="footer-link">Kone Code</a>
            <a href="https://lab.koneacademy.io" className="footer-link">Kone Lab</a>
            <a href="https://ai.koneacademy.io" className="footer-link">Kone AI</a>
            <a href="https://consult.koneacademy.io" className="footer-link">Kone Consult</a>
            <a href="https://kids.koneacademy.io" className="footer-link">Kone Kids</a>
            <a href="https://shop.koneacademy.io" className="footer-link">Kone Shop</a>
            <a href="https://warp.koneacademy.io" className="footer-link">Kone Warp</a>
            <a href="https://digital.koneacademy.io" className="footer-link">Kone Digital</a>
          </div>
        </div>

        {/* Contact/Location Column */}
        <div className="footer-links-col">
          <h4 className="footer-h4">Headquarters</h4>
          <div className="footer-social-info">
            <div className="footer-info-item">
              📍 <strong>Accra Office:</strong><br />
              Kone Code Academy, Accra, Ghana
            </div>
            <div className="footer-info-item">
              🌾 <strong>Farming Partner Districts:</strong><br />
              Volta Region, Ghana
            </div>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <div>
          © {new Date().getFullYear()} Kone Farms. All rights reserved.
        </div>
        <div className="footer-bottom-links">
          <a href="https://koneacademy.io" className="footer-link">Kone Academy</a>
        </div>
      </div>
    </footer>
  );
}
