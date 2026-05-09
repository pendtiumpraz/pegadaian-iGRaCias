/**
 * SectionTitle — card section header with optional subtitle,
 * hint, and right-side actions.
 *
 * Mirrors the SectionTitle primitive in src/primitives.jsx.
 * Title uses the `.display` Fraunces face, subtitle / hint sits
 * below in --ink-500.
 *
 * Two prop names are accepted for the secondary line:
 *   - `subtitle` — rendered below the title (display font fallback)
 *   - `hint`    — small caption shown immediately under the title
 *
 * Props:
 *   title     — main text                        (required)
 *   subtitle  — secondary line below title       (string|node)
 *   hint      — small caption (e.g. period)      (string|node)
 *   actions   — right-side action node           (node)
 *   level     — heading level 2|3|4              (default 3)
 *   display   — render title with .display       (default true)
 *   className — passthrough
 *   style     — passthrough
 */
export default function SectionTitle({
    title,
    subtitle,
    hint,
    actions,
    level = 3,
    display = true,
    className = '',
    style,
}) {
    const Tag = `h${Math.min(Math.max(level, 1), 6)}`

    return (
        <div
            className={['section-title', className]
                .filter(Boolean)
                .join(' ')}
            style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 14,
                ...style,
            }}
        >
            <div style={{ minWidth: 0 }}>
                <Tag
                    className={display ? 'display' : ''}
                    style={{
                        margin: 0,
                        fontSize: display ? 17 : 13,
                        fontWeight: display ? 600 : 700,
                        color: 'var(--ink-900)',
                        lineHeight: 1.2,
                        letterSpacing: display ? -0.01 : 0.1,
                    }}
                >
                    {title}
                </Tag>
                {hint && (
                    <div
                        style={{
                            fontSize: 12,
                            color: 'var(--ink-500)',
                            marginTop: 3,
                        }}
                    >
                        {hint}
                    </div>
                )}
                {subtitle && (
                    <div
                        style={{
                            fontSize: 13,
                            color: 'var(--ink-600)',
                            marginTop: 4,
                        }}
                    >
                        {subtitle}
                    </div>
                )}
            </div>
            {actions && (
                <div
                    style={{
                        display: 'inline-flex',
                        gap: 8,
                        alignItems: 'center',
                        flexShrink: 0,
                    }}
                >
                    {actions}
                </div>
            )}
        </div>
    )
}
