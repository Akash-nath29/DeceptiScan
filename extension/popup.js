document.getElementById("detect").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});


chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const currentUrl = tabs[0].url;
  const domain = new URL(currentUrl).hostname;
  document.querySelector('.site-info').textContent = domain;

  chrome.storage.local.get(['enabledSites'], function (result) {
    const enabledSites = result.enabledSites || {};
    const toggle = document.querySelector('input[type="checkbox"]');
    toggle.checked = enabledSites[domain] !== false;
  });
});

document.querySelector('input[type="checkbox"]').addEventListener('change', function (e) {
  const isEnabled = e.target.checked;

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const domain = new URL(tabs[0].url).hostname;

    chrome.storage.local.get(['enabledSites'], function (result) {
      const enabledSites = result.enabledSites || {};
      enabledSites[domain] = isEnabled;
      chrome.storage.local.set({ enabledSites });
    });
  });
});