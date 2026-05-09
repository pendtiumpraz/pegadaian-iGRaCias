/**
 * RightRail — detail page layout helper.
 *
 * Mirrors the 1fr / 320px grid used throughout src/details.jsx
 * (Incident, Policy, Loss, Compliance, Fraud detail pages).
 *
 * Composition:
 *   - `main` slot — primary content column, scrolls with the page
 *   - `rail` slot — fixed-width right column (DetailRow + linked cards)
 *
 * Props:
 *   main       — primary content node                        (required)
 *   rail       — right column node                           (required)
 *   railWidth  — px or any CSS length                         (default '320px')
 *   gap        — px between columns                           (default 24)
 *   className  — passthrough
 *   style      — passthrough
 */
export default function RightRail({
    main,
    rail,
    railWidth = '320px',
    gap = 24,
    className = '',
    style,
}) {
    return (
        <div
            className={['right-rail', className].filter(Boolean).join(' ')}
            style={{
                display: 'grid',
                gridTemplateColumns: `1fr ${railWidth}`,
                gap,
                alignItems: 'start',
                ...style,
            }}
        >
            <div
                style={{
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                }}
            >
                {main}
            </div>
            <div
                style={{
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                }}
            >
                {rail}
            </div>
        </div>
    )
}
