# 💻 PokéClicker Desktop Client - 100% Completionist Bot Suite

[![License: MIT](https://img.shields.io/badge/License-MIT%20with%20Educational%20Disclaimer-blue.svg)](../LICENSE)
[![Platform: Desktop Electron](https://img.shields.io/badge/Platform-pokeclicker--desktop-cyan.svg)](../README.md)
[![Version: 3.5.0](https://img.shields.io/badge/Version-v3.5.0-success.svg)](../README.md)

This directory contains the complete internal automation engine and update-proof integration for the official **PokéClicker Desktop Client** (`pokeclicker-desktop`).

---

## 🛡️ Update-Proof Architecture (Game Updates Cannot Break It)

PokéClicker auto-updates by downloading a new zip of `pokeclicker-master` from GitHub into your `%APPDATA%` folder. We have engineered a **triple-redundancy system** so that updates never break your bot:

1. **Dynamic Offset & Runtime Resolver (`GameAdapter`)**:
   - Instead of static hardcoded references, the bot dynamically detects and unwraps game classes, Knockout observables, and methods (`Battle`, `GymBattle`, `DungeonBattle`, `Safari`, `SafariBattle`, `MapHelper`, `Routes`, `party`, `breeding`).
   - Adapts to internal version changes automatically.

2. **Permanent Electron Lifecycle Hook (`install_permanent_hook.js`)**:
   - Hooks directly into Electron's `mainWindow.webContents.on('did-finish-load')`.
   - Repacked directly inside `resources/app.asar`.
   - Whenever any page reloads or boots up, Electron reads the bot script and injects it into the game window.
   - Even if the game updater completely replaces `index.html`, the Electron hook re-injects the bot automatically.

3. **Background Auto-Patcher (`watch_and_patch.js`)**:
   - An optional lightweight watcher that monitors `docs/index.html` and re-applies the script tag within 300ms if a file replacement occurs.

---

## ⚡ 1-Click Installation

1. Double-click [`install.bat`](install.bat) (or run `node desktop/install_permanent_hook.js`).
2. **If PokéClicker Desktop is currently open:**
   - Click inside the game window and press **`Ctrl + R`** (or `F5`) to reload!
3. **If not open:**
   - Launch PokéClicker from your desktop shortcut as usual.
4. The **Cyber Glassmorphism Overlay** will appear inside your game window!
5. To restore the game to original vanilla state, run [`uninstall.bat`](uninstall.bat).

---

## 🎯 100% Completionist Features in Desktop

- **🏆 4-Stage 100% Route Completion**: Unlock (10 kills) -> Catch all base Pokémon -> Catch all shiny Pokémon (with instant shiny rate boost) -> Complete route kill achievements.
- **🦁 Safari Zone Automation**: Auto-enters Safari, infinite 30-ball refill, 100% guaranteed catch rate, 80ms animation speed, auto-loots items, and catches all missing species/shinies.
- **🚩 Route & Global Achievements**: One-click 10,000 kills on current route, all regional route achievements, or global 100% achievement unlocker with max attack damage bonus.
- **🐾 Route Uncaught Hunter**: When enabled, the bot stays on each route until **100% of wild Pokémon species on that route are caught** before moving!
- **🧬 Auto Stone Evolutions**: Automatically uses evolution stones (Fire, Water, Thunder, Leaf, Moon, Sun, etc.) if the evolution is missing from your Pokédex!
- **🦖 Auto Fossil Reviving**: Automatically places fossils into the Day Care to revive prehistoric Pokémon!
- **🎯 100% Capture Rate**: Master Ball effect for all thrown balls using the game's native catch handler!
- **✨ Real Shiny Multiplier**: Multiplies the game's actual shiny encounter generator (up to 1000x / guaranteed). Produces 100% legitimate shiny Pokémon that save cleanly!
- **🖱️ Zero Rubberbanding & Manual Freedom**: Move your trainer anywhere on the map freely with zero rubberbanding; the bot executes combat and farming strictly in-place.
- **⛏️ 100% X-Ray Wallhack**: Uncovers only underground tiles containing buried items with zero energy wasted!

---

## ⌨️ Controls & Hotkeys

- **`F2`**: Show / Hide In-Game Overlay UI.
- **`F4`**: Master Bot Emergency Pause / Resume.
- **Header Drag**: Click and drag the overlay header to place it anywhere on screen.
- **Window Resize**: Grab the bottom-right corner to resize the menu to any dimensions.
- **Minimize (`_`)**: Collapse into a floating status pill with live CPS.

---

For full architectural details, educational research notes, and browser extension instructions, see the main [README.md](../README.md).
