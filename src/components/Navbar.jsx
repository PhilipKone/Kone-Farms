import React, { useState } from 'react';
import './Navbar.css';
import PepperIcon from './PepperIcon';

export default function Navbar({ currentRoute }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isAgritechActive = currentRoute === '#agritech';

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
        
        {/* Market Dropdown Wrapper */}
        <div className="nav-market-dropdown-wrap">
          <a href="#market" className={`nav-link nav-market-link ${currentRoute === '#market' || currentRoute === '#shito' ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px', verticalAlign: '-2px' }}>
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            Market
            <svg className="nav-chevron-icon" viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px', verticalAlign: 'middle' }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </a>
          <div className="nav-market-dropdown-menu">
            <a href="#market?category=agritech" className="dropdown-item">
              <span className="dropdown-item-title">Agritech Products</span>
              <span className="dropdown-item-desc">Solar IoT telemetry, soil NPK probes & automated valves</span>
            </a>
            <a href="#market?category=produce" className="dropdown-item">
              <span className="dropdown-item-title">Farm Produce</span>
              <span className="dropdown-item-desc">Organic Musa plantains, white yam tubers & peppers</span>
            </a>
            <a href="#market?category=food" className="dropdown-item">
              <span className="dropdown-item-title">Food Products</span>
              <span className="dropdown-item-desc">Kone Chips snack cartons & wholesale bundles</span>
            </a>
            <a href="#shito" className={`dropdown-item dropdown-shito-item ${currentRoute === '#shito' ? 'active' : ''}`}>
              <span className="dropdown-item-title">
                <PepperIcon size={14} style={{ marginRight: '6px' }} />
                Shito Supermarket
              </span>
              <span className="dropdown-item-desc">Dedicated aisle: 4 editions, heat ratings & gift sets</span>
            </a>
          </div>
        </div>

        <a href="#blog" className={`nav-link ${currentRoute.startsWith('#blog') ? 'active' : ''}`}>Blog</a>
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
        <a href="#agritech" className={`nav-link ${currentRoute === '#agritech' ? 'active' : ''}`} onClick={closeMobileMenu}>Agritech</a>
        
        {/* Market Section in Mobile with nested Shito */}
        <div className="mobile-nav-group">
          <a href="#market" className={`nav-link nav-market-link ${currentRoute === '#market' ? 'active' : ''}`} onClick={closeMobileMenu}>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: '-2px' }}>
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            Kone Market
          </a>
          <div className="mobile-nav-sublinks">
            <a href="#market?category=agritech" className="nav-sublink" onClick={closeMobileMenu}>
              Agritech Products
            </a>
            <a href="#market?category=produce" className="nav-sublink" onClick={closeMobileMenu}>
              Farm Produce
            </a>
            <a href="#market?category=food" className="nav-sublink" onClick={closeMobileMenu}>
              Food Products
            </a>
            <a href="#shito" className={`nav-sublink ${currentRoute === '#shito' ? 'active' : ''}`} onClick={closeMobileMenu}>
              <PepperIcon size={14} style={{ marginRight: '6px' }} />
              Shito Supermarket
            </a>
          </div>
        </div>

        <a href="#blog" className={`nav-link ${currentRoute.startsWith('#blog') ? 'active' : ''}`} onClick={closeMobileMenu}>Blog</a>
        <a href="#sitemap" className={`nav-link ${currentRoute === '#sitemap' ? 'active' : ''}`} onClick={closeMobileMenu}>Sitemap</a>
      </nav>

      {/* Mobile Floating Bottom Bar (6 Core Destinations with Labels) */}
      <nav className="farms-mobile-bottom-nav">
        <a href="#home" className={`mobile-nav-item ${currentRoute === '#home' ? 'active' : ''}`} title="Overview">
          <div className="mobile-icon-pill">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span className="mobile-nav-label">Overview</span>
        </a>
        <a href="#farms" className={`mobile-nav-item ${currentRoute === '#farms' ? 'active' : ''}`} title="Farms">
          <div className="mobile-icon-pill">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <span className="mobile-nav-label">Farms</span>
        </a>
        <a href="#food" className={`mobile-nav-item ${currentRoute === '#food' ? 'active' : ''}`} title="Food">
          <div className="mobile-icon-pill">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2v20"></path>
              <path d="M21 2v6a3 3 0 0 1-3 3"></path>
              <path d="M6 2v7"></path>
              <path d="M3 2v4a3 3 0 0 0 6 0V2"></path>
              <path d="M6 9v13"></path>
            </svg>
          </div>
          <span className="mobile-nav-label">Food</span>
        </a>
        <a href="#agritech" className={`mobile-nav-item ${isAgritechActive ? 'active' : ''}`} title="Agritech">
          <div className="mobile-icon-pill">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
              <rect x="9" y="9" width="6" height="6"></rect>
              <line x1="9" y1="2" x2="9" y2="4"></line>
              <line x1="15" y1="2" x2="15" y2="4"></line>
              <line x1="9" y1="20" x2="9" y2="22"></line>
              <line x1="15" y1="20" x2="15" y2="22"></line>
              <line x1="20" y1="9" x2="22" y2="9"></line>
              <line x1="20" y1="15" x2="22" y2="15"></line>
              <line x1="2" y1="9" x2="4" y2="9"></line>
              <line x1="2" y1="15" x2="4" y2="15"></line>
            </svg>
          </div>
          <span className="mobile-nav-label">Agritech</span>
        </a>
        <a href="#market" className={`mobile-nav-item ${currentRoute === '#market' || currentRoute === '#shito' ? 'active' : ''}`} title="Kone Market">
          <div className="mobile-icon-pill">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <span className="mobile-nav-label">Market</span>
        </a>
        <a href="#blog" className={`mobile-nav-item ${currentRoute.startsWith('#blog') ? 'active' : ''}`} title="Research Blog">
          <div className="mobile-icon-pill">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              <line x1="8" y1="7" x2="16" y2="7"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <span className="mobile-nav-label">Blog</span>
        </a>
      </nav>
    </header>
  );
}
