/**
 * DetailRow — field-list row used heavily in right-rail detail
 * cards across src/details.jsx. Renders an uppercase tracked
 * label and a value node, separated by a thin --ink-100 divider.
 *
 * Two layouts:
 *   inline=true  (default) — label + value on one line, value
 *                            right-aligned. Used in detail rails.
 *   inline=false           — label above, value below. Useful for
 *                            longer values or full-width forms.
 *
 * Props:
 *   label      — uppercase label text                 (required)
 *   value      — value node                           (required)
 *   mono       — render value with .mono              (default false)
 *   inline     — see above                            (default true)
 *   divider    — render bottom border                 (default true)
 *   className  — passthrough
 *   style      — passthrough
 */
export default function DetailRow({
    label,
    value,
    mono = false,
    inline = true,
    divider = true,
    className = '',
    style,
}) {
    const labelEl = (
        <span
            className="detail-row-label"
            style={{
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: 0.06 * 16,
                color: 'var(--ink-600)',
                fontWeight: 600,
                whiteSpace: 'nowrap',
            }}
        >
            {label}
        </span>
    )

    const valueEl = (
        <span
            className={['detail-row-value', mono ? 'mono' : '']
                .filter(Boolean)
                .join(' ')}
            style={{
                color: 'var(--ink-900)',
                fontWeight: 600,
                fontSize: inline ? 12.5 : 13,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                flexWrap: 'wrap',
                justifyContent: inline ? 'flex-end' : 'flex-start',
                textAlign: inline ? 'right' : 'left',
            }}
        >
            {value}
        </span>
    )

    return (
        <div
            className={['detail-row', className].filter(Boolean).join(' ')}
            style={{
                display: 'flex',
                flexDirection: inline ? 'row' : 'column',
                alignItems: inline ? 'center' : 'flex-start',
                justifyContent: inline ? 'space-between' : 'flex-start',
                gap: inline ? 12 : 4,
                padding: '10px 0',
                borderBottom: divider ? '1px solid var(--ink-100)' : 'none',
                fontSize: 12.5,
                ...style,
            }}
        >
            {labelEl}
            {valueEl}
        </div>
    )
}
