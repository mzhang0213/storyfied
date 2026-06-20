// One editable field row: a color-matched label (<p>) and an editable input.
// `field` is an entry from FIELDS; `value`/`onChange` wire it to popup state.

export default function FieldRow({ field, value, onChange }) {
  const { label, color, type } = field
  return (
    <div className="field-row">
      <p className="field-label" style={{ color, borderColor: color }}>
        {label}
      </p>
      {type === 'multiline' ? (
        <textarea
          className="field-input"
          style={{ borderColor: color }}
          value={value}
          rows={6}
          placeholder="—"
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      ) : (
        <input
          className="field-input"
          style={{ borderColor: color }}
          value={value}
          placeholder="—"
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      )}
    </div>
  )
}
