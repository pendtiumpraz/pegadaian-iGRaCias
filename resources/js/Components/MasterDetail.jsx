/**
 * MasterDetail — split layout for index pages.
 *
 * Mirrors the 320px / 1fr split used in audit-style index pages
 * where a left list selects the active record on the right.
 *
 * Composition:
 *   - `master` slot — left list column (sticky-friendly)
 *   - `detail` slot — right detail/empty-state column
 *
 * Props:
 *   master      — left column node                         (required)
 *   detail      — right column node                        (required)
 *   masterWidth — px or any CSS length                     (default '320px')
 *   gap         — px between columns                       (default 16)
 *   stickyTop   — sticky offset for the master column      (default 0)
 *   className   — passthrough
 *   style       — passthrough
 */
export default function MasterDetail({
    master,
    detail,
    masterWidth = '320px',
    gap = 16,
    stickyTop = 0,
    className = '',
    style,
}) {
    return (
        <div
            className={['master-detail', className].filter(Boolean).join(' ')}
            style={{
                display: 'grid',
                gridTemplateColumns: `${masterWidth} 1fr`,
                gap,
                alignItems: 'start',
                ...style,
            }}
        >
            <div
                style={{
                    minWidth: 0,
                    position: 'sticky',
                    top: stickyTop,
                    alignSelf: 'start',
                }}
            >
                {master}
            </div>
            <div style={{ minWidth: 0 }}>{detail}</div>
        </div>
    )
}
