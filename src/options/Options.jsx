import { useEffect, useRef, useState } from 'react'
import { getSettings, saveSettings, DEFAULTS } from '../lib/storage.js'

// A short, current list of Gemini models. The field is also free-text so the
// user can type any model id the API supports.
const MODEL_OPTIONS = ['gemini-flash-latest']

const iconUrl = chrome.runtime.getURL('icons/icon-128.png')

export default function Options() {
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState(DEFAULTS.model)
  const [promptOverride, setPromptOverride] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const setupRef = useRef(null)

  function smoothScrollToSetup() {
    setTimeout(() => setupRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
  }

  useEffect(() => {
    getSettings().then((s) => {
      setApiKey(s.apiKey)
      setModel(s.model)
      setPromptOverride(s.promptOverride)
    })
  }, [])

  // If opened via the popup's gear / "Add API key" (…#setup), jump to the form.
  useEffect(() => {
    if (window.location.hash === '#setup') {
      smoothScrollToSetup();
    }
  }, [])

  const onSave = async (e) => {
    e.preventDefault()
    await saveSettings({ apiKey: apiKey.trim(), model: model.trim(), promptOverride })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="page">
      {/* ---- greeting ---- */}
      <section className="hero">
        <img className="logo" src={iconUrl} width="104" height="104" alt="Storyfied" />
        <h1>Welcome to Storyfied</h1>
        <p className="sub">
          Turn any messy ticket into a clean, AI-ready brief - in one click.
          Here's how it works, then add your key and you're set.
        </p>
        <a className="jump" href="#setup" onClick={smoothScrollToSetup}>
          Skip to setup ↓
        </a>
      </section>

      {/* ---- how to use ---- */}
      <section className="steps">
        {/*<h2 className="steps-title">The How To</h2>*/}

        {/* STEP 1 */}
        <div className="step">
          <div className="num n1">1</div>
          <h3>Open a ticket</h3>
          <p className="step-desc">
            On any board - GitHub Projects, Azure DevOps, Jira - open the ticket you
            want to work on, then click the Storyfied icon in your toolbar.
          </p>
          <div className="shot">
            <div className="shot-bar">
              <span className="d r"></span><span className="d y"></span><span className="d g"></span>
              <span className="url">github.com/acme/app · #17</span>
              <span className="pin" title="Storyfied">📖</span>
            </div>
            <div className="shot-body board">
              <div className="ticket">
                <div className="t-title">Tax &amp; tip calculation</div>
                <div className="t-line"></div>
                <div className="t-line short"></div>
              </div>
              <div className="t-side">
                <span className="tag pink">validate</span>
                <span className="tag yellow">activity</span>
                <span className="tag red">P0</span>
              </div>
              {/*<div className="cursor">↖ click</div>*/}
            </div>
          </div>
        </div>

        <div className="connector"></div>

        {/* STEP 2 */}
        <div className="step">
          <div className="num n2">2</div>
          <h3>Review the boxes &amp; summary</h3>
          <p className="step-desc">
            Storyfied reads the ticket and the AI fills in each field. Every row is
            editable - fix anything before you copy.
          </p>
          <div className="shot">
            <div className="shot-bar">
              <span className="d r"></span><span className="d y"></span><span className="d g"></span>
              <span className="url">Storyfied</span>
            </div>
            <div className="shot-body popup">
              <div className="row"><span className="lbl" style={{ borderColor: '#7c3aed', color: '#7c3aed' }}>Title</span><span className="val">Tax &amp; tip calculation per diner</span></div>
              <div className="row"><span className="lbl" style={{ borderColor: '#dc2626', color: '#dc2626' }}>Priority</span><span className="val">P0</span></div>
              <div className="row"><span className="lbl" style={{ borderColor: '#d97706', color: '#d97706' }}>Labels</span><span className="val">validate, activity</span></div>
              <div className="row"><span className="lbl" style={{ borderColor: '#334155', color: '#334155' }}>Description</span><span className="val">As a diner, each person pays only the tax &amp; tip proportional to their own food spend…</span></div>
            </div>
          </div>
        </div>

        <div className="connector"></div>

        {/* STEP 3 */}
        <div className="step">
          <div className="num n3">3</div>
          <h3>Copy &amp; hand it to your agent</h3>
          <p className="step-desc">
            Hit <strong>Copy to clipboard</strong> to get a tidy markdown brief, then
            paste it straight into your AI coding agent.
          </p>
          <div className="shot">
            <div className="shot-bar">
              <span className="d r"></span><span className="d y"></span><span className="d g"></span>
              <span className="url">AI chat</span>
            </div>
            <div className="shot-body chat">
              <pre className="paste"># Tax &amp; tip calculation per diner
**Priority:** P0 · **Labels:** ~validate, activity

## Requirements
Each diner pays only the tax &amp; tip
proportional to their own food spend.

## Acceptance Criteria
- [ ] Split tax/tip by each diner's subtotal</pre>
              <div className="send">Send ➤</div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- setup / API key ---- */}
      <section className="setup" id="setup" ref={setupRef}>
        <div className="setup-card">
          <div className="setup-bar">
            <span>Set up your API key</span>
            <div className="dots"><span className="d r"></span><span className="d y"></span><span className="d g"></span></div>
          </div>
          <div className="setup-pad">
            <div className="alert">
              <span className="warn">⚠️</span>
              <span>
                <b>Required:</b> a Google Gemini API key - it's free to grab from{' '}
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">Google AI Studio</a>.
                It's stored locally in your browser and never sent anywhere except Google.
              </span>
            </div>

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
                  rows={3}
                  value={promptOverride}
                  onChange={(e) => setPromptOverride(e.target.value)}
                  placeholder="e.g. Always write acceptance criteria in Gherkin. Keep descriptions under 150 words."
                />
              </label>

              <button type="submit" className="primary">
                {saved ? '✓ Saved - you’re all set!' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
