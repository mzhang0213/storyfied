import { useEffect, useState } from 'react'
import { getSettings, saveSettings, DEFAULTS } from '../lib/storage.js'

// A short, current list of Gemini models. The field is also free-text so the
// user can type any model id the API supports.
const MODEL_OPTIONS = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
]

export default function Options() {
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState(DEFAULTS.model)
  const [promptOverride, setPromptOverride] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getSettings().then((s) => {
      setApiKey(s.apiKey)
      setModel(s.model)
      setPromptOverride(s.promptOverride)
    })
  }, [])

  const onSave = async (e) => {
    e.preventDefault()
    await saveSettings({ apiKey: apiKey.trim(), model: model.trim(), promptOverride })
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="options">
      <h1>Storyfied settings</h1>
      <p className="sub">
        Storyfied uses Google Gemini with your own API key. Get one from{' '}
        <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">
          Google AI Studio
        </a>
        . Your key is stored locally in this browser only.
      </p>

      <form onSubmit={onSave}>
        <label>
          Gemini API key
          <div className="key-row">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIza…"
              autoComplete="off"
              spellCheck={false}
            />
            <button type="button" className="ghost" onClick={() => setShowKey((s) => !s)}>
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        <label>
          Model
          <input
            list="model-options"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="gemini-2.5-flash"
            spellCheck={false}
          />
          <datalist id="model-options">
            {MODEL_OPTIONS.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </label>

        <label>
          Extra instructions (optional)
          <textarea
            rows={4}
            value={promptOverride}
            onChange={(e) => setPromptOverride(e.target.value)}
            placeholder="e.g. Always write acceptance criteria in Gherkin. Keep descriptions under 150 words."
          />
        </label>

        <button type="submit" className="primary">
          {saved ? '✓ Saved' : 'Save'}
        </button>
      </form>
    </div>
  )
}
