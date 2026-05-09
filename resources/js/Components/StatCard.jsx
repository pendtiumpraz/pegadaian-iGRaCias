import { ArrowUp, ArrowDown } from 'lucide-react'

/**
 * StatCard / KPI tile — mirrors the KPI primitive from
 * src/primitives.jsx in the i-GRaCias reference:
 *
 *   • optional left accent stripe (`accent` color)
 *   • uppercase label in --ink-600
 *   • mono numeric value in --ink-900
 *   • trend chip with up/down arrow + green/red tone
 *   • optional `sub` line for context
 *
 * Props:
 *   label      — uppercase label                 (string, required)
 *   value      — primary metric                   (string|number, required)
 *   sub        — supporting text under value      (string|node, optional)
 *   trend      — short delta string e.g. "+12"   (string, optional)
 *   trendDir   — 'up' | 'down' | 'flat'           (default: undefined)
 *   accent     — left stripe color                (CSS color, optional)
 *   icon       — Lucide icon component             (optional, top-right)
 *   className  — extra className for the wrapper
 */
export default function StatCard({
    label,
    value,
    sub,
    trend,
    trendDir,
    accent,
    icon: Icon,
    className = '',
}) {
    const trendColor =
        trendDir === 'up'   ? '#187c5b' :
        trendDir === 'down' ? '#b8392a' :
                              'var(--ink-600)'

    return (
        <div
            className={className}
            style={{
                background: '#fff',
                border: '1px solid var(--ink-200)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 18px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {accent && (
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 3,
                        background: accent,
                    }}
                />
            )}

            <div
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 8,
                }}
            >
                <span
                    style={{
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: 'var(--ink-600)',
                        textTransform: 'uppercase',
                        letterSpacing: 0.4,
                    }}
                >
                    {label}
                </span>
                {Icon && (
                    <span
                        style={{
                            color: 'var(--green-700)',
                            background: 'var(--green-50)',
                            borderRadius: 8,
                            padding: 6,
                            display: 'inline-flex',
                            flexShrink: 0,
                        }}
                    >
                        <Icon size={16} />
                    </span>
                )}
            </div>

            <div
                className="mono"
                style={{
                    fontSize: 28,
                    fontWeight: 600,
                    color: 'var(--ink-900)',
                    marginTop: 6,
                    lineHeight: 1.1,
                }}
            >
                {value ?? '—'}
            </div>

            {(trend || sub) && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginTop: 8,
                        fontSize: 12,
                    }}
                >
                    {trend && (
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3,
                                color: trendColor,
                                fontWeight: 600,
                            }}
                        >
                            {trendDir === 'up'   && <ArrowUp size={11} strokeWidth={2.5} />}
                            {trendDir === 'down' && <ArrowDown size={11} strokeWidth={2.5} />}
                            {trend}
                        </span>
                    )}
                    {sub && <span style={{ color: 'var(--ink-500)' }}>{sub}</span>}
                </div>
            )}
        </div>
    )
}
