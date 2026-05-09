import Avatar from './Avatar'

/**
 * AvatarStack — cluster of overlapping Avatar discs with
 * an optional `+N` overflow chip when the user list exceeds `max`.
 *
 * Used in audit + risk lists for "Tim Audit" / "PIC" cells. Mirrors
 * the inline pattern used in src/audit.jsx where Lead Auditor cells
 * render Avatar + name; here we render only the overlapping discs.
 *
 * Props:
 *   users     — Array<string | { name }>     (required)
 *   max       — visible disc cap before `+N`  (default 3)
 *   size      — disc px                       (default 24)
 *   overlap   — px each disc shifts left      (default size * 0.32)
 *   className — passthrough
 *   style     — passthrough
 */
export default function AvatarStack({
    users = [],
    max = 3,
    size = 24,
    overlap,
    className = '',
    style,
}) {
    const list = users.map((u) =>
        typeof u === 'string' ? { name: u } : u || { name: '?' },
    )
    const visible = list.slice(0, max)
    const extra = list.length - visible.length
    const shift = overlap ?? Math.round(size * 0.32)

    return (
        <div
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                ...style,
            }}
        >
            {visible.map((u, i) => (
                <div
                    key={i}
                    style={{
                        marginLeft: i === 0 ? 0 : -shift,
                        border: '2px solid #fff',
                        borderRadius: size + 4,
                        background: '#fff',
                        display: 'inline-flex',
                        zIndex: visible.length - i,
                    }}
                >
                    <Avatar name={u.name} size={size} tooltip={u.name} />
                </div>
            ))}
            {extra > 0 && (
                <div
                    title={list
                        .slice(max)
                        .map((u) => u.name)
                        .join(', ')}
                    className="mono"
                    style={{
                        marginLeft: -shift,
                        width: size,
                        height: size,
                        borderRadius: size,
                        border: '2px solid #fff',
                        background: 'var(--ink-200)',
                        color: 'var(--ink-700)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: Math.round(size * 0.36),
                        fontWeight: 700,
                        flexShrink: 0,
                    }}
                >
                    +{extra}
                </div>
            )}
        </div>
    )
}
