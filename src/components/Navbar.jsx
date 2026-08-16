import React, { useState } from 'react';
import './Navbar.css';

export default function Navbar({ currentRoute }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isAgritechActive = currentRoute === '#agritech' || currentRoute === '#agritech/webapp';

  return (
    <header className="farms-nav-header">
      <a href="#home" className="farms-brand" onClick={closeMobileMenu}>
        <img src="/logos/logo.svg" className="farms-logo" alt="Kone Farms Logo" />
        <span className="farms-brand-name">Kone Farms</span>
      </a>

      {/* Desktop Menu */}
      <nav className="nav-menu-desktop">
        <a href="#home" className={`nav-link ${currentRoute === '#home' ? 'active' : ''}`}>Overview</a>
        <a href="#farms" className={`nav-link ${currentRoute === '#farms' ? 'active' : ''}`}>Farms</a>
        <a href="#food" className={`nav-link ${currentRoute === '#food' ? 'active' : ''}`}>Food</a>
        <a href="#agritech" className={`nav-link ${isAgritechActive ? 'active' : ''}`}>Agritech</a>
        <a href="#agritech/webapp" className={`nav-link ${currentRoute === '#agritech/webapp' ? 'active' : ''}`} style={{ color: '#34d399', fontWeight: 800 }}>📱 PWA WebApp</a>
        <a href="#blog" className={`nav-link ${currentRoute.startsWith('#blog') ? 'active' : ''}`}>Blog</a>
        <a href="https://koneacademy.io" className="back-btn-nav">
          <svg className="back-arrow-svg" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Kone Academy
        </a>
      </nav>

      {/* Mobile Hamburger Toggle */}
      <button className="hamburger-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
        {mobileMenuOpen ? (
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>

      {/* Mobile Menu Backdrop Overlay */}
      <div 
        className={`nav-mobile-overlay ${mobileMenuOpen ? 'visible' : ''}`} 
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu Overlay */}
      <nav className={`nav-menu-mobile ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#home" className={`nav-link ${currentRoute === '#home' ? 'active' : ''}`} onClick={closeMobileMenu}>Overview</a>
        <a href="#farms" className={`nav-link ${currentRoute === '#farms' ? 'active' : ''}`} onClick={closeMobileMenu}>Farms</a>
        <a href="#food" className={`nav-link ${currentRoute === '#food' ? 'active' : ''}`} onClick={closeMobileMenu}>Food</a>
        <a href="#agritech" className={`nav-link ${currentRoute === '#agritech' ? 'active' : ''}`} onClick={closeMobileMenu}>Agritech Dashboard</a>
        <a href="#agritech/webapp" className={`nav-link ${currentRoute === '#agritech/webapp' ? 'active' : ''}`} onClick={closeMobileMenu} style={{ color: '#34d399', fontWeight: 800 }}>📱 Standalone PWA WebApp</a>
        <a href="#blog" className={`nav-link ${currentRoute.startsWith('#blog') ? 'active' : ''}`} onClick={closeMobileMenu}>Blog</a>
        <a href="https://koneacademy.io" className="back-btn-nav" style={{ marginTop: '1rem', justifyContent: 'center' }}>
          ⬅️ Back to Academy
        </a>
      </nav>

      {/* Mobile Floating Bottom Bar (Instagram Pill Style) */}
      <nav className="farms-mobile-bottom-nav">
        <a href="#home" className={`mobile-nav-item ${currentRoute === '#home' ? 'active' : ''}`} title="Overview">
          <div className="mobile-icon-pill">
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
        </a>
        <a href="#farms" className={`mobile-nav-item ${currentRoute === '#farms' ? 'active' : ''}`} title="Farms & Sourcing">
          <div className="mobile-icon-pill">
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        </a>
        <a href="#food" className={`mobile-nav-item ${currentRoute === '#food' ? 'active' : ''}`} title="Kone Shito Food">
          <div className="mobile-icon-pill">
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
        </a>
        <a href="#agritech/webapp" className={`mobile-nav-item ${isAgritechActive ? 'active' : ''}`} title="Smart Telemetry PWA">
          <div className="mobile-icon-pill">
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
              <rect x="9" y="9" width="6" height="6"></rect>
              <line x1="9" y1="1" x2="9" y2="4"></line>
              <line x1="15" y1="1" x2="15" y2="4"></line>
              <line x1="9" y1="20" x2="9" y2="23"></line>
              <line x1="15" y1="20" x2="15" y2="23"></line>
              <line x1="20" y1="9" x2="23" y2="9"></line>
              <line x1="20" y1="15" x2="23" y2="15"></line>
              <line x1="1" y1="9" x2="4" y2="9"></line>
              <line x1="1" y1="15" x2="4" y2="15"></line>
            </svg>
          </div>
        </a>
      </nav>
    </header>
  );
}
