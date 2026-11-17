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
    price: 40.0,
    originalPrice: null,
    weight: '250g Glass Jar',
    heatRating: '82,000 SHU • Extra Hot',
    heatColor: '#ef4444',
    badge: 'HOTTEST SELLER',
    badgeColor: '#dc2626',
    barcode: '079458210401',
    primaryImage: '/assets/shito/supermarket/red-clean-branded.jpg',
    ogImage: 'https://farms.codkon.com/assets/shito/supermarket/red-clean-branded.jpg',
    galleryImages: [
      '/assets/shito/supermarket/red-clean-branded.jpg',
      '/assets/shito/supermarket/red-clean-plain.jpg',
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
    price: 40.0,
    originalPrice: null,
    weight: '250g Glass Jar',
    heatRating: '42,000 SHU • Classic Medium',
    heatColor: '#3b82f6',
    badge: 'COASTAL FAVORITE',
    badgeColor: '#2563eb',
    barcode: '079458210402',
    primaryImage: '/assets/shito/supermarket/blue-clean-branded.jpg',
    ogImage: 'https://farms.codkon.com/assets/shito/supermarket/blue-clean-branded.jpg',
    galleryImages: [
      "/assets/shito/supermarket/blue-clean-branded.jpg",
      "/assets/shito/supermarket/blue-clean-plain.jpg"
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
    price: 40.0,
    originalPrice: null,
    weight: '250g Glass Jar',
    heatRating: '16,000 SHU • Aromatic Mild',
    heatColor: '#10b981',
    badge: 'FRESH HARVEST',
    badgeColor: '#16a34a',
    barcode: '079458210403',
    primaryImage: '/assets/shito/supermarket/green-clean-branded.jpg',
    ogImage: 'https://farms.codkon.com/assets/shito/supermarket/green-clean-branded.jpg',
    galleryImages: [
      '/assets/shito/supermarket/green-clean-branded.jpg',
      '/assets/shito/supermarket/green-clean-plain.jpg'
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
    id: 'ks-green-studio-250',
    slug: 'green-studio',
    slugAliases: ['green-studio-edition', 'ks-green-studio-250'],
    name: 'Green Studio Edition',
    shortName: 'Green Studio',
    subtitle: 'Botanical Studio Reserve',
    aisle: 'green',
    price: 45.0,
    originalPrice: null,
    weight: '250g Glass Jar',
    heatRating: '16,000 SHU • Aromatic Mild',
    heatColor: '#10b981',
    badge: 'STUDIO RESERVE',
    badgeColor: '#059669',
    barcode: '079458210430',
    primaryImage: '/assets/shito/supermarket/green-studio-front.jpg',
    ogImage: 'https://farms.codkon.com/assets/shito/supermarket/green-studio-front.jpg',
    galleryImages: [
      '/assets/shito/supermarket/green-studio-front.jpg',
      '/assets/shito/supermarket/green-studio-angle.jpg',
      '/assets/shito/supermarket/green-clean-branded.jpg'
    ],
    labelTexture: '/assets/shito/shito-label-green.png',
    lidHex: 0x16a34a,
    description:
      'Botanical studio reserve. Showcasing the vibrant emerald hue and artisanal glass clarity of native green Kpakpo Shito under pristine studio lighting.',
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
    price: 100.0,
    originalPrice: null,
    weight: '500g Glass Jar',
    heatRating: '65,000 SHU • Connoisseur Hot',
    heatColor: '#f59e0b',
    badge: 'LIMITED RESERVE',
    badgeColor: '#d97706',
    barcode: '079458210404',
    primaryImage: '/assets/shito/supermarket/gold-clean-branded.jpg',
    ogImage: 'https://farms.codkon.com/assets/shito/supermarket/gold-clean-branded.jpg',
    galleryImages: [
      '/assets/shito/supermarket/gold-clean-branded.jpg',
      '/assets/shito/supermarket/gold-clean-plain.jpg'
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
    slug: 'quartet',
    slugAliases: ['quartet-collection', 'trio', 'trio-collection', 'trio-box'],
    name: 'The Quartet Collection',
    shortName: 'Quartet Collection',
    subtitle: 'Red, Blue, Green & Gold (4x 250g)',
    aisle: 'bundles',
    price: 120.0,
    originalPrice: 135.0,
    weight: '4 x 250g (1000g Net)',
    heatRating: 'Mild to Fiery Spectrum',
    heatColor: '#f59e0b',
    badge: 'SPECIAL',
    badgeColor: '#d97706',
    barcode: '079458210410',
    primaryImage: '/assets/shito/supermarket/lineup-clean-branded.jpg',
    ogImage: 'https://farms.codkon.com/assets/shito/supermarket/lineup-clean-branded.jpg',
    galleryImages: [
      '/assets/shito/supermarket/lineup-clean-branded.jpg',
      '/assets/shito/supermarket/lineup-clean-plain.jpg'
    ],
    labelTexture: '/assets/shito/shito-label-red.png',
    lidHex: 0xdc2626,
    description:
      'The definitive Ghanaian pantry gift box. Contains one jar each of Fiery Red Scotch Bonnet, Seafood Heritage Blue, Emerald Kpakpo Green, and 12-Hour Copper Kettle Gold, packed in a gold-foil gift carton.',
    ingredients: 'Contains full jars of Red Edition (250g), Blue Edition (250g), Green Edition (250g), and Gold Edition (250g).',
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
];

// Compile-time static image mapping
export const PRODUCT_IMAGE_MAP = {
  'ks-red-250': '/assets/shito/supermarket/red-clean-branded.jpg',
  'ks-blue-250': '/assets/shito/supermarket/blue-clean-branded.jpg',
  'ks-green-250': '/assets/shito/supermarket/green-clean-branded.jpg',
  'ks-green-studio-250': '/assets/shito/supermarket/green-studio-front.jpg',
  'ks-gold-250': '/assets/shito/supermarket/gold-clean-branded.jpg',
  'ks-bundle-trio': '/assets/shito/supermarket/lineup-clean-branded.jpg',
};

export const PRODUCT_GALLERY_MAP = {
  'ks-red-250': [
    '/assets/shito/supermarket/red-clean-branded.jpg',
    '/assets/shito/supermarket/red-clean-plain.jpg',
    '/assets/shito/supermarket/red-studio-front.jpg',
    '/assets/shito/supermarket/red-studio-angle.jpg',
    '/assets/shito/supermarket/red-jar-closeup.jpg',
    '/assets/shito/supermarket/red-jar-shelf-1.jpg',
    '/assets/shito/supermarket/red-jar-table.jpg',
    '/assets/shito/supermarket/red-jar-kitchen.jpg'
  ],
  'ks-blue-250': [
    '/assets/shito/supermarket/blue-clean-branded.jpg',
    '/assets/shito/supermarket/blue-clean-plain.jpg'
  ],
  'ks-green-studio-250': [
    '/assets/shito/supermarket/green-studio-front.jpg',
    '/assets/shito/supermarket/green-studio-angle.jpg'
  ],
  'ks-green-250': [
    '/assets/shito/supermarket/green-clean-branded.jpg',
    '/assets/shito/supermarket/green-clean-plain.jpg'
  ],
  'ks-gold-250': [
    '/assets/shito/supermarket/gold-clean-branded.jpg',
    '/assets/shito/supermarket/gold-clean-plain.jpg'
  ],
  'ks-bundle-trio': [
    '/assets/shito/supermarket/lineup-clean-branded.jpg',
    '/assets/shito/supermarket/lineup-clean-plain.jpg'
  ],
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
  if (!product) return 'https://farms.codkon.com/food/shito';
  return `https://farms.codkon.com/food/shito/${product.slug}`;
}

// Formatted share text for social media (WhatsApp, Twitter, iMessage, etc.)
export function getShitoShareText(product) {
  if (!product) return 'Kone Shito — Authentic Ghanaian Black Pepper Sauce by Kone Farms.';
  return `Kone Shito ${product.name} (${product.weight}) — ${product.subtitle}.\nGH₵ ${product.price.toFixed(2)}`;
}
