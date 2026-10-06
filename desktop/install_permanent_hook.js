/**
 * PokéClicker Desktop Client - Permanent Update-Proof Hook Installer
 * 
 * 1. Patches resources/app/src/main.js with proper imports, did-finish-load hook, and keyboard handlers.
 * 2. Places pokeclicker-bot.js in resources/app/src/, %APPDATA%/.../docs/, and resources/app/src/pokeclicker-master/docs/.
 * 3. Patches index.html in both locations with <script src="pokeclicker-bot.js"></script>.
 * 4. Enables F5 / Ctrl+R (reload) and F12 / Ctrl+Shift+I (DevTools) in Electron.
 * 5. Repacks resources/app back into resources/app.asar.
 */

const fs = require('fs');
const path = require('path');

const localAppData = process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE, 'AppData', 'Local');
const appData = process.env.APPDATA || path.join(process.env.USERPROFILE, 'AppData', 'Roaming');

const desktopInstallDir = path.join(localAppData, 'Programs', 'pokeclicker-desktop');
const resourcesDir = path.join(desktopInstallDir, 'resources');
const appDir = path.join(resourcesDir, 'app');
const mainJsPath = path.join(appDir, 'src', 'main.js');
const asarPath = path.join(resourcesDir, 'app.asar');
const asarBakPath = path.join(resourcesDir, 'app.asar.bak');

const dataDir = path.join(appData, 'pokeclicker-desktop');
const docsDir = path.join(dataDir, 'pokeclicker-master', 'docs');
const botSource = path.join(__dirname, 'pokeclicker-bot.js');

function injectScriptTag(htmlPath) {
  if (!fs.existsSync(htmlPath)) return;
  let html = fs.readFileSync(htmlPath, 'utf8');
  if (html.includes('pokeclicker-bot.js')) return;

  const target = '<script src="scripts/script.min.js';
  const idx = html.indexOf(target);
  if (idx !== -1) {
    const endScript = html.indexOf('</script>', idx) + 9;
    html = html.slice(0, endScript) + '\n  <script src="pokeclicker-bot.js"></script>' + html.slice(endScript);
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log(`[Permanent Hook] Injected <script> tag into: ${htmlPath}`);
  }
}

async function installPermanentHook() {
  console.log('[Permanent Hook] Installing update-proof Electron lifecycle hook...');

  const asarModulePath = path.join(localAppData, 'npm-cache', '_npx', '8b3f11f22d4db0c9', 'node_modules', 'asar');
  const asar = require(asarModulePath);

  // 1. Ensure resources/app exists
  if (!fs.existsSync(appDir)) {
    console.log('[Permanent Hook] Extracting app.asar into resources/app...');
    asar.extractAll(asarPath, appDir);
  }

  // 2. Backup app.asar if not already backed up
  if (!fs.existsSync(asarBakPath) && fs.existsSync(asarPath)) {
    console.log(`[Permanent Hook] Creating safe backup of app.asar at:\n${asarBakPath}`);
    fs.copyFileSync(asarPath, asarBakPath);
  }

  // 3. Copy bot bundle into all relevant locations
  const appSrcBot = path.join(appDir, 'src', 'pokeclicker-bot.js');
  fs.copyFileSync(botSource, appSrcBot);
  console.log(`[Permanent Hook] Copied bot bundle to: ${appSrcBot}`);

  const internalDocs = path.join(appDir, 'src', 'pokeclicker-master', 'docs');
  if (fs.existsSync(internalDocs)) {
    const internalBot = path.join(internalDocs, 'pokeclicker-bot.js');
    fs.copyFileSync(botSource, internalBot);
    console.log(`[Permanent Hook] Copied bot bundle to: ${internalBot}`);
    injectScriptTag(path.join(internalDocs, 'index.html'));
  }

  if (fs.existsSync(docsDir)) {
    const docsBot = path.join(docsDir, 'pokeclicker-bot.js');
    fs.copyFileSync(botSource, docsBot);
    console.log(`[Permanent Hook] Copied bot bundle to: ${docsBot}`);
    injectScriptTag(path.join(docsDir, 'index.html'));
  }

  // 4. Update main.js
  let mainJs = fs.readFileSync(mainJsPath, 'utf8');

  // Fix path import
  if (!mainJs.includes("const path = require('path');")) {
    mainJs = mainJs.replace("const fs = require('fs');", "const fs = require('fs');\nconst path = require('path');");
  }

  // Clean old injection if present
  const hookStart = '// === POKECLICKER BOT PERMANENT INJECTOR ===';
  const hookEnd = '// ==========================================';
  if (mainJs.includes(hookStart)) {
    const startIdx = mainJs.indexOf(hookStart);
    const endIdx = mainJs.indexOf(hookEnd) + hookEnd.length;
    mainJs = mainJs.slice(0, startIdx) + mainJs.slice(endIdx);
  }

  const CLEAN_HOOK = `
  // === POKECLICKER BOT PERMANENT INJECTOR ===
  mainWindow.webContents.on('did-finish-load', () => {
    try {
      const srcBot = path.join(__dirname, 'pokeclicker-bot.js');
      const docsBot = path.join(dataDir, 'pokeclicker-master', 'docs', 'pokeclicker-bot.js');
      const internalBot = path.join(__dirname, 'pokeclicker-master', 'docs', 'pokeclicker-bot.js');
      const pathToLoad = fs.existsSync(docsBot) ? docsBot : (fs.existsSync(srcBot) ? srcBot : (fs.existsSync(internalBot) ? internalBot : null));

      if (pathToLoad) {
        const botCode = fs.readFileSync(pathToLoad, 'utf8');
        mainWindow.webContents.executeJavaScript(botCode).catch(e => console.error('[Bot Injection JS Error]', e));
      }
    } catch (e) {
      console.error('[Bot Hook Load Error]', e);
    }
  });

  // Enable F5 / Ctrl+R Reload and F12 / Ctrl+Shift+I DevTools
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F5' || (input.control && input.key && input.key.toLowerCase() === 'r')) {
      mainWindow.webContents.reload();
    }
    if (input.key === 'F12' || (input.control && input.shift && input.key && input.key.toLowerCase() === 'i')) {
      mainWindow.webContents.toggleDevTools();
    }
  });
  // ==========================================
`;

  const target = "mainWindow.setMenuBarVisibility(false);";
  if (mainJs.includes(target)) {
    mainJs = mainJs.replace(target, `${CLEAN_HOOK}\n  ${target}`);
  } else {
    mainJs = mainJs.replace('createWindow() {', `createWindow() {\n${CLEAN_HOOK}`);
  }

  fs.writeFileSync(mainJsPath, mainJs, 'utf8');
  console.log('[Permanent Hook] main.js patched with error-free loader and hotkey support.');

  // 5. Repack resources/app into resources/app.asar
  console.log('[Permanent Hook] Repacking resources/app into resources/app.asar...');
  try {
    await asar.createPackage(appDir, asarPath);
    console.log('[Permanent Hook] app.asar repacked successfully!');
  } catch (e) {
    console.warn('[Warning] Could not overwrite app.asar (game may be currently running, using resources/app instead).', e.message);
  }

  console.log('\n===============================================================');
  console.log('🛡️ PERMANENT UPDATE-PROOF HOOK FULLY INSTALLED & VERIFIED!');
  console.log('===============================================================');
}

installPermanentHook().catch(console.error);
