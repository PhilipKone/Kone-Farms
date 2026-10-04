import React, { useState, useEffect, useRef, useMemo } from 'react';
import './ShitoPage.css';
import {
  SUPERMARKET_PRODUCTS,
  PRODUCT_IMAGE_MAP,
  PRODUCT_GALLERY_MAP,
  getShitoProductBySlug,
  getShitoShareUrl,
  getShitoShareText
} from '../data/shitoProducts';

// Sanitizes and validates image URLs to prevent script injection / DOM-XSS
const sanitizeImgSrc = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('/') || /^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return '';
};

const getStaticProductImage = (id) => {
  return PRODUCT_IMAGE_MAP[id] || '/assets/shito/supermarket/red-clean-plain.jpg';
};

const getStaticGalleryImage = (id, index) => {
  const list = PRODUCT_GALLERY_MAP[id] || ['/assets/shito/supermarket/red-clean-plain.jpg'];
  return list[index] || list[0] || '/assets/shito/supermarket/red-clean-plain.jpg';
};

// ── SUPERMARKET AISLE DEPARTMENTS ───────────────────────────────────────────
const AISLE_TABS = [
  { id: 'all', name: 'All', count: 9 },
  { id: 'red', name: 'Red', count: 1 },
  { id: 'blue', name: 'Blue', count: 1 },
  { id: 'green', name: 'Green', count: 1 },
  { id: 'gold', name: 'Gold', count: 1 },
  { id: 'bundles', name: 'Sets', count: 3 },
  { id: 'wholesale', name: 'Wholesale', count: 2 }
];

export default function ShitoPage({ onNavigateHome, initialProductSlug }) {
  // Navigation & View Mode
  const [selectedAisle, setSelectedAisle] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'shelf'

  // Cart & Trolley State
  const [cartItems, setCartItems] = useState([
    {
      id: 'ks-red-250',
      name: 'Kone Shito Red (Fiery Black Gold)',
      price: 45.0,
      weight: '250g Jar',
      image: '/assets/shito/supermarket/red-studio-front.jpg',
      quantity: 1
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryZone, setDeliveryZone] = useState('accra_metro');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [customerNotes, setCustomerNotes] = useState('');

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Toast notification for link sharing
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimerRef = useRef(null);

  const showShareToast = (msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Sync initialProductSlug if directly opened via URL (e.g., /food/shito/red)
  useEffect(() => {
    if (initialProductSlug) {
      const target = getShitoProductBySlug(initialProductSlug);
      if (target) {
        setQuickViewProduct(target);
        setActivePhotoIdx(0);
      }
    } else {
      // Also inspect query string if ?product=...
      const params = new URLSearchParams(window.location.search);
      const queryProduct = params.get('product');
      if (queryProduct) {
        const target = getShitoProductBySlug(queryProduct);
        if (target) {
          setQuickViewProduct(target);
          setActivePhotoIdx(0);
        }
      }
    }
  }, [initialProductSlug]);

  // Sync URL and dynamic meta tags when quickViewProduct changes
  useEffect(() => {
    if (quickViewProduct) {
      const canonicalPath = `/food/shito/${quickViewProduct.slug}`;
      if (window.location.pathname !== canonicalPath) {
        window.history.replaceState(null, '', canonicalPath);
      }
      document.title = `Kone Shito ${quickViewProduct.name} (${quickViewProduct.weight}) | Kone Farms`;
      const descEl = document.querySelector('meta[name="description"]');
      if (descEl) descEl.setAttribute('content', quickViewProduct.description);
      const canEl = document.querySelector('link[rel="canonical"]');
      if (canEl) canEl.setAttribute('href', `https://farms.koneacademy.io${canonicalPath}`);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', `Kone Shito ${quickViewProduct.name} (${quickViewProduct.weight}) | Kone Farms`);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', quickViewProduct.description);
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', `https://farms.koneacademy.io${canonicalPath}`);
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute('content', quickViewProduct.ogImage);
      const ogImgSecure = document.querySelector('meta[property="og:image:secure_url"]');
      if (ogImgSecure) ogImgSecure.setAttribute('content', quickViewProduct.ogImage);
      const twImg = document.querySelector('meta[property="twitter:image"]');
      if (twImg) twImg.setAttribute('content', quickViewProduct.ogImage);
    } else {
      if (window.location.pathname.startsWith('/food/shito/') || window.location.pathname.startsWith('/shito/')) {
        window.history.replaceState(null, '', '/food/shito');
      }
      document.title = 'Kone Shito | Authentic Ghanaian Black Pepper Sauce | Kone Farms';
      const descEl = document.querySelector('meta[name="description"]');
      if (descEl) descEl.setAttribute('content', 'Buy authentic artisanal Kone Shito hot pepper sauce online. Handcrafted smallholder Ghanaian sauce.');
      const canEl = document.querySelector('link[rel="canonical"]');
      if (canEl) canEl.setAttribute('href', 'https://farms.koneacademy.io/food/shito');
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', 'Kone Shito | Authentic Ghanaian Black Pepper Sauce | Kone Farms');
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', 'https://farms.koneacademy.io/food/shito');
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute('content', 'https://farms.koneacademy.io/assets/shito/supermarket/lineup-clean-branded.jpg');
      const ogImgSecure = document.querySelector('meta[property="og:image:secure_url"]');
      if (ogImgSecure) ogImgSecure.setAttribute('content', 'https://farms.koneacademy.io/assets/shito/supermarket/lineup-clean-branded.jpg');
      const twImg = document.querySelector('meta[property="twitter:image"]');
      if (twImg) twImg.setAttribute('content', 'https://farms.koneacademy.io/assets/shito/supermarket/lineup-clean-branded.jpg');
    }
  }, [quickViewProduct]);

  // Social Sharing Actions
  const handleShareProduct = async (product, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!product) return;

    const shareUrl = getShitoShareUrl(product);
    const shareTitle = `Kone Shito ${product.name} (${product.weight})`;
    const shareText = `Check out Kone Shito ${product.name}: ${product.subtitle}.\nGH₵ ${product.price.toFixed(2)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        showShareToast(`✓ Link shared!`);
        return;
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        console.debug('Share API fallback to clipboard', err);
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showShareToast(`✓ Link copied! Preview will display the ${product.name} jar.`);
        return;
      } catch (err) {
        console.debug('Clipboard writeText failed', err);
      }
    }

    showShareToast(`Link: ${shareUrl}`);
  };

  const handleWhatsAppShare = (product, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!product) return;
    const shareUrl = getShitoShareUrl(product);
    const text = `Kone Shito ${product.name} (${product.weight}) — ${product.subtitle}\nGH₵ ${product.price.toFixed(2)}\n\nOrder here with thumbnail preview:\n${shareUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return SUPERMARKET_PRODUCTS.filter((prod) => {
      const matchesAisle = selectedAisle === 'all' || prod.aisle === selectedAisle;
      const matchesSearch =
        !searchQuery ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.ingredients.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesAisle && matchesSearch;
    });
  }, [selectedAisle, searchQuery]);

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const deliveryFee = useMemo(() => {
    if (cartSubtotal >= 250) return 0; // Free delivery threshold
    if (deliveryZone === 'pickup') return 0;
    if (deliveryZone === 'accra_metro') return 20;
    if (deliveryZone === 'greater_accra') return 30;
    if (deliveryZone === 'regional_hubs') return 45;
    return 20;
  }, [cartSubtotal, deliveryZone]);

  const cartGrandTotal = cartSubtotal + deliveryFee;

  // Cart Operations
  const addToCart = (product, quantityToAdd = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
        );
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.shortName || product.name,
            price: product.price,
            weight: product.weight,
            image: product.primaryImage,
            quantity: quantityToAdd
          }
        ];
      }
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (id, delta) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // WhatsApp Express Supermarket Order
  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    const orderId = `KS-${Math.floor(10000 + Math.random() * 90000)}`;
    const zoneLabels = {
      accra_metro: 'Accra Metro Express (GH₵ 20)',
      greater_accra: 'Greater Accra Hub (GH₵ 30)',
      regional_hubs: 'Kumasi / Takoradi Regional (GH₵ 45)',
      pickup: 'Supermarket Pickup at Kone Hub (FREE)'
    };

    let msg = `🛒 *KONE SHITO SUPERMARKET ORDER* 🛒\n`;
    msg += `*Order Reference:* #${orderId}\n`;
    msg += `--------------------------------\n`;

    cartItems.forEach((item, index) => {
      msg += `${index + 1}. *${item.name}*\n   Qty: ${item.quantity} | GH₵ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    msg += `--------------------------------\n`;
    msg += `*Subtotal:* GH₵ ${cartSubtotal.toFixed(2)}\n`;
    msg += `*Delivery:* ${deliveryFee === 0 ? 'FREE (Supermarket Promo)' : `GH₵ ${deliveryFee.toFixed(2)} (${zoneLabels[deliveryZone]})`}\n`;
    msg += `*TOTAL AMOUNT:* GH₵ ${cartGrandTotal.toFixed(2)}\n`;
    msg += `--------------------------------\n`;
    msg += `*Customer:* ${customerName.trim() || 'Valued Customer'}\n`;
    msg += `*Phone:* ${customerPhone.trim() || 'Provided on WhatsApp'}\n`;
    msg += `*Delivery Location:* ${deliveryAddress.trim() || 'Accra Metro'}\n`;
    msg += `*Payment Preference:* ${paymentMethod.toUpperCase()}\n`;
    if (customerNotes.trim()) {
      msg += `*Notes:* ${customerNotes.trim()}\n`;
    }
    msg += `--------------------------------\n`;
    msg += `Please confirm fresh batch availability and dispatch time! 🚀`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/233551993820?text=${encoded}`, '_blank');
  };



  return (
    <div className="supermarket-page-root">
      {/* ── STORE HEADER & AISLE CONTROLS ─────────────────────────────────── */}
      <header className="supermarket-store-header">
        <div className="supermarket-header-container">

          <div className="store-headline-group">
            <h1 className="supermarket-main-title">
              Kone <span className="title-accent">Shito</span>
            </h1>
          </div>

          {/* Search & View Mode Toggle */}
          <div className="supermarket-search-bar-wrap">
            <div className="supermarket-search-input-box">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="supermarket-search-field"
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  ✕
                </button>
              )}
            </div>

            {/* View Mode Segmented Controls */}
            <div className="supermarket-view-toggle">
              <button
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>Grid</span>
              </button>

              <button
                className={`view-toggle-btn ${viewMode === 'shelf' ? 'active' : ''}`}
                onClick={() => setViewMode('shelf')}
                title="Shelf View"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
                <span>Shelf</span>
              </button>
            </div>
          </div>

          {/* Department / Aisle Selector Pills */}
          <nav className="supermarket-aisles-nav">
            {AISLE_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`aisle-pill-btn ${selectedAisle === tab.id ? 'active' : ''}`}
                onClick={() => setSelectedAisle(tab.id)}
              >
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── MAIN CONTENT AREA ────────────────────────────────────────────── */}
      <main className="supermarket-main-content">
        {/* VIEW MODE 1: SUPERMARKET AISLE GRID (Default) */}
        {viewMode === 'grid' && (
          <div className="supermarket-catalog-container">

            <div className="supermarket-products-grid">
              {filteredProducts.map((product) => (
                <article key={product.id} className="supermarket-card">
                  {/* Product Image Frame */}
                  <div className="card-image-chassis" onClick={() => setQuickViewProduct(product)}>
                    <img
                      src={getStaticProductImage(product.id)}
                      alt={product.name}
                      className="supermarket-product-photo"
                      loading="lazy"
                    />
                    <button
                      className="card-quick-share-btn"
                      onClick={(e) => handleShareProduct(product, e)}
                      title={`Share ${product.name} with specific preview`}
                      aria-label={`Share ${product.name}`}
                    >
                      <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16 6 12 2 8 6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                      </svg>
                    </button>
                  </div>

                  {/* Product Details Section */}
                  <div className="card-info-section">
                    <div className="card-header-row">
                      <h3 className="product-card-title" onClick={() => setQuickViewProduct(product)}>
                        {product.name}
                      </h3>
                      <span className="card-weight-tag">{product.weight}</span>
                    </div>
                    <p className="product-card-subtitle">{product.subtitle}</p>

                    {/* Pricing & Add to Basket */}
                    <div className="card-price-shelf-row">
                      <div className="price-tag-block">
                        <span className="currency-symbol">GH₵</span>
                        <span className="price-amount">{product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="original-price-strike">GH₵ {product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>

                      <button
                        className="add-to-trolley-btn"
                        onClick={() => addToCart(product, 1)}
                        title="Add to Basket"
                      >
                        + Cart
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* VIEW MODE 2: REALISTIC SUPERMARKET WOODEN SHELVES */}
        {viewMode === 'shelf' && (
          <div className="supermarket-shelf-view-container animate-fade-in">
            {/* SHELF TIER 1: SINGLE JAR ARTISANAL FLAVORS */}
            <div className="supermarket-rack-tier">
              <div className="rack-tier-header">
                <span className="tier-tag">01 · Single Jars</span>
              </div>

              <div className="shelf-items-row">
                {SUPERMARKET_PRODUCTS.filter((p) => ['ks-red-250', 'ks-blue-250', 'ks-green-250', 'ks-gold-250'].includes(p.id)).map(
                  (product) => (
                    <div key={product.id} className="shelf-product-unit">
                      <div className="shelf-jar-wrapper" onClick={() => setQuickViewProduct(product)}>
                        <img src={getStaticProductImage(product.id)} alt={product.name} className="shelf-jar-img" />
                      </div>

                      {/* Shelf Talker Price Plate */}
                      <div className="shelf-talker-plate">
                        <div className="talker-name">{product.shortName}</div>
                        <div className="talker-weight">{product.weight}</div>
                        <div className="talker-bottom">
                          <span className="talker-price">GH₵ {product.price.toFixed(2)}</span>
                          <div className="talker-action-group">
                            <button
                              className="talker-share-btn"
                              onClick={(e) => handleShareProduct(product, e)}
                              title={`Share ${product.name}`}
                              aria-label={`Share ${product.name}`}
                            >
                              <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                <polyline points="16 6 12 2 8 6"></polyline>
                                <line x1="12" y1="2" x2="12" y2="15"></line>
                              </svg>
                            </button>
                            <button className="talker-add-btn" onClick={() => addToCart(product, 1)}>
                              + Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="wooden-shelf-plank">
                <div className="plank-wood-grain"></div>
                <div className="plank-metal-lip"></div>
              </div>
            </div>

            {/* SHELF TIER 2: PANTRY BUNDLES & GIFT BOXES */}
            <div className="supermarket-rack-tier">
              <div className="rack-tier-header">
                <span className="tier-tag">02 · Collections & Sets</span>
              </div>

              <div className="shelf-items-row bundles-row">
                {SUPERMARKET_PRODUCTS.filter((p) => p.aisle === 'bundles').map((product) => (
                  <div key={product.id} className="shelf-product-unit bundle-unit">
                    <div className="shelf-jar-wrapper bundle-wrapper" onClick={() => setQuickViewProduct(product)}>
                      <img src={getStaticProductImage(product.id)} alt={product.name} className="shelf-bundle-img" />
                    </div>

                    <div className="shelf-talker-plate">
                      <div className="talker-name">{product.shortName}</div>
                      <div className="talker-weight">{product.weight}</div>
                      <div className="talker-bottom">
                        <span className="talker-price">GH₵ {product.price.toFixed(2)}</span>
                        <div className="talker-action-group">
                          <button
                            className="talker-share-btn"
                            onClick={(e) => handleShareProduct(product, e)}
                            title={`Share ${product.name}`}
                            aria-label={`Share ${product.name}`}
                          >
                            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none">
                              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                              <polyline points="16 6 12 2 8 6"></polyline>
                              <line x1="12" y1="2" x2="12" y2="15"></line>
                            </svg>
                          </button>
                          <button className="talker-add-btn" onClick={() => addToCart(product, 1)}>
                            + Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="wooden-shelf-plank">
                <div className="plank-wood-grain"></div>
                <div className="plank-metal-lip"></div>
              </div>
            </div>

            {/* SHELF TIER 3: WHOLESALE MASTER CARTONS */}
            <div className="supermarket-rack-tier">
              <div className="rack-tier-header">
                <span className="tier-tag">03 · Bulk Wholesale</span>
              </div>

              <div className="shelf-items-row wholesale-row">
                {SUPERMARKET_PRODUCTS.filter((p) => p.aisle === 'wholesale').map((product) => (
                  <div key={product.id} className="shelf-product-unit wholesale-unit">
                    <div className="shelf-jar-wrapper wholesale-wrapper" onClick={() => setQuickViewProduct(product)}>
                      <img src={getStaticProductImage(product.id)} alt={product.name} className="shelf-wholesale-img" />
                    </div>

                    <div className="shelf-talker-plate">
                      <div className="talker-name">{product.shortName}</div>
                      <div className="talker-weight">{product.weight}</div>
                      <div className="talker-bottom">
                        <span className="talker-price">GH₵ {product.price.toFixed(2)}</span>
                        <div className="talker-action-group">
                          <button
                            className="talker-share-btn"
                            onClick={(e) => handleShareProduct(product, e)}
                            title={`Share ${product.name}`}
                            aria-label={`Share ${product.name}`}
                          >
                            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none">
                              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                              <polyline points="16 6 12 2 8 6"></polyline>
                              <line x1="12" y1="2" x2="12" y2="15"></line>
                            </svg>
                          </button>
                          <button className="talker-add-btn" onClick={() => addToCart(product, 1)}>
                            + Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="wooden-shelf-plank">
                <div className="plank-wood-grain"></div>
                <div className="plank-metal-lip"></div>
              </div>
            </div>
          </div>
        )}


        {/* ── KITCHEN PHOTOSHOOT WALL ("The Kitchen Archive") ─────────────── */}
        <section className="supermarket-photoshoot-section">
          <div className="section-title-wrap">
            <h2 className="section-heading">The Kitchen Archive</h2>
          </div>

          <div className="photoshoot-masonry-row">
            <div className="photo-wall-card">
              <img src="/assets/shito/supermarket/lineup-all-4-jars.jpg" alt="All 4 Flagship Shito Jars" loading="lazy" />
            </div>
            <div className="photo-wall-card">
              <img src="/assets/shito/supermarket/red-jar-shelf-1.jpg" alt="Red Jar" loading="lazy" />
            </div>
            <div className="photo-wall-card">
              <img src="/assets/shito/supermarket/blue-jar-table.jpg" alt="Blue Jar" loading="lazy" />
            </div>
            <div className="photo-wall-card">
              <img src="/assets/shito/supermarket/green-jar-table.jpg" alt="Green Jar" loading="lazy" />
            </div>
            <div className="photo-wall-card">
              <img src="/assets/shito/supermarket/lineup-supermarket-stack.jpg" alt="Master Stacks" loading="lazy" />
            </div>
          </div>
        </section>
      </main>

      {/* ── FLOATING TROLLEY WIDGET ───────────────────────────────────────── */}
      <div className="floating-trolley-dock">
        <button className="trolley-trigger-btn" onClick={() => setIsCartOpen(true)}>
          <div className="trolley-icon-wrap">
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="trolley-count-pill">{cartCount}</span>
          </div>
          <div className="trolley-meta-wrap">
            <span className="trolley-label">Your Basket</span>
            <span className="trolley-total">GH₵ {cartGrandTotal.toFixed(2)}</span>
          </div>
          <span className="trolley-chevron">➔</span>
        </button>
      </div>

      {/* ── SLIDE-OVER SUPERMARKET BASKET DRAWER ──────────────────────────── */}
      {isCartOpen && (
        <div className="cart-drawer-backdrop" onClick={() => setIsCartOpen(false)}>
          <aside className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className="cart-drawer-header">
              <div className="drawer-title-group">
                <h3>Supermarket Trolley</h3>
                <span className="items-count-tag">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
              </div>
              <button className="drawer-close-btn" onClick={() => setIsCartOpen(false)}>
                ✕
              </button>
            </div>

            {/* Scrollable Items List */}
            <div className="cart-drawer-items-list">
              {cartItems.length === 0 ? (
                <div className="empty-cart-state">
                  <div className="empty-cart-icon">🛒</div>
                  <h4>Your Supermarket Basket is Empty</h4>
                  <p>Explore our aisles to pick up your favorite Kone Shito jars!</p>
                  <button className="empty-shop-btn" onClick={() => setIsCartOpen(false)}>
                    Browse Aisles
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="cart-item-row">
                    <img src={getStaticProductImage(item.id)} alt={item.name} className="cart-item-thumbnail" />
                    <div className="cart-item-info">
                      <div className="cart-item-title-row">
                        <span className="cart-item-name">{item.name}</span>
                        <button
                          className="cart-remove-btn"
                          onClick={() => removeFromCart(item.id)}
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                      <span className="cart-item-weight">{item.weight}</span>
                      <div className="cart-item-controls-row">
                        <div className="cart-stepper">
                          <button onClick={() => updateCartQty(item.id, -1)}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateCartQty(item.id, 1)}>+</button>
                        </div>
                        <span className="cart-item-line-price">
                          GH₵ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Receipt Summary & Delivery Selection */}
            {cartItems.length > 0 && (
              <div className="cart-drawer-footer">
                <div className="cart-receipt-breakdown">
                  <div className="receipt-row">
                    <span>Items Subtotal:</span>
                    <span>GH₵ {cartSubtotal.toFixed(2)}</span>
                  </div>

                  {/* Delivery Destination Selector */}
                  <div className="delivery-selection-block">
                    <label className="delivery-label">Delivery Destination:</label>
                    <select
                      value={deliveryZone}
                      onChange={(e) => setDeliveryZone(e.target.value)}
                      className="delivery-select-dropdown"
                    >
                      <option value="accra_metro">Accra Metro Express (Airport, Osu, Cantonments, Dzorwulu) — GH₵ 20</option>
                      <option value="greater_accra">Greater Accra (East Legon, Spintex, Tema, Madina) — GH₵ 30</option>
                      <option value="regional_hubs">Regional Hubs (Kumasi, Takoradi, Cape Coast) — GH₵ 45</option>
                      <option value="pickup">Self Pickup at Kone Farms Accra Hub — FREE</option>
                    </select>
                  </div>

                  <div className="receipt-row">
                    <span>Delivery Fee:</span>
                    <span className={deliveryFee === 0 ? 'free-promo-text' : ''}>
                      {deliveryFee === 0 ? 'FREE (Special Promo)' : `GH₵ ${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="receipt-row grand-total-row">
                    <strong>Total Payable:</strong>
                    <strong>GH₵ {cartGrandTotal.toFixed(2)}</strong>
                  </div>
                </div>

                {/* Customer Checkout Form */}
                <div className="customer-info-inputs">
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Kofi Mensah)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="customer-field"
                  />
                  <input
                    type="tel"
                    placeholder="Phone / WhatsApp Number (e.g. 055 199 3820)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="customer-field"
                  />
                  <input
                    type="text"
                    placeholder="Delivery Address / Landmark (e.g. Near A&C Mall, East Legon)"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="customer-field"
                  />

                  <div className="payment-preference-row">
                    <label>Payment Method:</label>
                    <div className="payment-chips">
                      <button
                        className={`payment-chip ${paymentMethod === 'momo' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('momo')}
                      >
                        📱 MTN / Telecel MoMo
                      </button>
                      <button
                        className={`payment-chip ${paymentMethod === 'cash' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('cash')}
                      >
                        💵 Cash on Delivery
                      </button>
                    </div>
                  </div>
                </div>

                {/* Primary WhatsApp Dispatch Action */}
                <button className="supermarket-checkout-btn" onClick={handleWhatsAppCheckout}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>Checkout via WhatsApp (Instant Dispatch)</span>
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* ── QUICK LOOK / PRODUCT INSPECTION MODAL ─────────────────────────── */}
      {quickViewProduct && (
        <div className="quickview-modal-backdrop" onClick={() => setQuickViewProduct(null)}>
          <div className="quickview-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="quickview-close-btn" onClick={() => setQuickViewProduct(null)}>
              ✕
            </button>

            <div className="quickview-modal-grid">
              {/* Left Column: Clean Studio Photo Gallery */}
              <div className="quickview-photos-column">
                <div className="quickview-main-image-wrap">
                  <img
                    src={getStaticGalleryImage(quickViewProduct.id, activePhotoIdx)}
                    alt={quickViewProduct.name}
                    className="quickview-main-img"
                  />
                </div>

                <div className="quickview-thumbnails-row">
                  {quickViewProduct.galleryImages.slice(0, 4).map((photo, i) => (
                    <button
                      key={i}
                      className={`thumbnail-btn ${activePhotoIdx === i ? 'active' : ''}`}
                      onClick={() => setActivePhotoIdx(i)}
                    >
                      <img src={getStaticGalleryImage(quickViewProduct.id, i)} alt="" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Editorial Product Details */}
              <div className="quickview-info-column">
                <h2 className="quickview-title">{quickViewProduct.name}</h2>
                <div className="quickview-price-line">
                  <span className="price-big">GH₵ {quickViewProduct.price.toFixed(2)}</span>
                  <span className="unit-label">· {quickViewProduct.weight}</span>
                </div>

                <p className="quickview-desc">{quickViewProduct.description}</p>

                {/* Key Provenance & Ingredients */}
                <div className="quickview-editorial-block">
                  <div className="editorial-row">
                    <span className="editorial-label">Ingredients</span>
                    <span className="editorial-val">{quickViewProduct.ingredients}</span>
                  </div>
                  <div className="editorial-row">
                    <span className="editorial-label">Heat Profile</span>
                    <span className="editorial-val">{quickViewProduct.heatRating}</span>
                  </div>
                  <div className="editorial-row">
                    <span className="editorial-label">Pairings</span>
                    <span className="editorial-val">{quickViewProduct.pairings.join(', ')}</span>
                  </div>
                </div>

                {/* Refined Action Row */}
                <div className="quickview-actions-row">
                  <button
                    className="modal-add-cart-btn"
                    onClick={() => {
                      addToCart(quickViewProduct, 1);
                      setQuickViewProduct(null);
                    }}
                  >
                    Add to Cart — GH₵ {quickViewProduct.price.toFixed(2)}
                  </button>

                  <button
                    className="modal-share-btn"
                    onClick={(e) => handleShareProduct(quickViewProduct, e)}
                    title={`Share ${quickViewProduct.name} (with ${quickViewProduct.name} preview)`}
                    aria-label={`Share ${quickViewProduct.name}`}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                    <span>Share</span>
                  </button>

                  <button
                    className="modal-whatsapp-share-btn"
                    onClick={(e) => handleWhatsAppShare(quickViewProduct, e)}
                    title={`Share ${quickViewProduct.name} directly on WhatsApp`}
                    aria-label={`Share ${quickViewProduct.name} on WhatsApp`}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.07l-.29-.17-3.02.79.81-2.94-.19-.31c-.78-1.29-1.19-2.77-1.19-4.3 0-4.54 3.7-8.24 8.24-8.24m4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.61c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29" />
                    </svg>
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Share Toast Notification */}
      {toastMessage && (
        <div className="shito-share-toast" role="status" aria-live="polite">
          <div className="toast-pill">
            <span className="toast-icon">✓</span>
            <span className="toast-msg">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
