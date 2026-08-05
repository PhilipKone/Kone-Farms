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
            <a href="#sitemap" className="footer-link" style={{ fontWeight: 'bold', color: '#39ff14' }}>Subdomain Sitemap</a>
          </div>
        </div>

        {/* Ecosystem Column */}
        <div className="footer-links-col">
          <h4 className="footer-h4">Ecosystem</h4>
          <div className="footer-links">
            <a href="https://www.koneacademy.io" className="footer-link">Academy Home</a>
            <a href="https://www.koneacademy.io/sitemap" className="footer-link">Sitemap</a>
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

        {/* Contact/Social Column */}
        <div className="footer-links-col">
          <h4 className="footer-h4">Community & Contact</h4>
          <div className="footer-social-info" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <a 
              href="https://whatsapp.com/channel/0029Vb89rkTE50Ugks0LIG0L" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                background: 'rgba(57, 255, 20, 0.12)',
                border: '1px solid rgba(57, 255, 20, 0.3)',
                color: '#39ff14',
                padding: '0.45rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 'bold',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                width: 'fit-content'
              }}
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Channel
            </a>
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
