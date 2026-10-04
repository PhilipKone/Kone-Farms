// ── KONE SHITO PRODUCT CATALOG & OPEN GRAPH METADATA REGISTRY ────────────────
// Contains full static product configurations, clean share URLs, and OG image mappings

export const SUPERMARKET_PRODUCTS = [
  {
    id: 'ks-red-250',
    slug: 'red',
    slugAliases: ['red-edition', 'ks-red-250'],
    name: 'Red Edition',
    shortName: 'Red Edition',
    subtitle: 'Scotch Bonnet & Smoked Seafood',
    aisle: 'red',
    price: 45.0,
    originalPrice: null,
    weight: '250g Glass Jar',
    heatRating: '82,000 SHU • Extra Hot',
    heatColor: '#ef4444',
    badge: 'HOTTEST SELLER',
    badgeColor: '#dc2626',
    barcode: '079458210401',
    primaryImage: '/assets/shito/supermarket/red-clean-plain.jpg',
    ogImage: 'https://farms.koneacademy.io/assets/shito/supermarket/red-clean-branded.jpg',
    galleryImages: [
      '/assets/shito/supermarket/red-clean-plain.jpg',
      '/assets/shito/supermarket/red-clean-branded.jpg',
      '/assets/shito/supermarket/red-studio-front.jpg',
      '/assets/shito/supermarket/red-studio-angle.jpg',
      '/assets/shito/supermarket/red-jar-closeup.jpg',
      '/assets/shito/supermarket/red-jar-shelf-1.jpg',
      '/assets/shito/supermarket/red-jar-table.jpg',
      '/assets/shito/supermarket/red-jar-kitchen.jpg'
    ],
    labelTexture: '/assets/shito/shito-label-red.png',
    lidHex: 0xdc2626,
    description:
      'Our flagship black pepper sauce slow-caramelized over low heat with organic Ghanaian Scotch Bonnet peppers, pink shallots, sun-dried Volta delta prawns, and wild smoked herring.',
    ingredients:
      'Organic Scotch Bonnet Peppers, Pink Shallots, Smoked Volta Prawns, Smoked Coastal Herring, Cold-Pressed Vegetable Oil, Fresh Ginger, Ada Mineral Sea Salt, Natural Spices.',
    nutrition: {
      servingSize: '15g (1 Tbsp)',
      calories: '45 kcal',
      totalFat: '3.5g (Zero Trans Fat)',
      sodium: '110mg',
      protein: '1.8g',
      shelfLife: '12 Months (Airtight Safety Seal)'
    },
    pairings: ['Kone Plantain Chips', 'Late-Night Fried Yam', 'Charcoal-Grilled Tilapia', 'Accra Waakye']
  },
  {
    id: 'ks-blue-250',
    slug: 'blue',
    slugAliases: ['blue-edition', 'ks-blue-250'],
    name: 'Blue Edition',
    shortName: 'Blue Edition',
    subtitle: 'Volta Delta River Prawn',
    aisle: 'blue',
    price: 45.0,
    originalPrice: null,
    weight: '250g Glass Jar',
    heatRating: '42,000 SHU • Classic Medium',
    heatColor: '#3b82f6',
    badge: 'COASTAL FAVORITE',
    badgeColor: '#2563eb',
    barcode: '079458210402',
    primaryImage: '/assets/shito/supermarket/blue-clean-plain.jpg',
    ogImage: 'https://farms.koneacademy.io/assets/shito/supermarket/blue-clean-branded.jpg',
    galleryImages: [
      '/assets/shito/supermarket/blue-clean-plain.jpg',
      '/assets/shito/supermarket/blue-clean-branded.jpg',
      '/assets/shito/supermarket/blue-jar-front.jpg',
      '/assets/shito/supermarket/blue-jar-angle.jpg',
      '/assets/shito/supermarket/blue-jar-closeup.jpg',
      '/assets/shito/supermarket/blue-jar-table.jpg',
      '/assets/shito/supermarket/blue-jar-kitchen.jpg',
      '/assets/shito/supermarket/blue-jar-high.jpg'
    ],
    labelTexture: '/assets/shito/shito-label-blue.png',
    lidHex: 0x2563eb,
    description:
      'A seafood lover’s dream. Heavy on sun-dried Volta estuary river prawns and slow-smoked coastal herring, blended into sweet caramelized onions and mellow red chilies.',
    ingredients:
      'Dried Volta Delta Prawns (Coarse Ground), Smoked Coastal Herring, Caramelized Yellow Onions, Mild Red Chili, Ginger Root Confit, Garlic, Cold-Pressed Oil, Sea Salt.',
    nutrition: {
      servingSize: '15g (1 Tbsp)',
      calories: '42 kcal',
      totalFat: '3.0g (Zero Trans Fat)',
      sodium: '125mg',
      protein: '2.4g',
      shelfLife: '12 Months (Airtight Safety Seal)'
    },
    pairings: ['Kenkey & Fried Fish', 'Hot Jollof Rice', 'Waakye & Gari Foto', 'Kone Yam Chips']
  },
  {
    id: 'ks-green-250',
    slug: 'green',
    slugAliases: ['green-edition', 'ks-green-250'],
    name: 'Green Edition',
    shortName: 'Green Edition',
    subtitle: 'Emerald Kpakpo Pepper',
    aisle: 'green',
    price: 45.0,
    originalPrice: null,
    weight: '250g Glass Jar',
    heatRating: '16,000 SHU • Aromatic Mild',
    heatColor: '#10b981',
    badge: 'FRESH HARVEST',
    badgeColor: '#16a34a',
    barcode: '079458210403',
    primaryImage: '/assets/shito/supermarket/green-clean-plain.jpg',
    ogImage: 'https://farms.koneacademy.io/assets/shito/supermarket/green-clean-branded.jpg',
    galleryImages: [
      '/assets/shito/supermarket/green-clean-plain.jpg',
      '/assets/shito/supermarket/green-clean-branded.jpg',
      '/assets/shito/supermarket/green-studio-front.jpg',
      '/assets/shito/supermarket/green-studio-angle.jpg',
      '/assets/shito/supermarket/green-jar-closeup.jpg',
      '/assets/shito/supermarket/green-jar-shelf-1.jpg',
      '/assets/shito/supermarket/green-jar-table.jpg',
      '/assets/shito/supermarket/green-jar-kitchen.jpg',
      '/assets/shito/supermarket/green-jar-angle2.jpg'
    ],
    labelTexture: '/assets/shito/shito-label-green.png',
    lidHex: 0x16a34a,
    description:
      'Bright, botanical, and floral. Made with native round green Kpakpo Shito peppers, roasted garlic confit, crushed white peppercorns, and wild garden aromatics.',
    ingredients:
      'Fresh Green Kpakpo Shito Peppers, Roasted Garlic, White Peppercorns, Wild Basil, Smoked Crayfish, Cold-Pressed Vegetable Oil, Ada Sea Salt.',
    nutrition: {
      servingSize: '15g (1 Tbsp)',
      calories: '38 kcal',
      totalFat: '2.8g (Zero Trans Fat)',
      sodium: '95mg',
      protein: '1.4g',
      shelfLife: '12 Months (Airtight Safety Seal)'
    },
    pairings: ['Morning Fried Eggs & Avocado Toast', 'Rustic Potato Crisps', 'Grilled Chicken Salad', 'Boiled Yam']
  },
  {
    id: 'ks-gold-250',
    slug: 'gold',
    slugAliases: ['gold-edition', 'ks-gold-250'],
    name: 'Gold Edition',
    shortName: 'Gold Edition',
    subtitle: '12-Hour Copper Kettle Reserve',
    aisle: 'gold',
    price: 55.0,
    originalPrice: null,
    weight: '250g Glass Jar',
    heatRating: '65,000 SHU • Connoisseur Hot',
    heatColor: '#f59e0b',
    badge: 'LIMITED RESERVE',
    badgeColor: '#d97706',
    barcode: '079458210404',
    primaryImage: '/assets/shito/supermarket/gold-clean-plain.jpg',
    ogImage: 'https://farms.koneacademy.io/assets/shito/supermarket/gold-clean-branded.jpg',
    galleryImages: [
      '/assets/shito/supermarket/gold-clean-plain.jpg',
      '/assets/shito/supermarket/gold-clean-branded.jpg',
      '/assets/shito/supermarket/gold-jar-front.jpg',
      '/assets/shito/supermarket/lineup-clean-plain.jpg',
      '/assets/shito/supermarket/lineup-group-table.jpg'
    ],
    labelTexture: '/assets/shito/shito-label-red.png',
    lidHex: 0xd97706,
    description:
      'Our artisanal master reserve batch. Simmered for 12 continuous hours in traditional copper kettles with triple-smoked crayfish, caramelized aged ginger, and golden oil infusion.',
    ingredients:
      'Triple-Smoked Estuary Crayfish, Heritage Scotch Bonnet, Aged Yellow Ginger, Red Shallots, Cardamom & Allspice, Pure Cold-Pressed Groundnut Oil, Ada Salt.',
    nutrition: {
      servingSize: '15g (1 Tbsp)',
      calories: '48 kcal',
      totalFat: '3.8g',
      sodium: '115mg',
      protein: '2.2g',
      shelfLife: '14 Months'
    },
    pairings: ['Celebration Party Jollof', 'Oxtail Stew Rice', 'Artisanal Charcuterie Board']
  },
  {
    id: 'ks-bundle-trio',
    slug: 'trio',
    slugAliases: ['trio-collection', 'ks-bundle-trio', 'trio-box'],
    name: 'The Trio Collection',
    shortName: 'Trio Collection',
    subtitle: 'Red, Blue & Green (3x 250g)',
    aisle: 'bundles',
    price: 120.0,
    originalPrice: 135.0,
    weight: '3 x 250g (750g Net)',
    heatRating: 'Mild to Fiery Spectrum',
    heatColor: '#ec4899',
    badge: 'SPECIAL',
    badgeColor: '#db2777',
    barcode: '079458210410',
    primaryImage: '/assets/shito/supermarket/lineup-clean-plain.jpg',
    ogImage: 'https://farms.koneacademy.io/assets/shito/supermarket/lineup-clean-branded.jpg',
    galleryImages: [
      '/assets/shito/supermarket/lineup-clean-plain.jpg',
      '/assets/shito/supermarket/lineup-clean-branded.jpg',
      '/assets/shito/supermarket/lineup-trio-shelf.jpg',
      '/assets/shito/supermarket/lineup-all-4-jars.jpg',
      '/assets/shito/supermarket/lineup-group-table.jpg'
    ],
    labelTexture: '/assets/shito/shito-label-red.png',
    lidHex: 0xdc2626,
    description:
      'The definitive Ghanaian pantry gift box. Contains one jar each of Fiery Red Scotch Bonnet, Seafood Heritage Blue, and Emerald Kpakpo Green, packed in a gold-foil gift carton.',
    ingredients: 'Contains full jars of Red Edition (250g), Blue Edition (250g), and Green Edition (250g).',
    nutrition: {
      servingSize: '3 x 250g Sealed Glass Jars',
      calories: 'Variety Pack',
      totalFat: 'Zero Trans Fat Across All Jars',
      sodium: 'Balanced',
      protein: 'High Marine Protein',
      shelfLife: '12 Months Freshness'
    },
    pairings: ['The Ultimate Gift for Family & Diaspora', 'Party Grazing Tables', 'Pantry Staple Stockup']
  },
  {
    id: 'ks-bundle-quad',
    slug: 'master',
    slugAliases: ['master-collection', 'ks-bundle-quad', 'quad-box'],
    name: 'The Master Collection',
    shortName: 'Master Collection',
    subtitle: 'All 4 Flagship Varieties (4x 250g)',
    aisle: 'bundles',
    price: 165.0,
    originalPrice: 190.0,
    weight: '4 x 250g (1000g Net)',
    heatRating: 'Complete Range (16K - 82K SHU)',
    heatColor: '#8b5cf6',
    badge: 'CHEF SELECTION',
    badgeColor: '#7c3aed',
    barcode: '079458210411',
    primaryImage: '/assets/shito/supermarket/lineup-clean-branded.jpg',
    ogImage: 'https://farms.koneacademy.io/assets/shito/supermarket/lineup-clean-branded.jpg',
    galleryImages: [
      '/assets/shito/supermarket/lineup-clean-branded.jpg',
      '/assets/shito/supermarket/lineup-all-4-jars.jpg',
      '/assets/shito/supermarket/lineup-clean-plain.jpg',
      '/assets/shito/supermarket/lineup-group-table.jpg',
      '/assets/shito/supermarket/lineup-trio-shelf.jpg'
    ],
    labelTexture: '/assets/shito/shito-label-red.png',
    lidHex: 0xdc2626,
    description:
      'For true Ghanaian culinary enthusiasts. Includes every edition: Fiery Red, Seafood Blue, Emerald Green, and Limited Master Reserve Gold in a handsome wooden provisions caddy.',
    ingredients: 'Includes 1x Red (250g), 1x Blue (250g), 1x Green (250g), 1x Gold Reserve (250g).',
    nutrition: {
      servingSize: '4 x 250g Sealed Glass Jars',
      calories: 'Complete Master Sampler',
      totalFat: 'Cold-Pressed Oils Only',
      sodium: 'Ada Natural Sea Salt',
      protein: 'Authentic Seafood Sediments',
      shelfLife: '12-14 Months'
    },
    pairings: ['Master Chef Kitchens', 'Home Tasting Flights', 'Executive Corporate Gifts']
  },
  {
    id: 'ks-bundle-chips',
    slug: 'chips',
    slugAliases: ['shito-and-chips', 'ks-bundle-chips'],
    name: 'Shito & Chips Kit',
    shortName: 'Shito & Chips',
    subtitle: '1x Choice Jar + Plantain & Yam Chips',
    aisle: 'bundles',
    price: 85.0,
    originalPrice: 95.0,
    weight: '1x 250g Jar + 2x Chips',
    heatRating: 'Crisp & Fiery Match',
    heatColor: '#f97316',
    badge: 'BESTSELLER',
    badgeColor: '#ea580c',
    barcode: '079458210412',
    primaryImage: '/assets/shito/supermarket/lineup-group-table.jpg',
    ogImage: 'https://farms.koneacademy.io/assets/shito/supermarket/lineup-group-table.jpg',
    galleryImages: [
      '/assets/shito/supermarket/lineup-group-table.jpg',
      '/assets/shito/supermarket/lineup-clean-plain.jpg',
      '/assets/shito/supermarket/red-jar-table.jpg',
      '/assets/shito/supermarket/blue-jar-table.jpg'
    ],
    labelTexture: '/assets/shito/shito-label-red.png',
    lidHex: 0xdc2626,
    description:
      'The ultimate Ghanaian street snacking experience. Dip our thin kettle-cooked Golden Plantain Chips and salted Ghanaian White Yam Chips directly into savory Kone Shito.',
    ingredients:
      '1x 250g Glass Jar Kone Shito (Red or Blue), 1x 150g Golden Plantain Chips, 1x 150g Crispy Yam Chips with sea salt and rosemary.',
    nutrition: {
      servingSize: 'Snack Feast Kit',
      calories: '100% Non-GMO Organic Farmland Sourced',
      totalFat: 'Zero Trans Fat',
      sodium: 'Pure Mineral Salt',
      protein: 'Nutritious & Energizing',
      shelfLife: '9-12 Months'
    },
    pairings: ['Late-Night Movies', 'Game Nights', 'Office Snacking Stash', 'Picnics']
  },
  {
    id: 'ks-wholesale-carton12',
    slug: 'carton-12',
    slugAliases: ['wholesale-carton', 'ks-wholesale-carton12', 'carton12'],
    name: 'Merchant Carton',
    shortName: 'Carton of 12',
    subtitle: '12x 250g Jars Freight Pack',
    aisle: 'wholesale',
    price: 450.0,
    originalPrice: 540.0,
    weight: '12 x 250g (3.0kg Net)',
    heatRating: 'Merchant Tier',
    heatColor: '#10b981',
    badge: 'WHOLESALE',
    badgeColor: '#059669',
    barcode: '079458210420',
    primaryImage: '/assets/shito/supermarket/lineup-carton-display.jpg',
    ogImage: 'https://farms.koneacademy.io/assets/shito/supermarket/lineup-carton-display.jpg',
    galleryImages: [
      '/assets/shito/supermarket/lineup-carton-display.jpg',
      '/assets/shito/supermarket/lineup-supermarket-stack.jpg',
      '/assets/shito/supermarket/lineup-clean-plain.jpg'
    ],
    labelTexture: '/assets/shito/shito-label-red.png',
    lidHex: 0xdc2626,
    description:
      'Wholesale master shipping carton containing 12 vacuum-sealed glass jars separated by shockproof corrugated dividers. Ideal for boutique grocers, African food stores, and diaspora shipping.',
    ingredients: 'Standard configuration: 6x Red Edition, 4x Blue Edition, 2x Green Edition (or customized upon WhatsApp checkout).',
    nutrition: {
      servingSize: '12 Sealed Jars',
      calories: 'Wholesale Commercial Pack',
      totalFat: 'Unit Cost: GH₵ 37.50 / jar',
      sodium: 'Retail Value: GH₵ 45-55 / jar',
      protein: 'High Resale Margin',
      shelfLife: '12 Months'
    },
    pairings: ['Retail Store Shelves', 'Diaspora Care Barrels', 'Restaurants & Chop Bars']
  },
  {
    id: 'ks-wholesale-crate24',
    slug: 'crate-24',
    slugAliases: ['commercial-crate', 'ks-wholesale-crate24', 'crate24'],
    name: 'Commercial Crate',
    shortName: 'Crate of 24',
    subtitle: '24x 250g Jars Food Service',
    aisle: 'wholesale',
    price: 840.0,
    originalPrice: 1080.0,
    weight: '24 x 250g (6.0kg Net)',
    heatRating: 'Food Service',
    heatColor: '#0ea5e9',
    badge: 'BULK VALUE',
    badgeColor: '#0284c7',
    barcode: '079458210421',
    primaryImage: '/assets/shito/supermarket/lineup-supermarket-stack.jpg',
    ogImage: 'https://farms.koneacademy.io/assets/shito/supermarket/lineup-supermarket-stack.jpg',
    galleryImages: [
      '/assets/shito/supermarket/lineup-supermarket-stack.jpg',
      '/assets/shito/supermarket/lineup-carton-display.jpg',
      '/assets/shito/supermarket/lineup-group-table.jpg'
    ],
    labelTexture: '/assets/shito/shito-label-red.png',
    lidHex: 0xdc2626,
    description:
      'Designed specifically for wedding caterers, commercial chop bars, and hotel kitchens requiring consistent, high-grade artisanal shito without chemical adulterants.',
    ingredients: '24 sealed jars with tamper-evident fresh-lock seals. Custom flavor splits available upon request.',
    nutrition: {
      servingSize: '24 Commercial Units',
      calories: 'Volume Food Service Tier',
      totalFat: 'Unit Cost: GH₵ 35.00 / jar',
      sodium: 'Standard Food Safe Specs',
      protein: '100% Traceable Organic Batches',
      shelfLife: '12 Months'
    },
    pairings: ['Event & Wedding Catering', 'Accra & Kumasi Chop Bars', 'Export Containers']
  }
];

// Compile-time static image mapping
export const PRODUCT_IMAGE_MAP = {
  'ks-red-250': '/assets/shito/supermarket/red-clean-plain.jpg',
  'ks-blue-250': '/assets/shito/supermarket/blue-clean-plain.jpg',
  'ks-green-250': '/assets/shito/supermarket/green-clean-plain.jpg',
  'ks-gold-250': '/assets/shito/supermarket/gold-clean-plain.jpg',
  'ks-bundle-trio': '/assets/shito/supermarket/lineup-clean-plain.jpg',
  'ks-bundle-quad': '/assets/shito/supermarket/lineup-all-4-jars.jpg',
  'ks-bundle-chips': '/assets/shito/supermarket/lineup-group-table.jpg',
  'ks-wholesale-carton12': '/assets/shito/supermarket/lineup-carton-display.jpg',
  'ks-wholesale-crate24': '/assets/shito/supermarket/lineup-supermarket-stack.jpg'
};

export const PRODUCT_GALLERY_MAP = {
  'ks-red-250': [
    '/assets/shito/supermarket/red-clean-plain.jpg',
    '/assets/shito/supermarket/red-clean-branded.jpg',
    '/assets/shito/supermarket/red-studio-front.jpg',
    '/assets/shito/supermarket/red-studio-angle.jpg',
    '/assets/shito/supermarket/red-jar-closeup.jpg',
    '/assets/shito/supermarket/red-jar-shelf-1.jpg',
    '/assets/shito/supermarket/red-jar-table.jpg',
    '/assets/shito/supermarket/red-jar-kitchen.jpg'
  ],
  'ks-blue-250': [
    '/assets/shito/supermarket/blue-clean-plain.jpg',
    '/assets/shito/supermarket/blue-clean-branded.jpg',
    '/assets/shito/supermarket/blue-jar-front.jpg',
    '/assets/shito/supermarket/blue-jar-angle.jpg',
    '/assets/shito/supermarket/blue-jar-table.jpg',
    '/assets/shito/supermarket/blue-jar-label.jpg',
    '/assets/shito/supermarket/blue-jar-closeup.jpg',
    '/assets/shito/supermarket/blue-jar-kitchen.jpg'
  ],
  'ks-green-250': [
    '/assets/shito/supermarket/green-clean-plain.jpg',
    '/assets/shito/supermarket/green-clean-branded.jpg',
    '/assets/shito/supermarket/green-studio-front.jpg',
    '/assets/shito/supermarket/green-studio-angle.jpg',
    '/assets/shito/supermarket/green-jar-shelf-1.jpg',
    '/assets/shito/supermarket/green-jar-table.jpg',
    '/assets/shito/supermarket/green-jar-closeup.jpg',
    '/assets/shito/supermarket/green-jar-kitchen.jpg'
  ],
  'ks-gold-250': [
    '/assets/shito/supermarket/gold-clean-plain.jpg',
    '/assets/shito/supermarket/gold-clean-branded.jpg',
    '/assets/shito/supermarket/gold-jar-front.jpg',
    '/assets/shito/supermarket/lineup-clean-plain.jpg',
    '/assets/shito/supermarket/lineup-group-table.jpg'
  ],
  'ks-bundle-trio': [
    '/assets/shito/supermarket/lineup-clean-plain.jpg',
    '/assets/shito/supermarket/lineup-clean-branded.jpg',
    '/assets/shito/supermarket/lineup-trio-shelf.jpg',
    '/assets/shito/supermarket/lineup-all-4-jars.jpg',
    '/assets/shito/supermarket/lineup-group-table.jpg'
  ],
  'ks-bundle-quad': [
    '/assets/shito/supermarket/lineup-clean-branded.jpg',
    '/assets/shito/supermarket/lineup-all-4-jars.jpg',
    '/assets/shito/supermarket/lineup-clean-plain.jpg',
    '/assets/shito/supermarket/lineup-group-table.jpg',
    '/assets/shito/supermarket/lineup-trio-shelf.jpg'
  ],
  'ks-bundle-chips': [
    '/assets/shito/supermarket/lineup-group-table.jpg',
    '/assets/shito/supermarket/lineup-clean-plain.jpg',
    '/assets/shito/supermarket/red-jar-table.jpg',
    '/assets/shito/supermarket/blue-jar-table.jpg'
  ],
  'ks-wholesale-carton12': [
    '/assets/shito/supermarket/lineup-carton-display.jpg',
    '/assets/shito/supermarket/lineup-supermarket-stack.jpg',
    '/assets/shito/supermarket/lineup-clean-plain.jpg'
  ],
  'ks-wholesale-crate24': [
    '/assets/shito/supermarket/lineup-supermarket-stack.jpg',
    '/assets/shito/supermarket/lineup-carton-display.jpg',
    '/assets/shito/supermarket/lineup-group-table.jpg'
  ]
};

// Finds a product by its primary slug, ID, or slug alias (case-insensitive)
export function getShitoProductBySlug(slugOrId) {
  if (!slugOrId || typeof slugOrId !== 'string') return null;
  const clean = slugOrId.trim().toLowerCase();
  return (
    SUPERMARKET_PRODUCTS.find(
      (p) =>
        p.slug.toLowerCase() === clean ||
        p.id.toLowerCase() === clean ||
        (Array.isArray(p.slugAliases) && p.slugAliases.some((alias) => alias.toLowerCase() === clean))
    ) || null
  );
}

// Canonical share URL for any shito product
export function getShitoShareUrl(product) {
  if (!product) return 'https://farms.koneacademy.io/food/shito';
  return `https://farms.koneacademy.io/food/shito/${product.slug}`;
}

// Formatted share text for social media (WhatsApp, Twitter, iMessage, etc.)
export function getShitoShareText(product) {
  if (!product) return 'Kone Shito — Authentic Ghanaian Black Pepper Sauce by Kone Farms.';
  return `Kone Shito ${product.name} (${product.weight}) — ${product.subtitle}.\nGH₵ ${product.price.toFixed(2)}`;
}
