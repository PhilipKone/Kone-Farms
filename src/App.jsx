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
import Market from './components/Market';
import ShitoPage from './components/ShitoPage';
import { getShitoProductBySlug } from './data/shitoProducts';

const routeMetadata = {
  '#home': {
    title: 'Kone Farms & Agritech | Sustainable Agriculture & Artisanal Foods',
    desc: 'Pioneering Sustainable Agriculture & Artisanal Foods Through Modern Agritech. Handcrafted Kone Chips and authentic Kone Shito, sourced directly from organic Ghanaian farmlands.',
    canonical: 'https://farms.koneacademy.io/',
    image: 'https://farms.koneacademy.io/og-image.png?v=4'
  },
  '#market': {
    title: 'Kone Market | Wholesale Produce, Cartons & Harvest | Kone Farms',
    desc: 'Official Kone Market storefront. Purchase wholesale cartons of Kone Shito & Kone Chips, or source organic bulk farm harvest.',
    canonical: 'https://farms.koneacademy.io/market',
    image: 'https://farms.koneacademy.io/assets/shito/supermarket/lineup-clean-branded.jpg'
  },
  '#farms': {
    title: 'Organic Farmlands & Fair-Trade Sourcing | Kone Farms',
    desc: 'Direct farming partnerships across Ghana cultivating Golden Plantain, White Yam, and Scotch Bonnet peppers under 100% fair-trade standards.',
    canonical: 'https://farms.koneacademy.io/farms',
    image: 'https://farms.koneacademy.io/og-image.png?v=4'
  },
  '#food': {
    title: 'Kone Chips & Artisanal Packaged Foods | Kone Farms',
    desc: 'Premium packaged food products featuring crisp kettle-cooked plantain, yam, and potato chips paired with authentic savory Kone Shito black pepper sauce.',
    canonical: 'https://farms.koneacademy.io/food',
    image: 'https://farms.koneacademy.io/assets/shito/supermarket/lineup-clean-branded.jpg'
  },
  '#agritech': {
    title: 'smartFarm IoT Architecture & Precision Agritech Blueprints | Kone Farms',
    desc: 'Open-source engineering and IoT blueprints for tropical agriculture. Researching solar telemetry, precision soil moisture sensing, and low-waste irrigation.',
    canonical: 'https://farms.koneacademy.io/agritech',
    image: 'https://farms.koneacademy.io/og-image.png?v=4'
  },
  '#blog': {
    title: 'Agritech Research & Scientific Whitepapers | Kone Farms Blog',
    desc: 'Publication-grade agritech research on Musa paradisiaca L. physiology, NPK sensor calibration, poultry environmental automation, and LoRa mesh networks.',
    canonical: 'https://farms.koneacademy.io/blog',
    image: 'https://farms.koneacademy.io/og-image.png?v=4'
  },
  '#sitemap': {
    title: 'Subdomain Architecture & Resource Directory | Kone Farms Sitemap',
    desc: 'Complete architectural directory and resource index of all Kone Farms division sections, research studies, IoT tools, and sister ecosystems.',
    canonical: 'https://farms.koneacademy.io/sitemap',
    image: 'https://farms.koneacademy.io/og-image.png?v=4'
  },
  '#shito': {
    title: 'Kone Shito | Authentic Ghanaian Black Pepper Sauce | Kone Farms',
    desc: 'Buy authentic artisanal Kone Shito hot pepper sauce online. Handcrafted smallholder Ghanaian sauce: Red Edition Scotch Bonnet, Coastal Blue Delta Prawn, Green Edition Kpakpo, and Collector Trio Boxes.',
    canonical: 'https://farms.koneacademy.io/food/shito',
    image: 'https://farms.koneacademy.io/assets/shito/supermarket/lineup-clean-branded.jpg'
  }
};

function resolveCurrentRoute() {
  const pathname = window.location.pathname.replace(/\/$/, '') || '';
  const hash = window.location.hash || '';
  const search = window.location.search || '';

  // Check path-based routing (e.g. /farms, /food, /agritech, /blog, /sitemap, /shito, /food/shito, /blog/:slug)
  if (pathname.startsWith('/blog/')) {
    const slug = pathname.replace('/blog/', '');
    return `#blog/${slug}`;
  }
  if (pathname === '/blog') return '#blog';
  if (pathname === '/farms') return '#farms';
  if (pathname === '/food') return '#food';

  // Shito direct product routes
  if (pathname.startsWith('/food/shito/') || pathname.startsWith('/shito/')) {
    const slug = pathname.replace(/^\/(food\/)?shito\//, '');
    if (slug) return `#shito/${slug}`;
    return '#shito';
  }

  if (pathname === '/shito' || pathname === '/food/shito') {
    const searchParams = new URLSearchParams(search);
    const productParam = searchParams.get('product');
    if (productParam) return `#shito/${productParam}`;
    return '#shito';
  }

  if (pathname === '/agritech') return '#agritech';
  if (pathname === '/market') return '#market';
  if (pathname === '/sitemap') return '#sitemap';

  // Fall back to hash routing
  if (hash.startsWith('#blog/')) return hash;
  if (hash.startsWith('#shito/')) return hash;
  if (hash === '#agritech/webapp') return '#agritech';
  if (hash === '#shito' || hash === '#food/shito') return '#shito';
  if (hash.startsWith('#market')) return '#market';
  if (hash.startsWith('#farms')) return '#farms';
  if (hash.startsWith('#food')) return '#food';
  if (hash.startsWith('#agritech')) return '#agritech';
  if (['#farms', '#food', '#agritech', '#market', '#blog', '#sitemap', '#shito'].includes(hash)) return hash;

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

    // Dynamic metadata update for specific shito product routes
    if (route.startsWith('#shito/')) {
      const slug = route.replace('#shito/', '');
      const product = getShitoProductBySlug(slug);
      if (product) {
        const productTitle = `Kone Shito ${product.name} (${product.weight}) | Kone Farms`;
        const canonical = `https://farms.koneacademy.io/food/shito/${product.slug}`;
        document.title = productTitle;
        const descEl = document.querySelector('meta[name="description"]');
        if (descEl) descEl.setAttribute('content', product.description);
        const canEl = document.querySelector('link[rel="canonical"]');
        if (canEl) canEl.setAttribute('href', canonical);
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', productTitle);
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', product.description);
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', canonical);
        const ogImg = document.querySelector('meta[property="og:image"]');
        if (ogImg) ogImg.setAttribute('content', product.ogImage);
        const ogImgSecure = document.querySelector('meta[property="og:image:secure_url"]');
        if (ogImgSecure) ogImgSecure.setAttribute('content', product.ogImage);
        const twTitle = document.querySelector('meta[property="twitter:title"]');
        if (twTitle) twTitle.setAttribute('content', productTitle);
        const twDesc = document.querySelector('meta[property="twitter:description"]');
        if (twDesc) twDesc.setAttribute('content', product.description);
        const twImg = document.querySelector('meta[property="twitter:image"]');
        if (twImg) twImg.setAttribute('content', product.ogImage);
        const twUrl = document.querySelector('meta[property="twitter:url"]');
        if (twUrl) twUrl.setAttribute('content', canonical);
        return;
      }
    }

    // Dynamic metadata update for base routes
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
      if (meta.image) {
        const ogImg = document.querySelector('meta[property="og:image"]');
        if (ogImg) ogImg.setAttribute('content', meta.image);
        const ogImgSecure = document.querySelector('meta[property="og:image:secure_url"]');
        if (ogImgSecure) ogImgSecure.setAttribute('content', meta.image);
        const twImg = document.querySelector('meta[property="twitter:image"]');
        if (twImg) twImg.setAttribute('content', meta.image);
      }
    }
  }, [route]);

  const renderContent = () => {
    if (route.startsWith('#blog/')) {
      const slug = route.replace('#blog/', '');
      return <BlogPost slug={slug} onBack={() => { window.location.hash = '#blog'; }} />;
    }

    if (route.startsWith('#shito')) {
      const productSlug = route.startsWith('#shito/') ? route.replace('#shito/', '') : null;
      return (
        <ShitoPage
          initialProductSlug={productSlug}
          onNavigateHome={() => { window.location.hash = '#home'; }}
        />
      );
    }

    switch (route) {
      case '#farms':
        return <Farms />;
      case '#food':
        return <Food />;
      case '#agritech':
        return <Agritech />;
      case '#market':
        return <Market />;
      case '#shito':
        return <ShitoPage onNavigateHome={() => { window.location.hash = '#home'; }} />;
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

