/**
 * Sparkline — mini SVG line chart with optional area fill.
 *
 * Mirrors the Sparkline primitive in src/primitives.jsx and the
 * KRI tab usage in src/risk.jsx (last-value vs threshold breach
 * coloring). Values are normalised to fit width × height with a
 * 2px vertical breathing room.
 *
 * Props:
 *   data        — number[]                (required, ≥ 2 items)
 *   width       — px                      (default 72)
 *   height      — px                      (default 20)
 *   color       — stroke / fill color     (default --green-600)
 *   fill        — render area below line  (default true)
 *   threshold   — number; if last > threshold use breachColor
 *   breachColor — color when last value over threshold (default red)
 *   strokeWidth — line stroke px          (default 1.6)
 *   className   — passthrough class
 *   style       — passthrough style
 */
export default function Sparkline({
    data = [],
    width = 72,
    height = 20,
    color = 'var(--green-600)',
    fill = true,
    threshold,
    breachColor = '#b8392a',
    strokeWidth = 1.6,
    className = '',
    style,
}) {
    if (!Array.isArray(data) || data.length < 2) {
        return (
            <svg
                width={width}
                height={height}
                className={className}
                style={{ display: 'block', ...style }}
            />
        )
    }

    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    const last = data[data.length - 1]
    const isBreach = typeof threshold === 'number' && last > threshold
    const stroke = isBreach ? breachColor : color

    const pts = data.map((v, i) => [
        (i / (data.length - 1)) * width,
        height - ((v - min) / range) * (height - 4) - 2,
    ])
    const path = pts
        .map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1))
        .join(' ')
    const area = `${path} L ${width},${height} L 0,${height} Z`

    return (
        <svg
            width={width}
            height={height}
            className={className}
            style={{ display: 'block', ...style }}
        >
            {fill && <path d={area} fill={stroke} opacity="0.12" />}
            <path
                d={path}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    )
}
