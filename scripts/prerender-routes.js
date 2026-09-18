import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error("Template dist/index.html not found! Run vite build first.");
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

const routes = [
  {
    path: 'farms',
    title: 'Organic Farmlands & Fair-Trade Sourcing | Kone Farms',
    desc: 'Direct farming partnerships across Ghana cultivating Golden Plantain, White Yam, and Scotch Bonnet peppers under 100% fair-trade standards.',
    canonical: 'https://farms.koneacademy.io/farms'
  },
  {
    path: 'food',
    title: 'Kone Chips & Artisanal Packaged Foods | Kone Farms',
    desc: 'Premium packaged food products featuring crisp kettle-cooked plantain, yam, and potato chips paired with authentic savory Kone Shito black pepper sauce.',
    canonical: 'https://farms.koneacademy.io/food'
  },
  {
    path: 'agritech',
    title: 'smartFarm IoT Telemetry & Precision Agriculture | Kone Farms',
    desc: 'Intelligent agricultural IoT telemetry. Real-time soil moisture sensors, weather stations, and automated solar drip irrigation calculators.',
    canonical: 'https://farms.koneacademy.io/agritech'
  },
  {
    path: 'market',
    title: 'The Kone Market | Artisanal Foods, Bulk Harvest & smartFarm Hardware',
    desc: 'Official Kone storefront. Purchase wholesale cartons of Kone Chips & Shito, source organic bulk plantains & yams, or procure smartFarm IoT hardware.',
    canonical: 'https://farms.koneacademy.io/market'
  },
  {
    path: 'blog',
    title: 'Agritech Research & Scientific Whitepapers | Kone Farms Blog',
    desc: 'Publication-grade agritech research on Musa paradisiaca L. physiology, NPK sensor calibration, poultry environmental automation, and LoRa mesh networks.',
    canonical: 'https://farms.koneacademy.io/blog'
  },
  {
    path: 'sitemap',
    title: 'Subdomain Architecture & Resource Directory | Kone Farms Sitemap',
    desc: 'Complete architectural directory and resource index of all Kone Farms division sections, research studies, IoT tools, and sister ecosystems.',
    canonical: 'https://farms.koneacademy.io/sitemap'
  },
  {
    path: 'blog/plantain-musa-paradisiaca-precision-agritech-west-africa',
    title: 'Precision Agritech & Musa paradisiaca L. Telemetry | Kone Farms Blog',
    desc: 'A publication-grade research study on Musa paradisiaca L. cultivation in West Africa with multi-sensor IoT telemetry and Black Sigatoka mitigation.',
    canonical: 'https://farms.koneacademy.io/blog/plantain-musa-paradisiaca-precision-agritech-west-africa'
  },
  {
    path: 'blog/solar-esp32-lora-soil-moisture-ghana',
    title: 'Autonomous Solar ESP32 LoRa Soil Moisture Network | Kone Farms Blog',
    desc: 'Hardware BOM, schematic design, and power budget analysis for an off-grid ESP32-S3 and SX1262 LoRa mesh node with MPPT solar harvesting.',
    canonical: 'https://farms.koneacademy.io/blog/solar-esp32-lora-soil-moisture-ghana'
  },
  {
    path: 'blog/greenhouse-microclimate-npk-sensor-calibration',
    title: 'Greenhouse Microclimate Dynamics & NPK Calibration | Kone Farms Blog',
    desc: 'Mathematical validation and calibration protocols for optical and dielectric NPK soil sensors in tropical greenhouse environments.',
    canonical: 'https://farms.koneacademy.io/blog/greenhouse-microclimate-npk-sensor-calibration'
  },
  {
    path: 'blog/poultry-ammonia-nh3-environmental-control',
    title: 'Autonomous Poultry Environmental Control & NH3 Scrubbing | Kone Farms Blog',
    desc: 'Real-time ammonia (NH3) telemetry and closed-loop ventilation automation for tropical commercial broiler housing.',
    canonical: 'https://farms.koneacademy.io/blog/poultry-ammonia-nh3-environmental-control'
  }
];

console.log("Generating static HTML files for clean GitHub Pages 200 OK routing...");

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

  const targetDir = path.join(distDir, r.path);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, html, 'utf8');
  console.log(`  ✓ Generated: dist/${r.path}/index.html`);
}

console.log("\nAll static clean routes successfully generated!");
