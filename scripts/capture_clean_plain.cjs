const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\96664a42-c53d-4e12-9220-aca550f24491';

async function capture() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:4173/#shito ...');
  await page.goto('http://localhost:4173/#shito', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Top of page showing ultra-minimal header, search, and pills
  console.log('Capturing top hero header...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '32_ultra_minimal_desktop.png'),
    fullPage: false
  });

  // 2. Scrolled directly to product cards
  console.log('Capturing product cards...');
  await page.evaluate(() => {
    const card = document.querySelector('.supermarket-card');
    if (card) card.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '33_ultra_minimal_card_grid.png'),
    fullPage: false
  });

  // 3. Wooden Shelf View
  console.log('Capturing Wooden Shelf View...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('.view-toggle-btn'));
    const btn = buttons.find(b => b.textContent.includes('Shelf'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => {
    const plank = document.querySelector('.supermarket-rack-tier');
    if (plank) plank.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '34_ultra_minimal_shelf.png'),
    fullPage: false
  });

  // 4. Mobile Viewport
  console.log('Capturing Mobile View...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('.view-toggle-btn'));
    const btn = buttons.find(b => b.textContent.includes('Grid'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => {
    const card = document.querySelector('.supermarket-card');
    if (card) card.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '35_ultra_minimal_mobile.png'),
    fullPage: false
  });

  await browser.close();
  console.log('All ultra-minimal screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
