// Formats the (possibly user-edited) fields into a clean markdown brief and
// writes it to the clipboard.

import { FIELDS } from './fields.js'

const has = (v) => typeof v === 'string' && v.trim().length > 0

export function formatForAI(fields, { url } = {}) {
  const lines = []

  const title = has(fields.title) ? fields.title.trim() : 'Untitled ticket'
  lines.push(`# ${title}`)

  // Inline metadata row(s): only include fields that have a value.
  const meta = [
    ['Type', fields.type],
    ['Priority', fields.priority],
    ['Size', fields.size],
    ['Status', fields.status],
    ['Labels', fields.labels],
    ['Assignee', fields.assignee],
  ].filter(([, v]) => has(v))
  if (meta.length) {
    lines.push('')
    lines.push(meta.map(([k, v]) => `**${k}:** ${v.trim()}`).join(' · '))
  }

  if (has(fields.description)) {
    lines.push('')
    lines.push('## Description / Requirements')
    lines.push(fields.description.trim())
  }

  if (has(fields.acceptanceCriteria)) {
    lines.push('')
    lines.push('## Acceptance Criteria')
    lines.push(fields.acceptanceCriteria.trim())
  }

  if (has(url)) {
    lines.push('')
    lines.push(`_Source: ${url.trim()}_`)
  }

  return lines.join('\n')
}

// Defensive: ensure every known field is at least referenced so format stays
// in sync with the schema even as FIELDS grows.
export function knownFieldKeys() {
  return FIELDS.map((f) => f.key)
}

export async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text)
}
