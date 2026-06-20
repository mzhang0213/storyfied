// Self-contained page scraper.
//
// This function is INJECTED into the active tab via chrome.scripting.executeScript
// ({ func: scrapeTicketPage }). Because executeScript serializes the function with
// .toString() and runs it in the page, it MUST be fully self-contained — it can
// only reference identifiers declared inside its own body, never module-scope
// imports/constants. Keep everything local.
//
// Using programmatic injection (instead of a declared content_script) means it
// works even on tabs that were already open before the extension was installed,
// which removes the "reload the tab" failure mode.
export function scrapeTicketPage() {
  const MAX_CHARS = 16000

  const clean = (s) => (s || '').replace(/ /g, ' ').replace(/\n{3,}/g, '\n\n').trim()
  const textOf = (el) => (el ? clean(el.innerText) : '')

  // Pick the primary ticket region. Ticket metadata (labels, priority, size,
  // status, ...) usually lives in a sidebar column that is a SIBLING of the
  // body, so we must choose a container broad enough to include it — not the
  // narrow issue-body element. Order matters: a side drawer/modal wins (project
  // board item view), then the page's <main> (full-page issue view), then body.
  let region = ''

  // 1. Open drawer / modal / side panel (e.g. clicking an item on a project board).
  const overlays = document.querySelectorAll(
    '[role="dialog"], [role="complementary"], [aria-modal="true"]'
  )
  for (const el of overlays) {
    const t = textOf(el)
    if (t.length > region.length) region = t
  }
  if (region.length < 200) region = '' // too small to be the ticket — fall through

  // 2. Full-page issue/work-item view: <main> spans both the body and sidebar.
  if (!region) {
    region =
      textOf(document.querySelector('main')) ||
      textOf(document.querySelector('[role="main"]')) ||
      // Board-specific full-page containers as a hint.
      textOf(document.querySelector('.work-item-form, .witform-layout, .work-item-view'))
  }

  // 3. Last resort: whole page.
  if (!region || region.length < 60) region = textOf(document.body)

  // Safety net: some layouts keep the metadata sidebar OUTSIDE <main>. Append
  // any aside/complementary panels whose text isn't already captured.
  const parts = [region]
  const sidebars = document.querySelectorAll('aside, [role="complementary"]')
  for (const el of sidebars) {
    const t = textOf(el)
    if (t.length >= 30 && !region.includes(t.slice(0, 60))) parts.push(t)
  }

  let text = clean(parts.join('\n\n'))
  if (text.length > MAX_CHARS) text = text.slice(0, MAX_CHARS)

  return {
    rawText: text,
    url: location.href,
    pageTitle: document.title,
  }
}
