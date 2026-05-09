import { Check } from 'lucide-react'

/**
 * Stepper — horizontal workflow stepper.
 *
 * Mirrors the 5-step status stepper used in src/details.jsx
 * (IncidentDetailPage) and the workflow approval stepper in
 * src/policy.jsx. Done steps render filled green with a check;
 * the current step renders a green ring on white; pending steps
 * render a flat ink chip with their number.
 *
 * Props:
 *   steps        — Array<{ label, sub?, status? }>  (required)
 *                  status ∈ 'done' | 'current' | 'pending'
 *                  if status omitted, currentIndex is used
 *   currentIndex — index treated as 'current' (0-based)
 *   size         — circle px                       (default 30)
 *   className    — passthrough
 *   style        — passthrough
 */
export default function Stepper({
    steps = [],
    currentIndex,
    size = 30,
    className = '',
    style,
}) {
    const resolved = steps.map((s, i) => {
        let status = s.status
        if (!status) {
            if (typeof currentIndex === 'number') {
                if (i < currentIndex) status = 'done'
                else if (i === currentIndex) status = 'current'
                else status = 'pending'
            } else {
                status = 'pending'
            }
        }
        return { ...s, status }
    })

    return (
        <div
            className={className}
            style={{
                display: 'flex',
                gap: 0,
                width: '100%',
                ...style,
            }}
        >
            {resolved.map((s, i) => {
                const isLast = i === resolved.length - 1
                const done = s.status === 'done'
                const current = s.status === 'current'

                const circleBg = done
                    ? 'var(--green-600)'
                    : current
                      ? '#fff'
                      : 'var(--ink-100)'
                const circleBorder = current
                    ? '2px solid var(--green-600)'
                    : `2px solid ${done ? 'var(--green-600)' : 'var(--ink-200)'}`
                const circleColor = done
                    ? '#fff'
                    : current
                      ? 'var(--green-700)'
                      : 'var(--ink-500)'

                return (
                    <div key={i} style={{ flex: 1, minWidth: 0 }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    width: size,
                                    height: size,
                                    borderRadius: size,
                                    background: circleBg,
                                    border: circleBorder,
                                    color: circleColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: 12,
                                    flexShrink: 0,
                                    transition: 'all 120ms',
                                }}
                            >
                                {done ? (
                                    <Check size={Math.round(size * 0.45)} />
                                ) : (
                                    i + 1
                                )}
                            </div>
                            {!isLast && (
                                <div
                                    style={{
                                        flex: 1,
                                        height: 2,
                                        background: done
                                            ? 'var(--green-600)'
                                            : 'var(--ink-200)',
                                        transition: 'background 120ms',
                                    }}
                                />
                            )}
                        </div>
                        <div
                            style={{
                                fontSize: 11.5,
                                fontWeight: current ? 700 : 500,
                                color: current
                                    ? 'var(--ink-900)'
                                    : 'var(--ink-600)',
                                marginTop: 8,
                                paddingRight: 12,
                            }}
                        >
                            {s.label}
                        </div>
                        {s.sub && (
                            <div
                                style={{
                                    fontSize: 11,
                                    color: 'var(--ink-500)',
                                    marginTop: 2,
                                    paddingRight: 12,
                                }}
                            >
                                {s.sub}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
