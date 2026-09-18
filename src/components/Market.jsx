import React, { useState, useMemo } from 'react';
import './Market.css';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

export default function Market() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProductLine, setSelectedProductLine] = useState('chips');
  const [orderQuantity, setOrderQuantity] = useState(5);
  
  // Wholesaler application / direct order state
  const [distributorName, setDistributorName] = useState('');
  const [distributorEmail, setDistributorEmail] = useState('');
  const [distributorPhone, setDistributorPhone] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Modal states for Bulk Harvest and Hardware Inquiries
  const [activeModal, setActiveModal] = useState(null); // 'harvest' | 'hardware' | null
  const [modalItem, setModalItem] = useState(null);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryContact, setInquiryContact] = useState('');
  const [inquiryVolume, setInquiryVolume] = useState('500kg - 1 Metric Ton');
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Pricing configuration for packaged wholesale lines
  const pricingConfig = {
    chips: {
      name: 'Kone Chips (Cartons of 24 Pouches - 150g)',
      unitName: 'Carton of 24 Pouches (150g)',
      basePrice: 140,
      itemLabel: 'Cartons (24 packs each)',
      suggestedRetailPerUnit: 8.0,
      unitsPerBox: 24,
      shippingFlat: 20
    },
    shito: {
      name: 'Kone Shito (Boxes of 12 Jars - 350g)',
      unitName: 'Box of 12 Jars (350g)',
      basePrice: 180,
      itemLabel: 'Boxes (12 jars each)',
      suggestedRetailPerUnit: 20.0,
      unitsPerBox: 12,
      shippingFlat: 25
    },
    combo: {
      name: 'Merchant Starter Pallet (12 Jars Shito + 12 Chip Pouches)',
      unitName: 'Merchant Starter Pallet (12 Jars + 12 Chips)',
      basePrice: 220,
      itemLabel: 'Combo Pallets',
      suggestedRetailPerUnit: 14.0,
      unitsPerBox: 24,
      shippingFlat: 25
    }
  };

  const activePricing = pricingConfig[selectedProductLine] || pricingConfig.chips;

  const currentTier = useMemo(() => {
    let discountPercent = 0;
    let shipping = activePricing.shippingFlat;

    if (orderQuantity >= 10) {
      discountPercent = 0.10;
      shipping = 0;
    } else if (orderQuantity >= 5) {
      discountPercent = 0.05;
    }

    const pricePerUnit = Math.round(activePricing.basePrice * (1 - discountPercent));
    const label = orderQuantity >= 10
      ? 'Wholesale Tier 2 (10% Off + Free Shipping)'
      : orderQuantity >= 5
      ? 'Wholesale Tier 1 (5% Off)'
      : 'Standard Stockist Tier';

    return { discountPercent, shipping, price: pricePerUnit, label };
  }, [orderQuantity, activePricing]);

  const totalCost = (currentTier.price * orderQuantity) + currentTier.shipping;
  const totalUnits = orderQuantity * activePricing.unitsPerBox;
  const estimatedRetailRevenue = totalUnits * activePricing.suggestedRetailPerUnit;
  const estimatedDistributorProfit = estimatedRetailRevenue - totalCost;

  // Complete Catalog across all 3 divisions
  const catalog = [
    // ── Packaged Foods & Sauces ──────────────────────────────────────────
    {
      id: 'food-plantain-chips',
      category: 'food',
      name: 'Kone Golden Plantain Chips',
      division: 'Food & Snacks',
      origin: 'Partner Smallholder Groves, Ghana',
      image: '/assets/products/plantain-chips.jpg',
      badge: 'Bestseller',
      badgeColor: '#eab308',
      singlePrice: 'GHS 8.00',
      cartonPrice: 'GHS 140 / 24 packs',
      lineKey: 'chips',
      desc: 'Thinly sliced sun-drenched organic plantains kettle-cooked in cold-pressed oil with sea salt finish.',
      specs: ['150g Nitrogen Pouch', 'Zero Trans Fat', '9 Months Shelf-Life']
    },
    {
      id: 'food-yam-chips',
      category: 'food',
      name: 'Kone Crispy White Yam Chips',
      division: 'Food & Snacks',
      origin: 'Central Belt Farmlands, Ghana',
      image: '/assets/products/yam-chips.jpg',
      badge: 'Savory Crisp',
      badgeColor: '#f97316',
      singlePrice: 'GHS 8.00',
      cartonPrice: 'GHS 140 / 24 packs',
      lineKey: 'chips',
      desc: 'Authentic Ghanaian white yam sliced thin, kettle-fried with cracked black pepper, sea salt, and wild rosemary.',
      specs: ['150g Nitrogen Pouch', 'High Dietary Fiber', 'Gluten-Free']
    },
    {
      id: 'food-potato-chips',
      category: 'food',
      name: 'Kone Rustic Potato Crisps',
      division: 'Food & Snacks',
      origin: 'Highland Farms Cooperative',
      image: '/assets/products/potato-chips.jpg',
      badge: 'Zesty Crunch',
      badgeColor: '#38bdf8',
      singlePrice: 'GHS 8.00',
      cartonPrice: 'GHS 140 / 24 packs',
      lineKey: 'chips',
      desc: 'Skin-on highland potatoes, slow kettle-cooked for rustic crunch and seasoned with aromatic Ghanaian chili paprika.',
      specs: ['150g Nitrogen Pouch', 'Non-GMO', 'Kettle Cooked']
    },
    {
      id: 'food-trio-box',
      category: 'food',
      name: 'Kone Trio Variety Gift Box',
      division: 'Food & Snacks',
      origin: 'Multi-Hub Collective, Ghana',
      image: '/assets/products/trio-box.jpg',
      badge: 'Master Sampler',
      badgeColor: '#ec4899',
      singlePrice: 'GHS 24.00',
      cartonPrice: 'GHS 210 / 10 boxes',
      lineKey: 'combo',
      desc: 'The complete trifecta of sweet plantain, savory yam, and rustic potato chips in a presentation-grade gift box.',
      specs: ['3 x 150g Pouches', 'Presentation Box', 'Event & Party Ready']
    },
    {
      id: 'food-shito-jar',
      category: 'food',
      name: 'Kone Authentic Shito Sauce',
      division: 'Food & Snacks',
      origin: 'Artisanal Kitchens, Accra',
      image: '/assets/products/shito-jar.jpg',
      badge: 'Signature Umami',
      badgeColor: '#ef4444',
      singlePrice: 'GHS 20.00',
      cartonPrice: 'GHS 180 / 12 jars',
      lineKey: 'shito',
      desc: 'Slow-simmered black pepper sauce crafted with smoked herring, wild shrimp, shallots, and fiery scotch bonnet peppers.',
      specs: ['350g Glass Jar', '85,000 SHU Heat', '12 Months Vacuum Sealed']
    },

    // ── Organic Bulk Farm Harvest ────────────────────────────────────────
    {
      id: 'harvest-plantain',
      category: 'harvest',
      name: 'Organic Musa Plantain Bunches',
      division: 'Organic Farmlands',
      origin: 'Eastern & Volta Basin Outgrowers',
      image: '/assets/crops/plantain.jpg',
      badge: 'Wholesale Crop',
      badgeColor: '#10b981',
      singlePrice: 'Wholesale Contract',
      cartonPrice: 'Min. Order: 50 Bunches / 1 Ton',
      lineKey: null,
      desc: 'Export-grade Apem & Apantu plantains harvested at optimal physiological maturity. Direct from smallholder farm gates.',
      specs: ['Direct Farm Gate', 'Export Caliber Fingers', 'Fair-Trade Certified']
    },
    {
      id: 'harvest-yam',
      category: 'harvest',
      name: 'Ghanaian White Yam Tubers (Pona)',
      division: 'Organic Farmlands',
      origin: 'Central & Northern Belt Hubs',
      image: '/assets/crops/yam.jpg',
      badge: 'Export Grade',
      badgeColor: '#f59e0b',
      singlePrice: 'Wholesale Contract',
      cartonPrice: 'Min. Order: 100 Tubers / 1 Ton',
      lineKey: null,
      desc: 'Dense, dry-matter rich Pona white yam tubers. Carefully cured and packed in aerated wooden crates for shipping.',
      specs: ['Cured for Longevity', 'High Dry Starch', 'Phytosanitary Certified']
    },
    {
      id: 'harvest-pepper',
      category: 'harvest',
      name: 'Fresh Scotch Bonnet Peppers',
      division: 'Organic Farmlands',
      origin: 'Irrigated Precision Outgrowers',
      image: '/assets/crops/pepper.jpg',
      badge: 'High Capsaicin',
      badgeColor: '#ef4444',
      singlePrice: 'Wholesale Contract',
      cartonPrice: 'Min. Order: 50kg Sacks',
      lineKey: null,
      desc: 'Fire-red aromatic Capsicum chinense peppers grown with controlled drip stress to concentrate flavor and capsaicin.',
      specs: ['85K+ Scoville Heat', 'Sorted & Destemmed', 'Refrigerated Dispatch']
    },
    {
      id: 'harvest-shallots',
      category: 'harvest',
      name: 'Artisanal Pink Shallots & Alliums',
      division: 'Organic Farmlands',
      origin: 'Volta Delta Coastal Plains',
      image: '/assets/crops/shallots.jpg',
      badge: 'Gourmet Produce',
      badgeColor: '#a855f7',
      singlePrice: 'Wholesale Contract',
      cartonPrice: 'Min. Order: 50kg Mesh Bags',
      lineKey: null,
      desc: 'Sun-cured pink alliums with intense aromatic sweetness. Sourced directly from traditional coastal delta beds.',
      specs: ['Sun-Cured Bulbs', 'Long Ambient Storage', 'Intense Umami Notes']
    },

    // ── smartFarm Agritech Hardware ──────────────────────────────────────
    {
      id: 'hardware-telemetry-station',
      category: 'hardware',
      name: 'smartFarm Telemetry Base Station',
      division: 'smartFarm Agritech',
      origin: 'Kone Engineering Lab, Accra',
      image: '/assets/agritech/telemetry-station.jpg',
      badge: 'Autonomous IoT',
      badgeColor: '#06b6d4',
      singlePrice: 'GHS 1,450.00',
      cartonPrice: 'Complete Field Kit + Solar Mount',
      lineKey: null,
      desc: 'Off-grid solar-powered weather and soil gateway. Real-time LoRaWAN mesh transmitter with 15km field coverage.',
      specs: ['Solar MPPT + 18650 Li-ion', 'LoRaWAN 868/915MHz', 'IP67 Weatherproof']
    },
    {
      id: 'hardware-sensor-node',
      category: 'hardware',
      name: 'Soil Moisture & Temperature Node',
      division: 'smartFarm Agritech',
      origin: 'Kone Engineering Lab, Accra',
      image: '/assets/home/division-agritech.jpg',
      badge: 'Precision SDI-12',
      badgeColor: '#10b981',
      singlePrice: 'GHS 680.00',
      cartonPrice: 'Dual Probe + LoRa Node',
      lineKey: null,
      desc: 'Stainless steel dielectric soil moisture (VWC%) and root temperature probe with battery-powered wireless telemetry node.',
      specs: ['±2% VWC Accuracy', '5-Year Battery Life', 'Pre-calibrated Profiles']
    }
  ];

  const filteredCatalog = useMemo(() => {
    if (activeCategory === 'all') return catalog;
    return catalog.filter((item) => item.category === activeCategory);
  }, [activeCategory, catalog]);

  // Handle Wholesale application submit
  const handleWholesaleSubmit = async (e) => {
    e.preventDefault();
    setSubmittingOrder(true);

    const orderData = {
      clientType: 'B2B Wholesale / Distributor',
      businessName: distributorName,
      email: distributorEmail,
      phone: distributorPhone,
      productLine: selectedProductLine,
      lineName: activePricing.unitName,
      quantity: orderQuantity,
      pricePerUnit: currentTier.price,
      shippingCost: currentTier.shipping,
      totalInvoiceGhs: totalCost,
      estimatedProfitGhs: estimatedDistributorProfit,
      submittedAt: new Date().toISOString()
    };

    if (db) {
      try {
        await addDoc(collection(db, 'market_wholesale_orders'), orderData);
      } catch (err) {
        console.warn('Firestore write notice:', err);
      }
    }

    // Compose WhatsApp quick dispatch message
    const msg = encodeURIComponent(
      `🛒 *NEW KONE MARKET WHOLESALE ORDER*\n` +
      `------------------------------------\n` +
      `*Business:* ${distributorName}\n` +
      `*Phone:* ${distributorPhone}\n` +
      `*Email:* ${distributorEmail}\n` +
      `*Product:* ${activePricing.unitName}\n` +
      `*Volume:* ${orderQuantity} ${activePricing.itemLabel}\n` +
      `*Invoice Total:* GHS ${totalCost}.00\n` +
      `*Tier:* ${currentTier.label}\n\n` +
      `Please confirm stock availability and dispatch schedule!`
    );

    setSubmittingOrder(false);
    setOrderSubmitted(true);

    // Open WhatsApp link in new tab
    window.open(`https://wa.me/233240000000?text=${msg}`, '_blank');
  };

  // Open inquiry modal for bulk crops or hardware
  const handleOpenInquiry = (item, modalType) => {
    setModalItem(item);
    setActiveModal(modalType);
    setInquirySuccess(false);
    setInquiryNotes(`Interested in acquiring ${item.name} (${item.origin}).`);
  };

  // Handle custom modal inquiry submission
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    const payload = {
      type: activeModal === 'harvest' ? 'Commercial Harvest Contract' : 'smartFarm Hardware Procurement',
      item: modalItem?.name,
      contactName: inquiryName,
      contactPhone: inquiryContact,
      estimatedVolume: inquiryVolume,
      notes: inquiryNotes,
      submittedAt: new Date().toISOString()
    };

    if (db) {
      try {
        await addDoc(collection(db, 'market_inquiries'), payload);
      } catch (err) {
        console.warn('Firestore write notice:', err);
      }
    }

    const msg = encodeURIComponent(
      `🌿 *KONE MARKET ${activeModal === 'harvest' ? 'BULK HARVEST' : 'HARDWARE'} INQUIRY*\n` +
      `------------------------------------\n` +
      `*Item:* ${modalItem?.name}\n` +
      `*Contact:* ${inquiryName} (${inquiryContact})\n` +
      `*Requested Volume:* ${inquiryVolume}\n` +
      `*Notes:* ${inquiryNotes}\n\n` +
      `Please provide formal quotation and delivery terms.`
    );

    setInquirySuccess(true);
    window.open(`https://wa.me/233240000000?text=${msg}`, '_blank');
  };

  return (
    <div className="kone-market-page">
      <div className="market-container">
        
        {/* ── MARKET HERO SECTION ────────────────────────────────────────── */}
        <header className="market-header-section">
          <div className="market-badge-pill">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            Kone Official Storefront & Wholesale Hub
          </div>

          <h1 className="farms-headline" style={{ marginTop: '0.75rem' }}>
            The Kone Market
          </h1>

          <p className="farms-subheadline">
            Fresh from our Ghanaian soils, handcrafted in our artisanal kitchens, and powered by smartFarm engineering. Sourcing for retail shelves, export quotas, or modern precision fields.
          </p>

          {/* Value Badges */}
          <div className="market-trust-row">
            <div className="market-trust-tag">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="#10b981" strokeWidth="2.5" fill="none">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              100% Fair-Trade Sourced
            </div>
            <div className="market-trust-tag">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="#eab308" strokeWidth="2.5" fill="none">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Zero Preservatives or Additives
            </div>
            <div className="market-trust-tag">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="#38bdf8" strokeWidth="2.5" fill="none">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              </svg>
              Fast Nationwide Dispatch
            </div>
          </div>

          {/* Category Filter Segments */}
          <div className="segmented-control-wrapper" style={{ marginTop: '2rem' }}>
            <div className="segmented-control" role="tablist">
              <button
                className={`segment-btn ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All Offerings ({catalog.length})
              </button>
              <button
                className={`segment-btn ${activeCategory === 'food' ? 'active' : ''}`}
                onClick={() => setActiveCategory('food')}
              >
                Packaged Foods & Sauces (5)
              </button>
              <button
                className={`segment-btn ${activeCategory === 'harvest' ? 'active' : ''}`}
                onClick={() => setActiveCategory('harvest')}
              >
                Organic Bulk Harvest (4)
              </button>
              <button
                className={`segment-btn ${activeCategory === 'hardware' ? 'active' : ''}`}
                onClick={() => setActiveCategory('hardware')}
              >
                smartFarm Hardware (2)
              </button>
            </div>
          </div>
        </header>

        {/* ── PRODUCT CATALOG GRID ────────────────────────────────────────── */}
        <section className="market-catalog-section">
          <div className="market-grid">
            {filteredCatalog.map((item) => (
              <div key={item.id} className="market-card">
                <div className="market-card-media">
                  <img src={item.image} alt={item.name} className="market-card-img" loading="lazy" />
                  <div className="market-card-gradient"></div>
                  <span 
                    className="market-card-badge" 
                    style={{ borderColor: item.badgeColor, color: item.badgeColor }}
                  >
                    {item.badge}
                  </span>
                </div>

                <div className="market-card-body">
                  <div className="market-item-origin">{item.division} • {item.origin}</div>
                  <h3 className="market-item-title">{item.name}</h3>
                  <p className="market-item-desc">{item.desc}</p>

                  <div className="market-item-specs">
                    {item.specs.map((spec, i) => (
                      <span key={i} className="market-spec-chip">{spec}</span>
                    ))}
                  </div>

                  <div className="market-item-pricing-box">
                    <div className="price-col">
                      <span className="price-label">Retail / Spec</span>
                      <strong className="price-val">{item.singlePrice}</strong>
                    </div>
                    <div className="price-col text-right">
                      <span className="price-label">Commercial Lot</span>
                      <span className="price-carton">{item.cartonPrice}</span>
                    </div>
                  </div>

                  {item.category === 'food' ? (
                    <button 
                      className="market-order-action-btn"
                      onClick={() => {
                        setSelectedProductLine(item.lineKey || 'chips');
                        const calcEl = document.getElementById('market-wholesale-portal');
                        if (calcEl) calcEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" style={{ marginRight: '6px' }}>
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                      </svg>
                      Order Wholesale Cartons ➔
                    </button>
                  ) : item.category === 'harvest' ? (
                    <button 
                      className="market-order-action-btn harvest-action-btn"
                      onClick={() => handleOpenInquiry(item, 'harvest')}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" style={{ marginRight: '6px' }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      Request Bulk Harvest Quote ➔
                    </button>
                  ) : (
                    <button 
                      className="market-order-action-btn hardware-action-btn"
                      onClick={() => handleOpenInquiry(item, 'hardware')}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" style={{ marginRight: '6px' }}>
                        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                        <rect x="9" y="9" width="6" height="6"></rect>
                      </svg>
                      Procure Field Hardware ➔
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── B2B WHOLESALE CARTON CALCULATOR & DIRECT PORTAL ─────────────── */}
        <section id="market-wholesale-portal" className="market-wholesale-portal-wrapper">
          <div className="market-portal-header">
            <div className="market-badge-pill" style={{ borderColor: 'rgba(234, 179, 8, 0.4)', color: '#fef08a' }}>
              Volume Merchant Desk
            </div>
            <h2 className="market-section-title">
              Interactive B2B Margin & Carton Calculator
            </h2>
            <p className="market-section-subtitle">
              Calculate volume discounts, delivery freight, and retail profitability for stocking Kone Chips & Shito on your shelves.
            </p>
          </div>

          <div className="b2b-distributors-grid">
            {/* Left: Wholesaler Application & Instant Dispatch */}
            <div className="farms-card" style={{ textAlign: 'left' }}>
              <h3 className="smartfarm-title" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#34d399" strokeWidth="2" fill="none">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Merchant Dispatch Order
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Submit your store details to receive official dispatch credentials and instantaneous WhatsApp dispatch confirmation.
              </p>

              {orderSubmitted ? (
                <div className="submit-success-banner">
                  <div style={{ margin: '0 auto 1rem', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="#34d399" strokeWidth="2" fill="none">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <strong style={{ display: 'block', fontSize: '1.2rem', marginBottom: '0.5rem', color: '#34d399' }}>Order Dispatch Initiated!</strong>
                  <p style={{ fontSize: '0.85rem', margin: 0, color: '#cbd5e1' }}>
                    Your wholesale invoice has been drafted and routed to our dispatch logistics desk on WhatsApp. Our dispatch manager is confirming your delivery window now.
                  </p>
                  <button 
                    className="market-btn-secondary"
                    style={{ marginTop: '1.25rem' }}
                    onClick={() => setOrderSubmitted(false)}
                  >
                    Draft Another Wholesale Order
                  </button>
                </div>
              ) : (
                <form onSubmit={handleWholesaleSubmit}>
                  <div className="dist-form-group">
                    <label htmlFor="market-dist-name" className="dist-label">Store / Business Name</label>
                    <input
                      id="market-dist-name"
                      type="text"
                      required
                      value={distributorName}
                      onChange={(e) => setDistributorName(e.target.value)}
                      placeholder="e.g. Accra Central Mart or Palm Hotel Pantry"
                      className="dist-input"
                    />
                  </div>

                  <div className="dist-form-group">
                    <label htmlFor="market-dist-email" className="dist-label">Business Email</label>
                    <input
                      id="market-dist-email"
                      type="email"
                      required
                      value={distributorEmail}
                      onChange={(e) => setDistributorEmail(e.target.value)}
                      placeholder="purchasing@yourstore.com"
                      className="dist-input"
                    />
                  </div>

                  <div className="dist-form-group">
                    <label htmlFor="market-dist-phone" className="dist-label">Contact Phone / WhatsApp</label>
                    <input
                      id="market-dist-phone"
                      type="tel"
                      required
                      value={distributorPhone}
                      onChange={(e) => setDistributorPhone(e.target.value)}
                      placeholder="+233 24 000 0000"
                      className="dist-input"
                    />
                  </div>

                  <div className="dist-form-group">
                    <label htmlFor="market-product-line" className="dist-label">Select Inventory Line</label>
                    <select
                      id="market-product-line"
                      value={selectedProductLine}
                      onChange={(e) => setSelectedProductLine(e.target.value)}
                      className="dist-input select-farms-option"
                    >
                      <option value="chips">Kone Chips (Cartons of 24 Pouches - 150g)</option>
                      <option value="shito">Kone Shito (Boxes of 12 Jars - 350g)</option>
                      <option value="combo">Merchant Starter Pallet (12 Shito + 12 Chips)</option>
                    </select>
                  </div>

                  <div className="dist-form-group">
                    <label htmlFor="market-quantity-select" className="dist-label">
                      Select Volume ({activePricing.itemLabel})
                    </label>
                    <select
                      id="market-quantity-select"
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(Number(e.target.value))}
                      className="dist-input select-farms-option"
                    >
                      {[1, 2, 5, 10, 20, 50, 100].map((num) => (
                        <option key={num} value={num}>
                          {num} {activePricing.itemLabel} {num >= 10 ? '(10% Off + Free Freight)' : num >= 5 ? '(5% Volume Savings)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submittingOrder}
                    className="farms-submit-btn" 
                    style={{ width: '100%', marginTop: '1rem' }}
                  >
                    {submittingOrder ? 'Processing Invoice...' : 'Generate Invoice & Order on WhatsApp ➔'}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Live B2B Margin Calculator */}
            <div className="farms-card" style={{ textAlign: 'left' }}>
              <h3 className="smartfarm-title" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#34d399" strokeWidth="2" fill="none">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                Real-Time Profit & Margin Matrix
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Live calculation of merchant cost basis, consumer retail turnover, and net gross margin.
              </p>

              <div className="pricing-calculator-box">
                <div className="calc-row">
                  <span>Selected Line:</span>
                  <strong>{activePricing.unitName}</strong>
                </div>
                <div className="calc-row">
                  <span>Volume Tier:</span>
                  <span className="calc-tier-badge">{currentTier.label}</span>
                </div>
                <div className="calc-row">
                  <span>Price per Carton/Box:</span>
                  <strong>
                    {currentTier.discountPercent > 0 && (
                      <s style={{ color: '#ef4444', marginRight: '0.5rem' }}>GHS {activePricing.basePrice}</s>
                    )}
                    GHS {currentTier.price}.00
                  </strong>
                </div>
                <div className="calc-row">
                  <span>Total Individual Units:</span>
                  <strong style={{ color: '#facc15' }}>{totalUnits} Retail Units</strong>
                </div>
                <div className="calc-row">
                  <span>Logistics & Freight:</span>
                  <span>{currentTier.shipping === 0 ? <strong style={{ color: '#10b981' }}>FREE FREIGHT</strong> : `GHS ${currentTier.shipping}.00`}</span>
                </div>

                <div className="calc-total-row">
                  <span>Wholesale Cost (GHS):</span>
                  <span className="calc-total-amount">GHS {totalCost}.00</span>
                </div>

                {/* Profit Projection Card */}
                <div className="profit-projection-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Est. Consumer Retail Revenue:</span>
                    <strong style={{ color: '#38bdf8' }}>GHS {estimatedRetailRevenue}.00</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Est. Merchant Profit:</span>
                    <strong style={{ color: '#10b981' }}>+GHS {estimatedDistributorProfit}.00 ({Math.round((estimatedDistributorProfit / totalCost) * 100)}% ROI)</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'left', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginTop: '1rem' }}>
                  <strong style={{ display: 'block', color: 'white', marginBottom: '0.25rem' }}>Volume Discount Milestones:</strong>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                    <li>Order <strong>5 - 9 cartons</strong>: Instant <strong>5%</strong> invoice savings.</li>
                    <li>Order <strong>10+ cartons</strong>: <strong>10%</strong> savings + <strong>Free Nationwide Cold-Chain/Freight</strong>.</li>
                  </ul>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(16, 185, 129, 0.15)', paddingTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left', marginTop: '1rem' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#34d399" strokeWidth="2" fill="none" style={{ flexShrink: 0 }}>
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  Dispatched in food-grade nitrogen moisture-barrier packaging. Delivery within 24-48 hours across Greater Accra, Kumasi, and regional capitals.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── INQUIRY MODAL (Harvest & Hardware) ─────────────────────────── */}
        {activeModal && modalItem && (
          <div className="market-modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="market-modal-card" onClick={(e) => e.stopPropagation()}>
              <button 
                className="market-modal-close"
                onClick={() => setActiveModal(null)}
                aria-label="Close dialog"
              >
                ✕
              </button>

              <div className="market-modal-header">
                <span className="market-spec-chip" style={{ color: modalItem.badgeColor, borderColor: modalItem.badgeColor }}>
                  {activeModal === 'harvest' ? '🌾 Organic Bulk Harvest Contract' : '⚡ smartFarm Hardware Order'}
                </span>
                <h3 style={{ fontSize: '1.4rem', color: 'white', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
                  {modalItem.name}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                  Origin: {modalItem.origin} • {modalItem.cartonPrice}
                </p>
              </div>

              {inquirySuccess ? (
                <div className="submit-success-banner" style={{ marginTop: '1.5rem' }}>
                  <strong style={{ display: 'block', fontSize: '1.1rem', color: '#34d399', marginBottom: '0.5rem' }}>
                    Inquiry Routed to WhatsApp Desk!
                  </strong>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                    Our commercial outgrower and agritech hardware teams have received your request specifications.
                  </p>
                  <button 
                    className="market-btn-secondary" 
                    style={{ marginTop: '1rem' }}
                    onClick={() => setActiveModal(null)}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} style={{ marginTop: '1.25rem' }}>
                  <div className="dist-form-group">
                    <label className="dist-label">Your Name / Organization</label>
                    <input 
                      type="text" 
                      required 
                      value={inquiryName} 
                      onChange={(e) => setInquiryName(e.target.value)} 
                      placeholder="e.g. Kwame Mensah / Volta Agro Processors" 
                      className="dist-input" 
                    />
                  </div>

                  <div className="dist-form-group">
                    <label className="dist-label">Contact Phone / WhatsApp</label>
                    <input 
                      type="tel" 
                      required 
                      value={inquiryContact} 
                      onChange={(e) => setInquiryContact(e.target.value)} 
                      placeholder="+233 24 000 0000" 
                      className="dist-input" 
                    />
                  </div>

                  <div className="dist-form-group">
                    <label className="dist-label">
                      {activeModal === 'harvest' ? 'Estimated Harvest Volume' : 'Desired Hardware Quantity'}
                    </label>
                    <select 
                      value={inquiryVolume} 
                      onChange={(e) => setInquiryVolume(e.target.value)} 
                      className="dist-input select-farms-option"
                    >
                      {activeModal === 'harvest' ? (
                        <>
                          <option value="500kg - 1 Metric Ton">500kg - 1 Metric Ton</option>
                          <option value="2 - 5 Metric Tons">2 - 5 Metric Tons</option>
                          <option value="10+ Metric Tons (Commercial Export)">10+ Metric Tons (Commercial Export)</option>
                          <option value="Ongoing Weekly Outgrower Supply">Ongoing Weekly Outgrower Supply</option>
                        </>
                      ) : (
                        <>
                          <option value="1 Evaluation Kit (Station + Probe)">1 Evaluation Kit (Station + Probe)</option>
                          <option value="3 - 5 Field Nodes (Medium Farm)">3 - 5 Field Nodes (Medium Farm)</option>
                          <option value="10+ Nodes (Cooperative / Multi-Acreage)">10+ Nodes (Cooperative / Multi-Acreage)</option>
                          <option value="Custom Engineering & Installation">Custom Engineering & Installation</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="dist-form-group">
                    <label className="dist-label">Notes or Specifications</label>
                    <textarea 
                      rows="3" 
                      value={inquiryNotes} 
                      onChange={(e) => setInquiryNotes(e.target.value)} 
                      placeholder="Delivery location, timeline, or specific variety preferences..." 
                      className="dist-input" 
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button type="submit" className="farms-submit-btn" style={{ width: '100%', marginTop: '1rem' }}>
                    Send Formal Inquiry on WhatsApp ➔
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
