/**
 * Tag — neutral chip distinct from <Badge>.
 *
 * Mirrors the Tag primitive in src/primitives.jsx (the small
 * grey "category" pill) and adds soft tonal variants used in
 * the reference's filter chips and audit/risk taxonomy cells.
 *
 * Tones produce a soft bg-100 surface with a -700 foreground —
 * the same recipe the reference uses for Tag/Tone chips.
 *
 * Props:
 *   children   — chip content                       (required)
 *   tone       — 'neutral' | 'mono' | 'green' |
 *                'gold' | 'blue' | 'amber' | 'red'  (default 'neutral')
 *   size       — 'xs' | 'sm' | 'md'                 (default 'sm')
 *   onClick    — pointer handler (chip becomes button-like)
 *   className  — passthrough
 *   style      — passthrough
 */
const TONES = {
    neutral: { bg: 'var(--ink-100)', fg: 'var(--ink-700)' },
    mono:    { bg: 'var(--ink-50)',  fg: 'var(--ink-800)', mono: true },
    green:   { bg: 'var(--green-100)', fg: 'var(--green-800)' },
    gold:    { bg: 'var(--gold-100)',  fg: '#7a4f0a' },
    blue:    { bg: 'var(--blue-100)',  fg: '#1c3d5e' },
    amber:   { bg: 'var(--amber-100)', fg: '#7a4f0a' },
    red:     { bg: 'var(--red-100)',   fg: '#8b261b' },
}

const SIZES = {
    xs: { p: '1px 6px',  fs: 10.5, gap: 4, radius: 5 },
    sm: { p: '3px 8px',  fs: 11.5, gap: 6, radius: 6 },
    md: { p: '5px 10px', fs: 12,   gap: 6, radius: 7 },
}

export default function Tag({
    children,
    tone = 'neutral',
    size = 'sm',
    onClick,
    className = '',
    style,
}) {
    const t = TONES[tone] || TONES.neutral
    const s = SIZES[size] || SIZES.sm

    return (
        <span
            onClick={onClick}
            className={[t.mono ? 'mono' : '', className]
                .filter(Boolean)
                .join(' ')}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: s.gap,
                padding: s.p,
                borderRadius: s.radius,
                background: t.bg,
                color: t.fg,
                fontSize: s.fs,
                fontWeight: 500,
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
                cursor: onClick ? 'pointer' : 'default',
                ...style,
            }}
        >
            {children}
        </span>
    )
}
