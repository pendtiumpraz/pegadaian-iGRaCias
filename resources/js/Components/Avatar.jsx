/**
 * Avatar — initials disc.
 *
 * Mirrors the Avatar primitive in src/primitives.jsx and the
 * inline `Avatar` helper in Layouts/AppLayout.jsx. Color is hashed
 * from the name string against a small i-GRaCias palette so the
 * same name always renders with the same tint.
 *
 * Props:
 *   name       — display name                    (required)
 *   size       — px                              (default 32)
 *   bg         — explicit background override     (CSS color)
 *   tooltip    — title attribute on the disc     (default = name)
 *   className  — passthrough
 *   style      — passthrough
 */
const PALETTE = [
    '#187c5b', // green-600
    '#0f4a37', // green-800
    '#2e5a8a', // blue-600
    '#b8862c', // gold-600
    '#7a4f0a', // amber-700
    '#1c3d5e', // navy
]

function hashColor(name = '') {
    if (!name) return PALETTE[0]
    let h = 0
    for (let i = 0; i < name.length; i++) {
        h = (h << 5) - h + name.charCodeAt(i)
        h |= 0
    }
    return PALETTE[Math.abs(h) % PALETTE.length]
}

export default function Avatar({
    name,
    size = 32,
    bg,
    tooltip,
    className = '',
    style,
}) {
    const initials = (name || '?')
        .split(' ')
        .map((s) => s[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    const color = bg || hashColor(name || '')

    return (
        <div
            className={className}
            title={tooltip ?? name ?? undefined}
            style={{
                width: size,
                height: size,
                borderRadius: size,
                background: color,
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: Math.round(size * 0.4),
                fontWeight: 700,
                flexShrink: 0,
                userSelect: 'none',
                ...style,
            }}
        >
            {initials || '?'}
        </div>
    )
}

// Expose the palette helper so AvatarStack and other consumers
// can stay visually consistent.
export { hashColor }
