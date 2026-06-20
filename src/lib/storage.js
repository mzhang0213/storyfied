// Thin wrappers over chrome.storage.local for settings.

const DEFAULTS = {
  apiKey: '',
  model: 'gemini-2.5-flash',
  promptOverride: '', // optional custom instruction appended to the system prompt
}

export async function getSettings() {
  const stored = await chrome.storage.local.get(Object.keys(DEFAULTS))
  return { ...DEFAULTS, ...stored }
}

export async function saveSettings(partial) {
  await chrome.storage.local.set(partial)
}

export { DEFAULTS }
