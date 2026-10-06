/**
 * PokéClicker Headless / Remote CDP Bot Controller
 * Connects to PokéClicker via Chrome DevTools Protocol (CDP) on port 9222
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 9222;
const BUNDLE_PATH = path.join(__dirname, 'pokeclicker-bot.js');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log(`[Remote Bot] Connecting to PokéClicker on port ${PORT}...`);

  let targets;
  try {
    targets = await fetchJson(`http://127.0.0.1:${PORT}/json/list`);
  } catch (e) {
    console.error(`[Error] Could not connect to http://127.0.0.1:${PORT}/json/list.`);
    console.log('Ensure PokéClicker was started with launch_with_debug.bat or --remote-debugging-port=9222');
    process.exit(1);
  }

  const gameTarget = targets.find(t => t.url && (t.url.includes('pokeclicker') || t.url.includes('index.html')));

  if (!gameTarget) {
    console.error('[Error] No active PokéClicker page found in target list:');
    console.dir(targets);
    process.exit(1);
  }

  console.log(`[Remote Bot] Found target: ${gameTarget.title} (${gameTarget.url})`);
  console.log(`[Remote Bot] WebSocket debugger URL: ${gameTarget.webSocketDebuggerUrl}`);

  // In Node.js, we can use built-in or WebSocket to send CDP commands
  const WebSocket = global.WebSocket || require('ws');
  const ws = new WebSocket(gameTarget.webSocketDebuggerUrl);

  let idCounter = 1;
  const pendingRequests = new Map();

  function sendCDP(method, params = {}) {
    return new Promise((resolve) => {
      const id = idCounter++;
      pendingRequests.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.on('open', async () => {
    console.log('[Remote Bot] Connected to CDP session!');

    // Read bot bundle
    const bundleCode = fs.readFileSync(BUNDLE_PATH, 'utf8');

    console.log('[Remote Bot] Injecting PokeClicker Bot Bundle into game process...');
    const result = await sendCDP('Runtime.evaluate', {
      expression: bundleCode,
      userGesture: true,
      awaitPromise: true,
      returnByValue: true
    });

    console.log('[Remote Bot] Injection result:', result);

    // Stream status every 3 seconds
    setInterval(async () => {
      const statusRes = await sendCDP('Runtime.evaluate', {
        expression: `(() => {
          if (!window.PokeClickerBotCore) return { running: false };
          const c = window.PokeClickerBotCore;
          return {
            running: c.running,
            cps: c.stats.cps,
            kills: c.stats.kills,
            eggs: c.stats.eggsHatched,
            dungeons: c.stats.dungeonsCleared,
            gyms: c.stats.gymsCleared,
            shinies: c.stats.shiniesEncountered
          };
        })()`,
        returnByValue: true
      });

      if (statusRes && statusRes.result && statusRes.result.value) {
        const v = statusRes.result.value;
        process.stdout.write(`\r[Remote Bot] Status: ${v.running ? 'RUNNING' : 'PAUSED'} | CPS: ${v.cps} | Kills: ${v.kills} | Eggs: ${v.eggs} | Dungeons: ${v.dungeons} | Shinies: ${v.shinies}   `);
      }
    }, 2000);
  });

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.id && pendingRequests.has(msg.id)) {
        pendingRequests.get(msg.id)(msg.result);
        pendingRequests.delete(msg.id);
      }
    } catch (e) {}
  });

  ws.on('error', (err) => {
    console.error('[Remote Bot] WebSocket error:', err.message);
  });
}

main().catch(console.error);
