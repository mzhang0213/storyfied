// Minimal service worker. The popup injects the scraper via chrome.scripting
// and talks to Gemini via fetch, so there's little to do here. On first install
// we open the welcome / onboarding page (which ends with the API-key setup).

const WELCOME_URL = 'src/options/options.html'

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: chrome.runtime.getURL(WELCOME_URL) })
  }
})
