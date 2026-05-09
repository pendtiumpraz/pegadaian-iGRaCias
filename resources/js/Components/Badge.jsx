/**
 * Status badge — pill chip with semantic tone + optional dot.
 *
 * Mirrors the `Badge` primitive in the i-GRaCias reference
 * (src/primitives.jsx) so colors stay consistent across the app.
 *
 * Lookup is keyed on the literal Indonesian status word (case-
 * insensitive). Unknown statuses fall back to a neutral chip.
 *
 * Usage:
 *   <Badge status="Aktif" />
 *   <Badge status="Tinggi" />
 *   <Badge status="Patuh" />
 *   <Badge status="Custom" tone="success" />
 *   <Badge label="Open" tone="danger" />
 */

const TONES = {
    // semantic shortcuts
    success: { bg: '#d6f0e3', fg: '#0f4a37', dot: '#187c5b' },
    warning: { bg: '#fbecd1', fg: '#7a4f0a', dot: '#c98114' },
    danger:  { bg: '#fbe4df', fg: '#8b261b', dot: '#b8392a' },
    info:    { bg: '#e0ecf8', fg: '#1c3d5e', dot: '#2e5a8a' },
    neutral: { bg: '#eef2ef', fg: '#374441', dot: '#7a8884' },
}

const STATUS_TONE = {
    // risk levels
    'tinggi':         TONES.danger,
    'sedang':         TONES.warning,
    'rendah':         TONES.success,
    'minimal':        TONES.success,
    // generic states
    'aktif':          TONES.danger,
    'pemantauan':     TONES.warning,
    'termitigasi':    TONES.success,
    'patuh':          TONES.success,
    'implementasi':   TONES.info,
    'gap analisis':   TONES.warning,
    'selesai':        TONES.success,
    'pelaksanaan':    TONES.info,
    'pelaporan':      TONES.warning,
    'perencanaan':    TONES.neutral,
    'investigasi':    TONES.warning,
    'verifikasi':     TONES.info,
    'disetujui':      TONES.success,
    'recovery':       TONES.warning,
    'litigasi':       TONES.danger,
    'klaim asuransi': TONES.info,
    'tutup':          TONES.neutral,
    'review':         TONES.warning,
    'draft':          TONES.neutral,
    'open':           TONES.danger,
    'closed':         TONES.neutral,
}

export default function Badge({ status, label, tone, dot = true, className = '', style }) {
    const display = label ?? status ?? '—'
    const key = (status ?? label ?? '').toString().toLowerCase().trim()

    const t =
        (tone && TONES[tone]) ||
        STATUS_TONE[key] ||
        TONES.neutral

    return (
        <span
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '3px 9px',
                borderRadius: 99,
                background: t.bg,
                color: t.fg,
                fontSize: 11.5,
                fontWeight: 600,
                letterSpacing: 0.1,
                whiteSpace: 'nowrap',
                ...style,
            }}
        >
            {dot && (
                <span
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: 6,
                        background: t.dot,
                    }}
                />
            )}
            {display}
        </span>
    )
}

/**
 * Tag — neutral chip, useful for categories / kinds.
 * Matches the `Tag` primitive in the reference.
 */
export function Tag({ children, onClick, className = '', style }) {
    return (
        <span
            onClick={onClick}
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '3px 8px',
                borderRadius: 6,
                background: 'var(--ink-100)',
                color: 'var(--ink-700)',
                fontSize: 11.5,
                fontWeight: 500,
                cursor: onClick ? 'pointer' : 'default',
                ...style,
            }}
        >
            {children}
        </span>
    )
}
