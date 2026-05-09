import { Link } from '@inertiajs/react'
import { ChevronRight } from 'lucide-react'

/**
 * PageHeader — i-GRaCias style.
 *
 * Title is rendered in `Fraunces` (.display class) at 26px,
 * sub in --ink-600. Optional breadcrumb above title and tab
 * row below — both mirrored from src/primitives.jsx.
 *
 * Props:
 *   title         — string                       (required)
 *   description   — string|node                  (optional)
 *   breadcrumbs   — Array<{ label, href? }>      (optional)
 *   actions       — node rendered on the right    (optional)
 *   tabs          — Array<{ id, label, count? }> (optional)
 *   activeTab     — id of currently active tab   (optional)
 *   onTabChange   — (id) => void                 (optional)
 */
export default function PageHeader({
    title,
    description,
    breadcrumbs,
    actions,
    tabs,
    activeTab,
    onTabChange,
}) {
    return (
        <div style={{ borderBottom: '1px solid var(--ink-200)', background: '#fff' }}>
            <div style={{ padding: '18px 32px 0' }}>
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <div
                        style={{
                            fontSize: 12,
                            color: 'var(--ink-500)',
                            marginBottom: 8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            flexWrap: 'wrap',
                        }}
                    >
                        {breadcrumbs.map((b, i) => {
                            const isLast = i === breadcrumbs.length - 1
                            const labelStyle = {
                                color: isLast ? 'var(--ink-800)' : 'var(--ink-500)',
                                fontWeight: isLast ? 600 : 400,
                            }
                            return (
                                <span
                                    key={i}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                                >
                                    {i > 0 && <ChevronRight size={12} />}
                                    {b.href && !isLast ? (
                                        <Link href={b.href} style={labelStyle}>
                                            {b.label}
                                        </Link>
                                    ) : (
                                        <span style={labelStyle}>{b.label ?? b}</span>
                                    )}
                                </span>
                            )
                        })}
                    </div>
                )}

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 16,
                    }}
                >
                    <div>
                        <h1
                            className="display"
                            style={{
                                margin: 0,
                                fontSize: 26,
                                color: 'var(--ink-900)',
                                lineHeight: 1.15,
                            }}
                        >
                            {title}
                        </h1>
                        {description && (
                            <div
                                style={{
                                    fontSize: 13.5,
                                    color: 'var(--ink-600)',
                                    marginTop: 6,
                                    maxWidth: 760,
                                }}
                            >
                                {description}
                            </div>
                        )}
                    </div>
                    {actions && (
                        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                            {actions}
                        </div>
                    )}
                </div>

                {tabs && tabs.length > 0 && (
                    <div style={{ display: 'flex', gap: 2, marginTop: 18 }}>
                        {tabs.map((t) => {
                            const active = activeTab === t.id
                            return (
                                <button
                                    type="button"
                                    key={t.id}
                                    onClick={() => onTabChange && onTabChange(t.id)}
                                    style={{
                                        padding: '10px 14px',
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: active ? 'var(--green-700)' : 'var(--ink-600)',
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: active
                                            ? '2px solid var(--green-700)'
                                            : '2px solid transparent',
                                        marginBottom: -1,
                                        cursor: 'pointer',
                                    }}
                                >
                                    {t.label}
                                    {t.count != null && (
                                        <span
                                            style={{
                                                marginLeft: 6,
                                                padding: '1px 6px',
                                                borderRadius: 99,
                                                fontSize: 11,
                                                background: active ? 'var(--green-100)' : 'var(--ink-100)',
                                                color: active ? 'var(--green-800)' : 'var(--ink-600)',
                                            }}
                                        >
                                            {t.count}
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
