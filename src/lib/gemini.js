// Gemini API client. Calls the Generative Language API generateContent endpoint
// with structured-JSON output so we get back the field object directly.

import { responseSchema, emptyFields } from './fields.js'
import { SYSTEM_INSTRUCTION, buildUserContent } from './extractPrompt.js'

const ENDPOINT = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent`

export async function processTicket({ apiKey, model, rawText, url, pageTitle, promptOverride }) {
  if (!apiKey) throw new Error('No Gemini API key set. Open the options page to add one.')
  if (!rawText || !rawText.trim()) throw new Error('No ticket text could be read from this page.')

  const systemText = promptOverride
    ? `${SYSTEM_INSTRUCTION}\n\nAdditional instructions:\n${promptOverride}`
    : SYSTEM_INSTRUCTION

  const body = {
    systemInstruction: { parts: [{ text: systemText }] },
    contents: [
      { role: 'user', parts: [{ text: buildUserContent({ rawText, url, pageTitle }) }] },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: responseSchema(),
      temperature: 0.3,
    },
  }

  let res
  try {
    res = await fetch(ENDPOINT(model), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(body),
    })
  } catch (e) {
    throw new Error(`Network error reaching Gemini: ${e.message}`)
  }

  if (!res.ok) {
    let detail = ''
    try {
      const err = await res.json()
      detail = err?.error?.message || ''
    } catch {
      /* ignore parse failure */
    }
    if (res.status === 400 && /api key/i.test(detail)) {
      throw new Error('Gemini rejected the API key. Check it in the options page.')
    }
    if (res.status === 403) throw new Error('Gemini access denied (403). Check the key and its permissions.')
    if (res.status === 429) throw new Error('Gemini rate limit / quota exceeded (429). Try again later.')
    throw new Error(`Gemini error ${res.status}${detail ? `: ${detail}` : ''}`)
  }

  const data = await res.json()

  const candidate = data?.candidates?.[0]
  if (candidate?.finishReason === 'SAFETY') {
    throw new Error('Gemini blocked the response for safety reasons.')
  }
  const text = candidate?.content?.parts?.map((p) => p.text).join('') ?? ''
  if (!text.trim()) throw new Error('Gemini returned an empty response.')

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Could not parse Gemini response as JSON.')
  }

  // Normalize to a complete field object (string values only).
  const result = emptyFields()
  for (const key of Object.keys(result)) {
    const v = parsed[key]
    result[key] = v == null ? '' : String(v)
  }
  return result
}
