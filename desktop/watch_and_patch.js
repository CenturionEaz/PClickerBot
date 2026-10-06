/**
 * PokéClicker Desktop Client - Background Watcher & Auto-Patcher
 * Watches index.html and re-applies bot script tag immediately if a game update replaces it.
 */

const fs = require('fs');
const path = require('path');

const appData = process.env.APPDATA || path.join(process.env.USERPROFILE, 'AppData', 'Roaming');
const desktopDocsDir = path.join(appData, 'pokeclicker-desktop', 'pokeclicker-master', 'docs');
const htmlPath = path.join(desktopDocsDir, 'index.html');
const botSourcePath = path.join(__dirname, 'pokeclicker-bot.js');
const botDestPath = path.join(desktopDocsDir, 'pokeclicker-bot.js');

const SCRIPT_TAG = '<script src="pokeclicker-bot.js"></script>';

console.log('[Watcher] Monitoring PokéClicker desktop files for updates...');
console.log(`[Watcher] Target: ${htmlPath}`);

function verifyAndPatch() {
  try {
    if (!fs.existsSync(htmlPath)) return;

    // Check bot file exists in docs
    if (!fs.existsSync(botDestPath) && fs.existsSync(botSourcePath)) {
      fs.copyFileSync(botSourcePath, botDestPath);
      console.log('[Watcher] Re-copied pokeclicker-bot.js into docs folder.');
    }

    // Check script tag in index.html
    let html = fs.readFileSync(htmlPath, 'utf8');
    if (!html.includes(SCRIPT_TAG)) {
      console.log('[Watcher] Game update detected! Re-injecting bot script tag...');
      if (html.includes('</body>')) {
        html = html.replace('</body>', `  ${SCRIPT_TAG}\n</body>`);
        fs.writeFileSync(htmlPath, html, 'utf8');
        console.log('[Watcher] Re-injected script tag successfully.');
      }
    }
  } catch (e) {
    console.error('[Watcher Error]', e.message);
  }
}

// Initial check
verifyAndPatch();

// Watch docs folder
if (fs.existsSync(desktopDocsDir)) {
  fs.watch(desktopDocsDir, (eventType, filename) => {
    if (filename === 'index.html' || filename === 'pokeclicker-bot.js') {
      setTimeout(verifyAndPatch, 300);
    }
  });
  console.log('[Watcher] Live file watcher active. You may minimize this window.');
} else {
  console.warn('[Watcher] Desktop docs folder does not exist yet.');
}
