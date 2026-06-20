// Canonical field set for a "storyfied" ticket.
//
// `key`      — id used in state + the Gemini JSON schema
// `label`    — display label for the row
// `color`    — accent color for the label + input border (the "color matched" rows)
// `type`     — 'text' (single-line <input>) or 'multiline' (<textarea>)
// `schema`   — JSON-schema fragment for Gemini structured output

export const FIELDS = [
  {
    key: 'title',
    label: 'Title',
    color: '#7c3aed',
    type: 'text',
    schema: { type: 'string', description: 'Concise ticket title.' },
  },
  {
    key: 'type',
    label: 'Type',
    color: '#2563eb',
    type: 'text',
    schema: {
      type: 'string',
      description: 'One of: bug, feature, task, chore, spike. Empty if unclear.',
    },
  },
  {
    key: 'priority',
    label: 'Priority',
    color: '#dc2626',
    type: 'text',
    schema: {
      type: 'string',
      description: 'Priority if stated (e.g. P1/High/Critical). Empty if absent.',
    },
  },
  {
    key: 'labels',
    label: 'Labels',
    color: '#d97706',
    type: 'text',
    schema: {
      type: 'string',
      description: 'Comma-separated labels/tags found on the ticket. Empty if none.',
    },
  },
  {
    key: 'size',
    label: 'Size / Points',
    color: '#059669',
    type: 'text',
    schema: {
      type: 'string',
      description: 'Story points or t-shirt size if present. Empty if absent.',
    },
  },
  {
    key: 'status',
    label: 'Status',
    color: '#0891b2',
    type: 'text',
    schema: {
      type: 'string',
      description: 'Workflow status/column (e.g. To Do, In Progress). Empty if absent.',
    },
  },
  {
    key: 'assignee',
    label: 'Assignee',
    color: '#4f46e5',
    type: 'text',
    schema: {
      type: 'string',
      description: 'Assignee name/handle if present. Empty if absent.',
    },
  },
  {
    key: 'description',
    label: 'Description / Requirements',
    color: '#334155',
    type: 'multiline',
    schema: {
      type: 'string',
      description:
        'Buffed, formalized description and requirements. Expand sparse input into a clear user story + bullet requirements; tighten verbose input. Do not invent facts not implied by the ticket.',
    },
  },
  {
    key: 'acceptanceCriteria',
    label: 'Acceptance Criteria',
    color: '#475569',
    type: 'multiline',
    schema: {
      type: 'string',
      description:
        'Acceptance criteria as a checklist. Derive reasonable criteria from the requirements if none are stated; keep them verifiable.',
    },
  },
]

// JSON schema object passed to Gemini's responseSchema.
export function responseSchema() {
  const properties = {}
  for (const f of FIELDS) properties[f.key] = f.schema
  return {
    type: 'object',
    properties,
    required: FIELDS.map((f) => f.key),
  }
}

// An empty field object keyed by field key.
export function emptyFields() {
  return Object.fromEntries(FIELDS.map((f) => [f.key, '']))
}
