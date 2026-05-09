import { Loader2, FileText } from 'lucide-react'

/**
 * DataTable — i-GRaCias table primitive.
 *
 * Mirrors the `Table` primitive in src/primitives.jsx +
 * the row hover / header treatment used in src/risk.jsx and
 * src/audit.jsx. Uses --ink-200 borders, --ink-50 header bg,
 * --ink-100 row dividers, hover --ink-50.
 *
 * Columns can use either `key` (simple cell) or `render(row)`
 * for custom content. A `render(value, row)` 2-arg form is also
 * supported for backward compatibility with the older signature.
 *
 * Props:
 *   columns   — Array<{ key, label, width?, align?, render? }>
 *   data      — Array<object>
 *   loading   — boolean
 *   onRowClick — (row) => void
 *   emptyMessage — string|node
 */
export default function DataTable({
    columns = [],
    data = [],
    loading = false,
    onRowClick,
    emptyMessage = 'Tidak ada data ditemukan.',
}) {
    return (
        <div
            style={{
                background: '#fff',
                border: '1px solid var(--ink-200)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
            }}
        >
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr style={{ background: 'var(--ink-50)' }}>
                            {columns.map((col, i) => (
                                <th
                                    key={col.key ?? i}
                                    style={{
                                        textAlign: col.align ?? 'left',
                                        padding: '10px 16px',
                                        fontSize: 11.5,
                                        fontWeight: 700,
                                        color: 'var(--ink-600)',
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.4,
                                        borderBottom: '1px solid var(--ink-200)',
                                        width: col.width,
                                    }}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    style={{
                                        padding: '40px 16px',
                                        textAlign: 'center',
                                        color: 'var(--ink-500)',
                                    }}
                                >
                                    <span
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 8,
                                        }}
                                    >
                                        <Loader2
                                            size={16}
                                            style={{ animation: 'spin 1s linear infinite' }}
                                        />
                                        Memuat data…
                                    </span>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    style={{ padding: '48px 24px', textAlign: 'center' }}
                                >
                                    <div
                                        style={{
                                            width: 48,
                                            height: 48,
                                            margin: '0 auto 14px',
                                            borderRadius: 48,
                                            background: 'var(--ink-100)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--ink-500)',
                                        }}
                                    >
                                        <FileText size={22} />
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 13,
                                            color: 'var(--ink-600)',
                                        }}
                                    >
                                        {emptyMessage}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIdx) => (
                                <tr
                                    key={row.id ?? rowIdx}
                                    onClick={() => onRowClick && onRowClick(row)}
                                    style={{
                                        borderBottom: '1px solid var(--ink-100)',
                                        cursor: onRowClick ? 'pointer' : 'default',
                                        transition: 'background 120ms',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (onRowClick) e.currentTarget.style.background = 'var(--ink-50)'
                                    }}
                                    onMouseLeave={(e) => {
                                        if (onRowClick) e.currentTarget.style.background = 'transparent'
                                    }}
                                >
                                    {columns.map((col, j) => {
                                        let cell
                                        if (typeof col.render === 'function') {
                                            // Support both render(row) and render(value, row).
                                            cell = col.render.length >= 2
                                                ? col.render(row[col.key], row)
                                                : col.render(row)
                                        } else {
                                            cell = row[col.key] ?? '—'
                                        }
                                        return (
                                            <td
                                                key={col.key ?? j}
                                                style={{
                                                    padding: '12px 16px',
                                                    textAlign: col.align ?? 'left',
                                                    color: 'var(--ink-800)',
                                                    verticalAlign: 'middle',
                                                }}
                                            >
                                                {cell}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
