/**
 * Heatmap — 5×5 likelihood × impact risk heatmap.
 *
 * Mirrors the Heatmap primitive in src/primitives.jsx. Cells are
 * colored by likelihood × impact score:
 *   ≥ 16  → red    (#b8392a)  [Tinggi]
 *   ≥  7  → amber  (#c98114)  [Sedang]
 *   ≥  1  → green  (#187c5b)  [Rendah/Minimal]
 *
 * Two input shapes are supported:
 *
 *   // flat object keyed by "L,I" → count
 *   cells={{ '5,5': 2, '4,3': 1, ... }}
 *
 *   // nested object (matches src/dashboard.jsx)
 *   cells={{ 5:{1:0,2:0,3:1,4:2,5:1}, 4:{...}, ... }}
 *
 * Props:
 *   cells         — counts per cell (see above)
 *   onCellClick   — (likelihood, impact, count) => void
 *   currentCell   — string "L,I" to highlight with white outline
 *   showAxisLabel — render axis text                 (default true)
 *   className     — passthrough
 *   style         — passthrough
 */
const LIKELIHOOD_LABELS = [
    'Hampir Pasti',  // 5
    'Sering',        // 4
    'Mungkin',       // 3
    'Jarang',        // 2
    'Hampir Tidak',  // 1
]

const IMPACT_LABELS = ['Tidak Sig.', 'Minor', 'Moderat', 'Mayor', 'Katastropik']

function colorAt(l, i) {
    const score = l * i
    if (score >= 16) return '#b8392a'
    if (score >= 7) return '#c98114'
    if (score >= 1) return '#187c5b'
    return '#187c5b'
}

function readCount(cells, l, i) {
    if (!cells) return 0
    // flat shape ("L,I" key)
    const flat = cells[`${l},${i}`]
    if (typeof flat === 'number') return flat
    // nested shape
    const row = cells[l]
    if (row && typeof row[i] === 'number') return row[i]
    return 0
}

export default function Heatmap({
    cells = {},
    onCellClick,
    currentCell,
    showAxisLabel = true,
    className = '',
    style,
}) {
    const rows = [5, 4, 3, 2, 1]
    const cols = [1, 2, 3, 4, 5]

    return (
        <div className={className} style={style}>
            <div style={{ display: 'flex', gap: 8 }}>
                {/* Likelihood (Y) labels */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        fontSize: 10,
                        color: 'var(--ink-500)',
                        fontWeight: 600,
                        paddingTop: 2,
                        paddingBottom: showAxisLabel ? 18 : 2,
                        minWidth: 76,
                    }}
                >
                    {LIKELIHOOD_LABELS.map((l) => (
                        <span key={l}>{l}</span>
                    ))}
                </div>

                <div style={{ flex: 1 }}>
                    {/* 5×5 grid */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)',
                            gap: 4,
                        }}
                    >
                        {rows.map((l) =>
                            cols.map((i) => {
                                const cnt = readCount(cells, l, i)
                                const isCurrent = currentCell === `${l},${i}`
                                return (
                                    <button
                                        key={`${l}-${i}`}
                                        type="button"
                                        onClick={() =>
                                            onCellClick &&
                                            onCellClick(l, i, cnt)
                                        }
                                        style={{
                                            aspectRatio: '1.4 / 1',
                                            borderRadius: 6,
                                            border: isCurrent
                                                ? '2px solid #fff'
                                                : '1px solid #fff',
                                            outline: isCurrent
                                                ? '2px solid var(--ink-900)'
                                                : 'none',
                                            background:
                                                cnt > 0
                                                    ? colorAt(l, i)
                                                    : '#f3f5f3',
                                            color:
                                                cnt > 0
                                                    ? '#fff'
                                                    : 'var(--ink-400)',
                                            fontWeight: 700,
                                            fontSize: cnt > 0 ? 16 : 11,
                                            fontFamily: 'var(--font-mono)',
                                            cursor: onCellClick
                                                ? 'pointer'
                                                : 'default',
                                            transition: 'transform 120ms',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (onCellClick)
                                                e.currentTarget.style.transform =
                                                    'scale(1.04)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform =
                                                'scale(1)'
                                        }}
                                    >
                                        {cnt > 0 ? cnt : ''}
                                    </button>
                                )
                            }),
                        )}
                    </div>

                    {/* Impact (X) labels */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)',
                            gap: 4,
                            marginTop: 6,
                            fontSize: 10,
                            color: 'var(--ink-500)',
                            fontWeight: 600,
                            textAlign: 'center',
                        }}
                    >
                        {IMPACT_LABELS.map((l) => (
                            <span key={l}>{l}</span>
                        ))}
                    </div>

                    {showAxisLabel && (
                        <div
                            style={{
                                textAlign: 'center',
                                fontSize: 10.5,
                                color: 'var(--ink-500)',
                                fontWeight: 600,
                                marginTop: 2,
                                letterSpacing: 0.4,
                                textTransform: 'uppercase',
                            }}
                        >
                            Dampak →
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
