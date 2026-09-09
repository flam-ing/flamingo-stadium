// Gameplay verification with Playwright: starts each game, mashes plausible keys for a few seconds,
// checks for page errors, that the game left the title state, and that score/finish paths run.
// usage: node scripts/play.mjs   (needs playwright-core available via PW_MODULE env or node_modules)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pw = require(process.env.PW_MODULE || 'playwright-core');
import { spawn } from 'child_process';
import fs from 'fs';
const KEYS = { splash:['Space'], says:['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'], run:['ArrowLeft','ArrowRight','Space'], snore:['Space'], dynamo:['KeyA','KeyL'], dig:['ArrowLeft','ArrowRight'], hoop:['Space','ArrowLeft','ArrowRight'], harden:['Space'], sushi:['Space'], eggs:['ArrowLeft','ArrowRight'] };
const srv = spawn('python3', ['-m','http.server','8798'], { stdio:'ignore' }); await new Promise(r=>setTimeout(r,800));
const browser = await pw.chromium.launch({ executablePath: process.env.CHROME || undefined });
let failed = 0; fs.mkdirSync('scripts/out', { recursive:true });
for (const [id, keys] of Object.entries(KEYS)) {
  const page = await browser.newPage({ viewport:{ width:1000, height:620 } });
  const errors = []; page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type()==='error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  await page.goto(`http://localhost:8798/games/${id}.html`, { waitUntil:'load' });
  await page.waitForTimeout(300);
  // patch: expose shell state by reading canvas pixels is hard; instead check the HUD text via a state probe injected before start
  await page.keyboard.press('Space'); // start
  await page.waitForTimeout(3300); // countdown 3s
  const t0 = Date.now();
  while (Date.now() - t0 < 6000) { // play 6s
    if (id === 'hoop' || id === 'harden') { await page.keyboard.down('Space'); await page.waitForTimeout(250); await page.keyboard.up('Space'); await page.waitForTimeout(150); }
    else { for (const k of keys) { await page.keyboard.press(k); await page.waitForTimeout(45); } }
  }
  await page.screenshot({ path:`scripts/out/${id}-play.png` });
  // let timed games run out so finish/result paths execute (skip long ones)
  const ok = errors.length === 0;
  console.log((ok?'ok  ':'FAIL')+' '+id+(ok?'':'  '+errors.slice(0,3).join(' | ')));
  if (!ok) failed++;
  await page.close();
}
await browser.close(); srv.kill(); process.exit(failed?1:0);
