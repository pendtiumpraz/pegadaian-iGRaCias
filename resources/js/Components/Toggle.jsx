/**
 * Toggle — on/off switch.
 *
 * Mirrors the on/off cells in the reference's settings tables.
 * Uses --green-600 for active and --ink-200 for inactive; the
 * thumb is a pure white disc with a soft shadow.
 *
 * Props:
 *   checked    — boolean                       (required)
 *   onChange   — (next: boolean) => void
 *   label      — optional inline label after the switch
 *   sub        — optional sub-label rendered below `label`
 *   size       — 'sm' | 'md' | 'lg'             (default 'md')
 *   disabled   — boolean
 *   id         — input id (for label htmlFor)
 *   className  — passthrough
 *   style      — passthrough
 */
const SIZES = {
    sm: { w: 30, h: 18, thumb: 14, pad: 2, fs: 12 },
    md: { w: 36, h: 22, thumb: 18, pad: 2, fs: 13 },
    lg: { w: 44, h: 26, thumb: 22, pad: 2, fs: 14 },
}

export default function Toggle({
    checked = false,
    onChange,
    label,
    sub,
    size = 'md',
    disabled = false,
    id,
    className = '',
    style,
}) {
    const s = SIZES[size] || SIZES.md
    const handle = () => {
        if (disabled || !onChange) return
        onChange(!checked)
    }

    const switchEl = (
        <span
            role="switch"
            aria-checked={checked}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault()
                    handle()
                }
            }}
            onClick={handle}
            id={id}
            style={{
                position: 'relative',
                display: 'inline-block',
                width: s.w,
                height: s.h,
                borderRadius: s.h,
                background: checked ? 'var(--green-600)' : 'var(--ink-200)',
                transition: 'background 160ms',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.55 : 1,
                flexShrink: 0,
                outline: 'none',
            }}
        >
            <span
                style={{
                    position: 'absolute',
                    top: s.pad,
                    left: checked ? s.w - s.thumb - s.pad : s.pad,
                    width: s.thumb,
                    height: s.thumb,
                    borderRadius: s.thumb,
                    background: '#fff',
                    boxShadow: '0 1px 2px rgba(10,48,35,0.18)',
                    transition: 'left 160ms',
                }}
            />
        </span>
    )

    if (!label && !sub) {
        return (
            <span className={className} style={style}>
                {switchEl}
            </span>
        )
    }

    return (
        <label
            htmlFor={id}
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: sub ? 'flex-start' : 'center',
                gap: 10,
                cursor: disabled ? 'not-allowed' : 'pointer',
                ...style,
            }}
        >
            {switchEl}
            {(label || sub) && (
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {label && (
                        <span
                            style={{
                                fontSize: s.fs,
                                fontWeight: 600,
                                color: 'var(--ink-900)',
                                lineHeight: 1.3,
                            }}
                        >
                            {label}
                        </span>
                    )}
                    {sub && (
                        <span
                            style={{
                                fontSize: 12,
                                color: 'var(--ink-600)',
                                lineHeight: 1.4,
                            }}
                        >
                            {sub}
                        </span>
                    )}
                </span>
            )}
        </label>
    )
}
