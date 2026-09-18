import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Farms from './components/Farms';
import Food from './components/Food';
import Agritech from './components/Agritech';
import Sitemap from './components/Sitemap';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';

const routeMetadata = {
  '#home': {
    title: 'Kone Farms & Agritech | Sustainable Agriculture & Artisanal Foods',
    desc: 'Pioneering Sustainable Agriculture & Artisanal Foods Through Modern Agritech. Handcrafted Kone Chips and authentic Kone Shito, sourced directly from organic Ghanaian farmlands.',
    canonical: 'https://farms.koneacademy.io/'
  },
  '#farms': {
    title: 'Organic Farmlands & Fair-Trade Sourcing | Kone Farms',
    desc: 'Direct farming partnerships across Ghana cultivating Golden Plantain, White Yam, and Scotch Bonnet peppers under 100% fair-trade standards.',
    canonical: 'https://farms.koneacademy.io/farms'
  },
  '#food': {
    title: 'Kone Chips & Artisanal Packaged Foods | Kone Farms',
    desc: 'Premium packaged food products featuring crisp kettle-cooked plantain, yam, and potato chips paired with authentic savory Kone Shito black pepper sauce.',
    canonical: 'https://farms.koneacademy.io/food'
  },
  '#agritech': {
    title: 'smartFarm IoT Telemetry & Precision Agriculture | Kone Farms',
    desc: 'Intelligent agricultural IoT telemetry. Real-time soil moisture sensors, weather stations, and automated solar drip irrigation calculators.',
    canonical: 'https://farms.koneacademy.io/agritech'
  },
  '#blog': {
    title: 'Agritech Research & Scientific Whitepapers | Kone Farms Blog',
    desc: 'Publication-grade agritech research on Musa paradisiaca L. physiology, NPK sensor calibration, poultry environmental automation, and LoRa mesh networks.',
    canonical: 'https://farms.koneacademy.io/blog'
  },
  '#sitemap': {
    title: 'Subdomain Architecture & Resource Directory | Kone Farms Sitemap',
    desc: 'Complete architectural directory and resource index of all Kone Farms division sections, research studies, IoT tools, and sister ecosystems.',
    canonical: 'https://farms.koneacademy.io/sitemap'
  }
};

function resolveCurrentRoute() {
  const pathname = window.location.pathname.replace(/\/$/, '') || '';
  const hash = window.location.hash || '';

  // Check path-based routing (e.g. /farms, /food, /agritech, /blog, /sitemap, /blog/:slug)
  if (pathname.startsWith('/blog/')) {
    const slug = pathname.replace('/blog/', '');
    return `#blog/${slug}`;
  }
  if (pathname === '/blog') return '#blog';
  if (pathname === '/farms') return '#farms';
  if (pathname === '/food') return '#food';
  if (pathname === '/agritech') return '#agritech';
  if (pathname === '/sitemap') return '#sitemap';

  // Fall back to hash routing
  if (hash.startsWith('#blog/')) return hash;
  if (hash === '#agritech/webapp') return '#agritech';
  if (['#farms', '#food', '#agritech', '#blog', '#sitemap'].includes(hash)) return hash;

  return '#home';
}

export default function App() {
  const [route, setRoute] = useState(resolveCurrentRoute);

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(resolveCurrentRoute());
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Dynamic metadata update for SEO and Google Sitelinks
    const meta = routeMetadata[route];
    if (meta) {
      document.title = meta.title;
      const descEl = document.querySelector('meta[name="description"]');
      if (descEl) descEl.setAttribute('content', meta.desc);
      const canEl = document.querySelector('link[rel="canonical"]');
      if (canEl) canEl.setAttribute('href', meta.canonical);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', meta.title);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', meta.desc);
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', meta.canonical);
    }
  }, [route]);

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
      <Navbar currentRoute={route} />
      <main className="farms-main-viewport">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

