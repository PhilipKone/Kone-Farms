import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Farms from './components/Farms';
import Food from './components/Food';
import Agritech from './components/Agritech';

export default function App() {
  const [route, setRoute] = useState(window.location.hash || '#home');

  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = window.location.hash;
      // Map empty hash to #home
      if (!currentHash || currentHash === '#') {
        setRoute('#home');
      } else if (['#home', '#farms', '#food', '#agritech'].includes(currentHash)) {
        setRoute(currentHash);
      } else {
        // Fallback for unrecognized hashes
        setRoute('#home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Perform initial evaluation
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Smoothly scroll back to top of screen on page/route transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route]);

  const renderContent = () => {
    switch (route) {
      case '#farms':
        return <Farms />;
      case '#food':
        return <Food />;
      case '#agritech':
        return <Agritech />;
      case '#home':
      default:
        return <Home />;
    }
  };

  return (
    <div className="farms-page-wrapper">
      <Navbar currentRoute={route} />
      <main className="farms-main-viewport">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}
