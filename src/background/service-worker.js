// Minimal service worker. The popup talks to the content script directly via
// chrome.tabs.sendMessage, and to Gemini via fetch, so there's little to do
// here. We keep it to (a) satisfy the manifest and (b) open the options page
// the first time the extension is installed.

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    const { apiKey } = await chrome.storage.local.get('apiKey')
    if (!apiKey) chrome.runtime.openOptionsPage()
  }
})
