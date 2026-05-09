/**
 * HBar — horizontal mini progress bar.
 *
 * Mirrors the HBar primitive in src/primitives.jsx and the
 * progress / KRI usage in dashboard + audit list. Track is
 * --ink-200 by default; a label + valueLabel row can be rendered
 * above the bar in the same component for compact list rows.
 *
 * Props:
 *   value       — current numeric value           (required)
 *   max         — denominator                     (default 100)
 *   color       — fill color                      (default --green-600)
 *   height      — px                              (default 8)
 *   track       — track color                     (default --ink-200)
 *   label       — optional left header label       (string|node)
 *   valueLabel  — optional right value label      (string|node)
 *   mono        — render valueLabel in mono       (default true when present)
 *   className   — passthrough
 *   style       — passthrough
 */
export default function HBar({
    value = 0,
    max = 100,
    color = 'var(--green-600)',
    height = 8,
    track = 'var(--ink-200)',
    label,
    valueLabel,
    mono = true,
    className = '',
    style,
}) {
    const safeMax = max || 1
    const pct = Math.max(0, Math.min(100, (value / safeMax) * 100))

    return (
        <div className={className} style={style}>
            {(label || valueLabel) && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        gap: 8,
                        fontSize: 12,
                        marginBottom: 4,
                    }}
                >
                    {label && (
                        <span
                            style={{
                                color: 'var(--ink-700)',
                                fontWeight: 600,
                            }}
                        >
                            {label}
                        </span>
                    )}
                    {valueLabel != null && (
                        <span
                            className={mono ? 'mono' : ''}
                            style={{
                                color: 'var(--ink-700)',
                                fontWeight: 600,
                                fontSize: 11.5,
                            }}
                        >
                            {valueLabel}
                        </span>
                    )}
                </div>
            )}
            <div
                style={{
                    background: track,
                    borderRadius: 99,
                    height,
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        width: `${pct}%`,
                        background: color,
                        height: '100%',
                        borderRadius: 99,
                        transition: 'width 300ms',
                    }}
                />
            </div>
        </div>
    )
}
