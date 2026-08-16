import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Farms from './components/Farms';
import Food from './components/Food';
import Agritech from './components/Agritech';
import AgritechWebApp from './components/AgritechWebApp';
import Sitemap from './components/Sitemap';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';

export default function App() {
  const [route, setRoute] = useState(window.location.hash || '#home');

  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = window.location.hash;
      if (!currentHash || currentHash === '#') {
        setRoute('#home');
      } else if (currentHash.startsWith('#blog/')) {
        setRoute(currentHash);
      } else if (currentHash === '#agritech/webapp') {
        setRoute('#agritech/webapp');
      } else if (['#home', '#farms', '#food', '#agritech', '#blog', '#sitemap'].includes(currentHash)) {
        setRoute(currentHash);
      } else {
        setRoute('#home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route]);

  const isWebAppRoute = route === '#agritech/webapp';

  const renderContent = () => {
    if (route.startsWith('#blog/')) {
      const slug = route.replace('#blog/', '');
      return <BlogPost slug={slug} onBack={() => { window.location.hash = '#blog'; }} />;
    }

    switch (route) {
      case '#farms':
        return <Farms />;
      case '#food':
        return <Food />;
      case '#agritech/webapp':
        return <AgritechWebApp onBack={() => { window.location.hash = '#agritech'; }} />;
      case '#agritech':
        return <Agritech />;
      case '#blog':
        return <Blog onSelectArticle={(slug) => { window.location.hash = `#blog/${slug}`; }} />;
      case '#sitemap':
        return <Sitemap onBack={() => { window.location.hash = '#home'; }} />;
      case '#home':
      default:
        return <Home />;
    }
  };

  return (
    <div className="farms-page-wrapper">
      {!isWebAppRoute && <Navbar currentRoute={route} />}
      <main className="farms-main-viewport">
        {renderContent()}
      </main>
      {!isWebAppRoute && <Footer />}
    </div>
  );
}
