import { useEffect, useState, useCallback } from 'react'
import { FIELDS, emptyFields } from '../lib/fields.js'
import { getSettings } from '../lib/storage.js'
import { processTicket } from '../lib/gemini.js'
import { formatForAI, copyToClipboard } from '../lib/clipboard.js'
import { scrapeTicketPage } from '../content/scrape.js'
import FieldRow from './FieldRow.jsx'

// UI phases
const PHASE = {
  LOADING: 'loading', // reading settings + scraping + calling Gemini
  NO_KEY: 'no_key',
  ERROR: 'error',
  READY: 'ready',
}

async function scrapeActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab?.id) throw new Error('No active tab found.')

  // Restricted pages can't be injected — give a clear message instead of a
  // cryptic chrome error.
  const url = tab.url || ''
  if (/^(chrome|edge|brave|about|chrome-extension|devtools|view-source):/i.test(url) ||
      url.startsWith('https://chrome.google.com/webstore') ||
      url.startsWith('https://chromewebstore.google.com')) {
    throw new Error('This page is restricted by the browser and cannot be read. Open a ticket on your board and try again.')
  }

  let injection
  try {
    // Programmatic injection: works regardless of when the tab was loaded, so
    // there's no "reload the tab" requirement. activeTab grants access on click.
    ;[injection] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scrapeTicketPage,
    })
  } catch (e) {
    throw new Error(`Could not read this page: ${e?.message || e}`)
  }

  const data = injection?.result
  if (!data || !data.rawText) {
    throw new Error('No ticket text could be read from this page.')
  }
  return data // { rawText, url, pageTitle }
}

export default function Popup() {
  const [phase, setPhase] = useState(PHASE.LOADING)
  const [error, setError] = useState('')
  const [fields, setFields] = useState(emptyFields())
  const [sourceUrl, setSourceUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const run = useCallback(async () => {
    setPhase(PHASE.LOADING)
    setError('')
    setCopied(false)
    try {
      const settings = await getSettings()
      if (!settings.apiKey) {
        setPhase(PHASE.NO_KEY)
        return
      }
      const scraped = await scrapeActiveTab()
      setSourceUrl(scraped.url || '')
      const result = await processTicket({
        apiKey: settings.apiKey,
        model: settings.model,
        promptOverride: settings.promptOverride,
        rawText: scraped.rawText,
        url: scraped.url,
        pageTitle: scraped.pageTitle,
      })
      setFields(result)
      setPhase(PHASE.READY)
    } catch (e) {
      setError(String(e?.message || e))
      setPhase(PHASE.ERROR)
    }
  }, [])

  useEffect(() => {
    run()
  }, [run])

  const onFieldChange = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }))
    setCopied(false)
  }

  const onCopy = async () => {
    try {
      await copyToClipboard(formatForAI(fields, { url: sourceUrl }))
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch (e) {
      setError(`Copy failed: ${e?.message || e}`)
    }
  }

  const openOptions = () => chrome.runtime.openOptionsPage()

  return (
    <div className="popup">
      <header className="popup-header">
        <span className="brand">Storyfied</span>
        <button className="link-btn" onClick={openOptions} title="Settings">
          ⚙
        </button>
      </header>

      {phase === PHASE.LOADING && (
        <div className="state">
          <div className="spinner" />
          <p>Reading the ticket and storyfying…</p>
        </div>
      )}

      {phase === PHASE.NO_KEY && (
        <div className="state">
          <p>No Gemini API key set yet.</p>
          <button className="primary" onClick={openOptions}>
            Add your API key
          </button>
        </div>
      )}

      {phase === PHASE.ERROR && (
        <div className="state">
          <p className="error">{error}</p>
          <button className="primary" onClick={run}>
            Try again
          </button>
        </div>
      )}

      {phase === PHASE.READY && (
        <>
          <div className="fields">
            {FIELDS.map((f) => (
              <FieldRow
                key={f.key}
                field={f}
                value={fields[f.key] || ''}
                onChange={onFieldChange}
              />
            ))}
          </div>
          <footer className="popup-footer">
            <button className="ghost" onClick={run} title="Re-run on this ticket">
              ↻ Re-storyfy
            </button>
            <button className="primary" onClick={onCopy}>
              {copied ? '✓ Copied!' : 'Copy to clipboard'}
            </button>
          </footer>
        </>
      )}
    </div>
  )
}
