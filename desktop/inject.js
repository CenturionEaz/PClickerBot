/**
 * PokéClicker Desktop Client Patcher & Injector
 * Safely integrates the master bot directly into index.html
 */

const fs = require('fs');
const path = require('path');

const appData = process.env.APPDATA || path.join(process.env.USERPROFILE, 'AppData', 'Roaming');
const desktopDocsDir = path.join(appData, 'pokeclicker-desktop', 'pokeclicker-master', 'docs');
const htmlPath = path.join(desktopDocsDir, 'index.html');
const bakPath = path.join(desktopDocsDir, 'index.html.bak');
const botSourcePath = path.join(__dirname, 'pokeclicker-bot.js');
const botDestPath = path.join(desktopDocsDir, 'pokeclicker-bot.js');

const SCRIPT_TAG = '<script src="pokeclicker-bot.js"></script>';

function checkInstallation() {
  if (!fs.existsSync(htmlPath)) {
    console.error(`[Error] Could not find PokéClicker desktop installation at:\n${htmlPath}`);
    return false;
  }
  return true;
}

function install() {
  console.log('[Installer] Starting PokéClicker Desktop Bot Injection...');

  if (!checkInstallation()) return;

  // 1. Copy bot bundle into desktop docs folder
  console.log(`[Installer] Copying bot bundle to:\n${botDestPath}`);
  fs.copyFileSync(botSourcePath, botDestPath);

  // 2. Backup index.html if backup does not already exist
  if (!fs.existsSync(bakPath)) {
    console.log(`[Installer] Creating safe backup at:\n${bakPath}`);
    fs.copyFileSync(htmlPath, bakPath);
  }

  // 3. Inject script tag into index.html right after script.min.js or before </head>
  let html = fs.readFileSync(htmlPath, 'utf8');

  // Remove existing occurrences if any to avoid duplicates
  while (html.includes(SCRIPT_TAG)) {
    html = html.replace(SCRIPT_TAG, '');
  }

  if (html.includes('scripts/script.min.js')) {
    html = html.replace(/(<script src="scripts\/script\.min\.js[^>]*><\/script>)/i, `$1\n  ${SCRIPT_TAG}`);
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log('[Installer] Injected <script src="pokeclicker-bot.js"></script> directly after script.min.js in <head>!');
  } else if (html.includes('</head>')) {
    html = html.replace('</head>', `  ${SCRIPT_TAG}\n</head>`);
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log('[Installer] Injected <script src="pokeclicker-bot.js"></script> before </head>!');
  } else if (html.includes('</body>')) {
    html = html.replace('</body>', `  ${SCRIPT_TAG}\n</body>`);
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log('[Installer] Injected <script src="pokeclicker-bot.js"></script> before </body>!');
  } else {
    console.error('[Error] Could not find insertion point in index.html.');
    return;
  }

  console.log('\n======================================================');
  console.log('🎉 POKÉCLICKER DESKTOP BOT INJECTED INTO INDEX.HTML!');
  console.log('======================================================\n');
}

function uninstall() {
  console.log('[Uninstaller] Restoring original PokéClicker desktop client...');

  if (!checkInstallation()) return;

  if (fs.existsSync(bakPath)) {
    fs.copyFileSync(bakPath, htmlPath);
    console.log('[Uninstaller] Restored index.html from backup.');
  } else {
    let html = fs.readFileSync(htmlPath, 'utf8');
    html = html.replace(SCRIPT_TAG, '');
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log('[Uninstaller] Removed bot script tag from index.html.');
  }

  console.log('✅ index.html restored to original vanilla state.\n');
}

function status() {
  if (!checkInstallation()) return;
  const html = fs.readFileSync(htmlPath, 'utf8');
  const isInstalled = html.includes(SCRIPT_TAG);
  console.log(`[Status] PokéClicker Desktop Bot Injected in index.html: ${isInstalled ? 'YES (ACTIVE)' : 'NO'}`);
  console.log(`[Status] Bot Bundle Present in Docs: ${fs.existsSync(botDestPath) ? 'YES' : 'NO'}`);
}

const arg = process.argv[2] || '--install';
if (arg === '--uninstall') {
  uninstall();
} else if (arg === '--status') {
  status();
} else {
  install();
}
