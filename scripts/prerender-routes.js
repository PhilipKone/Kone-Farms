import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SUPERMARKET_PRODUCTS } from '../src/data/shitoProducts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error("Template dist/index.html not found! Run vite build first.");
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

const baseRoutes = [
  {
    path: 'farms',
    title: 'Organic Farmlands & Fair-Trade Sourcing | Kone Farms',
    desc: 'Direct farming partnerships across Ghana cultivating Golden Plantain, White Yam, and Scotch Bonnet peppers under 100% fair-trade standards.',
    canonical: 'https://farms.koneacademy.io/farms',
    image: 'https://farms.koneacademy.io/og-image.png?v=4'
  },
  {
    path: 'food',
    title: 'Kone Chips & Artisanal Packaged Foods | Kone Farms',
    desc: 'Premium packaged food products featuring crisp kettle-cooked plantain, yam, and potato chips paired with authentic savory Kone Shito black pepper sauce.',
    canonical: 'https://farms.koneacademy.io/food',
    image: 'https://farms.koneacademy.io/assets/shito/supermarket/lineup-clean-plain.jpg',
    imageWidth: 1024,
    imageHeight: 1024,
    imageAlt: 'Kone Chips and Authentic Kone Shito Artisanal Lineup'
  },
  {
    path: 'shito',
    title: 'Kone Shito | Authentic Ghanaian Black Pepper Sauce | Kone Farms',
    desc: 'Buy authentic artisanal Kone Shito hot pepper sauce online. Handcrafted smallholder Ghanaian sauce: Red Edition Scotch Bonnet, Coastal Blue Delta Prawn, Green Edition Kpakpo, and Collector Trio Boxes.',
    canonical: 'https://farms.koneacademy.io/shito',
    image: 'https://farms.koneacademy.io/assets/shito/supermarket/lineup-clean-plain.jpg',
    imageWidth: 1024,
    imageHeight: 1024,
    imageAlt: 'Kone Shito Artisanal Lineup — Authentic Ghanaian Black Pepper Sauce',
    crawlableHtml: `
      <main style="font-family:sans-serif;max-width:800px;margin:2rem auto;padding:1rem;color:#fff;">
        <h1>Kone Shito Supermarket — Authentic Ghanaian Black Pepper Sauce</h1>
        <p>Handcrafted by Kone Farms using organic Ghanaian Scotch Bonnet peppers, wild smoked Volta river prawns, coastal herring, and cold-pressed oil.</p>
        <section>
          <h2>Kone Shito Red Edition (250g Glass Jar) — GHS 45.00</h2>
          <p>Scotch Bonnet & Smoked Seafood • 82,000 SHU Extra Hot. Slow-caramelized with pink shallots, sun-dried Volta delta prawns, and smoked herring.</p>
        </section>
        <section>
          <h2>Kone Shito Blue Edition (250g Glass Jar) — GHS 45.00</h2>
          <p>Volta Delta River Prawn • 42,000 SHU Classic Medium. Heavy on coarse-ground dried estuary river prawns and smoked coastal herring.</p>
        </section>
        <section>
          <h2>Kone Shito Green Edition (250g Glass Jar) — GHS 45.00</h2>
          <p>Kpakpo Shito & Fresh Green Herbs • 28,000 SHU Mild Tangy Zest. Heirloom green bonnet peppers and fresh shallots.</p>
        </section>
        <section>
          <h2>Kone Shito Gold Edition (250g Glass Jar) — GHS 55.00</h2>
          <p>12-Hour Copper Kettle Reserve • 65,000 SHU Connoisseur Hot. Triple-smoked estuary crayfish and caramelized aged ginger.</p>
        </section>
        <section>
          <h2>Kone Shito Collector Trio Box (3 x 250g) — GHS 120.00</h2>
          <p>The Complete Collection: 1x Red, 1x Blue, 1x Green in premium presentation gift packaging.</p>
        </section>
        <section>
          <h2>Wholesale Master Carton (12 Jars) — GHS 450.00</h2>
          <p>Bulk stockist lot for restaurants, retail shelves, and export grocery.</p>
        </section>
      </main>
    `
  },
  {
    path: 'food/shito',
    title: 'Kone Shito | Authentic Ghanaian Black Pepper Sauce | Kone Farms',
    desc: 'Buy authentic artisanal Kone Shito hot pepper sauce online. Handcrafted smallholder Ghanaian sauce: Red Edition Scotch Bonnet, Coastal Blue Delta Prawn, Green Edition Kpakpo, and Collector Trio Boxes.',
    canonical: 'https://farms.koneacademy.io/food/shito',
    image: 'https://farms.koneacademy.io/assets/shito/supermarket/lineup-clean-branded.jpg',
    imageWidth: 1024,
    imageHeight: 1024,
    imageAlt: 'Kone Shito Artisanal Lineup — Authentic Ghanaian Black Pepper Sauce with Official Recipe Labels'
  },
  {
    path: 'agritech',
    title: 'smartFarm IoT Architecture & Precision Agritech Blueprints | Kone Farms',
    desc: 'Open-source engineering and IoT blueprints for tropical agriculture. Researching solar telemetry, precision soil moisture sensing, and low-waste irrigation.',
    canonical: 'https://farms.koneacademy.io/agritech',
    image: 'https://farms.koneacademy.io/og-image.png?v=4'
  },
  {
    path: 'market',
    title: 'Kone Market | Artisanal Foods, Bulk Harvest & Wholesale Cartons | Kone Farms',
    desc: 'Official Kone Market storefront. Purchase wholesale cartons of Kone Shito & Kone Chips, or source organic bulk farm harvest.',
    canonical: 'https://farms.koneacademy.io/market',
    image: 'https://farms.koneacademy.io/assets/shito/supermarket/lineup-clean-plain.jpg'
  },
  {
    path: 'blog',
    title: 'Agritech Research & Scientific Whitepapers | Kone Farms Blog',
    desc: 'Publication-grade agritech research on Musa paradisiaca L. physiology, NPK sensor calibration, poultry environmental automation, and LoRa mesh networks.',
    canonical: 'https://farms.koneacademy.io/blog',
    image: 'https://farms.koneacademy.io/og-image.png?v=4'
  },
  {
    path: 'sitemap',
    title: 'Subdomain Architecture & Resource Directory | Kone Farms Sitemap',
    desc: 'Complete architectural directory and resource index of all Kone Farms division sections, research studies, IoT tools, and sister ecosystems.',
    canonical: 'https://farms.koneacademy.io/sitemap',
    image: 'https://farms.koneacademy.io/og-image.png?v=4'
  },
  {
    path: 'blog/plantain-musa-paradisiaca-precision-agritech-west-africa',
    title: 'Precision Agritech & Musa paradisiaca L. Telemetry | Kone Farms Blog',
    desc: 'A publication-grade research study on Musa paradisiaca L. cultivation in West Africa with multi-sensor IoT telemetry and Black Sigatoka mitigation.',
    canonical: 'https://farms.koneacademy.io/blog/plantain-musa-paradisiaca-precision-agritech-west-africa',
    image: 'https://farms.koneacademy.io/og-image.png?v=4'
  },
  {
    path: 'blog/solar-esp32-lora-soil-moisture-ghana',
    title: 'Autonomous Solar ESP32 LoRa Soil Moisture Network | Kone Farms Blog',
    desc: 'Hardware BOM, schematic design, and power budget analysis for an off-grid ESP32-S3 and SX1262 LoRa mesh node with MPPT solar harvesting.',
    canonical: 'https://farms.koneacademy.io/blog/solar-esp32-lora-soil-moisture-ghana',
    image: 'https://farms.koneacademy.io/og-image.png?v=4'
  },
  {
    path: 'blog/greenhouse-microclimate-npk-sensor-calibration',
    title: 'Greenhouse Microclimate Dynamics & NPK Calibration | Kone Farms Blog',
    desc: 'Mathematical validation and calibration protocols for optical and dielectric NPK soil sensors in tropical greenhouse environments.',
    canonical: 'https://farms.koneacademy.io/blog/greenhouse-microclimate-npk-sensor-calibration',
    image: 'https://farms.koneacademy.io/og-image.png?v=4'
  },
  {
    path: 'blog/poultry-ammonia-nh3-environmental-control',
    title: 'Autonomous Poultry Environmental Control & NH3 Scrubbing | Kone Farms Blog',
    desc: 'Real-time ammonia (NH3) telemetry and closed-loop ventilation automation for tropical commercial broiler housing.',
    canonical: 'https://farms.koneacademy.io/blog/poultry-ammonia-nh3-environmental-control',
    image: 'https://farms.koneacademy.io/og-image.png?v=4'
  },
  {
    path: 'blog/smartfarm-telemetry-iot-sensor-array',
    title: 'smartFarm Telemetry Architecture & Sensor Arrays | Kone Farms Blog',
    desc: 'An open-source hardware blueprint for multi-depth soil moisture, temperature, and solar irradiance telemetry in tropical agriculture.',
    canonical: 'https://farms.koneacademy.io/blog/smartfarm-telemetry-iot-sensor-array',
    image: 'https://farms.koneacademy.io/og-image.png?v=4'
  },
  {
    path: 'blog/iot-water-valves-automated-drip-irrigation',
    title: 'IoT Water Valves & Automated Micro-Drip Irrigation | Kone Farms Blog',
    desc: 'Low-power bi-stable pulse-latching solenoid valve controllers driven by rhizosphere moisture deficit thresholds for water conservation.',
    canonical: 'https://farms.koneacademy.io/blog/iot-water-valves-automated-drip-irrigation',
    image: 'https://farms.koneacademy.io/og-image.png?v=4'
  }
];

// Generate dedicated product routes with specific Open Graph thumbnails
const productRoutes = [];

for (const p of SUPERMARKET_PRODUCTS) {
  const productTitle = `Kone Shito ${p.name} (${p.weight}) | Kone Farms`;
  const productCanonical = `https://farms.koneacademy.io/food/shito/${p.slug}`;
  const crawlableHtml = `
    <main style="font-family:sans-serif;max-width:800px;margin:2rem auto;padding:1rem;color:#fff;">
      <h1>Kone Shito ${p.name} (${p.weight})</h1>
      <p style="font-size:1.2rem;color:#10b981;font-weight:bold;">Price: GH₵ ${p.price.toFixed(2)}</p>
      <p><strong>Heat Level:</strong> ${p.heatRating}</p>
      <p>${p.description}</p>
      <h3>Ingredients:</h3>
      <p>${p.ingredients}</p>
      <h3>Pairings:</h3>
      <p>${p.pairings ? p.pairings.join(', ') : 'Waakye, Fried Yam, Rice'}</p>
      <img src="${p.primaryImage}" alt="Kone Shito ${p.name} (${p.weight})" style="max-width:100%;border-radius:12px;margin:1.5rem 0;" />
      <p><a href="${productCanonical}" style="color:#10b981;font-weight:bold;">Order ${p.name} Online at Kone Farms</a></p>
    </main>
  `;

  const routeConfig = {
    title: productTitle,
    desc: p.description,
    canonical: productCanonical,
    image: p.ogImage,
    imageWidth: 1024,
    imageHeight: 1024,
    imageAlt: `Kone Shito ${p.name} (${p.weight}) Jar with Official Recipe Label`,
    crawlableHtml
  };

  // Primary route: food/shito/<slug>
  productRoutes.push({
    ...routeConfig,
    path: `food/shito/${p.slug}`
  });

  // Alias route: shito/<slug>
  productRoutes.push({
    ...routeConfig,
    path: `shito/${p.slug}`
  });

  // Alias route: food/shito/<id>
  productRoutes.push({
    ...routeConfig,
    path: `food/shito/${p.id}`
  });

  // Additional aliases (e.g. red-edition)
  if (Array.isArray(p.slugAliases)) {
    for (const alias of p.slugAliases) {
      if (alias !== p.slug && alias !== p.id) {
        productRoutes.push({
          ...routeConfig,
          path: `food/shito/${alias}`
        });
      }
    }
  }
}

const routes = [...baseRoutes, ...productRoutes];

console.log("Generating static HTML files for clean GitHub Pages 200 OK routing with dedicated OG thumbnails...");

for (const r of routes) {
  let html = template;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${r.title}</title>`);

  // Replace Canonical
  html = html.replace(/<link rel="canonical" href=".*?" \/>/i, `<link rel="canonical" href="${r.canonical}" />`);

  // Replace Meta Description
  html = html.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${r.desc}" />`);

  // Replace OpenGraph Title, Description, Url
  html = html.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${r.title}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${r.desc}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${r.canonical}" />`);

  // Replace Twitter Title, Description, Url
  html = html.replace(/<meta property="twitter:title" content=".*?" \/>/i, `<meta property="twitter:title" content="${r.title}" />`);
  html = html.replace(/<meta property="twitter:description" content=".*?" \/>/i, `<meta property="twitter:description" content="${r.desc}" />`);
  html = html.replace(/<meta property="twitter:url" content=".*?" \/>/i, `<meta property="twitter:url" content="${r.canonical}" />`);

  // Replace OpenGraph and Twitter Image
  const imgUrl = r.image || 'https://farms.koneacademy.io/og-image.png?v=4';
  html = html.replace(/<meta property="og:image" content=".*?" \/>/i, `<meta property="og:image" content="${imgUrl}" />`);
  html = html.replace(/<meta property="og:image:secure_url" content=".*?" \/>/i, `<meta property="og:image:secure_url" content="${imgUrl}" />`);
  html = html.replace(/<meta property="twitter:image" content=".*?" \/>/i, `<meta property="twitter:image" content="${imgUrl}" />`);

  const imgW = r.imageWidth || 1200;
  const imgH = r.imageHeight || 630;
  const imgAlt = r.imageAlt || r.title;
  html = html.replace(/<meta property="og:image:width" content=".*?" \/>/i, `<meta property="og:image:width" content="${imgW}" />`);
  html = html.replace(/<meta property="og:image:height" content=".*?" \/>/i, `<meta property="og:image:height" content="${imgH}" />`);
  html = html.replace(/<meta property="og:image:alt" content=".*?" \/>/i, `<meta property="og:image:alt" content="${imgAlt}" />`);

  // Inject crawlable fallback HTML into <div id="root"> for search engine indexing
  if (r.crawlableHtml) {
    html = html.replace('<div id="root"></div>', `<div id="root"><noscript>${r.crawlableHtml}</noscript></div>`);
  }

  const targetDir = path.join(distDir, r.path);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, html, 'utf8');
  console.log(`  ✓ Generated: dist/${r.path}/index.html`);
}

console.log("\nAll static clean routes successfully generated with product-specific OG images!");
