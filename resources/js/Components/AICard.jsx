import { Sparkles, Check, MessageSquare, X } from 'lucide-react'

/**
 * AICard — single AI suggestion card, used inside an AI panel
 * listing (e.g. AI Suggestions inside Kebijakan/Show right rail
 * or Risiko/Create assistance).
 *
 * Composition:
 *   - severity pill at the top (high/medium/low)
 *   - title + body
 *   - optional pasal source line
 *   - optional left-bordered green quote block
 *   - footer with Accept / Discuss / Ignore actions
 *
 * Props:
 *   severity   — 'high' | 'medium' | 'low'    (default 'medium')
 *   title      — string                       (required)
 *   body       — string|node                  (optional)
 *   pasal      — string|node — citation line  (optional)
 *   quote      — string|node — left-rule block (optional)
 *   onAccept   — () => void
 *   onDiscuss  — () => void
 *   onIgnore   — () => void
 *   className, style — passthrough
 */
const SEV_TONE = {
    high:   { bg: '#fbe4df', fg: '#8b261b', label: 'Severity Tinggi' },
    medium: { bg: '#fbecd1', fg: '#7a4f0a', label: 'Severity Sedang' },
    low:    { bg: '#d6f0e3', fg: '#0f4a37', label: 'Severity Rendah' },
}

export default function AICard({
    severity = 'medium',
    title,
    body,
    pasal,
    quote,
    onAccept,
    onDiscuss,
    onIgnore,
    className = '',
    style,
}) {
    const sev = SEV_TONE[severity] || SEV_TONE.medium

    return (
        <div
            className={['ai-card', className].filter(Boolean).join(' ')}
            style={{
                border: '1px solid var(--ink-200)',
                borderRadius: 'var(--radius-lg)',
                background: '#fff',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                ...style,
            }}
        >
            {/* header row */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                }}
            >
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '3px 9px',
                        borderRadius: 99,
                        background: sev.bg,
                        color: sev.fg,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 0.2,
                        textTransform: 'uppercase',
                    }}
                >
                    {sev.label}
                </span>
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 11,
                        color: 'var(--ink-500)',
                        fontWeight: 600,
                    }}
                >
                    <Sparkles size={12} style={{ color: 'var(--gold-500)' }} />
                    AI
                </span>
            </div>

            {/* title + body */}
            <div>
                <div
                    style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: 'var(--ink-900)',
                        lineHeight: 1.35,
                    }}
                >
                    {title}
                </div>
                {body && (
                    <div
                        style={{
                            fontSize: 13,
                            color: 'var(--ink-700)',
                            marginTop: 4,
                            lineHeight: 1.55,
                        }}
                    >
                        {body}
                    </div>
                )}
            </div>

            {/* pasal source */}
            {pasal && (
                <div
                    className="mono"
                    style={{
                        fontSize: 11.5,
                        color: 'var(--ink-600)',
                        fontWeight: 600,
                    }}
                >
                    {pasal}
                </div>
            )}

            {/* left-rule green quote */}
            {quote && (
                <div
                    style={{
                        borderLeft: '3px solid var(--green-600)',
                        background: 'var(--green-50)',
                        padding: '10px 12px',
                        borderRadius: 6,
                        fontSize: 12.5,
                        lineHeight: 1.55,
                        color: 'var(--ink-800)',
                        fontStyle: 'italic',
                    }}
                >
                    {quote}
                </div>
            )}

            {/* actions */}
            {(onAccept || onDiscuss || onIgnore) && (
                <div
                    style={{
                        display: 'flex',
                        gap: 8,
                        marginTop: 4,
                        flexWrap: 'wrap',
                    }}
                >
                    {onAccept && (
                        <button
                            type="button"
                            onClick={onAccept}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '6px 12px',
                                borderRadius: 8,
                                background: 'var(--green-700)',
                                color: '#fff',
                                fontSize: 12,
                                fontWeight: 600,
                                border: '1px solid var(--green-700)',
                                cursor: 'pointer',
                            }}
                        >
                            <Check size={13} /> Terima
                        </button>
                    )}
                    {onDiscuss && (
                        <button
                            type="button"
                            onClick={onDiscuss}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '6px 12px',
                                borderRadius: 8,
                                background: '#fff',
                                color: 'var(--ink-800)',
                                fontSize: 12,
                                fontWeight: 600,
                                border: '1px solid var(--ink-300)',
                                cursor: 'pointer',
                            }}
                        >
                            <MessageSquare size={13} /> Diskusikan
                        </button>
                    )}
                    {onIgnore && (
                        <button
                            type="button"
                            onClick={onIgnore}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '6px 12px',
                                borderRadius: 8,
                                background: 'transparent',
                                color: 'var(--ink-600)',
                                fontSize: 12,
                                fontWeight: 600,
                                border: '1px solid transparent',
                                cursor: 'pointer',
                            }}
                        >
                            <X size={13} /> Abaikan
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
