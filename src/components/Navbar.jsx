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
        <a href="#agritech" className={`nav-link ${currentRoute === '#agritech' ? 'active' : ''}`}>Agritech</a>
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

      {/* Mobile Menu Overlay */}
      <nav className={`nav-menu-mobile ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#home" className={`nav-link ${currentRoute === '#home' ? 'active' : ''}`} onClick={closeMobileMenu}>Overview</a>
        <a href="#farms" className={`nav-link ${currentRoute === '#farms' ? 'active' : ''}`} onClick={closeMobileMenu}>Farms</a>
        <a href="#food" className={`nav-link ${currentRoute === '#food' ? 'active' : ''}`} onClick={closeMobileMenu}>Food</a>
        <a href="#agritech" className={`nav-link ${currentRoute === '#agritech' ? 'active' : ''}`} onClick={closeMobileMenu}>Agritech</a>
        <a href="https://koneacademy.io" className="back-btn-nav" style={{ marginTop: '1rem', justifyContent: 'center' }}>
          ⬅️ Back to Academy
        </a>
      </nav>
    </header>
  );
}
