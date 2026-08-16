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
          <h3 className="footer-h4">Explore</h3>
          <div className="footer-links">
            <a href="#home" className="footer-link">Overview</a>
            <a href="#farms" className="footer-link">Farms & Sourcing</a>
            <a href="#food" className="footer-link">Kone Shito Sauce</a>
            <a href="#agritech" className="footer-link">Smart Telemetry</a>
            <a href="#blog" className="footer-link">Agritech Research Blog</a>
            <a href="#sitemap" className="footer-link" style={{ fontWeight: 'bold', color: '#34d399' }}>Subdomain Sitemap</a>
          </div>
        </div>

        {/* Ecosystem Column */}
        <div className="footer-links-col">
          <h3 className="footer-h4">Ecosystem</h3>
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

        {/* Community & Social Column */}
        <div className="footer-links-col">
          <h3 className="footer-h4">Community & Social</h3>
          <div className="footer-social-list">
            <a 
              href="https://whatsapp.com/channel/0029Vb89rkTE50Ugks0LIG0L" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-pill whatsapp-pill"
              title="Join Kone Farms WhatsApp Channel"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>

            <a 
              href="https://www.linkedin.com/showcase/konefarms/about/?viewAsMember=true" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-pill linkedin-pill"
              title="Follow Kone Farms on LinkedIn"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
              LinkedIn
            </a>

            <a 
              href="https://www.facebook.com/profile.php?id=61593017477470" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-pill facebook-pill"
              title="Follow Kone Farms on Facebook"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>

            <a 
              href="https://www.instagram.com/konefarms/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-pill instagram-pill"
              title="Follow Kone Farms on Instagram"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </a>
          </div>

          <div className="footer-info-item" style={{ marginTop: '0.5rem' }}>
            📍 <strong>Accra Office:</strong><br />
            Kone Code Academy, Accra, Ghana
          </div>
          <div className="footer-info-item">
            🌾 <strong>Farming Partner Districts:</strong><br />
            Volta Region, Ghana
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <div>
          © {new Date().getFullYear()} Kone Farms. All rights reserved.
        </div>
        <div className="footer-bottom-links">
          <a href="https://www.linkedin.com/showcase/konefarms/about/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
          <a href="https://www.facebook.com/profile.php?id=61593017477470" target="_blank" rel="noopener noreferrer" className="footer-link">Facebook</a>
          <a href="https://www.instagram.com/konefarms/" target="_blank" rel="noopener noreferrer" className="footer-link">Instagram</a>
          <a href="https://whatsapp.com/channel/0029Vb89rkTE50Ugks0LIG0L" target="_blank" rel="noopener noreferrer" className="footer-link">WhatsApp</a>
          <a href="https://koneacademy.io" className="footer-link">Kone Academy</a>
        </div>
      </div>
    </footer>
  );
}
