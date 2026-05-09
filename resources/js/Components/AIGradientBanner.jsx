import { Sparkles, Send } from 'lucide-react'

/**
 * AIGradientBanner — the distinctive AI feature banner used
 * across Kebijakan/Index, Kebijakan/Show, Risiko/Create.
 *
 * Mirrors the AI Search panel in src/policy.jsx exactly:
 *   - 135deg gradient from --green-900 to --green-700
 *   - gold sparkle accents (--gold-300)
 *   - decorative translucent circles
 *   - input + primary "Tanya AI" button (gold)
 *   - row of suggestion chips below
 *
 * Two layouts:
 *   compact=false — full hero banner with input row + chips
 *   compact=true  — single-line promo (title + body + chip row)
 *
 * Props:
 *   title       — display heading                   (required)
 *   body        — supporting paragraph              (string|node)
 *   eyebrow     — small uppercase caption           (default 'AI Assistant')
 *   chips       — Array<string>                     suggestion chips
 *   onChipClick — (chip) => void
 *   inputValue, onInputChange, placeholder, onAsk
 *               — wires the prompt input + send button
 *   loading     — disables ask button + shows spinner
 *   answer      — node rendered below input as result block
 *   compact     — boolean (default false)
 *   className, style — passthrough
 */
export default function AIGradientBanner({
    title,
    body,
    eyebrow = 'AI Assistant',
    chips,
    onChipClick,
    inputValue,
    onInputChange,
    placeholder = 'Ajukan pertanyaan…',
    onAsk,
    loading = false,
    answer,
    compact = false,
    className = '',
    style,
}) {
    const askable = typeof onAsk === 'function'

    return (
        <div
            className={['ai-gradient', className].filter(Boolean).join(' ')}
            style={{
                background:
                    'linear-gradient(135deg, var(--green-900) 0%, var(--green-700) 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: compact ? '16px 20px' : '24px 26px',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                ...style,
            }}
        >
            {/* decorative blobs */}
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    right: -30,
                    top: -30,
                    width: 200,
                    height: 200,
                    borderRadius: 200,
                    background: 'rgba(255,255,255,0.04)',
                }}
            />
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    right: 60,
                    bottom: -60,
                    width: 140,
                    height: 140,
                    borderRadius: 140,
                    background: 'rgba(255,255,255,0.03)',
                }}
            />

            {eyebrow && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 6,
                        position: 'relative',
                    }}
                >
                    <Sparkles
                        size={16}
                        style={{ color: 'var(--gold-300)' }}
                    />
                    <span
                        style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: 'var(--gold-300)',
                            textTransform: 'uppercase',
                            letterSpacing: 0.6,
                        }}
                    >
                        {eyebrow}
                    </span>
                </div>
            )}

            {title && (
                <div
                    className="display"
                    style={{
                        fontSize: compact ? 17 : 22,
                        marginBottom: 4,
                        position: 'relative',
                    }}
                >
                    {title}
                </div>
            )}
            {body && (
                <div
                    style={{
                        fontSize: 13,
                        color: '#a8c9b6',
                        marginBottom: askable || chips ? 16 : 0,
                        maxWidth: 640,
                        position: 'relative',
                    }}
                >
                    {body}
                </div>
            )}

            {/* prompt input */}
            {askable && (
                <div
                    style={{
                        display: 'flex',
                        gap: 8,
                        marginBottom: chips ? 12 : 0,
                        position: 'relative',
                    }}
                >
                    <input
                        value={inputValue ?? ''}
                        onChange={(e) =>
                            onInputChange && onInputChange(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !loading && onAsk)
                                onAsk()
                        }}
                        placeholder={placeholder}
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            borderRadius: 10,
                            border: '1px solid rgba(255,255,255,0.18)',
                            background: 'rgba(255,255,255,0.08)',
                            color: '#fff',
                            fontSize: 14,
                            outline: 'none',
                            backdropFilter: 'blur(8px)',
                        }}
                    />
                    <button
                        type="button"
                        onClick={onAsk}
                        disabled={loading || !inputValue}
                        style={{
                            padding: '0 18px',
                            borderRadius: 10,
                            background: 'var(--gold-500)',
                            color: '#3d2806',
                            fontSize: 13,
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            border: 'none',
                            opacity: loading || !inputValue ? 0.5 : 1,
                            cursor:
                                loading || !inputValue
                                    ? 'not-allowed'
                                    : 'pointer',
                        }}
                    >
                        {loading ? (
                            'Mencari…'
                        ) : (
                            <>
                                Tanya AI <Send size={14} />
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* suggestion chips */}
            {Array.isArray(chips) && chips.length > 0 && (
                <div
                    style={{
                        display: 'flex',
                        gap: 8,
                        flexWrap: 'wrap',
                        position: 'relative',
                    }}
                >
                    {chips.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() =>
                                onChipClick && onChipClick(c)
                            }
                            style={{
                                padding: '5px 11px',
                                borderRadius: 99,
                                background: 'rgba(255,255,255,0.08)',
                                color: '#cfe5d6',
                                fontSize: 12,
                                border: '1px solid rgba(255,255,255,0.12)',
                                cursor: 'pointer',
                                transition: 'background 120ms',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                    'rgba(255,255,255,0.14)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                    'rgba(255,255,255,0.08)'
                            }}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            )}

            {/* result block */}
            {(loading || answer) && (
                <div
                    style={{
                        marginTop: 16,
                        padding: '14px 16px',
                        borderRadius: 10,
                        background: 'rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        position: 'relative',
                    }}
                >
                    {loading && !answer && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                color: '#a8c9b6',
                                fontSize: 13,
                            }}
                        >
                            <span
                                className="ai-spin"
                                style={{
                                    width: 14,
                                    height: 14,
                                    border: '2px solid rgba(255,255,255,0.2)',
                                    borderTopColor: 'var(--gold-300)',
                                    borderRadius: 14,
                                    animation:
                                        'aiGradientSpin 800ms linear infinite',
                                }}
                            />
                            Menganalisis…
                        </div>
                    )}
                    {answer && (
                        <>
                            <div
                                style={{
                                    fontSize: 13.5,
                                    lineHeight: 1.55,
                                    color: '#fff',
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {answer}
                            </div>
                            <div
                                style={{
                                    marginTop: 10,
                                    paddingTop: 10,
                                    borderTop:
                                        '1px solid rgba(255,255,255,0.12)',
                                    fontSize: 11,
                                    color: '#a8c9b6',
                                    display: 'flex',
                                    gap: 14,
                                    alignItems: 'center',
                                }}
                            >
                                <Sparkles size={11} />
                                <span>
                                    Dihasilkan oleh AI · verifikasi dengan
                                    dokumen sumber
                                </span>
                            </div>
                        </>
                    )}
                </div>
            )}

            <style>{`@keyframes aiGradientSpin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}
