/**
 * Donut — SVG donut chart with optional center label.
 *
 * Mirrors the Donut primitive in src/primitives.jsx and the
 * compliance / coverage usage on the dashboard. Uses HEX colors
 * sourced from the i-GRaCias palette (green/gold/blue/red).
 *
 * Two call shapes are supported:
 *
 *   <Donut segments={[{ value:38, color:'#187c5b', label:'Patuh' }, ...]}
 *          centerValue="94%" centerLabel="Patuh" />
 *
 *   <Donut segments={72} size={120} centerValue="72%" />
 *     (treats single number as % of green-600 against ink-100 track)
 *
 * Props:
 *   segments     — Array<{ value, color, label? }> | number   (required)
 *   size         — px                                          (default 120)
 *   thickness    — stroke width                                (default 14)
 *   centerLabel  — small uppercase label under value
 *   centerValue  — primary number/string in center
 *   trackColor   — track ring color                            (default --ink-100)
 *   className    — passthrough
 *   style        — passthrough
 */
export default function Donut({
    segments,
    size = 120,
    thickness = 14,
    centerLabel,
    centerValue,
    trackColor = 'var(--ink-100)',
    className = '',
    style,
}) {
    // Normalise: a single number → one green segment over a 100 total.
    const data = Array.isArray(segments)
        ? segments
        : [{ value: Number(segments) || 0, color: '#187c5b' }]

    const total = data.reduce((s, d) => s + (Number(d.value) || 0), 0) ||
        (Array.isArray(segments) ? 1 : 100)

    const r = (size - thickness) / 2
    const c = 2 * Math.PI * r
    let acc = 0

    return (
        <div
            className={className}
            style={{ position: 'relative', width: size, height: size, ...style }}
        >
            <svg
                width={size}
                height={size}
                style={{ transform: 'rotate(-90deg)' }}
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={trackColor}
                    strokeWidth={thickness}
                />
                {data.map((d, i) => {
                    const value = Number(d.value) || 0
                    const len = (value / total) * c
                    const off = -acc
                    acc += len
                    return (
                        <circle
                            key={i}
                            cx={size / 2}
                            cy={size / 2}
                            r={r}
                            fill="none"
                            stroke={d.color || 'var(--green-600)'}
                            strokeWidth={thickness}
                            strokeDasharray={`${len} ${c - len}`}
                            strokeDashoffset={off}
                            strokeLinecap="butt"
                        />
                    )
                })}
            </svg>
            {(centerValue || centerLabel) && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}
                >
                    {centerValue && (
                        <div
                            className="mono"
                            style={{
                                fontSize: Math.round(size * 0.18),
                                fontWeight: 600,
                                color: 'var(--ink-900)',
                                lineHeight: 1,
                            }}
                        >
                            {centerValue}
                        </div>
                    )}
                    {centerLabel && (
                        <div
                            style={{
                                fontSize: 10,
                                color: 'var(--ink-500)',
                                textTransform: 'uppercase',
                                letterSpacing: 0.4,
                                fontWeight: 600,
                                marginTop: 4,
                            }}
                        >
                            {centerLabel}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
