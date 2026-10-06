/**
 * PokéClicker Master Bot - Cyber Glassmorphism In-Game Overlay UI
 * Version 3.5.0 - 100% Safari Zone Auto-Completion & Route Shiny Completionist
 */

(function () {
  'use strict';

  if (window.PokeClickerBotUI) {
    console.log('[PokeClickerBot] UI already present in window.');
    return;
  }

  const BotUI = {
    initialized: false,
    visible: true,
    minimized: false,
    dragState: { isDragging: false, startX: 0, startY: 0, initialLeft: 0, initialTop: 0 },

    init() {
      if (this.initialized) return;

      const mount = () => {
        if (!document.body) {
          setTimeout(mount, 50);
          return;
        }
        this.buildDOM();
        this.attachEvents();
        this.startHUDUpdater();
        this.initialized = true;
        console.log('[PokeClickerBot] UI Overlay Mounted Successfully!');
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
      } else {
        mount();
      }
    },

    buildDOM() {
      const existing = document.getElementById('pokeclicker-bot-container');
      if (existing) existing.remove();
      const existingPill = document.getElementById('pokeclicker-bot-pill');
      if (existingPill) existingPill.remove();
      const existingBadge = document.getElementById('pokeclicker-bot-badge');
      if (existingBadge) existingBadge.remove();

      const core = window.PokeClickerBotCore || { version: '3.3.0', settings: {} };
      const s = core.settings;

      const container = document.createElement('div');
      container.id = 'pokeclicker-bot-container';
      container.innerHTML = `
        <!-- Header -->
        <div class="pcb-header" id="pcb-header">
          <div class="pcb-header-left">
            <div class="pcb-logo"></div>
            <div class="pcb-title-group">
              <span class="pcb-title">POKÉCLICKER MASTER BOT</span>
              <span class="pcb-subtitle">v${core.version} // 100% COMPLETIONIST</span>
            </div>
          </div>
          <div class="pcb-header-actions">
            <!-- Master Toggle -->
            <label class="pcb-master-switch" title="Master Bot Toggle (F4)">
              <input type="checkbox" id="pcb-master-toggle" ${s.masterEnabled ? 'checked' : ''}>
              <span class="pcb-slider-switch"></span>
            </label>
            <button class="pcb-btn-icon" id="pcb-btn-minimize" title="Minimize">_</button>
            <button class="pcb-btn-icon" id="pcb-btn-close" title="Hide UI (Press F2 to reopen)">✕</button>
          </div>
        </div>

        <!-- Live Objective Display -->
        <div style="background: rgba(0, 240, 255, 0.08); padding: 5px 12px; font-size: 11px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(0, 240, 255, 0.2);">
          <span style="color: var(--pcb-text-muted); font-weight: 600;">TASK:</span>
          <span id="pcb-hud-objective" style="color: var(--pcb-primary); font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 330px;">Connecting to Save...</span>
        </div>

        <!-- Mini HUD Bar -->
        <div class="pcb-hud-bar">
          <div class="pcb-hud-stat">
            <span class="pcb-hud-label">CPS:</span>
            <span class="pcb-hud-val" id="pcb-hud-cps">0</span>
          </div>
          <div class="pcb-hud-stat">
            <span class="pcb-hud-label">KILLS:</span>
            <span class="pcb-hud-val" id="pcb-hud-kills">0</span>
          </div>
          <div class="pcb-hud-stat">
            <span class="pcb-hud-label">CAUGHT:</span>
            <span class="pcb-hud-val" id="pcb-hud-caught" style="color: var(--pcb-success);">0</span>
          </div>
          <div class="pcb-hud-stat">
            <span class="pcb-hud-label">SHINY:</span>
            <span class="pcb-hud-val" id="pcb-hud-shiny" style="color: var(--pcb-gold);">0</span>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="pcb-tabs">
          <button class="pcb-tab-btn active" data-tab="story">🏆 Story</button>
          <button class="pcb-tab-btn" data-tab="spawner">🏪 Spawner</button>
          <button class="pcb-tab-btn" data-tab="safari">🦁 Safari</button>
          <button class="pcb-tab-btn" data-tab="combat">⚡ Combat</button>
          <button class="pcb-tab-btn" data-tab="catch">🎯 Catch</button>
          <button class="pcb-tab-btn" data-tab="items">🎒 Items</button>
          <button class="pcb-tab-btn" data-tab="hatchery">🥚 Day Care</button>
          <button class="pcb-tab-btn" data-tab="mine">⛏️ Mining</button>
          <button class="pcb-tab-btn" data-tab="farm">🌱 Farm</button>
          <button class="pcb-tab-btn" data-tab="quests">📜 Quests</button>
          <button class="pcb-tab-btn" data-tab="logs">💻 Logs</button>
        </div>

        <!-- Tab Content -->
        <div class="pcb-content">
          <!-- 1. 100% Story & Progression Tab -->
          <div class="pcb-tab-pane active" id="pcb-tab-story">
            <div class="pcb-card">
              <div class="pcb-card-title">100% Story Progression Engine</div>
              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Story & Map Progression</span>
                  <span class="pcb-desc">Defeats 10 route kills, unlocks map & moves to next route</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-story-toggle" ${s.autoStoryProgression ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Map Route Navigation</span>
                  <span class="pcb-desc">Automatically moves character between routes. Leave OFF for 100% manual map movement freedom.</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-mapnav-toggle" ${s.autoMapNavigation ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Route Completion Strategy</span>
                  <span class="pcb-desc">Controls when bot advances to next route</span>
                </div>
                <select class="pcb-select" id="pcb-strategy-select">
                  <option value="completionist" ${s.routeStrategy === 'completionist' ? 'selected' : ''}>🟢 Catch Available First</option>
                  <option value="progressionFirst" ${s.routeStrategy === 'progressionFirst' ? 'selected' : ''}>⚡ Fast 10-Kills & Advance</option>
                </select>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Tutorial Quests</span>
                  <span class="pcb-desc">Solves starter, mom, shop, viridian forest & Brock automatically</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-tutorial-toggle" ${s.autoTutorial ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Uncaught Pokémon Hunter</span>
                  <span class="pcb-desc">Stays on route until every wild species is registered in Pokédex</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-uncaught-toggle" ${s.uncaughtHunter ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Raids & Bosses (Temporary Battles)</span>
                  <span class="pcb-desc">Automatically clears Snorlax, Fighting Dojo, and Max Raids</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-raids-toggle" ${s.autoRaids ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Story Gyms</span>
                  <span class="pcb-desc">Challenges unbeaten Gym Leaders to unlock new routes</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-gym-toggle" ${s.autoGym ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Story Dungeons</span>
                  <span class="pcb-desc">Pathfinds and clears story dungeons with zero manual clicks</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-dungeon-toggle" ${s.autoDungeon ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Sail to Next Region</span>
                  <span class="pcb-desc">Travels to Johto, Hoenn, etc. when Champion is defeated</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-travel-toggle" ${s.autoTravel ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>
            </div>

            <!-- 100% Route Completionist Configuration -->
            <div class="pcb-card">
              <div class="pcb-card-title">🌟 100% Route Completionist Engine</div>
              
              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Catch All Base Pokémon</span>
                  <span class="pcb-desc">Will not leave route until 100% of wild species are registered in Pokédex</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-comp-base-toggle" ${s.completionCatchAll ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Catch All Shiny Pokémon</span>
                  <span class="pcb-desc">Hunts all wild shiny Pokémon on current route until 100% shiny complete</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-comp-shiny-toggle" ${s.completionCatchShinies ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">⚡ Auto Shiny Rate Boost on Route</span>
                  <span class="pcb-desc">Guarantees 100% wild shiny encounters while hunting route shinies so they catch instantly</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-comp-shinyboost-toggle" ${s.autoShinyBoostOnRoute ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Complete Route Achievements</span>
                  <span class="pcb-desc">Farms route kills until the achievement kill target is reached before advancing</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-comp-achieve-toggle" ${s.completionAchievements ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Route Achievement Kill Target</span>
                  <span class="pcb-desc">Defeat kill threshold required to consider route achievements complete</span>
                </div>
                <select class="pcb-select" id="pcb-comp-achievetarget-select">
                  <option value="100" ${s.routeAchievementTarget == 100 ? 'selected' : ''}>100 Kills (Defeat)</option>
                  <option value="1000" ${s.routeAchievementTarget == 1000 ? 'selected' : ''}>1,000 Kills (Explore)</option>
                  <option value="10000" ${s.routeAchievementTarget == 10000 ? 'selected' : ''}>10,000 Kills (Conquer - All 3)</option>
                </select>
              </div>
            </div>

            <!-- Achievement Fast Unlock Actions -->
            <div class="pcb-card">
              <div class="pcb-card-title">🏆 Route & Global Achievement Quick Actions</div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <button class="pcb-btn pcb-btn-sm" id="pcb-btn-max-cur-route">🚩 Max Current Route Achievements (10,000 Kills)</button>
                <button class="pcb-btn pcb-btn-sm" id="pcb-btn-max-all-routes">🗺️ Max ALL Regional Route Achievements</button>
                <button class="pcb-btn pcb-btn-sm pcb-btn-primary" id="pcb-btn-unlock-all-achieve">👑 Unlock ALL Achievements (Global + Max Attack Bonus)</button>
              </div>
            </div>
          </div>

          <!-- 2. Spawner & Free Store Tab (NEW) -->
          <div class="pcb-tab-pane" id="pcb-tab-spawner">
            <!-- Invert Spending Cheat -->
            <div class="pcb-card">
              <div class="pcb-card-title">💰 Economic Inversion Cheat</div>
              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Invert Spending (Gain When Spent)</span>
                  <span class="pcb-desc">Whenever you spend money, DT, or QP, you GAIN that amount instead!</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-gainonspend-toggle" ${s.gainOnSpend ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>
            </div>

            <!-- Instant Currency Injector -->
            <div class="pcb-card">
              <div class="pcb-card-title">⚡ Instant Currency Injector</div>
              <div class="pcb-desc" style="margin-bottom: 8px;">Direct legitimate injection. 100% safe and exportable save.</div>
              
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <!-- Pokédollars -->
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-weight: 600; color: var(--pcb-text-main);">💵 Pokédollars:</span>
                  <div style="display: flex; gap: 4px;">
                    <button class="pcb-btn pcb-btn-sm pcb-currency-btn" data-currency="0" data-amount="1000000">+1M</button>
                    <button class="pcb-btn pcb-btn-sm pcb-currency-btn" data-currency="0" data-amount="10000000">+10M</button>
                    <button class="pcb-btn pcb-btn-sm pcb-currency-btn" data-currency="0" data-amount="100000000">+100M</button>
                  </div>
                </div>

                <!-- Dungeon Tokens -->
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-weight: 600; color: var(--pcb-primary);">🗝️ Dungeon Tokens:</span>
                  <div style="display: flex; gap: 4px;">
                    <button class="pcb-btn pcb-btn-sm pcb-currency-btn" data-currency="1" data-amount="10000">+10k</button>
                    <button class="pcb-btn pcb-btn-sm pcb-currency-btn" data-currency="1" data-amount="100000">+100k</button>
                    <button class="pcb-btn pcb-btn-sm pcb-currency-btn" data-currency="1" data-amount="1000000">+1M</button>
                  </div>
                </div>

                <!-- Quest Points -->
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-weight: 600; color: var(--pcb-gold);">📜 Quest Points:</span>
                  <div style="display: flex; gap: 4px;">
                    <button class="pcb-btn pcb-btn-sm pcb-currency-btn" data-currency="2" data-amount="5000">+5k</button>
                    <button class="pcb-btn pcb-btn-sm pcb-currency-btn" data-currency="2" data-amount="50000">+50k</button>
                    <button class="pcb-btn pcb-btn-sm pcb-currency-btn" data-currency="2" data-amount="500000">+500k</button>
                  </div>
                </div>

                <!-- Diamonds -->
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-weight: 600; color: #58a6ff;">💎 Diamonds:</span>
                  <div style="display: flex; gap: 4px;">
                    <button class="pcb-btn pcb-btn-sm pcb-currency-btn" data-currency="3" data-amount="1000">+1k</button>
                    <button class="pcb-btn pcb-btn-sm pcb-currency-btn" data-currency="3" data-amount="10000">+10k</button>
                    <button class="pcb-btn pcb-btn-sm pcb-currency-btn" data-currency="3" data-amount="100000">+100k</button>
                  </div>
                </div>

                <!-- Farm & Battle Points -->
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-weight: 600; color: var(--pcb-success);">🌱 Farm / ⚔️ Battle:</span>
                  <div style="display: flex; gap: 4px;">
                    <button class="pcb-btn pcb-btn-sm pcb-currency-btn" data-currency="4" data-amount="10000">+10k Farm</button>
                    <button class="pcb-btn pcb-btn-sm pcb-currency-btn" data-currency="5" data-amount="10000">+10k Battle</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Free Item Packs -->
            <div class="pcb-card">
              <div class="pcb-card-title">🎁 Quick Free Item Packs</div>
              <div class="pcb-grid-2" style="margin-top: 6px;">
                <button class="pcb-btn pcb-btn-gold" id="pcb-pack-balls">⚪ 1,000 All Poké Balls</button>
                <button class="pcb-btn pcb-btn-gold" id="pcb-pack-stones">💎 25 All Evo Stones</button>
                <button class="pcb-btn pcb-btn-gold" id="pcb-pack-vitamins">💊 100 All Vitamins</button>
                <button class="pcb-btn pcb-btn-gold" id="pcb-pack-battle">⚡ 100 Battle Items</button>
                <button class="pcb-btn pcb-btn-gold" id="pcb-pack-fossils">🦖 10 All Fossils</button>
                <button class="pcb-btn pcb-btn-gold" id="pcb-pack-restores">🔋 100 Small Restores</button>
                <button class="pcb-btn pcb-btn-gold" id="pcb-pack-keys" style="grid-column: 1 / -1;">🗝️ Unlock ALL Key Items (Wailmer, Rods, Kit, Bike)</button>
              </div>
            </div>

            <!-- Complete In-Game Item Spawner -->
            <div class="pcb-card">
              <div class="pcb-card-title">📦 Complete Item Catalog Spawner</div>
              <div class="pcb-desc" style="margin-bottom: 6px;">Select any item from the game code to spawn directly into inventory for free.</div>
              <div style="display: flex; gap: 6px; margin-bottom: 6px;">
                <select class="pcb-select" id="pcb-spawner-itemselect" style="flex: 1; max-width: none;">
                  <option value="">-- Loading Game Items... --</option>
                </select>
                <input type="number" class="pcb-input" id="pcb-spawner-qty" value="100" min="1" max="99999" style="width: 70px;">
              </div>
              <button class="pcb-btn pcb-btn-primary" id="pcb-btn-spawner-inject" style="width: 100%;">
                ✨ Spawn Selected Item Free
              </button>
            </div>
          </div>

          <!-- 3. Safari Zone Tab -->
          <div class="pcb-tab-pane" id="pcb-tab-safari">
            <div class="pcb-card">
              <div class="pcb-card-title">🦁 Safari Zone Automation</div>
              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Safari Zone</span>
                  <span class="pcb-desc">Auto-enters Safari Zone, catches wild species, and loots map</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-safari-auto-toggle" ${s.autoSafari ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">100% Safari Catch Rate</span>
                  <span class="pcb-desc">Guarantees every Safari Ball throw catches the Pokémon instantly</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-safari-catch-toggle" ${s.safariCatchRate ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Infinite Safari Balls</span>
                  <span class="pcb-desc">Automatically refills your Safari Balls to 30 so you never run out</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-safari-balls-toggle" ${s.safariInfiniteBalls ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto-Loot Safari Items</span>
                  <span class="pcb-desc">Picks up all items spawned on the Safari Zone map automatically</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-safari-loot-toggle" ${s.safariAutoLoot ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Catch Shiny Safari Pokémon</span>
                  <span class="pcb-desc">Spawns and catches missing shiny Safari species for 100% zone completion</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-safari-shiny-toggle" ${s.safariCatchShinies ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="pcb-card">
              <div class="pcb-card-title">🎯 Instant Safari Completion & Actions</div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <button class="pcb-btn pcb-btn-primary" id="pcb-btn-complete-safari">🎯 Instant 100% Complete Current Safari Zone</button>
                <button class="pcb-btn" id="pcb-btn-max-safari-level">⭐ Max Safari Level (Level 40 + All Safari Achievements)</button>
                <button class="pcb-btn" id="pcb-btn-open-safari">🚪 Open Current Region Safari Modal</button>
              </div>
            </div>
          </div>

          <!-- 4. Combat & Clicker Tab -->
          <div class="pcb-tab-pane" id="pcb-tab-combat">
            <div class="pcb-card">
              <div class="pcb-card-title">Auto Clicker & Speed</div>
              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Internal Auto Clicker</span>
                  <span class="pcb-desc">Background click attack without mouse hijacking</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-clicker-toggle" ${s.clickerEnabled ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-slider-group">
                <div class="pcb-slider-header">
                  <span class="pcb-label">Clicker Speed</span>
                  <span class="pcb-slider-val" id="pcb-cps-label">${s.clickerCPS || 40} CPS</span>
                </div>
                <input type="range" class="pcb-range" id="pcb-cps-slider" min="1" max="100" value="${s.clickerCPS || 40}">
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Bypass Click Throttle</span>
                  <span class="pcb-desc">Removes game's internal 20 CPS click rate cap</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-bypass-toggle" ${s.bypassThrottle ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Instakill / 1-Hit God Mode</span>
                  <span class="pcb-desc">Eliminates enemies in 1 frame for ultra-fast clears</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-godmode-toggle" ${s.godMode ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="pcb-card">
              <div class="pcb-card-title">Gym & Dungeon Farming</div>
              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Continuous Gym Farm</span>
                  <span class="pcb-desc">Repeatedly defeats current town gym for money & shards</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-farmgym-toggle" ${s.farmGym ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Continuous Dungeon Farm</span>
                  <span class="pcb-desc">Continuously clears town dungeon for loot & drops</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-farmdungeon-toggle" ${s.farmDungeon ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Dungeon Pathfinding</span>
                  <span class="pcb-desc">Strategy when exploring dungeons</span>
                </div>
                <select class="pcb-select" id="pcb-dungeon-mode">
                  <option value="bossRush" ${s.dungeonMode === 'bossRush' ? 'selected' : ''}>⚡ Boss Rush (Fastest)</option>
                  <option value="chestLoot" ${s.dungeonMode === 'chestLoot' ? 'selected' : ''}>💎 Chest Hunter</option>
                  <option value="fullClear" ${s.dungeonMode === 'fullClear' ? 'selected' : ''}>🗺️ 100% Full Clear</option>
                </select>
              </div>

              <div class="pcb-slider-group">
                <div class="pcb-slider-header">
                  <span class="pcb-label">Min Dungeon Tokens Reserve</span>
                  <span class="pcb-slider-val" id="pcb-tokens-label">${s.dungeonMinTokens || 200} Tokens</span>
                </div>
                <input type="range" class="pcb-range" id="pcb-tokens-slider" min="50" max="5000" step="50" value="${s.dungeonMinTokens || 200}">
              </div>
            </div>
          </div>

          <!-- 4. Catch & Shiny Tab -->
          <div class="pcb-tab-pane" id="pcb-tab-catch">
            <div class="pcb-card">
              <div class="pcb-card-title">Capture & Shiny Multipliers</div>
              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">100% Guaranteed Catch Rate</span>
                  <span class="pcb-desc">Every ball thrown captures wild Pokémon without fail</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-catchrate-toggle" ${s.perfectCatchRate ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Boosted Shiny Encounters</span>
                  <span class="pcb-desc">Real in-game algorithm multiplier (vanilla compatible save)</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-boostshiny-toggle" ${s.boostShinyRate ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Shiny Chance Multiplier</span>
                  <span class="pcb-desc">Encounter multiplier factor</span>
                </div>
                <select class="pcb-select" id="pcb-shinymult-select">
                  <option value="2" ${s.shinyMultiplier === 2 ? 'selected' : ''}>2x Multiplier</option>
                  <option value="5" ${s.shinyMultiplier === 5 ? 'selected' : ''}>5x Multiplier</option>
                  <option value="10" ${s.shinyMultiplier === 10 ? 'selected' : ''}>10x Multiplier</option>
                  <option value="25" ${s.shinyMultiplier === 25 ? 'selected' : ''}>25x Multiplier</option>
                  <option value="50" ${s.shinyMultiplier === 50 ? 'selected' : ''}>50x Multiplier</option>
                  <option value="100" ${s.shinyMultiplier === 100 ? 'selected' : ''}>100x Multiplier</option>
                </select>
              </div>
            </div>

            <div class="pcb-card">
              <div class="pcb-card-title">Ball Management & Shop</div>
              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Ball Selector</span>
                  <span class="pcb-desc">Assigns Pokéball to caught (tokens) & Ultraball to shinies</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-ballselect-toggle" ${s.autoBallSelector ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Buy Poké Balls</span>
                  <span class="pcb-desc">Auto replenishes balls when inventory drops below 50</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-buyballs-toggle" ${s.autoBuyBalls ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <!-- 5. Items & Boosters Tab -->
          <div class="pcb-tab-pane" id="pcb-tab-items">
            <div class="pcb-card">
              <div class="pcb-card-title">Items & Equipment Automation</div>
              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Battle Items</span>
                  <span class="pcb-desc">Maintains xAttack, xClick, Lucky Egg & Incense buffs</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-battleitems-toggle" ${s.autoBattleItems ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Evolution Stones</span>
                  <span class="pcb-desc">Evolves Pokémon automatically if evolution is uncaught</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-stone-toggle" ${s.autoStoneEvo ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Oak Items</span>
                  <span class="pcb-desc">Equips Magic Ball, Exp Share, Blaze Cassette & levels them</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-oak-toggle" ${s.autoOakItems ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Gems & Flutes</span>
                  <span class="pcb-desc">Upgrades type gem damage & maintains flute buffs</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-gems-toggle" ${s.autoGems ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="pcb-card">
              <div class="pcb-card-title">Resource Quick Grant</div>
              <button class="pcb-btn pcb-btn-gold" id="pcb-btn-boost" style="width: 100%;">
                💰 Grant +10M Money, 100k DT & 10k QP
              </button>
            </div>
          </div>

          <!-- 6. Day Care & Hatchery Tab -->
          <div class="pcb-tab-pane" id="pcb-tab-hatchery">
            <div class="pcb-card">
              <div class="pcb-card-title">Day Care Nursery Engine</div>
              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Day Care Breeding</span>
                  <span class="pcb-desc">Queues lvl 100 Pokémon to gain attack bonuses & hatches eggs</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-hatchery-toggle" ${s.autoHatchery ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Instant Hatch</span>
                  <span class="pcb-desc">Instantly hatches eggs without waiting for step counters</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-instanthatch-toggle" ${s.autoInstantHatch ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Breeding Priority</span>
                  <span class="pcb-desc">Sort order for selecting candidate parents</span>
                </div>
                <select class="pcb-select" id="pcb-hatchery-priority">
                  <option value="efficiency" ${s.hatcheryPriority === 'efficiency' ? 'selected' : ''}>📈 Breeding Efficiency</option>
                  <option value="baseAttack" ${s.hatcheryPriority === 'baseAttack' ? 'selected' : ''}>⚔️ Highest Base Attack</option>
                  <option value="missingShiny" ${s.hatcheryPriority === 'missingShiny' ? 'selected' : ''}>✨ Missing Shiny Hunter</option>
                  <option value="pokerus" ${s.hatcheryPriority === 'pokerus' ? 'selected' : ''}>🦠 Pokérus Resistant</option>
                </select>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Revive Fossils</span>
                  <span class="pcb-desc">Places Helix, Dome, Amber, etc. into Nursery when slots open</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-fossil-toggle" ${s.autoFossils ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <button class="pcb-btn" id="pcb-btn-instanthatch" style="width: 100%; margin-top: 4px;">
                🐣 Instant Hatch All Current Eggs
              </button>
            </div>
          </div>

          <!-- 7. Underground Mining Tab -->
          <div class="pcb-tab-pane" id="pcb-tab-mine">
            <div class="pcb-card">
              <div class="pcb-card-title">X-Ray Underground Mining</div>
              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Mining Engine</span>
                  <span class="pcb-desc">Automates digging, survey, and layer completion</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-mine-toggle" ${s.autoUnderground ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">X-Ray Wallhack Vision</span>
                  <span class="pcb-desc">Identifies exact buried items beneath rock tiles</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-wallhack-toggle" ${s.undergroundWallhack ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Bomb Dirt</span>
                  <span class="pcb-desc">Uses Bomb when stamina is full to blast away top layers</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-bomb-toggle" ${s.autoMineBomb ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Small Restores & Battery</span>
                  <span class="pcb-desc">Discharges battery and drinks restores for continuous digging</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-battery-toggle" ${s.autoBattery ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Trade for Diamonds</span>
                  <span class="pcb-desc">Converts duplicate treasures into valuable Diamonds</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-diamonds-toggle" ${s.autoTradeTreasures ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <!-- 8. Berry Farm Tab -->
          <div class="pcb-tab-pane" id="pcb-tab-farm">
            <div class="pcb-card">
              <div class="pcb-card-title">Autonomous Farming Mode</div>
              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Farm (Autonomous Mode)</span>
                  <span class="pcb-desc">Coordinates route farming, crops, stamina, day care, and quests</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-autofarm-toggle" ${s.autoFarmMaster ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="pcb-card">
              <div class="pcb-card-title">Berry Farming Automation</div>
              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Berry Plots</span>
                  <span class="pcb-desc">Handles planting, harvesting, and weed clearance</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-farm-toggle" ${s.autoFarming ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Selected Berry to Plant</span>
                  <span class="pcb-desc">Berry seed automatically replanted on empty plots</span>
                </div>
                <select class="pcb-select" id="pcb-berry-select">
                  <option value="0" ${s.farmingBerry === 0 ? 'selected' : ''}>🍒 Cheri Berry</option>
                  <option value="1" ${s.farmingBerry === 1 ? 'selected' : ''}>🌰 Chesto Berry</option>
                  <option value="2" ${s.farmingBerry === 2 ? 'selected' : ''}>🍑 Pecha Berry</option>
                  <option value="3" ${s.farmingBerry === 3 ? 'selected' : ''}>🍇 Rawst Berry</option>
                  <option value="4" ${s.farmingBerry === 4 ? 'selected' : ''}>🍐 Aspear Berry</option>
                  <option value="5" ${s.farmingBerry === 5 ? 'selected' : ''}>🍓 Leppa Berry</option>
                  <option value="6" ${s.farmingBerry === 6 ? 'selected' : ''}>🍊 Oran Berry</option>
                  <option value="7" ${s.farmingBerry === 7 ? 'selected' : ''}>🍋 Persim Berry</option>
                  <option value="8" ${s.farmingBerry === 8 ? 'selected' : ''}>🍈 Lum Berry</option>
                  <option value="9" ${s.farmingBerry === 9 ? 'selected' : ''}>🥝 Sitrus Berry</option>
                </select>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Shovel Weeds</span>
                  <span class="pcb-desc">Removes withered crops & weeds to keep soil fertile</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-weed-toggle" ${s.autoWeedClear ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <!-- 9. Quests & Frontier Tab -->
          <div class="pcb-tab-pane" id="pcb-tab-quests">
            <div class="pcb-card">
              <div class="pcb-card-title">Universal Quest Engine & Frontier</div>
              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Daily & Story Quests</span>
                  <span class="pcb-desc">Begins, solves criteria via code navigation, and claims rewards</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-quests-toggle" ${s.autoQuests ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>

              <div class="pcb-row">
                <div class="pcb-label-desc">
                  <span class="pcb-label">Auto Battle Frontier</span>
                  <span class="pcb-desc">Fights Battle Frontier for points, trophies & achievements</span>
                </div>
                <label class="pcb-toggle">
                  <input type="checkbox" id="pcb-frontier-toggle" ${s.autoFrontier ? 'checked' : ''}>
                  <span class="pcb-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <!-- 10. Logs Tab -->
          <div class="pcb-tab-pane" id="pcb-tab-logs">
            <div class="pcb-card">
              <div class="pcb-card-title">
                <span>Realtime Activity Console</span>
                <button class="pcb-btn" id="pcb-btn-clearlogs" style="padding: 2px 8px; font-size: 10px;">Clear</button>
              </div>
              <div class="pcb-console" id="pcb-console"></div>
            </div>
          </div>
        </div>
      `;

      const pill = document.createElement('div');
      pill.id = 'pokeclicker-bot-pill';
      pill.innerHTML = `
        <span class="pcb-pill-dot"></span>
        <span style="font-weight: 700;">BOT RUNNING</span>
        <span style="color: var(--pcb-primary);" id="pcb-pill-cps">0 CPS</span>
      `;

      const badge = document.createElement('div');
      badge.id = 'pokeclicker-bot-badge';
      badge.title = 'PokéClicker Master Bot (Press F2 or Click to Open/Close)';
      badge.textContent = '⚡';

      document.body.appendChild(container);
      document.body.appendChild(pill);
      document.body.appendChild(badge);
    },

    attachEvents() {
      try {
        const core = window.PokeClickerBotCore || { settings: {} };
        const s = core.settings;

        const on = (id, event, fn) => {
          const el = document.getElementById(id);
          if (el) el.addEventListener(event, fn);
          return el;
        };

        const header = document.getElementById('pcb-header');
        const container = document.getElementById('pokeclicker-bot-container');

        if (header && container) {
          header.addEventListener('mousedown', (e) => {
            if (e.target.closest('button') || e.target.closest('input') || e.target.closest('label') || e.target.closest('select')) return;
            this.dragState.isDragging = true;
            this.dragState.startX = e.clientX;
            this.dragState.startY = e.clientY;
            const rect = container.getBoundingClientRect();
            this.dragState.initialLeft = rect.left;
            this.dragState.initialTop = rect.top;
          });

          window.addEventListener('mousemove', (e) => {
            if (!this.dragState.isDragging) return;
            const dx = e.clientX - this.dragState.startX;
            const dy = e.clientY - this.dragState.startY;
            container.style.left = `${this.dragState.initialLeft + dx}px`;
            container.style.top = `${this.dragState.initialTop + dy}px`;
            container.style.right = 'auto';
          });

          window.addEventListener('mouseup', () => {
            this.dragState.isDragging = false;
          });
        }

        on('pcb-master-toggle', 'change', (e) => {
          s.masterEnabled = e.target.checked;
          if (core.saveSettings) {
            core.running = s.masterEnabled;
            core.saveSettings();
            core.log(`Master Bot: ${s.masterEnabled ? 'ACTIVE' : 'PAUSED'}`, s.masterEnabled ? 'success' : 'warn');
          }
        });

        on('pcb-btn-minimize', 'click', () => this.toggleMinimize());
        on('pokeclicker-bot-pill', 'click', () => this.toggleMinimize(false));
        on('pokeclicker-bot-badge', 'click', () => this.toggleVisibility());
        on('pcb-btn-close', 'click', () => this.toggleVisibility(false));

        // Tab Navigation
        document.querySelectorAll('.pcb-tab-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            document.querySelectorAll('.pcb-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.pcb-tab-pane').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const tabId = `pcb-tab-${btn.getAttribute('data-tab')}`;
            const pane = document.getElementById(tabId);
            if (pane) pane.classList.add('active');

            // If switching to spawner, populate items
            if (btn.getAttribute('data-tab') === 'spawner') {
              this.populateSpawnerItems();
            }
          });
        });

        const bindToggle = (id, key) => {
          on(id, 'change', (e) => {
            s[key] = e.target.checked;
            if (core.saveSettings) core.saveSettings();
          });
        };

        // Story Toggles & Selects
        bindToggle('pcb-story-toggle', 'autoStoryProgression');
        bindToggle('pcb-mapnav-toggle', 'autoMapNavigation');
        bindToggle('pcb-tutorial-toggle', 'autoTutorial');
        bindToggle('pcb-uncaught-toggle', 'uncaughtHunter');
        bindToggle('pcb-raids-toggle', 'autoRaids');
        bindToggle('pcb-gym-toggle', 'autoGym');
        bindToggle('pcb-dungeon-toggle', 'autoDungeon');
        bindToggle('pcb-travel-toggle', 'autoTravel');

        // Route 100% Completion Toggles & Selects
        bindToggle('pcb-comp-base-toggle', 'completionCatchAll');
        bindToggle('pcb-comp-shiny-toggle', 'completionCatchShinies');
        bindToggle('pcb-comp-shinyboost-toggle', 'autoShinyBoostOnRoute');
        bindToggle('pcb-comp-achieve-toggle', 'completionAchievements');
        on('pcb-comp-achievetarget-select', 'change', (e) => {
          s.routeAchievementTarget = parseInt(e.target.value, 10);
          if (core.saveSettings) core.saveSettings();
        });

        // Route & Global Achievement Quick Actions
        on('pcb-btn-max-cur-route', 'click', () => {
          if (core.maxRouteAchievements && core.adapter) {
            const reg = core.adapter.getRegion();
            const r = core.adapter.getRoute();
            core.maxRouteAchievements(reg, r);
          }
        });
        on('pcb-btn-max-all-routes', 'click', () => {
          if (core.maxAllRegionalRouteAchievements && core.adapter) {
            const reg = core.adapter.getRegion();
            core.maxAllRegionalRouteAchievements(reg);
          }
        });
        on('pcb-btn-unlock-all-achieve', 'click', () => {
          if (core.unlockAllAchievementsGlobal) {
            core.unlockAllAchievementsGlobal();
          }
        });

        // Safari Zone Toggles & Actions
        bindToggle('pcb-safari-auto-toggle', 'autoSafari');
        bindToggle('pcb-safari-catch-toggle', 'safariCatchRate');
        bindToggle('pcb-safari-balls-toggle', 'safariInfiniteBalls');
        bindToggle('pcb-safari-loot-toggle', 'safariAutoLoot');
        bindToggle('pcb-safari-shiny-toggle', 'safariCatchShinies');
        on('pcb-btn-complete-safari', 'click', () => {
          if (core.completeCurrentSafari) core.completeCurrentSafari();
        });
        on('pcb-btn-max-safari-level', 'click', () => {
          if (core.maxSafariLevel) core.maxSafariLevel();
        });
        on('pcb-btn-open-safari', 'click', () => {
          if (typeof Safari !== 'undefined' && Safari.openModal) Safari.openModal();
        });

        on('pcb-strategy-select', 'change', (e) => {
          s.routeStrategy = e.target.value;
          if (core.saveSettings) core.saveSettings();
        });

        // Spawner & Cheat Toggles
        bindToggle('pcb-gainonspend-toggle', 'gainOnSpend');

        // Currency Injector Buttons
        document.querySelectorAll('.pcb-currency-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const curType = parseInt(btn.getAttribute('data-currency'), 10);
            const amt = parseInt(btn.getAttribute('data-amount'), 10);
            if (core.injectCurrency) {
              core.injectCurrency(curType, amt);
            }
          });
        });

        // Quick Item Packs
        on('pcb-pack-balls', 'click', () => core.spawnPack && core.spawnPack('allBalls'));
        on('pcb-pack-stones', 'click', () => core.spawnPack && core.spawnPack('allStones'));
        on('pcb-pack-vitamins', 'click', () => core.spawnPack && core.spawnPack('allVitamins'));
        on('pcb-pack-battle', 'click', () => core.spawnPack && core.spawnPack('allBattleItems'));
        on('pcb-pack-fossils', 'click', () => core.spawnPack && core.spawnPack('allFossils'));
        on('pcb-pack-restores', 'click', () => core.spawnPack && core.spawnPack('restores'));
        on('pcb-pack-keys', 'click', () => core.spawnPack && core.spawnPack('allKeys'));

        // Catalog Spawner Button
        on('pcb-btn-spawner-inject', 'click', () => {
          const sel = document.getElementById('pcb-spawner-itemselect');
          const qtyInput = document.getElementById('pcb-spawner-qty');
          if (!sel || !sel.value) {
            alert('Please select an item first!');
            return;
          }
          const itemKey = sel.value;
          const qty = parseInt(qtyInput ? qtyInput.value : 100, 10) || 100;
          if (core.spawnItem) {
            core.spawnItem(itemKey, qty);
          }
        });

        // Combat Toggles
        bindToggle('pcb-clicker-toggle', 'clickerEnabled');
        bindToggle('pcb-bypass-toggle', 'bypassThrottle');
        bindToggle('pcb-godmode-toggle', 'godMode');
        bindToggle('pcb-farmgym-toggle', 'farmGym');
        bindToggle('pcb-farmdungeon-toggle', 'farmDungeon');

        // Catch Toggles
        bindToggle('pcb-catchrate-toggle', 'perfectCatchRate');
        bindToggle('pcb-boostshiny-toggle', 'boostShinyRate');
        bindToggle('pcb-ballselect-toggle', 'autoBallSelector');
        bindToggle('pcb-buyballs-toggle', 'autoBuyBalls');

        // Items Toggles
        bindToggle('pcb-battleitems-toggle', 'autoBattleItems');
        bindToggle('pcb-stone-toggle', 'autoStoneEvo');
        bindToggle('pcb-fossil-toggle', 'autoFossils');
        bindToggle('pcb-oak-toggle', 'autoOakItems');
        bindToggle('pcb-gems-toggle', 'autoGems');

        // Hatchery Toggles
        bindToggle('pcb-hatchery-toggle', 'autoHatchery');
        bindToggle('pcb-instanthatch-toggle', 'autoInstantHatch');

        // Mining Toggles
        bindToggle('pcb-mine-toggle', 'autoUnderground');
        bindToggle('pcb-wallhack-toggle', 'undergroundWallhack');
        bindToggle('pcb-bomb-toggle', 'autoMineBomb');
        bindToggle('pcb-battery-toggle', 'autoBattery');
        bindToggle('pcb-diamonds-toggle', 'autoTradeTreasures');

        // Farm Toggles
        bindToggle('pcb-autofarm-toggle', 'autoFarmMaster');
        bindToggle('pcb-farm-toggle', 'autoFarming');
        bindToggle('pcb-weed-toggle', 'autoWeedClear');

        // Quests Toggles
        bindToggle('pcb-quests-toggle', 'autoQuests');
        bindToggle('pcb-frontier-toggle', 'autoFrontier');

        // Sliders & Selects
        const cpsSlider = document.getElementById('pcb-cps-slider');
        const cpsLabel = document.getElementById('pcb-cps-label');
        if (cpsSlider) {
          cpsSlider.addEventListener('input', (e) => {
            s.clickerCPS = parseInt(e.target.value, 10);
            if (cpsLabel) cpsLabel.textContent = `${s.clickerCPS} CPS`;
            if (core.updateClickerSpeed) core.updateClickerSpeed();
            if (core.saveSettings) core.saveSettings();
          });
        }

        const tokenSlider = document.getElementById('pcb-tokens-slider');
        const tokenLabel = document.getElementById('pcb-tokens-label');
        if (tokenSlider) {
          tokenSlider.addEventListener('input', (e) => {
            s.dungeonMinTokens = parseInt(e.target.value, 10);
            if (tokenLabel) tokenLabel.textContent = `${s.dungeonMinTokens} Tokens`;
            if (core.saveSettings) core.saveSettings();
          });
        }

        on('pcb-dungeon-mode', 'change', (e) => {
          s.dungeonMode = e.target.value;
          if (core.saveSettings) core.saveSettings();
        });

        on('pcb-shinymult-select', 'change', (e) => {
          s.shinyMultiplier = parseInt(e.target.value, 10);
          if (core.saveSettings) core.saveSettings();
        });

        on('pcb-hatchery-priority', 'change', (e) => {
          s.hatcheryPriority = e.target.value;
          if (core.saveSettings) core.saveSettings();
        });

        on('pcb-berry-select', 'change', (e) => {
          s.farmingBerry = parseInt(e.target.value, 10);
          if (core.saveSettings) core.saveSettings();
        });

        on('pcb-btn-instanthatch', 'click', () => {
          if (core.instantHatchAll) core.instantHatchAll();
        });

        on('pcb-btn-boost', 'click', () => {
          if (core.boostResources) core.boostResources();
        });

        on('pcb-btn-clearlogs', 'click', () => {
          const consoleEl = document.getElementById('pcb-console');
          if (consoleEl) consoleEl.innerHTML = '';
        });

        // Hotkeys: F2 (Toggle UI), F4 (Toggle Master Bot)
        window.addEventListener('keydown', (e) => {
          if (e.key === 'F2') {
            e.preventDefault();
            e.stopPropagation();
            this.toggleVisibility();
          } else if (e.key === 'F4') {
            e.preventDefault();
            e.stopPropagation();
            const master = document.getElementById('pcb-master-toggle');
            if (master) {
              master.checked = !master.checked;
              master.dispatchEvent(new Event('change'));
            }
          }
        }, true);

        // Global shortcut on window
        window.togglePokeClickerBot = () => this.toggleVisibility();

        // Populate items once ready
        setTimeout(() => this.populateSpawnerItems(), 1500);

        // Log stream
        if (core) {
          core.onLog = (entry) => {
            const consoleEl = document.getElementById('pcb-console');
            if (!consoleEl) return;
            const row = document.createElement('div');
            row.className = 'pcb-log-entry';
            
            let typeClass = 'pcb-log-info';
            if (entry.type === 'success') typeClass = 'pcb-log-success';
            if (entry.type === 'warn') typeClass = 'pcb-log-warn';
            if (entry.type === 'danger') typeClass = 'pcb-log-danger';
            if (entry.type === 'shiny' || entry.type === 'gold') typeClass = 'pcb-log-shiny';

            row.innerHTML = `<span class="pcb-log-time">[${entry.time}]</span> <span class="${typeClass}">${entry.message}</span>`;
            consoleEl.appendChild(row);

            if (consoleEl.children.length > 100) {
              consoleEl.removeChild(consoleEl.firstChild);
            }
            consoleEl.scrollTop = consoleEl.scrollHeight;
          };
        }
      } catch (err) {
        console.error('[PokeClickerBot] Error in attachEvents:', err);
      }
    },

    populateSpawnerItems() {
      try {
        const sel = document.getElementById('pcb-spawner-itemselect');
        if (!sel) return;
        if (typeof ItemList === 'undefined') return;

        const keys = Object.keys(ItemList).sort();
        if (keys.length === 0) return;

        // Only repopulate if still placeholder
        if (sel.options.length <= 1) {
          sel.innerHTML = '<option value="">-- Choose Item from Catalog (' + keys.length + ' Items) --</option>';
          keys.forEach(k => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = k.replace(/_/g, ' ');
            sel.appendChild(opt);
          });
        }
      } catch (e) {}
    },

    toggleMinimize(force) {
      const container = document.getElementById('pokeclicker-bot-container');
      const pill = document.getElementById('pokeclicker-bot-pill');
      this.minimized = typeof force === 'boolean' ? force : !this.minimized;
      if (this.minimized) {
        if (container) container.style.display = 'none';
        if (pill) pill.classList.add('active');
      } else {
        if (container) container.style.display = 'flex';
        if (pill) pill.classList.remove('active');
      }
    },

    toggleVisibility(force) {
      const container = document.getElementById('pokeclicker-bot-container');
      if (!container) return;
      this.visible = typeof force === 'boolean' ? force : !this.visible;
      if (this.visible) {
        container.classList.remove('hidden');
      } else {
        container.classList.add('hidden');
      }
    },

    startHUDUpdater() {
      const core = window.PokeClickerBotCore;
      setInterval(() => {
        if (!core) return;
        const cpsEl = document.getElementById('pcb-hud-cps');
        const killsEl = document.getElementById('pcb-hud-kills');
        const caughtEl = document.getElementById('pcb-hud-caught');
        const shinyEl = document.getElementById('pcb-hud-shiny');
        const objEl = document.getElementById('pcb-hud-objective');
        const pillCps = document.getElementById('pcb-pill-cps');

        if (cpsEl) cpsEl.textContent = `${core.stats.cps} /s`;
        if (killsEl) killsEl.textContent = core.stats.kills.toLocaleString();
        if (caughtEl) caughtEl.textContent = core.stats.caught.toLocaleString();
        if (shinyEl) shinyEl.textContent = core.stats.shiniesEncountered.toString();
        if (objEl) objEl.textContent = core.stats.currentObjective;
        if (pillCps) pillCps.textContent = `${core.stats.cps} CPS`;
      }, 400);
    }
  };

  window.PokeClickerBotUI = BotUI;
})();
