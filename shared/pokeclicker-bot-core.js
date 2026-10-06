/**
 * PokéClicker Master Bot - Advanced Core Automation Engine
 * Version 3.5.0 - 100% Safari Zone Auto-Completion & Route Shiny Completionist
 */

(function () {
  'use strict';

  if (window.PokeClickerBotCore) {
    console.log('[PokeClickerBot] Core already present in window.');
    return;
  }

  // ==========================================================
  // DYNAMIC GAME ADAPTER
  // ==========================================================
  const GameAdapter = {
    unwrap(val) {
      if (typeof val === 'function') {
        try { return val(); } catch (e) { return null; }
      }
      return val;
    },

    getGame() {
      if (typeof App !== 'undefined' && App.game) return App.game;
      if (window.App && window.App.game) return window.App.game;
      return null;
    },

    getRoute() {
      if (typeof player === 'undefined') return 0;
      return typeof player.route === 'function' ? player.route() : player.route;
    },

    getRegion() {
      if (typeof player === 'undefined') return 0;
      return typeof player.region === 'function' ? player.region() : player.region;
    },

    getParty() {
      const g = this.getGame();
      return g ? g.party : null;
    },

    getBreeding() {
      const g = this.getGame();
      return g ? g.breeding : null;
    },

    getFarming() {
      const g = this.getGame();
      return g ? g.farming : null;
    },

    getUnderground() {
      const g = this.getGame();
      return g ? g.underground : null;
    },

    getQuests() {
      const g = this.getGame();
      return g ? g.quests : null;
    },

    getWallet() {
      const g = this.getGame();
      return g ? g.wallet : null;
    },

    getBattle() {
      if (typeof Battle !== 'undefined') return Battle;
      if (window.Battle) return window.Battle;
      return null;
    },

    getGymBattle() {
      if (typeof GymBattle !== 'undefined') return GymBattle;
      if (window.GymBattle) return window.GymBattle;
      return null;
    },

    getDungeonBattle() {
      if (typeof DungeonBattle !== 'undefined') return DungeonBattle;
      if (window.DungeonBattle) return window.DungeonBattle;
      return null;
    },

    isReady() {
      const g = this.getGame();
      return !!(g && g.party && typeof player !== 'undefined');
    }
  };

  // ==========================================================
  // MASTER BOT CORE
  // ==========================================================
  const BotCore = {
    version: '3.5.0',
    initialized: false,
    running: false,
    isRouteShinyBoostActive: false,
    adapter: GameAdapter,

    // Live statistics
    stats: {
      clicks: 0,
      cps: 0,
      kills: 0,
      caught: 0,
      eggsHatched: 0,
      dungeonsCleared: 0,
      gymsCleared: 0,
      raidsCleared: 0,
      undergroundMined: 0,
      berriesHarvested: 0,
      shiniesEncountered: 0,
      evolutionsPerformed: 0,
      fossilsRevived: 0,
      currentObjective: 'Waiting for Save Selection...',
      startTime: Date.now(),
    },

    // User settings
    settings: {
      masterEnabled: true,
      autoFarmMaster: true, // Autonomous hands-off background farm

      // Story & Map Navigation (OFF by default for 100% manual map freedom)
      autoMapNavigation: false,
      autoStoryProgression: true,
      autoTutorial: true,
      uncaughtHunter: true,
      routeStrategy: 'completionist', // 'completionist' or 'progressionFirst'
      autoTravel: true,
      autoStoneEvo: true,
      autoFossils: true,

      // 100% Route Completionist Engine
      completionCatchAll: true,
      completionCatchShinies: true,
      autoShinyBoostOnRoute: true,
      completionAchievements: false,
      routeAchievementTarget: 10000,

      // Safari Zone Automation
      autoSafari: true,
      safariCatchRate: true,
      safariInfiniteBalls: true,
      safariAutoLoot: true,
      safariCatchShinies: true,

      // Combat & Auto Clicker
      clickerEnabled: true,
      clickerCPS: 40,
      bypassThrottle: true,
      godMode: false,

      // Real In-Game Catch & Shiny Multipliers
      perfectCatchRate: true,
      boostShinyRate: true,
      shinyMultiplier: 10,
      autoBallSelector: true,
      autoBuyBalls: true,
      minPokeballs: 50,
      buyAmount: 100,

      // Cheats & Economics
      gainOnSpend: false, // Invert spending: gain currency when spent!

      // Gyms, Raids & Battle Frontier
      autoGym: true,
      gymTarget: 'auto',
      farmGym: false,
      autoRaids: true,
      autoFrontier: false,

      // Dungeons
      autoDungeon: true,
      dungeonTarget: 'auto',
      farmDungeon: false,
      dungeonMode: 'bossRush', // 'bossRush', 'chestLoot', or 'fullClear'
      dungeonMinTokens: 200,

      // Day Care & Hatchery
      autoHatchery: true,
      autoInstantHatch: false,
      hatcheryPriority: 'efficiency',
      autoVitamins: false,

      // Items & Boosters
      autoBattleItems: true,
      autoFlutes: true,
      autoGems: true,
      autoOakItems: true,
      autoShards: true,

      // Underground Mining
      autoUnderground: true,
      undergroundWallhack: true,
      autoMineSurvey: true,
      autoMineBomb: false,
      autoBattery: true,
      autoTradeTreasures: true,

      // Berry Farming
      autoFarming: true,
      farmingBerry: 0,
      autoHarvest: true,
      autoWeedClear: true,
      autoMulch: false,

      // Quests
      autoQuests: true,
    },

    intervals: {},
    recentClicks: 0,
    lastClickTime: Date.now(),

    log(msg, type = 'info') {
      const entry = {
        time: new Date().toLocaleTimeString(),
        message: msg,
        type: type,
      };
      if (this.onLog) {
        this.onLog(entry);
      }
      if (type === 'shiny' || type === 'gold' || type === 'danger') {
        console.log(`%c[PokeClickerBot][${type.toUpperCase()}] ${msg}`, 'color: #00f0ff; font-weight: bold;');
      }
    },

    saveSettings() {
      try {
        localStorage.setItem('pokeclicker_bot_settings', JSON.stringify(this.settings));
      } catch (e) {}
    },

    loadSettings() {
      try {
        const saved = localStorage.getItem('pokeclicker_bot_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          Object.assign(this.settings, parsed);
        }
      } catch (e) {}
    },

    init() {
      this.loadSettings();

      // Poll until save profile is loaded
      const pollGame = setInterval(() => {
        if (this.adapter.isReady()) {
          clearInterval(pollGame);
          this.installDynamicHooks();
          this.startLoops();
          this.initialized = true;
          this.running = this.settings.masterEnabled;
          this.stats.currentObjective = 'Connected & Active';
          this.log(`PokéClicker Master Bot v${this.version} Connected!`, 'success');
        } else {
          this.stats.currentObjective = 'Select Save Profile to Begin';
        }
      }, 300);
    },

    installDynamicHooks() {
      const self = this;

      // 1. 100% Catch Rate Hook
      try {
        if (typeof Battle !== 'undefined') {
          const origCatchRate = Battle.catchRateActual;
          Battle.catchRateActual = function () {
            if (self.settings.masterEnabled && self.settings.perfectCatchRate) {
              return 100;
            }
            return origCatchRate ? origCatchRate.apply(this, arguments) : 100;
          };
        }
        if (typeof DungeonBattle !== 'undefined') {
          const origDungeonCatchRate = DungeonBattle.catchRateActual;
          DungeonBattle.catchRateActual = function () {
            if (self.settings.masterEnabled && self.settings.perfectCatchRate) {
              return 100;
            }
            return origDungeonCatchRate ? origDungeonCatchRate.apply(this, arguments) : 100;
          };
        }
        // 100% Safari Zone Catch Rate Hook
        if (typeof SafariBattle !== 'undefined' && SafariBattle.calcCapture) {
          const origSafariCalc = SafariBattle.calcCapture;
          SafariBattle.calcCapture = function () {
            if (self.settings.masterEnabled && (self.settings.perfectCatchRate || self.settings.safariCatchRate)) {
              return Promise.resolve([true, 3]);
            }
            return origSafariCalc.apply(this, arguments);
          };
          if (SafariBattle.Speed) {
            SafariBattle.Speed.ballThrowAnim = 80;
            SafariBattle.Speed.ballThrowDelay = 80;
            SafariBattle.Speed.enemyTransition = 80;
            SafariBattle.Speed.ballBounceDelay = 80;
            SafariBattle.Speed.ballBounceAnim = 80;
            SafariBattle.Speed.enemyCaught = 80;
          }
        }
        this.log('Installed 100% Guaranteed Catch Rate Hook (Routes, Dungeons, Safari).', 'success');
      } catch (e) {
        console.error('[PokeClickerBot] Catch hook install error:', e);
      }

      // 2. Dynamic Shiny Multiplier Hook
      try {
        if (typeof PokemonFactory !== 'undefined' && PokemonFactory.generateShiny) {
          const origGenShiny = PokemonFactory.generateShiny;
          PokemonFactory.generateShiny = function (chance, canBeShiny = true) {
            if (self.settings.masterEnabled) {
              if (self.isRouteShinyBoostActive) {
                chance = 1; // Guaranteed 100% shiny when hunting missing shinies on route/safari!
              } else if (self.settings.boostShinyRate) {
                const mult = Math.max(1, self.settings.shinyMultiplier || 1);
                chance = Math.max(1, Math.floor(chance / mult));
              }
            }
            const res = origGenShiny.call(this, chance, canBeShiny);
            if (res) {
              self.stats.shiniesEncountered++;
              self.log('✨ Wild Shiny Pokémon Encountered!', 'shiny');
            }
            return res;
          };
        }
        this.log('Installed Boosted Shiny Encounter Hook.', 'success');
      } catch (e) {
        console.error('[PokeClickerBot] Shiny hook install error:', e);
      }

      // 3. Invert Spending (Currency Increased When Spent) Hook
      try {
        const game = this.adapter.getGame();
        if (game && game.wallet) {
          const wallet = game.wallet;
          const origLoseAmount = wallet.loseAmount;
          const origHasAmount = wallet.hasAmount;

          wallet.hasAmount = function (amount) {
            if (self.settings.masterEnabled && self.settings.gainOnSpend) {
              return true; // Always can afford when gain-on-spend is active!
            }
            return origHasAmount.apply(this, arguments);
          };

          wallet.loseAmount = function (amount) {
            if (self.settings.masterEnabled && self.settings.gainOnSpend) {
              if (amount && amount.amount > 0) {
                const curType = amount.currency;
                if (wallet.currencies[curType]) {
                  wallet.currencies[curType](wallet.currencies[curType]() + Math.abs(amount.amount));
                  self.log(`Invert Spending: Gained +${amount.amount.toLocaleString()} ${GameConstants.Currency[curType]}!`, 'gold');
                  return true;
                }
              }
            }
            return origLoseAmount.apply(this, arguments);
          };
          this.log('Installed Invert Spending (Gain on Spend) Hook.', 'success');
        }
      } catch (e) {
        console.error('[PokeClickerBot] Gain on Spend hook install error:', e);
      }
    },

    startLoops() {
      // 1. Combat Clicker Loop
      this.updateClickerSpeed();

      // 2. High-Frequency Catch & Combat State Check (100ms)
      this.intervals.combatState = setInterval(() => {
        if (!this.settings.masterEnabled) return;
        this.tickCombatState();
      }, 100);

      // 3. Routine Automation Loop (300ms)
      this.intervals.routine = setInterval(() => {
        if (!this.settings.masterEnabled) return;
        this.tickHatchery();
        this.tickQuests();
        this.tickFarming();
        this.tickStoneEvolutions();
        this.tickFossils();
        this.tickCatchAndShop();
      }, 300);

      // 4. Strategic & Dungeon Loop (350ms)
      this.intervals.strategy = setInterval(() => {
        if (!this.settings.masterEnabled) return;
        this.tickProgression();
        this.tickSafari();
        this.tickDungeon();
        this.tickGym();
        this.tickUnderground();
        this.tickBattleFrontier();
      }, 350);
    },

    updateClickerSpeed() {
      if (this.intervals.combat) clearInterval(this.intervals.combat);
      this.intervals.combat = setInterval(() => {
        if (!this.settings.masterEnabled || !this.settings.clickerEnabled) return;
        this.tickCombat();
      }, Math.max(10, Math.floor(1000 / this.settings.clickerCPS)));
    },

    // ==========================================================
    // 1. COMBAT ENGINE (Dungeons, Raids, Gyms, Routes)
    // ==========================================================
    tickCombat() {
      try {
        const game = this.adapter.getGame();
        if (!game) return;

        if (this.settings.bypassThrottle) {
          if (typeof Battle !== 'undefined') Battle.lastClickAttack = 0;
          if (typeof GymBattle !== 'undefined') GymBattle.lastClickAttack = 0;
          if (typeof DungeonBattle !== 'undefined') DungeonBattle.lastClickAttack = 0;
          if (typeof TemporaryBattleBattle !== 'undefined') TemporaryBattleBattle.lastClickAttack = 0;
          if (typeof BattleFrontierBattle !== 'undefined') BattleFrontierBattle.lastClickAttack = 0;
        }

        const state = game.gameState;
        if (state === GameConstants.GameState.fighting) {
          this.executeClickAttack(this.adapter.getBattle());
        } else if (state === GameConstants.GameState.gym || (typeof GymRunner !== 'undefined' && GymRunner.running())) {
          this.executeClickAttack(this.adapter.getGymBattle());
        } else if (state === GameConstants.GameState.dungeon || (typeof DungeonRunner !== 'undefined' && (DungeonRunner.fighting() || DungeonRunner.fightingBoss()))) {
          this.executeClickAttack(this.adapter.getDungeonBattle());
        } else if (state === GameConstants.GameState.temporaryBattle || (typeof TemporaryBattleRunner !== 'undefined' && TemporaryBattleRunner.running())) {
          this.executeClickAttack(typeof TemporaryBattleBattle !== 'undefined' ? TemporaryBattleBattle : null);
        } else if (state === GameConstants.GameState.battleFrontier || (typeof BattleFrontierRunner !== 'undefined' && BattleFrontierRunner.running())) {
          this.executeClickAttack(typeof BattleFrontierBattle !== 'undefined' ? BattleFrontierBattle : null);
        }
      } catch (e) {}
    },

    executeClickAttack(battleCtx) {
      if (!battleCtx || !battleCtx.enemyPokemon) return;
      const enemy = battleCtx.enemyPokemon();
      if (!enemy || !enemy.isAlive()) return;

      if (this.settings.godMode) {
        enemy.damage(enemy.maxHealth());
        if (typeof battleCtx.defeatPokemon === 'function') {
          battleCtx.defeatPokemon();
        }
        this.stats.kills++;
        this.stats.clicks++;
        this.recentClicks++;
        return;
      }

      const prevHp = enemy.health();
      battleCtx.clickAttack();
      this.stats.clicks++;
      this.recentClicks++;

      if (prevHp > 0 && !enemy.isAlive()) {
        this.stats.kills++;
      }
    },

    tickCombatState() {
      try {
        const now = Date.now();
        const elapsed = (now - this.lastClickTime) / 1000;
        if (elapsed >= 1) {
          this.stats.cps = Math.round(this.recentClicks / elapsed);
          this.recentClicks = 0;
          this.lastClickTime = now;
        }

        // Auto restart battle if on route and enemy is dead
        const game = this.adapter.getGame();
        if (!game) return;
        if (game.gameState === GameConstants.GameState.fighting) {
          const b = this.adapter.getBattle();
          if (b && (!b.enemyPokemon() || !b.enemyPokemon().isAlive()) && !b.catching()) {
            b.generateNewEnemy();
          }
        }
      } catch (e) {}
    },

    // ==========================================================
    // 2. STORY, GYMS, RAIDS & ROUTE PROGRESSION
    // ==========================================================
    tickProgression() {
      if (!this.settings.autoStoryProgression && !this.settings.autoFarmMaster) return;

      try {
        const game = this.adapter.getGame();
        if (!game) return;

        const curRegion = this.adapter.getRegion();
        const curRouteNum = this.adapter.getRoute();

        // A. Tutorial Quests (Only auto-moves route if autoMapNavigation is true)
        if (this.settings.autoTutorial) {
          const tutorial = game.quests.getQuestLine('Tutorial Quests');
          if (tutorial && tutorial.state() !== QuestLineState.ended) {
            this.handleTutorial(tutorial);
            if (this.settings.autoMapNavigation) return;
          }
        }

        // B. Travel to Next Region (Dock sailing)
        if (this.settings.autoTravel && typeof MapHelper !== 'undefined' && MapHelper.ableToTravel && MapHelper.ableToTravel()) {
          this.stats.currentObjective = `Traveling to Region #${curRegion + 2}...`;
          this.log(`🏆 Regional Champion Defeated! Sailing to the next region...`, 'gold');
          MapHelper.travelToNextRegion();
          return;
        }

        // C. Check Unbeaten Raids / Temporary Battles in Current Town
        if (this.settings.autoRaids && typeof TemporaryBattleRunner !== 'undefined') {
          const town = player.town;
          if (town && town.content) {
            for (const item of town.content) {
              if (typeof TemporaryBattle !== 'undefined' && item instanceof TemporaryBattle) {
                const idx = GameConstants.getTemporaryBattlesIndex(item.name);
                const defeated = (game.statistics.temporaryBattleDefeated[idx] && game.statistics.temporaryBattleDefeated[idx]()) || 0;
                if (item.isUnlocked() && defeated === 0 && !TemporaryBattleRunner.running()) {
                  this.stats.currentObjective = `Challenging Raid: ${item.getDisplayName()}`;
                  this.log(`Challenging Unbeaten Raid/Battle: ${item.getDisplayName()}!`, 'gold');
                  TemporaryBattleRunner.startBattle(item);
                  return;
                }
              }
            }
          }
        }

        // D. Check Unbeaten Gym in Current Town
        if (this.settings.autoGym && typeof GymRunner !== 'undefined') {
          const curTown = player.town;
          if (curTown && curTown.gym && curTown.gym.isUnlocked() && curTown.gym.clears() < 1) {
            if (game.gameState !== GameConstants.GameState.gym && !GymRunner.running()) {
              this.stats.currentObjective = `Challenging Gym: ${curTown.gym.leaderName || curTown.gym.town}`;
              GymRunner.startGym(curTown.gym, false);
              return;
            }
          }
        }

        // CRITICAL: If Auto Map Navigation is OFF, NEVER call MapHelper.moveToRoute!
        // The user moves freely on the map; bot attacks, catches, hatches, and farms in place!
        if (!this.settings.autoMapNavigation) {
          if (curRouteNum > 0) {
            const curKills = (game.statistics.routeKills[GameConstants.Region[curRegion]] &&
                              game.statistics.routeKills[GameConstants.Region[curRegion]][curRouteNum]()) || 0;
            this.stats.currentObjective = `Route ${curRouteNum} (${curKills} kills) [Manual Navigation]`;
          } else if (player.town) {
            this.stats.currentObjective = `In ${player.town.name} [Manual Navigation]`;
          }
          return;
        }

        // E. AUTO MAP NAVIGATION (Only when explicitly enabled by user)
        // Never pull the player out of towns, gyms, or dungeons!
        if (game.gameState === GameConstants.GameState.town ||
            game.gameState === GameConstants.GameState.gym ||
            game.gameState === GameConstants.GameState.dungeon) {
          return;
        }

        const routes = Routes.getRoutesByRegion(curRegion);
        if (!routes || !routes.length) return;

        // Check current route completion
        const curRouteData = routes.find(r => r.number === curRouteNum);
        if (curRouteData) {
          const curKills = (game.statistics.routeKills[GameConstants.Region[curRegion]] &&
                            game.statistics.routeKills[GameConstants.Region[curRegion]][curRouteNum]()) || 0;
          const curKillsDone = curKills >= GameConstants.ROUTE_KILLS_NEEDED;
          const curRouteBaseCompleted = RouteHelper.routeCompleted(curRouteNum, curRegion, false);
          const curRouteShinyCompleted = RouteHelper.routeCompleted(curRouteNum, curRegion, true);
          const targetKills = this.settings.routeAchievementTarget || 10000;
          const curRouteAchieveDone = !this.settings.completionAchievements || (curKills >= targetKills);

          // Stage 1: Route Unlock (10 kills)
          if (!curKillsDone) {
            this.stats.currentObjective = `Route ${curRouteNum}: Unlocking (${curKills}/10 kills)`;
            this.isRouteShinyBoostActive = false;
            return;
          }

          // Stage 2: Catch All Base Species (Pokedex Completion)
          if (this.settings.uncaughtHunter && (this.settings.routeStrategy === 'completionist' || this.settings.completionCatchAll) && !curRouteBaseCompleted) {
            const uncaught = this.getRouteUncaught(curRouteData, false);
            if (uncaught.length > 0) {
              this.stats.currentObjective = `Route ${curRouteNum}: Catching [${uncaught.slice(0, 3).join(', ')}] (${uncaught.length} left)`;
              this.isRouteShinyBoostActive = false;
              return;
            }
          }

          // Stage 3: Catch All Shiny Pokémon (with Instant/Boosted Shiny Rate!)
          if (this.settings.completionCatchShinies && !curRouteShinyCompleted) {
            const missingShinies = this.getRouteUncaught(curRouteData, true);
            if (missingShinies.length > 0) {
              if (this.settings.autoShinyBoostOnRoute) {
                this.isRouteShinyBoostActive = true;
              }
              this.stats.currentObjective = `Route ${curRouteNum}: Shiny Hunting [${missingShinies.slice(0, 3).join(', ')}] (⚡ Shiny Boost Active)`;
              return;
            }
          }
          this.isRouteShinyBoostActive = false;

          // Stage 4: Route Kill Achievements (100 / 1,000 / 10,000 Kills)
          if (this.settings.completionAchievements && !curRouteAchieveDone) {
            this.stats.currentObjective = `Route ${curRouteNum}: Farming Achievements (${curKills.toLocaleString()}/${targetKills.toLocaleString()} kills)`;
            return;
          }
        }

        // Find next route forward that is unlocked and incomplete
        for (const route of routes) {
          if (!route.isUnlocked()) continue;

          const kills = (game.statistics.routeKills[GameConstants.Region[curRegion]] &&
                         game.statistics.routeKills[GameConstants.Region[curRegion]][route.number]()) || 0;
          const killsDone = kills >= GameConstants.ROUTE_KILLS_NEEDED;
          const isRouteBaseDone = RouteHelper.routeCompleted(route.number, curRegion, false);
          const isRouteShinyDone = RouteHelper.routeCompleted(route.number, curRegion, true);
          const targetKills = this.settings.routeAchievementTarget || 10000;
          const isRouteAchieveDone = !this.settings.completionAchievements || (kills >= targetKills);

          const isComplete = killsDone &&
            (!this.settings.completionCatchAll || isRouteBaseDone) &&
            (!this.settings.completionCatchShinies || isRouteShinyDone) &&
            isRouteAchieveDone;

          if (!isComplete) {
            if (this.settings.autoMapNavigation && curRouteNum !== route.number) {
              this.stats.currentObjective = `Advancing to Route ${route.number} for 100% Completion`;
              MapHelper.moveToRoute(route.number, curRegion);
              this.log(`Advancing to Route ${route.number} to continue 100% completion...`, 'info');
            }
            return;
          }
        }

        // Story Dungeons Needing Clears
        if (this.settings.autoDungeon && typeof dungeonList !== 'undefined') {
          for (const dungeonName in dungeonList) {
            const dungeon = dungeonList[dungeonName];
            if (dungeon && dungeon.isUnlocked && dungeon.isUnlocked()) {
              const dIndex = GameConstants.getDungeonIndex(dungeon.name);
              const clears = (game.statistics.dungeonsCleared[dIndex] && game.statistics.dungeonsCleared[dIndex]()) || 0;
              if (clears < 1) {
                const tokens = game.wallet.currencies[GameConstants.Currency.dungeonToken]();
                if (tokens >= dungeon.tokenCost) {
                  this.stats.currentObjective = `Clearing Story Dungeon: ${dungeon.name}`;
                  if (game.gameState !== GameConstants.GameState.dungeon) {
                    DungeonRunner.initializeDungeon(dungeon);
                    this.log(`Entering Unbeaten Story Dungeon: ${dungeon.name}!`, 'info');
                  }
                  return;
                }
              }
            }
          }
        }
      } catch (e) {
        console.error('[PokeClickerBot] Error in tickProgression:', e);
      }
    },

    getRouteUncaught(route, shinyCheck = false) {
      try {
        const curRegion = this.adapter.getRegion();
        const available = RouteHelper.getAvailablePokemonList(route.number, curRegion, true);
        if (!available || !available.length) return [];
        const party = this.adapter.getParty();
        return [...new Set(available)].filter(name => {
          const pData = PokemonHelper.getPokemonByName(name);
          return pData && !party.alreadyCaughtPokemon(pData.id, shinyCheck);
        });
      } catch (e) {
        return [];
      }
    },

    // ==========================================================
    // 3. TUTORIAL QUESTLINE HANDLER
    // ==========================================================
    handleTutorial(tutorial) {
      try {
        if (player.regionStarters[GameConstants.Region.kanto]() <= GameConstants.Starter.None) {
          if (typeof StartSequenceRunner !== 'undefined' && StartSequenceRunner.pickStarter) {
            StartSequenceRunner.pickStarter(GameConstants.Starter.Grass);
            this.log('Tutorial: Selected starter Pokémon (Bulbasaur)!', 'success');
            return;
          }
        }

        if (tutorial.state() === QuestLineState.inactive) {
          tutorial.state(QuestLineState.started);
          tutorial.beginQuest(tutorial.curQuest());
        }

        const curIdx = tutorial.curQuest();
        const questObj = tutorial.curQuestObject();
        const desc = questObj && questObj.description ? questObj.description : `Quest #${curIdx + 1}`;
        this.stats.currentObjective = `Tutorial: ${desc}`;

        try {
          if (typeof Information !== 'undefined' && Information.hide) Information.hide();
          if (window.$) {
            $('#npc-modal').modal('hide');
            $('#pokeballSelectorModal').modal('hide');
          }
        } catch (e) {}

        const curRoute = this.adapter.getRoute();
        const allowMove = this.settings.autoMapNavigation;

        if (curIdx === 0) {
          if (allowMove && curRoute !== 1) MapHelper.moveToRoute(1, GameConstants.Region.kanto);
        } else if (curIdx === 1) {
          this.tickBallSelector();
          if (allowMove && curRoute !== 1) MapHelper.moveToRoute(1, GameConstants.Region.kanto);
        } else if (curIdx === 2) {
          if (allowMove && curRoute !== 2) MapHelper.moveToRoute(2, GameConstants.Region.kanto);
        } else if (curIdx === 3) {
          if (typeof PalletMom1 !== 'undefined' && PalletMom1.setTalkedTo) {
            PalletMom1.setTalkedTo();
            this.log('Tutorial: Talked to Mom in Pallet Town!', 'success');
          }
        } else if (curIdx === 4) {
          if (typeof ItemList !== 'undefined' && ItemList['Pokeball']) {
            ItemList['Pokeball'].buy(10);
            this.log('Tutorial: Bought 10 Poké Balls from Shop!', 'success');
          }
        } else if (curIdx === 5) {
          if (typeof ViridianCityOldMan2 !== 'undefined' && ViridianCityOldMan2.setTalkedTo) {
            ViridianCityOldMan2.setTalkedTo();
            this.log('Tutorial: Talked to Old Man in Viridian City!', 'success');
          }
        } else if (curIdx === 6) {
          if (allowMove && curRoute !== 1 && curRoute !== 2) {
            MapHelper.moveToRoute(1, GameConstants.Region.kanto);
          }
        } else if (curIdx === 7) {
          if (typeof ItemList !== 'undefined' && ItemList['Dungeon_ticket']) {
            ItemList['Dungeon_ticket'].buy(1);
            this.log('Tutorial: Bought Dungeon Ticket!', 'success');
          }
        } else if (curIdx === 8) {
          const tokens = App.game.wallet.currencies[GameConstants.Currency.dungeonToken]();
          if (tokens >= 50) {
            if (App.game.gameState !== GameConstants.GameState.dungeon) {
              const vForest = dungeonList['Viridian Forest'];
              if (vForest) {
                DungeonRunner.initializeDungeon(vForest);
                this.log('Tutorial: Entered Viridian Forest Dungeon!', 'info');
              }
            }
          }
        } else if (curIdx === 9) {
          const brock = GymList['Pewter City'];
          if (brock && App.game.gameState !== GameConstants.GameState.gym) {
            GymRunner.startGym(brock, false);
            this.log('Tutorial: Challenging Brock at Pewter City Gym!', 'info');
          }
        }
      } catch (err) {
        console.error('[PokeClickerBot] Error in handleTutorial:', err);
      }
    },

    // ==========================================================
    // 4. EVOLUTIONS & FOSSILS
    // ==========================================================
    tickStoneEvolutions() {
      if (!this.settings.autoStoneEvo) return;
      try {
        const party = this.adapter.getParty();
        if (!party || !party.caughtPokemon) return;

        party.caughtPokemon.forEach(pokemon => {
          if (!pokemon.evolutions) return;
          pokemon.evolutions.forEach(evo => {
            if (evo.stone && !party.alreadyCaughtPokemonByName(evo.evolvedPokemon)) {
              const stoneName = GameConstants.StoneType[evo.stone];
              if (stoneName && player.itemList[stoneName] && player.itemList[stoneName]() > 0) {
                const partyPokemon = party.getPokemon(pokemon.id);
                if (partyPokemon && partyPokemon.useStone) {
                  partyPokemon.useStone(evo.stone);
                  this.stats.evolutionsPerformed++;
                  this.log(`🧬 Evolved ${pokemon.name} into ${evo.evolvedPokemon} using ${stoneName}!`, 'shiny');
                }
              }
            }
          });
        });
      } catch (e) {}
    },

    tickFossils() {
      if (!this.settings.autoFossils) return;
      try {
        const breeding = this.adapter.getBreeding();
        if (!breeding || !breeding.canBreedPokemon() || !breeding.hasFreeEggSlot()) return;

        const fossils = [
          'Helix_fossil', 'Dome_fossil', 'Old_amber', 'Root_fossil', 'Claw_fossil',
          'Armor_fossil', 'Skull_fossil', 'Cover_fossil', 'Plume_fossil', 'Jaw_fossil',
          'Sail_fossil', 'Fossilized_bird', 'Fossilized_fish', 'Fossilized_drake', 'Fossilized_dino'
        ];

        for (const f of fossils) {
          if (player.itemList[f] && player.itemList[f]() > 0 && typeof ItemList !== 'undefined') {
            const item = ItemList[f];
            if (item && breeding.hasFreeEggSlot()) {
              breeding.addEggItemToHatchery(item);
              this.stats.fossilsRevived++;
              this.log(`🦖 Placed ${f.replace(/_/g, ' ')} into Day Care to revive!`, 'info');
              break;
            }
          }
        }
      } catch (e) {}
    },

    // ==========================================================
    // 5. GYMS & ADVANCED DUNGEON / RAID PATHFINDER
    // ==========================================================
    tickGym() {
      if (!this.settings.autoGym || typeof GymRunner === 'undefined') return;
      try {
        const game = this.adapter.getGame();
        if (game.gameState === GameConstants.GameState.gym || GymRunner.running()) return;

        if (this.settings.farmGym) {
          let target = null;
          if (this.settings.gymTarget === 'auto') {
            const town = player.town;
            if (town && town.gym) target = town.gym;
          } else {
            target = GymList[this.settings.gymTarget];
          }

          if (target && target.isUnlocked()) {
            GymRunner.startGym(target, true);
            this.stats.gymsCleared++;
            this.log(`Started Auto-Gym: ${target.leaderName || target.town}`, 'info');
          }
        }
      } catch (e) {}
    },

    tickDungeon() {
      if (!this.settings.autoDungeon || typeof DungeonRunner === 'undefined') return;
      try {
        const game = this.adapter.getGame();
        const state = game.gameState;

        if (state === GameConstants.GameState.dungeon) {
          const map = DungeonRunner.map;
          if (!map || !map.board || !map.board()) return;

          if (DungeonRunner.fighting() || DungeonRunner.fightingBoss() || (typeof DungeonBattle !== 'undefined' && DungeonBattle.catching && DungeonBattle.catching())) {
            return;
          }

          const currentTile = map.currentTile();
          if (currentTile) {
            if (currentTile.type() === GameConstants.DungeonTileType.chest) {
              DungeonRunner.openChest();
              this.log('Opened Dungeon Chest!', 'success');
              return;
            }
            if (currentTile.type() === GameConstants.DungeonTileType.boss && !DungeonRunner.fightingBoss()) {
              DungeonRunner.startBossFight();
              this.stats.dungeonsCleared++;
              this.log('Engaged Dungeon Boss Fight!', 'info');
              return;
            }
            if (currentTile.type() === GameConstants.DungeonTileType.ladder) {
              DungeonRunner.nextFloor();
              this.log('Climbed Dungeon Ladder to Next Floor!', 'info');
              return;
            }
          }

          const playerPos = map.playerPosition();
          const floor = playerPos.floor || 0;
          const board = map.board();
          if (!board || !board[floor]) return;
          const floorBoard = board[floor];

          let bossTile = null;
          let ladderTile = null;
          const chestTiles = [];
          const unvisitedTiles = [];

          for (let y = 0; y < floorBoard.length; y++) {
            for (let x = 0; x < floorBoard[y].length; x++) {
              const tile = floorBoard[y][x];
              if (!tile) continue;
              const type = tile.type();
              if (type === GameConstants.DungeonTileType.boss) {
                bossTile = { x, y, floor };
              } else if (type === GameConstants.DungeonTileType.ladder) {
                ladderTile = { x, y, floor };
              } else if (type === GameConstants.DungeonTileType.chest) {
                chestTiles.push({ x, y, floor });
              }
              if (!tile.isVisited) {
                unvisitedTiles.push({ x, y, floor });
              }
            }
          }

          let target = null;
          const exitTile = bossTile || ladderTile;

          if (this.settings.dungeonMode === 'bossRush') {
            target = exitTile;
          } else if (this.settings.dungeonMode === 'chestLoot') {
            if (chestTiles.length > 0) {
              target = this.findNearestTile(playerPos, chestTiles);
            } else {
              target = exitTile;
            }
          } else {
            if (unvisitedTiles.length > 0) {
              target = this.findNearestTile(playerPos, unvisitedTiles);
            } else {
              target = exitTile;
            }
          }

          if (!target && unvisitedTiles.length > 0) {
            target = this.findNearestTile(playerPos, unvisitedTiles);
          }

          if (!target) {
            target = exitTile;
          }

          if (target) {
            this.stepDungeonTowards(map, playerPos, target, floorBoard);
          }
        } else if (this.settings.farmDungeon && state === GameConstants.GameState.town && !DungeonRunner.fighting()) {
          const town = player.town;
          if (town && town.dungeon) {
            const dungeon = town.dungeon;
            if (DungeonRunner.canStartDungeon(dungeon)) {
              const tokens = game.wallet.currencies[GameConstants.Currency.dungeonToken]();
              if (tokens >= this.settings.dungeonMinTokens && tokens >= dungeon.tokenCost) {
                DungeonRunner.initializeDungeon(dungeon);
                this.log(`Entered Dungeon: ${dungeon.name}`, 'info');
              }
            }
          }
        }
      } catch (e) {
        console.error('[PokeClickerBot] Error in tickDungeon:', e);
      }
    },

    findNearestTile(pos, tiles) {
      let closest = null;
      let minDist = Infinity;
      for (const t of tiles) {
        const dist = Math.abs(t.x - pos.x) + Math.abs(t.y - pos.y);
        if (dist < minDist) {
          minDist = dist;
          closest = t;
        }
      }
      return closest;
    },

    stepDungeonTowards(map, playerPos, target, floorBoard) {
      try {
        const floor = playerPos.floor || 0;
        const dx = Math.abs(target.x - playerPos.x);
        const dy = Math.abs(target.y - playerPos.y);
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
          map.moveToCoordinates(target.x, target.y);
          return;
        }

        const neighbors = [
          { x: playerPos.x + 1, y: playerPos.y },
          { x: playerPos.x - 1, y: playerPos.y },
          { x: playerPos.x, y: playerPos.y + 1 },
          { x: playerPos.x, y: playerPos.y - 1 }
        ];

        let bestAdjacent = null;
        let bestDist = Infinity;

        for (const n of neighbors) {
          const pt = new Point(n.x, n.y, floor);
          if (map.hasAccessToTile(pt)) {
            const dist = Math.abs(target.x - n.x) + Math.abs(target.y - n.y);
            if (dist < bestDist) {
              bestDist = dist;
              bestAdjacent = n;
            }
          }
        }

        if (bestAdjacent) {
          map.moveToCoordinates(bestAdjacent.x, bestAdjacent.y);
          return;
        }

        for (const n of neighbors) {
          const pt = new Point(n.x, n.y, floor);
          if (map.hasAccessToTile(pt)) {
            map.moveToCoordinates(n.x, n.y);
            return;
          }
        }
      } catch (err) {}
    },

    // ==========================================================
    // 5. SAFARI ZONE ENGINE & COMPLETIONIST (Hands-Off & 100% Capture)
    // ==========================================================
    tickSafari() {
      if (!this.settings.autoSafari && (typeof Safari === 'undefined' || !Safari.inProgress())) return;
      try {
        if (typeof Safari === 'undefined' || typeof SafariBattle === 'undefined') return;

        // Auto unlock Safari Ticket if missing so Safari Zone is accessible
        if (!Safari.canAccess() && App.game && App.game.keyItems) {
          if (typeof KeyItemType !== 'undefined' && KeyItemType.Safari_ticket !== undefined) {
            App.game.keyItems.gainKeyItem(KeyItemType.Safari_ticket);
            this.log('🗝️ Unlocked Safari Ticket!', 'gold');
          }
        }

        const curRegion = typeof Safari.activeRegion === 'function' ? Safari.activeRegion() : player.region;

        // If currently inside Safari Zone
        if (Safari.inProgress()) {
          // 1. Refill Safari Balls if running low
          if (this.settings.safariInfiniteBalls && Safari.balls() <= 5) {
            Safari.balls(30);
          }

          // 2. Battle State Handling
          if (Safari.inBattle()) {
            const enemy = SafariBattle.enemy;
            if (enemy) {
              if (this.settings.safariCatchRate) {
                enemy.catchFactor = 100;
                enemy.escapeFactor = 0;
              }
              if (!SafariBattle.busy()) {
                SafariBattle.throwBall();
                this.stats.currentObjective = `Safari Battle: Catching ${enemy.name}${enemy.shiny ? ' ✨' : ''}`;
              }
            }
            return;
          }

          // 3. Auto Loot Items on Map
          if (this.settings.safariAutoLoot && Safari.itemGrid && Safari.itemGrid().length > 0) {
            const it = Safari.itemGrid()[0];
            Safari.playerXY.x = it.x;
            Safari.playerXY.y = it.y;
            Safari.checkItem();
            this.log('🎁 Picked up Safari Zone item!', 'success');
            return;
          }

          // 4. Species & Shiny Completion Check
          const safariList = (typeof SafariPokemonList !== 'undefined' && SafariPokemonList.list[curRegion])
            ? SafariPokemonList.list[curRegion]().filter(p => p.isAvailable ? p.isAvailable() : true)
            : [];

          const uncaughtBase = safariList.filter(p => !App.game.party.alreadyCaughtPokemonByName(p.name, false));
          const uncaughtShiny = safariList.filter(p => !App.game.party.alreadyCaughtPokemonByName(p.name, true));

          if (uncaughtBase.length > 0) {
            const target = uncaughtBase[0];
            this.stats.currentObjective = `Safari (${GameConstants.Region[curRegion]}): Hunting [${target.name}] (${uncaughtBase.length} remaining)`;
            
            const onGrid = Safari.pokemonGrid().find(p => p.name === target.name);
            if (onGrid) {
              Safari.playerXY.x = onGrid.x;
              Safari.playerXY.y = onGrid.y;
              Safari.checkBattle();
            } else {
              const pkmn = new SafariPokemon(target.name, 'base');
              SafariBattle.load(pkmn);
            }
            return;
          } else if (this.settings.safariCatchShinies && uncaughtShiny.length > 0) {
            const target = uncaughtShiny[0];
            this.stats.currentObjective = `Safari (${GameConstants.Region[curRegion]}): Shiny Hunting [${target.name}] (${uncaughtShiny.length} remaining)`;

            const pkmn = new SafariPokemon(target.name, 'base');
            pkmn.shiny = true;
            SafariBattle.load(pkmn);
            return;
          } else {
            this.stats.currentObjective = `Safari Zone (${GameConstants.Region[curRegion]}): 100% Completed! 🎉`;
          }
        } else if (this.settings.autoSafari && typeof player !== 'undefined' && player.town) {
          const curTown = player.town;
          const hasSafariTown = curTown.content && curTown.content.some(c => typeof SafariTownContent !== 'undefined' && c instanceof SafariTownContent);
          if (hasSafariTown && Safari.canAccess()) {
            if (Safari.canPay()) {
              Safari.payEntranceFee();
              this.log(`Entered Safari Zone (${GameConstants.Region[curRegion]})!`, 'info');
            } else if (App.game && App.game.wallet) {
              App.game.wallet.currencies[GameConstants.Currency.questPoint](1000);
              Safari.payEntranceFee();
              this.log(`Entered Safari Zone (${GameConstants.Region[curRegion]})!`, 'info');
            }
          }
        }
      } catch (e) {
        console.error('[PokeClickerBot] tickSafari error:', e);
      }
    },

    completeCurrentSafari() {
      try {
        const region = typeof Safari !== 'undefined' && typeof Safari.activeRegion === 'function' ? Safari.activeRegion() : player.region;
        if (typeof SafariPokemonList === 'undefined' || !SafariPokemonList.list[region]) {
          this.log(`No Safari Zone found in region ${GameConstants.Region[region]}!`, 'danger');
          return;
        }
        const encounters = SafariPokemonList.list[region]().filter(p => p.isAvailable ? p.isAvailable() : true);
        let caughtCount = 0;
        encounters.forEach(p => {
          const pData = PokemonHelper.getPokemonByName(p.name);
          if (!pData) return;
          if (!App.game.party.alreadyCaughtPokemon(pData.id, false)) {
            App.game.party.gainPokemonById(pData.id, false);
            caughtCount++;
          }
          if (!App.game.party.alreadyCaughtPokemon(pData.id, true)) {
            App.game.party.gainPokemonById(pData.id, true);
            caughtCount++;
          }
        });

        // Collect all items on grid if inside
        if (typeof Safari !== 'undefined' && Safari.inProgress && Safari.inProgress() && Safari.itemGrid) {
          while (Safari.itemGrid().length > 0) {
            const it = Safari.itemGrid()[0];
            Safari.playerXY.x = it.x;
            Safari.playerXY.y = it.y;
            Safari.checkItem();
          }
        }

        // Max Safari Level & Exp
        this.maxSafariLevel();

        if (typeof AchievementHandler !== 'undefined') {
          AchievementHandler.checkAchievements();
        }
        this.log(`🎯 Safari Zone (${GameConstants.Region[region]}) 100% Completed! Caught ${caughtCount} species/shinies & maxed Safari Level!`, 'gold');
      } catch (e) {
        console.error('[PokeClickerBot] completeCurrentSafari error:', e);
      }
    },

    maxSafariLevel() {
      try {
        if (typeof Safari !== 'undefined' && Safari.safariExp && Safari.expRequiredForLevel && Safari.maxSafariLevel) {
          const maxExp = Safari.expRequiredForLevel(Safari.maxSafariLevel);
          Safari.safariExp(maxExp);
          if (typeof AchievementHandler !== 'undefined') {
            AchievementHandler.checkAchievements();
          }
          this.log(`⭐ Safari Level maxed to Level ${Safari.maxSafariLevel} (${maxExp.toLocaleString()} EXP)!`, 'gold');
        }
      } catch (e) {
        console.error('[PokeClickerBot] maxSafariLevel error:', e);
      }
    },

    maxRouteAchievements(region, routeNum) {
      try {
        const game = this.adapter.getGame();
        if (!game || !game.statistics || !game.statistics.routeKills) return;
        const rName = GameConstants.Region[region];
        if (game.statistics.routeKills[rName] && game.statistics.routeKills[rName][routeNum]) {
          game.statistics.routeKills[rName][routeNum](10000);
          if (typeof AchievementHandler !== 'undefined') {
            AchievementHandler.checkAchievements();
          }
          this.log(`🏆 Route ${routeNum} (${rName}): Kills set to 10,000! All 3 route achievements unlocked!`, 'gold');
        }
      } catch (e) {
        console.error('[PokeClickerBot] maxRouteAchievements error:', e);
      }
    },

    maxAllRegionalRouteAchievements(region) {
      try {
        const game = this.adapter.getGame();
        if (!game || !game.statistics || !game.statistics.routeKills) return;
        const rName = GameConstants.Region[region];
        const routes = Routes.getRoutesByRegion(region);
        let count = 0;
        routes.forEach(route => {
          if (game.statistics.routeKills[rName] && game.statistics.routeKills[rName][route.number]) {
            game.statistics.routeKills[rName][route.number](10000);
            count++;
          }
        });
        if (typeof AchievementHandler !== 'undefined') {
          AchievementHandler.checkAchievements();
        }
        this.log(`🗺️ Maxed route kills (10,000) for all ${count} routes in ${rName}! All regional route achievements unlocked!`, 'gold');
      } catch (e) {
        console.error('[PokeClickerBot] maxAllRegionalRouteAchievements error:', e);
      }
    },

    unlockAllAchievementsGlobal() {
      try {
        if (typeof AchievementHandler === 'undefined' || !AchievementHandler.achievementList) return;
        let unlocked = 0;
        AchievementHandler.achievementList.forEach(a => {
          if (a.achievable && a.achievable() && !a.unlocked()) {
            a.unlock();
            unlocked++;
          }
        });
        AchievementHandler.updateAchievementBonus();
        this.log(`👑 Unlocked ${unlocked} achievements globally! All achievement damage bonuses activated!`, 'gold');
      } catch (e) {
        console.error('[PokeClickerBot] unlockAllAchievementsGlobal error:', e);
      }
    },

    // ==========================================================
    // 6. UNDERGROUND MINING (Autonomous Stamina Use)
    // ==========================================================
    tickUnderground() {
      if (!this.settings.autoUnderground) return;
      try {
        const ug = this.adapter.getUnderground();
        if (!ug) return;

        // Auto unlock Explorer Kit if missing so mining is available
        if (!ug.canAccess() && App.game.keyItems && !App.game.keyItems.hasKeyItem(KeyItemType.Explorer_kit)) {
          App.game.keyItems.gainKeyItem(KeyItemType.Explorer_kit);
          this.log('Unlocked Explorer Kit for Underground Mining!', 'gold');
        }

        if (!ug.canAccess()) return;

        if (this.settings.autoBattery) {
          if (ug.energy < 10) {
            if (player.itemList['SmallRestore'] && player.itemList['SmallRestore']() > 0) {
              ItemList['SmallRestore'].use(1);
              this.log('Underground: Used Small Restore for +10 Stamina!', 'info');
            }
          }
          if (ug.battery && ug.battery.charge && ug.battery.charge() > 0) {
            ug.battery.discharge();
          }
        }

        const mine = ug.mine;
        if (!mine) return;
        const grid = mine.grid;
        if (!grid || !grid.length) return;

        if (mine.completed || (mine.itemsFound >= mine.itemsBuried && mine.itemsBuried > 0)) {
          mine.completed = false;
          mine.generate();
          this.log('Underground Layer Completed! Generated new layer.', 'success');
          return;
        }

        if (this.settings.undergroundWallhack) {
          let dug = false;
          for (let i = 0; i < grid.length; i++) {
            const tile = grid[i];
            if (tile && tile.reward && tile.layerDepth > 0) {
              if (ug.energy > 0) {
                if (typeof UndergroundController !== 'undefined' && UndergroundController.clickModalMineSquare) {
                  UndergroundController.clickModalMineSquare(i);
                } else {
                  const coord = mine.getCoordinateForGridIndex(i);
                  ug.tools.useTool(UndergroundToolType.Chisel, coord.x, coord.y);
                }
                this.stats.undergroundMined++;
                dug = true;
                break;
              }
            }
          }

          if (!dug && this.settings.autoMineBomb && ug.energy >= 10) {
            ug.tools.useTool(UndergroundToolType.Bomb);
            this.stats.undergroundMined++;
          }
        }
      } catch (e) {}
    },

    // ==========================================================
    // 7. DAY CARE & HATCHERY (Autonomous Breeding)
    // ==========================================================
    tickHatchery() {
      if (!this.settings.autoHatchery) return;
      try {
        const breeding = this.adapter.getBreeding();
        if (!breeding || !breeding.canAccess() || !breeding.canBreedPokemon()) return;

        if (this.settings.autoInstantHatch) {
          breeding.eggList.forEach((eggObs, idx) => {
            const egg = eggObs();
            if (egg && egg.pokemon) {
              const maxSteps = typeof egg.totalSteps === 'function' ? egg.totalSteps() : egg.totalSteps;
              if (egg.steps) egg.steps(maxSteps || 1000);
            }
          });
        }

        breeding.eggList.forEach((eggObs, idx) => {
          const egg = eggObs();
          if (egg && egg.canHatch && egg.canHatch()) {
            breeding.hatchPokemonEgg(idx);
            this.stats.eggsHatched++;
            this.log(`Hatched egg in slot #${idx + 1}!`, 'success');
          }
        });

        if (breeding.hasFreeEggSlot()) {
          const breedingSet = new Set([
            ...breeding.eggList.map(l => l().pokemon).filter(Boolean),
            ...breeding.queueList().filter(q => q[0] === EggType.Pokemon).map(q => q[1]),
          ]);

          let candidates = this.adapter.getParty().caughtPokemon.filter(p => {
            return p.level === 100 && !breedingSet.has(p.name) && p.breedingEfficiency() > 0;
          });

          if (candidates.length > 0) {
            if (this.settings.hatcheryPriority === 'efficiency') {
              candidates.sort((a, b) => b.breedingEfficiency() - a.breedingEfficiency());
            } else if (this.settings.hatcheryPriority === 'baseAttack') {
              candidates.sort((a, b) => b.baseAttack - a.baseAttack);
            } else if (this.settings.hatcheryPriority === 'missingShiny') {
              candidates.sort((a, b) => (a.shiny ? 1 : 0) - (b.shiny ? 1 : 0) || b.breedingEfficiency() - a.breedingEfficiency());
            } else if (this.settings.hatcheryPriority === 'pokerus') {
              candidates.sort((a, b) => (b.pokerus || 0) - (a.pokerus || 0) || b.breedingEfficiency() - a.breedingEfficiency());
            }

            const chosen = candidates[0];
            if (chosen) {
              breeding.addPokemonToHatchery(chosen);
              this.log(`Day Care: Added ${chosen.name} (Atk: +${chosen.attackBonus()})`, 'info');
            }
          }
        }
      } catch (e) {}
    },

    // ==========================================================
    // 8. BERRY FARMING (Guaranteed Access & Full Cycle)
    // ==========================================================
    tickFarming() {
      if (!this.settings.autoFarming) return;
      try {
        const farm = this.adapter.getFarming();
        if (!farm) return;

        // Auto unlock Wailmer Pail so Berry Farm is never locked out
        if (!farm.canAccess() && App.game.keyItems && !App.game.keyItems.hasKeyItem(KeyItemType.Wailmer_pail)) {
          App.game.keyItems.gainKeyItem(KeyItemType.Wailmer_pail);
          this.log('Unlocked Wailmer Pail for Berry Farm automation!', 'gold');
        }

        if (!farm.canAccess()) return;
        const plots = farm.plotList;
        if (!plots) return;

        // Auto unlock locked farm plots if affordable
        plots.forEach((plot, index) => {
          if (!plot.isUnlocked() && farm.canBuyPlot(index)) {
            farm.unlockPlot(index);
            this.log(`Unlocked Berry Plot #${index + 1}!`, 'success');
          }
        });

        // Ensure player has seeds: if 0 of chosen berry, pick an owned berry or grant starter seeds
        let berryToPlant = this.settings.farmingBerry;
        if (!farm.hasBerry(berryToPlant)) {
          for (let b = 0; b < farm.berryInventory.length; b++) {
            if (farm.hasBerry(b)) {
              berryToPlant = b;
              break;
            }
          }
        }
        if (!farm.hasBerry(berryToPlant)) {
          farm.gainBerry(BerryType.Cheri, 10);
          berryToPlant = BerryType.Cheri;
        }

        plots.forEach((plot, index) => {
          if (!plot.isUnlocked()) return;

          if (this.settings.autoHarvest && plot.stage() === PlotStage.Berry) {
            farm.harvest(index);
            this.stats.berriesHarvested++;
            this.log(`Harvested berry from plot #${index + 1}!`, 'success');
          }

          if (plot.isEmpty() && farm.hasBerry(berryToPlant)) {
            farm.plant(index, berryToPlant);
          }

          if (this.settings.autoWeedClear && (plot.stage() === PlotStage.Withered || (plot.isWeed && plot.isWeed()))) {
            farm.shovel(index);
          }
        });
      } catch (e) {}
    },

    // ==========================================================
    // 9. SHOP, ITEMS, POKEBALLS & BOOSTERS
    // ==========================================================
    tickCatchAndShop() {
      try {
        this.tickBallSelector();

        if (this.settings.autoBuyBalls && typeof ItemList !== 'undefined') {
          const ballType = GameConstants.Pokeball.Pokeball;
          const current = App.game.pokeballs.pokeballs[ballType].quantity();
          if (current < this.settings.minPokeballs) {
            const money = App.game.wallet.currencies[GameConstants.Currency.money]();
            const cost = ItemList['Pokeball'].totalPrice(this.settings.buyAmount);
            if (money >= cost || this.settings.gainOnSpend) {
              ItemList['Pokeball'].buy(this.settings.buyAmount);
              this.log(`Auto-bought ${this.settings.buyAmount} Poké Balls!`, 'success');
            }
          }
        }

        this.tickBattleItems();
        this.tickOakItems();
        this.tickFlutesAndGems();
        this.tickTreasures();
      } catch (e) {}
    },

    tickBallSelector() {
      if (!this.settings.autoBallSelector) return;
      try {
        if (App.game.pokeballFilters && App.game.pokeballFilters.list) {
          const filters = App.game.pokeballFilters.list();
          filters.forEach(filter => {
            const name = filter.name ? filter.name() : '';
            if (name === 'Default' || name === 'Uncaught') {
              if (filter.ball() === GameConstants.Pokeball.None) {
                filter.ball(GameConstants.Pokeball.Pokeball);
              }
            } else if (name === 'Caught') {
              filter.ball(GameConstants.Pokeball.Pokeball);
            } else if (name === 'Shiny') {
              filter.ball(GameConstants.Pokeball.Ultraball);
            }
          });
        }

        if (App.game.pokeballs) {
          if (App.game.pokeballs.alreadyCaughtSelection) {
            App.game.pokeballs.alreadyCaughtSelection(GameConstants.Pokeball.Pokeball);
          }
          if (App.game.pokeballs.notCaughtSelection) {
            App.game.pokeballs.notCaughtSelection(GameConstants.Pokeball.Pokeball);
          }
          if (App.game.pokeballs.shinySelection) {
            App.game.pokeballs.shinySelection(GameConstants.Pokeball.Ultraball);
          }
        }
      } catch (e) {}
    },

    tickBattleItems() {
      if (!this.settings.autoBattleItems || typeof ItemList === 'undefined') return;
      try {
        const battleItems = ['xAttack', 'xClick', 'Lucky_egg', 'Lucky_incense', 'Item_magnet', 'Dowsing_machine'];
        for (const item of battleItems) {
          if (ItemList[item] && player.itemList[item] && player.itemList[item]() > 0) {
            if (player.effectList[item] && player.effectList[item]() <= 10) {
              ItemList[item].use(1);
            }
          }
        }
      } catch (e) {}
    },

    tickOakItems() {
      if (!this.settings.autoOakItems) return;
      try {
        const oak = App.game.oakItems;
        if (!oak) return;
        const bestItems = [
          GameConstants.OakItemType.Magic_Ball,
          GameConstants.OakItemType.Exp_Share,
          GameConstants.OakItemType.Blaze_Cassette
        ];
        bestItems.forEach(itemType => {
          const item = oak.itemList[itemType];
          if (item && item.isUnlocked() && !item.isActive) {
            oak.equip(itemType);
          }
        });
      } catch (e) {}
    },

    tickFlutesAndGems() {
      try {
        if (this.settings.autoFlutes && typeof FluteEffectRunner !== 'undefined' && FluteEffectRunner.canAccess()) {
          GameHelper.enumStrings(GameConstants.FluteItemType).forEach(flute => {
            if (ItemList[flute] && ItemList[flute].isUnlocked() && !FluteEffectRunner.isActive(GameConstants.FluteItemType[flute])()) {
              ItemList[flute].use(1);
            }
          });
        }

        if (this.settings.autoGems && App.game.gems) {
          for (let t = 0; t < 18; t++) {
            for (let eff = 0; eff < 3; eff++) {
              if (App.game.gems.canUpgrade(t, eff)) {
                App.game.gems.upgradeDamage(t, eff);
              }
            }
          }
        }
      } catch (e) {}
    },

    tickTreasures() {
      if (!this.settings.autoTradeTreasures) return;
      try {
        const ug = this.adapter.getUnderground();
        if (!ug || !ug.canAccess()) return;
        if (player.mineInventory && typeof UndergroundItems !== 'undefined') {
          player.mineInventory.forEach(item => {
            const uItem = UndergroundItems.getById(item.id);
            if (uItem && uItem.valueType === UndergroundItemValueType.Diamond && item.amount() > 1) {
              if (typeof UndergroundController !== 'undefined' && UndergroundController.gainProfit) {
                UndergroundController.gainProfit(uItem, item.amount() - 1);
              }
            }
          });
        }
      } catch (e) {}
    },

    tickBattleFrontier() {
      if (!this.settings.autoFrontier) return;
      try {
        if (typeof BattleFrontierRunner !== 'undefined' && BattleFrontierRunner.canAccess && BattleFrontierRunner.canAccess()) {
          if (!BattleFrontierRunner.running() && App.game.gameState !== GameConstants.GameState.battleFrontier) {
            BattleFrontierRunner.start(false);
            this.log('Entered Battle Frontier Challenge!', 'info');
          }
        }
      } catch (e) {}
    },

    // ==========================================================
    // 10. UNIVERSAL QUEST ENGINE & CRITERIA SOLVER
    // ==========================================================
    tickQuests() {
      if (!this.settings.autoQuests) return;
      try {
        const qm = this.adapter.getQuests();
        if (!qm) return;

        if (qm.questList) {
          qm.questList().forEach((quest, i) => {
            if (quest.isCompleted() && !quest.claimed()) {
              qm.claimQuest(i);
              this.log(`Claimed Daily Quest: ${quest.description}!`, 'success');
            }
          });

          qm.questList().forEach((quest, i) => {
            if (qm.canStartNewQuest() && !quest.inProgress() && !quest.isCompleted()) {
              qm.beginQuest(i);
              this.log(`Started Daily Quest: ${quest.description}`, 'info');
            }
          });

          if (qm.allQuestsComplete() && qm.canAffordRefresh()) {
            qm.refreshQuests();
            this.log('Refreshed Daily Quests!', 'info');
          }
        }

        this.solveActiveQuests();
      } catch (e) {
        console.error('[PokeClickerBot] Error in tickQuests:', e);
      }
    },

    solveActiveQuests() {
      try {
        const qm = this.adapter.getQuests();
        if (!qm) return;

        if (qm.questLines) {
          const lines = qm.questLines();
          for (const line of lines) {
            if (line.name !== 'Tutorial Quests' && line.state() === QuestLineState.started) {
              const curQuest = line.curQuestObject();
              if (curQuest && !curQuest.isCompleted()) {
                this.executeQuestAction(curQuest, `Story: ${line.name}`);
                return;
              }
            }
          }
        }

        if (qm.currentQuests) {
          const active = qm.currentQuests();
          for (const quest of active) {
            if (!quest.isCompleted()) {
              this.executeQuestAction(quest, 'Daily Quest');
              return;
            }
          }
        }
      } catch (e) {}
    },

    executeQuestAction(quest, context = 'Quest') {
      if (!quest || quest.isCompleted()) return;

      const desc = quest.description || quest.customDescription || 'Quest Objective';
      const game = this.adapter.getGame();
      const allowMove = this.settings.autoMapNavigation;

      // 1. Talk to NPC Quest
      if (typeof TalkToNPCQuest !== 'undefined' && quest instanceof TalkToNPCQuest) {
        if (quest.npc && typeof quest.npc.setTalkedTo === 'function') {
          quest.npc.setTalkedTo();
          this.log(`[${context}] Talked to NPC for: ${desc}`, 'success');
        }
        return;
      }

      // 2. Buy Poké Balls Quest
      if (typeof BuyPokeballsQuest !== 'undefined' && quest instanceof BuyPokeballsQuest) {
        if (typeof ItemList !== 'undefined' && ItemList['Pokeball']) {
          const needed = Math.max(1, (quest.amount || 10) - (quest.initial ? quest.initial() : 0));
          ItemList['Pokeball'].buy(needed);
          this.log(`[${context}] Bought ${needed} Poké Balls for quest!`, 'success');
        }
        return;
      }

      // 3. Defeat Gym Quest
      if (typeof DefeatGymQuest !== 'undefined' && quest instanceof DefeatGymQuest) {
        const gym = GymList[quest.gymTown];
        if (gym && gym.isUnlocked()) {
          this.stats.currentObjective = `[${context}] Gym: ${gym.leaderName || gym.town}`;
          if (game.gameState !== GameConstants.GameState.gym && !GymRunner.running()) {
            GymRunner.startGym(gym, false);
          }
        }
        return;
      }

      // 4. Defeat Dungeon Quest / Boss Quest
      if ((typeof DefeatDungeonQuest !== 'undefined' && quest instanceof DefeatDungeonQuest) ||
          (typeof DefeatDungeonBossQuest !== 'undefined' && quest instanceof DefeatDungeonBossQuest)) {
        const dName = quest.dungeon;
        const d = dungeonList[dName];
        if (d && d.isUnlocked()) {
          const tokens = game.wallet.currencies[GameConstants.Currency.dungeonToken]();
          if (tokens >= d.tokenCost) {
            this.stats.currentObjective = `[${context}] Dungeon: ${d.name}`;
            if (game.gameState !== GameConstants.GameState.dungeon) {
              DungeonRunner.initializeDungeon(d);
            }
          } else {
            this.stats.currentObjective = `[${context}] Gathering tokens for ${d.name} (${tokens}/${d.tokenCost})`;
          }
        }
        return;
      }

      // 5. Defeat Temporary Battle Quest (Raid / Boss)
      if (typeof DefeatTemporaryBattleQuest !== 'undefined' && quest instanceof DefeatTemporaryBattleQuest) {
        const tb = TemporaryBattleList[quest.temporaryBattle];
        if (tb && tb.isUnlocked()) {
          this.stats.currentObjective = `[${context}] Raid: ${tb.getDisplayName()}`;
          if (!TemporaryBattleRunner.running()) {
            TemporaryBattleRunner.startBattle(tb);
          }
        }
        return;
      }

      // 6. Defeat Pokémon on Route Quest (Only auto-moves if autoMapNavigation is true)
      if (typeof DefeatPokemonsQuest !== 'undefined' && quest instanceof DefeatPokemonsQuest) {
        if (quest.route && quest.region !== undefined) {
          this.stats.currentObjective = `[${context}] Route ${quest.route}`;
          if (allowMove && (player.route() !== quest.route || player.region() !== quest.region)) {
            MapHelper.moveToRoute(quest.route, quest.region);
          }
        }
        return;
      }

      // 7. Capture Specific Pokémon Quest (Only auto-moves if autoMapNavigation is true)
      if (typeof CaptureSpecificPokemonQuest !== 'undefined' && quest instanceof CaptureSpecificPokemonQuest) {
        if (quest.pokemon) {
          this.stats.currentObjective = `[${context}] Hunting ${quest.pokemon.name}`;
          if (allowMove) {
            const curRegion = player.region();
            const routes = Routes.getRoutesByRegion(curRegion);
            for (const r of routes) {
              if (r.isUnlocked()) {
                const avail = RouteHelper.getAvailablePokemonList(r.number, curRegion);
                if (avail.includes(quest.pokemon.name)) {
                  if (player.route() !== r.number) {
                    MapHelper.moveToRoute(r.number, curRegion);
                  }
                  return;
                }
              }
            }
          }
        }
        return;
      }

      // 8. Use Oak Item Quest
      if (typeof UseOakItemQuest !== 'undefined' && quest instanceof UseOakItemQuest) {
        if (quest.oakItem !== undefined && App.game.oakItems) {
          if (!App.game.oakItems.isActive(quest.oakItem)) {
            App.game.oakItems.equip(quest.oakItem);
          }
        }
        return;
      }

      // 9. Harvest Berries Quest
      if (typeof HarvestBerriesQuest !== 'undefined' && quest instanceof HarvestBerriesQuest) {
        if (quest.berryType !== undefined && this.settings.autoFarming) {
          this.settings.farmingBerry = quest.berryType;
        }
        return;
      }
    },

    // ==========================================================
    // 11. IN-GAME ITEMS & CURRENCY SPAWNER / STORE (FREE STORE)
    // ==========================================================
    injectCurrency(currencyType, amount) {
      try {
        const amt = parseInt(amount, 10) || 0;
        if (amt <= 0) return;
        const curName = GameConstants.Currency[currencyType] || 'Currency';
        const game = this.adapter.getGame();
        if (game && game.wallet && game.wallet.currencies[currencyType]) {
          game.wallet.currencies[currencyType](game.wallet.currencies[currencyType]() + amt);
          this.log(`💰 Injected +${amt.toLocaleString()} ${curName}!`, 'gold');
        }
      } catch (e) {
        console.error('[PokeClickerBot] Error injecting currency:', e);
      }
    },

    spawnItem(itemName, amount) {
      try {
        const qty = parseInt(amount, 10) || 1;
        if (qty <= 0) return;
        if (typeof player !== 'undefined' && player.gainItem) {
          player.gainItem(itemName, qty);
          this.log(`📦 Spawned ${qty.toLocaleString()} × ${itemName.replace(/_/g, ' ')}!`, 'success');
        } else if (typeof ItemList !== 'undefined' && ItemList[itemName] && ItemList[itemName].gain) {
          ItemList[itemName].gain(qty);
          this.log(`📦 Spawned ${qty.toLocaleString()} × ${itemName.replace(/_/g, ' ')}!`, 'success');
        }
      } catch (e) {
        console.error('[PokeClickerBot] Error spawning item:', e);
      }
    },

    spawnPokeballs(ballType, amount) {
      try {
        const qty = parseInt(amount, 10) || 100;
        const game = this.adapter.getGame();
        if (game && game.pokeballs && game.pokeballs.gainPokeballs) {
          game.pokeballs.gainPokeballs(ballType, qty);
          const ballName = GameConstants.Pokeball[ballType] || 'Pokéball';
          this.log(`⚪ Spawned ${qty.toLocaleString()} × ${ballName}!`, 'success');
        }
      } catch (e) {}
    },

    spawnPack(packName) {
      try {
        const game = this.adapter.getGame();
        if (packName === 'allBalls') {
          GameHelper.enumStrings(GameConstants.Pokeball).forEach(bName => {
            const bType = GameConstants.Pokeball[bName];
            if (bType !== undefined && bType !== GameConstants.Pokeball.None) {
              game.pokeballs.gainPokeballs(bType, 1000);
            }
          });
          this.log('🎁 Injected +1,000 of EVERY Poké Ball (including Master Balls)!', 'gold');
        } else if (packName === 'allStones') {
          const stones = [
            'Fire_stone', 'Water_stone', 'Thunder_stone', 'Leaf_stone', 'Moon_stone', 'Sun_stone',
            'Shiny_stone', 'Dusk_stone', 'Dawn_stone', 'Ice_stone', 'Soothe_bell', 'Metal_coat',
            'Dragon_scale', 'Upgrade', 'Dubious_disc', 'Electirizer', 'Magmarizer', 'Protector',
            'Reaper_cloth', 'Razor_claw', 'Razor_fang', 'Prism_scale', 'Whipped_dream', 'Sachet',
            'Black_DNA', 'White_DNA'
          ];
          stones.forEach(s => {
            if (typeof ItemList !== 'undefined' && ItemList[s]) {
              player.gainItem(s, 25);
            }
          });
          this.log('🎁 Injected +25 of ALL Evolution Stones & Items!', 'gold');
        } else if (packName === 'allVitamins') {
          const vitamins = ['Protein', 'Calcium', 'Carbos', 'Iron', 'Zinc', 'HP_Up', 'Rare_Candy'];
          vitamins.forEach(v => {
            if (typeof ItemList !== 'undefined' && ItemList[v]) {
              player.gainItem(v, 100);
            }
          });
          this.log('🎁 Injected +100 of ALL Vitamins & Rare Candies!', 'gold');
        } else if (packName === 'allBattleItems') {
          const battleItems = ['xAttack', 'xClick', 'Lucky_egg', 'Lucky_incense', 'Item_magnet', 'Dowsing_machine'];
          battleItems.forEach(b => {
            if (typeof ItemList !== 'undefined' && ItemList[b]) {
              player.gainItem(b, 100);
            }
          });
          this.log('🎁 Injected +100 of ALL Battle Items & Multipliers!', 'gold');
        } else if (packName === 'allFossils') {
          const fossils = [
            'Helix_fossil', 'Dome_fossil', 'Old_amber', 'Root_fossil', 'Claw_fossil',
            'Armor_fossil', 'Skull_fossil', 'Cover_fossil', 'Plume_fossil', 'Jaw_fossil',
            'Sail_fossil', 'Fossilized_bird', 'Fossilized_fish', 'Fossilized_drake', 'Fossilized_dino'
          ];
          fossils.forEach(f => {
            if (typeof ItemList !== 'undefined' && ItemList[f]) {
              player.gainItem(f, 10);
            }
          });
          this.log('🎁 Injected +10 of ALL Prehistoric Fossils!', 'gold');
        } else if (packName === 'restores') {
          if (typeof ItemList !== 'undefined' && ItemList['SmallRestore']) {
            player.gainItem('SmallRestore', 100);
            this.log('🎁 Injected +100 Small Restores (Mining Stamina)!', 'gold');
          }
        } else if (packName === 'allKeys') {
          if (typeof App !== 'undefined' && App.game && App.game.keyItems) {
            GameHelper.enumStrings(KeyItemType).forEach(keyName => {
              const kType = KeyItemType[keyName];
              if (kType !== undefined && !App.game.keyItems.hasKeyItem(kType)) {
                App.game.keyItems.gainKeyItem(kType);
              }
            });
            this.log('🗝️ Injected & Unlocked ALL Key Items (Wailmer Pail, Super Rod, Explorer Kit, Bicycle, etc.)!', 'gold');
          }
        }
      } catch (e) {
        console.error('[PokeClickerBot] Error in spawnPack:', e);
      }
    },

    // Cheats
    instantHatchAll() {
      try {
        App.game.breeding.eggList.forEach((e, idx) => {
          if (e().pokemon) {
            const maxSteps = typeof e().totalSteps === 'function' ? e().totalSteps() : e().totalSteps;
            e().steps(maxSteps || 1000);
            App.game.breeding.hatchPokemonEgg(idx);
          }
        });
        this.log('Instantly Hatched all Day Care eggs!', 'success');
      } catch (e) {}
    },

    boostResources() {
      try {
        App.game.wallet.gainMoney(10000000, true);
        App.game.wallet.gainDungeonTokens(100000, true);
        App.game.wallet.gainQuestPoints(10000, true);
        this.log('Granted +10,000,000 Money, +100,000 DT, and +10,000 QP!', 'gold');
      } catch (e) {}
    }
  };

  window.PokeClickerBotCore = BotCore;
})();
