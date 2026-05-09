import { Search } from 'lucide-react'
import Tag from './Tag'

/**
 * Toolbar — search + filter chips + right-aligned count tag,
 * intended to live inside a `<Card padding={0}>` above a Table.
 *
 * Mirrors the Toolbar primitive in src/primitives.jsx and its
 * recurring usage in policy/risk/audit list pages.
 *
 * Layout: input on the left, chip row in the middle, count on the
 * right. All three are optional but at least one should be set.
 *
 * Props:
 *   searchPlaceholder  — placeholder text         (default 'Cari…')
 *   searchValue        — controlled value
 *   onSearch           — (value) => void
 *   filters            — Array<{
 *                          label, value?, active?, onClick?
 *                        }>
 *                        Renders as a row of toggleable chips.
 *   right              — extra node rendered before count chip
 *   count              — number/string rendered as a mono Tag
 *   countLabel         — singular noun appended after the number
 *                        (e.g. "dokumen")
 *   className          — passthrough
 *   style              — passthrough
 */
export default function Toolbar({
    searchPlaceholder = 'Cari…',
    searchValue = '',
    onSearch,
    filters,
    right,
    count,
    countLabel,
    className = '',
    style,
}) {
    return (
        <div
            className={['toolbar', className].filter(Boolean).join(' ')}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderBottom: '1px solid var(--ink-200)',
                background: '#fff',
                ...style,
            }}
        >
            {/* search */}
            {onSearch && (
                <div
                    style={{
                        position: 'relative',
                        maxWidth: 340,
                        flex: '1 1 240px',
                        minWidth: 180,
                    }}
                >
                    <Search
                        size={15}
                        style={{
                            position: 'absolute',
                            left: 10,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--ink-500)',
                        }}
                    />
                    <input
                        value={searchValue}
                        onChange={(e) => onSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                        style={{
                            width: '100%',
                            padding: '8px 12px 8px 32px',
                            border: '1px solid var(--ink-300)',
                            borderRadius: 8,
                            fontSize: 13,
                            background: '#fff',
                            outline: 'none',
                        }}
                    />
                </div>
            )}

            {/* filter chips */}
            {Array.isArray(filters) && filters.length > 0 && (
                <div
                    style={{
                        display: 'flex',
                        gap: 6,
                        flexWrap: 'wrap',
                        flex: '1 1 auto',
                        minWidth: 0,
                    }}
                >
                    {filters.map((f, i) => (
                        <button
                            key={f.value ?? i}
                            type="button"
                            onClick={f.onClick}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '5px 10px',
                                fontSize: 12,
                                fontWeight: 600,
                                borderRadius: 99,
                                border: '1px solid',
                                borderColor: f.active
                                    ? 'var(--green-600)'
                                    : 'var(--ink-200)',
                                background: f.active
                                    ? 'var(--green-50)'
                                    : '#fff',
                                color: f.active
                                    ? 'var(--green-800)'
                                    : 'var(--ink-700)',
                                cursor: 'pointer',
                                transition: 'all 120ms',
                            }}
                        >
                            {f.label}
                            {f.count != null && (
                                <span
                                    className="mono"
                                    style={{
                                        fontSize: 10.5,
                                        padding: '0 5px',
                                        borderRadius: 99,
                                        background: f.active
                                            ? '#fff'
                                            : 'var(--ink-100)',
                                        color: f.active
                                            ? 'var(--green-800)'
                                            : 'var(--ink-600)',
                                    }}
                                >
                                    {f.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* right-side accessory + count */}
            <div
                style={{
                    marginLeft: 'auto',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                }}
            >
                {right}
                {count != null && (
                    <Tag tone="mono" size="sm">
                        {count}
                        {countLabel ? ` ${countLabel}` : ''}
                    </Tag>
                )}
            </div>
        </div>
    )
}
