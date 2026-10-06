document.addEventListener('DOMContentLoaded', () => {
  const badge = document.getElementById('bot-status-badge');
  const statusText = document.getElementById('bot-status-text');

  // Query active tab to check if PokeClicker is open
  if (chrome && chrome.tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.url && activeTab.url.includes('pokeclicker')) {
        badge.className = 'popup-status-badge active';
        statusText.textContent = 'CONNECTED TO POKÉCLICKER';
      } else {
        badge.className = 'popup-status-badge';
        statusText.textContent = 'STANDBY (OPEN GAME)';
      }
    });
  }
});
