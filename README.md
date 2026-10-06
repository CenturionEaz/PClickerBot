# 🔴 PClickerBot - PokéClicker 100% Completionist Automation Suite

[![License: MIT](https://img.shields.io/badge/License-MIT%20with%20Educational%20Disclaimer-blue.svg)](LICENSE)
[![Platform: Desktop & Web](https://img.shields.io/badge/Platform-Electron%20%7C%20Chrome%20%7C%20Brave-success.svg)](#-installation--setup)
[![Version: 3.5.0](https://img.shields.io/badge/Version-v3.5.0%20(Latest)-cyan.svg)](#-update-proof-triple-redundancy-architecture)
[![Compatibility: 100% Vanilla](https://img.shields.io/badge/Save%20Compatibility-100%25%20Vanilla%20Clean-brightgreen.svg)](#-save-file-integrity-guarantee)

An advanced, **100% internal** automation engine, reverse-engineering study, and Cyber-Glassmorphism UI dashboard developed for the open-source single-player incremental game [PokéClicker](https://www.pokeclicker.com).

Operates entirely through in-memory JavaScript execution and native engine bindings—**zero mouse hijacking, zero artificial input delays, and zero window focus requirements**, allowing seamless background progression while you work, browse, or play other games.

---

## ⚖️ Educational Research & Disclaimer

> [!IMPORTANT]
> ### 🎓 Purpose of this Project
> This software was developed **strictly for educational, academic, and reverse-engineering research purposes** to enhance personal software engineering, browser extension architecture, and desktop application injection techniques. 
> 
> The project explores:
> 1. **Client-side runtime instrumentation:** How single-page JavaScript applications and Knockout.js state engines behave under internal programmatic control.
> 2. **Electron process architecture:** Analyzing IPC lifecycle events, ASAR archive repacking, and persistent `webContents.did-finish-load` hooks on native desktop clients.
> 3. **Non-invasive DOM injection:** Designing cyber glassmorphism overlays that interact bidirectionally with complex existing reactive observables without race conditions or memory leaks.
> 
> **AI Collaboration:** The code in this repository was systematically designed, architected, refactored, cleaned, and documented with the assistance of Advanced AI Pair Programming.
> 
> **Scope & Ethics:**
> * PokéClicker is a **single-player, offline-capable, open-source community game**. This tool does not impact any multiplayer competitive fairness, external backend servers, or microtransactions.
> * All generated save files strictly adhere to the game's internal data formats and remain 100% compatible with standard vanilla web and desktop clients.
> * The author provides this codebase **AS IS** for benign study and personal curiosity. The author assumes no responsibility or liability for any misuse, unintended effects, or damages. Please refer to the [LICENSE](LICENSE) for full legal disclaimers.
> * Pokémon, Pokémon character names, and trademarks are property of Nintendo, Creatures Inc., and GAME FREAK Inc. This project is not affiliated with, endorsed by, or associated with Nintendo, GAME FREAK, or the PokéClicker development team.

---

## 🛡️ Update-Proof Triple-Redundancy Architecture

PokéClicker frequently auto-updates its codebase directly from its public repository. Traditional bots that rely on fixed memory offsets, hardcoded selectors, or static function references break immediately upon updates. **PClickerBot solves this permanently** through a three-layer resilience system:

```
                                  ┌──────────────────────────────────────────────┐
                                  │           PokéClicker Application            │
                                  └──────────────────────┬───────────────────────┘
                                                         │
                        ┌────────────────────────────────┼────────────────────────────────┐
                        ▼                                ▼                                ▼
           [Layer 1: GameAdapter]             [Layer 2: Electron ASAR]           [Layer 3: File Watcher]
         Dynamic Reflection Engine            Permanent Lifecycle Hook           Continuous Auto-Patcher
        ───────────────────────────          ──────────────────────────         ─────────────────────────
        • Discovers live singletons          • Hooks into did-finish-load       • Monitors docs/index.html
        • Unwraps Knockout observables       • Repacked directly in app.asar    • Auto-injects within 300ms
        • Adapts to API renames              • Survives full game updates       • Redundant recovery fallback
```

1. **Dynamic Offset & Runtime Resolver (`GameAdapter`)**:
   * Instead of fragile hardcoded references, the bot uses dynamic reflection to discover and unwrap live engine singletons (`App.game.party`, `Battle`, `GymBattle`, `DungeonBattle`, `Safari`, `SafariBattle`, `MapHelper`, `Routes`, `Wallet`, `BreedingHelper`).
   * Automatically adapts to code obfuscation and engine updates on the fly.
2. **Permanent Electron Lifecycle Hook (`install_permanent_hook.js`)**:
   * Directly patches Electron's main process inside `resources/app.asar` via `mainWindow.webContents.on('did-finish-load')`.
   * Even if PokéClicker's built-in updater completely replaces the web documents, Electron injects the bot into memory upon every single window refresh.
3. **Background Failsafe Patcher (`watch_and_patch.js`)**:
   * A resilient filesystem watcher that monitors the game's document root and automatically re-inserts the failsafe script tag if an update event overwrites `index.html`.

---

## 📁 Repository Structure

```
PClickerBot/
├── desktop/                        # 💻 Native Desktop Client Injection (Electron)
│   ├── install.bat                 # 1-Click native installer (ASAR patcher & lifecycle hook)
│   ├── uninstall.bat               # Clean vanilla restoration script
│   ├── install_permanent_hook.js   # Electron app.asar lifecycle hook installer
│   ├── inject.js                   # Failsafe direct index.html injector
│   ├── watch_and_patch.js          # Background auto-patch file watcher
│   ├── launch_with_debug.bat       # Debug launcher with CDP port 9222 enabled
│   ├── remote_cdp_bot.js           # Headless terminal automation via Chrome DevTools Protocol
│   ├── pokeclicker-bot.js          # Compiled desktop bot bundle
│   └── README.md                   # Desktop integration walkthrough
│
├── extension/                      # 🌐 Web Browser Extension (Chrome & Brave Manifest V3)
│   ├── manifest.json               # Manifest V3 configured for MAIN-world execution
│   ├── bundle.js                   # Compiled standalone extension bundle
│   ├── popup.html / popup.js       # Extension browser popup & shortcut reference
│   ├── icons/                      # High-resolution icons (16px, 48px, 128px)
│   └── README.md                   # Browser extension setup guide
│
├── shared/                         # 🛠️ Modular Core Architecture
│   ├── pokeclicker-bot-core.js     # Master logic loops, event hooks & game adapters
│   ├── pokeclicker-bot-ui.js       # Cyber Glassmorphism UI & HUD controller
│   ├── pokeclicker-bot-ui.css      # Custom styling, glow effects & cyber scrollbars
│   └── bundle.js                   # Built master bundle
│
├── build.js                        # Unified bundler (assembles shared components into targets)
├── LICENSE                         # MIT License with educational & ethical clauses
└── README.md                       # Master Documentation
```

---

## ⚡ Installation & Setup

### Option A: PokéClicker Desktop Client (Recommended)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/CenturionEaz/PClickerBot.git
   cd PClickerBot
   ```
2. Double-click [`desktop/install.bat`](desktop/install.bat) (or run `node desktop/install_permanent_hook.js`).
3. **If the Desktop App is already open:**
   * Click inside the game window and press **`Ctrl + R`** (or `F5`) to reload!
4. **If not open:**
   * Launch PokéClicker from your standard desktop shortcut.
5. The **Cyber Glassmorphism Overlay** will appear inside your game window!
6. *(Optional)* To restore the desktop client to 100% original vanilla state at any time, run [`desktop/uninstall.bat`](desktop/uninstall.bat).

---

### Option B: Chrome / Brave Web Extension

1. Clone or download this repository.
2. Open your browser and navigate to:
   * **Brave:** `brave://extensions`
   * **Chrome:** `chrome://extensions`
3. Toggle **Developer mode** ON (top-right corner).
4. Click **Load unpacked** (top-left button).
5. Select the [`extension/`](extension/) directory from this repository.
6. Navigate to [pokeclicker.com](https://www.pokeclicker.com).
7. The overlay will load automatically on game start!

---

## 🎯 Complete 11-Module Feature Suite

### 1. 🌟 4-Stage 100% Route Completionist Engine
The bot can automate your entire journey through all regions (Kanto through Paldea) using a structured 4-stage completion pipeline:
* **Stage 1 (Route Unlock):** Defeats the initial 10 wild Pokémon to unlock adjacent routes.
* **Stage 2 (Base Pokédex 100% Catch):** Stays on the route until **every wild species** is registered in your Pokédex (`RouteHelper.routeCompleted(route, region, false)`).
* **Stage 3 (Shiny Pokédex 100% Catch with ⚡ Auto Shiny Boost):**
  * Continuously hunts missing shiny Pokémon on the route (`RouteHelper.routeCompleted(route, region, true)`).
  * **⚡ Auto Shiny Rate Boost:** While hunting missing shinies on the route, encounters are dynamically set to **100% guaranteed shiny**. You catch every shiny form in seconds rather than grinding for days! Once all route shinies are registered, the boost turns off automatically.
* **Stage 4 (Route Kill Achievements):** Farms route kills until reaching your chosen achievement threshold (`100 Kills (Defeat)`, `1,000 Kills (Explore)`, or `10,000 Kills (Conquer)`).
* **Manual Map Freedom:** The **Auto Map Route Navigation** toggle is `OFF` by default. You have 100% freedom to click and move anywhere on the map with **zero rubberbanding**, while the bot attacks, catches, breeds, mines, and farms strictly in-place!

### 2. 🦁 Safari Zone Automation & 1-Click Clear
* **Autonomous In-Game Safari Runner (`Auto Safari Zone`):**
  * **Auto-Unlock Safari Ticket:** Grants `Safari_ticket` if missing so you can enter any Safari Zone immediately.
  * **Infinite Safari Balls:** Automatically tops up your Safari Balls to 30 whenever they drop below 5.
  * **100% Safari Catch Rate Hook:** Hooked `SafariBattle.calcCapture` so every ball throw is a guaranteed 3-wobble catch.
  * **Ultra-Fast Speed:** Accelerated Safari battle animations down to 80ms for near-instant captures.
  * **Auto-Loot Items:** Automatically sweeps and collects all spawned items across the Safari grid.
  * **Pokedex & Shiny Priority:** Spawns and battles uncaught species and missing shinies until the zone is 100% complete.
* **Instant Safari Action Buttons:**
  * **`🎯 Instant 100% Complete Current Safari Zone`:** Catches all missing base species & shiny variants in the current Safari, sweeps all items, and maxes your Safari level.
  * **`⭐ Max Safari Level`:** Sets Safari EXP to max (Level 40), instantly popping all Safari Level achievements.
  * **`🚪 Open Safari Modal`:** Quick-opens the Safari entrance anywhere on the map.

### 3. 🏆 Route & Global Achievement Quick Actions
* **`🚩 Max Current Route Achievements (10,000 Kills)`:** Sets route kills to 10,000 on your current route and unlocks all 3 route achievements.
* **`🗺️ Max ALL Regional Route Achievements`:** Sets every unlocked route in your current region to 10,000 kills, unlocking all regional explorer & conquer achievements.
* **`👑 Unlock ALL Achievements (Global)`:** Unlocks every achievable achievement across the entire game, maximizing your attack bonus damage multiplier!

### 4. ⚡ High-Speed Combat & Throttle Bypass
* **Custom CPS Slider:** Configure attack speeds from 5 up to 100+ CPS with a live CPS counter.
* **Native 50ms Throttle Bypass:** Overrides the internal game cooldowns (`Battle.lastClickAttack`), allowing true multi-hundred CPS attack throughput.
* **God Mode / OHKO:** Defeats any wild Pokémon, Gym Leader, or Dungeon Boss in a single hit.
* **Manual Clicking Support:** Independent master and combat switches allow you to disable automated clicking and fight manually whenever desired.

### 5. 🎯 Native Catch Rate & Genuine Shiny Multipliers
* **100% Guaranteed Capture Rate:** Master Ball behavior applied to regular Pokébals via `Battle.catchRateActual` and `DungeonBattle.catchRateActual`.
* **Real Shiny Rate Multipliers:** Hooks `PokemonFactory.generateShiny` with mathematically genuine probability multipliers (2x, 5x, 10x, 25x, 50x, 100x, 500x, 1000x). Generates authentic, clean Pokémon records in your party.
* **Auto Ball Selector & Restocker:** Automatically uses optimal balls based on catch status and purchases Pokéballs when inventory drops below 50.

### 6. 🏪 In-Game Spawner & Economic Inversion Store
* **Economic Inversion Cheat (`Gain When Spent`):** Inverts spending so that whenever you spend Pokédollars, Dungeon Tokens, or Quest Points, you **gain** that amount instead!
* **1-Click Free Currency Injector:** Instantly add +1M / +10M / +100M Pokédollars, Dungeon Tokens, Quest Points, Diamonds, Farm Points, and Battle Points.
* **Item Spawner & Packs:**
  * One-click packs: All Evolution Stones, All Vitamins, All Fossils, All Battle Items, All Restores, and **All Key Items** (Wailmer Pail, Explorer Kit, Bicycle, Fishing Rods, Town Map, etc.).
  * Catalog Spawner: Select any item in the game and spawn custom quantities for free.

### 7. 🥚 Day Care & Hatchery Automation
* **Autonomous Egg Cycle:** Automatically places eligible Pokémon into open Day Care slots and hatches ready eggs.
* **Intelligent Priority Queues:** Sort breeding candidates by:
  * Breeding Efficiency (Base Attack / Steps)
  * Base Attack (Highest raw attack first)
  * Missing Shiny (Breeds Pokémon whose shiny form is missing)
  * Pokérus (Spreads Pokérus to uninfected team members)
* **Instant Hatch Sandbox:** Instantly steps all active Day Care eggs to 100% completion with a single click.

### 8. ⛏️ Underground Mining (100% X-Ray Wallhack)
* **True X-Ray Item Detection:** Analyzes the underground grid in memory and mines **only** tiles containing buried fossils, plates, and treasures—zero wasted stamina.
* **Auto Battery & Restores:** Discharges battery charges and consumes Small Restores when stamina is low.
* **Instant Layer Generation:** Resets and generates a fresh mine layer the moment all buried items are extracted.

### 9. 🌱 Berry Farm & Mutation Engine
* **Access & Seed Fallback:** Unlocks the `Wailmer_pail` key item automatically so farming is accessible from day one, and provides starter Cheri seeds if plots are empty.
* **Plot Management:** Unlocks affordable farm plots automatically.
* **Harvest & Replant Loop:** Harvests mature berries before they wither and replants your chosen berry species perpetually.
* **Auto Weed Clear:** Automatically weeds pests and clears dead plots.

### 10. 📜 Questline & Tutorial Auto-Solver
* **Tutorial Quests:** Automatically handles starter selection, talk to mom, viridian shop, viridian forest, Brock, Pewter Gym, and Route 3.
* **Quest Point Farming:** Cycles through achievable daily quests (Defeat Pokémon, Catch Pokémon, Hatch Eggs, Clear Dungeons, Mine Items) to build up Quest Points.

### 11. 🏰 Dungeons & Gym Automation
* **Dungeon Pathfinding:** Automated exploration with three selectable modes:
  * **Boss Rush:** Navigates directly to the boss room via the shortest path.
  * **Chest Loot:** Sweeps all chests before defeating the boss.
  * **Full Clear:** Uncovers 100% of tiles before engaging the boss.
* **Gym Auto-Runner:** Automatically challenges Gym Leaders to progress the storyline and collect badges.

---

## ⌨️ Controls & Hotkeys

| Key / Control | Action |
|---|---|
| **`F2`** | Toggle the In-Game Cyber Overlay (Show / Hide) |
| **`F4`** | Emergency Master Bot Pause / Resume |
| **Floating Button (`⚡ PokéBot`)** | Re-opens the menu if closed |
| **Header Drag** | Click and drag the header to move the menu anywhere |
| **Window Resize** | Drag the bottom-right corner to resize the menu to any width/height |
| **Minimize (`_`)** | Minimizes the menu into a sleek HUD pill showing live CPS |

---

## 💾 Save File Integrity Guarantee

Every action performed by PClickerBot executes strictly through PokéClicker's native JavaScript functions and data controllers. 

* **No Memory Corruption:** Pokémon IDs, statistics, and party states are modified through standard class methods (`App.game.party.gainPokemonById()`, `MapHelper.moveToRoute()`, `App.game.wallet.gainAmount()`).
* **Universal Portability:** Saves downloaded or exported while using PClickerBot are **100% vanilla-clean**. They can be exported and imported into official web browsers, mobile clients, or standard desktop apps worldwide without warnings, bans, or errors.

---

## 🛠️ Building from Source

To compile all targets (Desktop bundle, Web Extension bundle, and shared libraries), simply run:

```bash
node build.js
```

The script will bundle `pokeclicker-bot-core.js`, `pokeclicker-bot-ui.js`, and `pokeclicker-bot-ui.css` into unified distribution files under `desktop/`, `extension/`, and `shared/`.

---

## 📄 License & Attribution

This project is licensed under the **MIT License with Educational & Non-Harm Disclaimer** — see the [LICENSE](LICENSE) file for complete terms.

* **Created by:** [CenturionEaz (Pratyush Rai)](https://github.com/CenturionEaz)
* **Assisted by:** Advanced AI Pair Programming & Code Architecture Tools
* **Disclaimer:** Provided strictly "AS IS" for educational research and reverse-engineering study. The author assumes no responsibility for use or misuse.
