import { useMemo, useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import {
    SearchX,
    AlertTriangle,
    Clock,
    CheckCircle2,
    Eye,
    XCircle,
    Download,
    AlertOctagon,
} from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import StatCard from '@/Components/StatCard'
import DataTable from '@/Components/DataTable'
import Badge from '@/Components/Badge'
import Tag from '@/Components/Tag'
import Toolbar from '@/Components/Toolbar'
import Avatar from '@/Components/Avatar'

/* ─────────────── helpers ─────────────── */

const cardBase = {
    background: '#fff',
    borderRadius: 'var(--radius-lg, 12px)',
    border: '1px solid var(--ink-200)',
}

const btnSecondary = {
    background: '#fff',
    color: 'var(--ink-800)',
    padding: '7px 14px',
    height: 34,
    borderRadius: 8,
    border: '1px solid var(--ink-300)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
}

const btnSmall = {
    background: '#fff',
    color: 'var(--ink-700)',
    padding: '4px 10px',
    borderRadius: 6,
    border: '1px solid var(--ink-300)',
    cursor: 'pointer',
    fontSize: 11.5,
    fontWeight: 600,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
}

const btnSmallDanger = {
    background: '#fff',
    color: '#8b261b',
    padding: '4px 10px',
    borderRadius: 6,
    border: '1px solid #f0c9c1',
    cursor: 'pointer',
    fontSize: 11.5,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
}

const SEVERITY_OPTIONS = [
    { value: '',         label: 'Semua' },
    { value: 'low',      label: 'Rendah' },
    { value: 'medium',   label: 'Sedang' },
    { value: 'high',     label: 'Tinggi' },
    { value: 'critical', label: 'Kritis' },
]

const STATUS_OPTIONS = [
    { value: '',            label: 'Semua Status' },
    { value: 'open',        label: 'Open' },
    { value: 'in_progress', label: 'Sedang Dikerjakan' },
    { value: 'verifikasi',  label: 'Verifikasi' },
    { value: 'selesai',     label: 'Selesai' },
]

function severityTone(s) {
    const v = String(s || '').toLowerCase()
    if (v.includes('crit') || v === 'kritis')   return 'red'
    if (v === 'high' || v === 'tinggi')         return 'red'
    if (v === 'medium' || v === 'sedang')       return 'gold'
    if (v === 'low' || v === 'rendah')          return 'green'
    return 'mono'
}

function severityLabel(s) {
    const map = {
        low:      'Rendah',
        medium:   'Sedang',
        high:     'Tinggi',
        critical: 'Kritis',
    }
    return map[String(s || '').toLowerCase()] || s || '—'
}

function formatDate(d) {
    if (!d) return null
    return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function isOverdue(deadline, status) {
    if (!deadline) return false
    if (String(status || '').toLowerCase() === 'selesai') return false
    return new Date(deadline) < new Date()
}

/* ─────────────── page ─────────────── */

export default function FindingIndex({ findings, plans = [], filters = {} }) {
    const [search, setSearch] = useState('')
    const [severity, setSeverity] = useState('')
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '')
    const [planFilter, setPlanFilter] = useState(filters.audit_plan_id ?? '')

    const data = findings?.data ?? []

    function applyServerFilter(next = {}) {
        router.get(
            route('findings.index'),
            {
                audit_plan_id: next.audit_plan_id ?? planFilter,
                status:        next.status        ?? statusFilter,
            },
            { preserveState: true, replace: true },
        )
    }

    const filtered = useMemo(() => {
        return data.filter((r) => {
            if (severity) {
                if (String(r.severity || '').toLowerCase() !== severity) return false
            }
            if (search) {
                const q = search.toLowerCase()
                const haystack = [
                    r.finding_code,
                    r.description,
                    r.recommendation,
                    r.audit_plan?.audit_code,
                    r.audit_plan?.title,
                    r.owner?.name,
                ].filter(Boolean).join(' ').toLowerCase()
                if (!haystack.includes(q)) return false
            }
            return true
        })
    }, [data, severity, search])

    const stats = useMemo(() => {
        let open = 0, inProgress = 0, verified = 0, closed = 0
        data.forEach((r) => {
            const s = String(r.status || '').toLowerCase()
            if (s === 'selesai' || s === 'closed') closed += 1
            else if (s === 'verifikasi' || s === 'verified') verified += 1
            else if (s === 'in_progress' || s === 'pelaksanaan' || s === 'in progress') inProgress += 1
            else open += 1
        })
        return { open, inProgress, verified, closed }
    }, [data])

    const severityChips = SEVERITY_OPTIONS.map((s) => ({
        label:   s.label,
        value:   s.value,
        active:  severity === s.value,
        onClick: () => setSeverity(s.value),
    }))

    const columns = [
        {
            key: 'finding_code',
            label: 'Nomor',
            width: 140,
            render: (v) => (
                <span className="mono" style={{ fontSize: 11.5, fontWeight: 600 }}>
                    {v ?? '—'}
                </span>
            ),
        },
        {
            key: 'description',
            label: 'Judul Temuan',
            render: (_, row) => (
                <div>
                    <div style={{ fontWeight: 600, lineHeight: 1.4 }}>
                        {row.description
                            ? (row.description.length > 80
                                ? row.description.slice(0, 80) + '…'
                                : row.description)
                            : '—'}
                    </div>
                    {row.unit?.name && (
                        <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 2 }}>
                            {row.unit.name}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'audit_plan',
            label: 'Audit',
            width: 150,
            render: (_, row) => row.audit_plan?.audit_code
                ? <Tag tone="mono" size="xs">{row.audit_plan.audit_code}</Tag>
                : <span style={{ color: 'var(--ink-500)' }}>—</span>,
        },
        {
            key: 'severity',
            label: 'Tingkat Risiko',
            width: 130,
            render: (v) => (
                <Tag tone={severityTone(v)} size="sm">
                    {severityLabel(v)}
                </Tag>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            width: 130,
            render: (v) => <Badge status={v} />,
        },
        {
            key: 'owner',
            label: 'PIC',
            width: 160,
            render: (_, row) => row.owner?.name
                ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <Avatar name={row.owner.name} size={22} />
                        <span style={{ fontSize: 12.5 }}>{row.owner.name}</span>
                    </span>
                )
                : <span style={{ color: 'var(--ink-500)' }}>—</span>,
        },
        {
            key: 'deadline',
            label: 'Target',
            width: 130,
            render: (_, row) => {
                const d = formatDate(row.deadline)
                if (!d) return <span style={{ color: 'var(--ink-500)' }}>—</span>
                const overdue = isOverdue(row.deadline, row.status)
                return (
                    <span
                        className="mono"
                        style={{
                            fontSize: 12,
                            color: overdue ? '#b8392a' : 'var(--ink-700)',
                            fontWeight: overdue ? 700 : 500,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                        }}
                    >
                        {overdue && <AlertOctagon size={11} />}
                        {d}
                    </span>
                )
            },
        },
        {
            key: 'actions',
            label: 'Aksi',
            width: 160,
            render: (_, row) => {
                const closed = String(row.status || '').toLowerCase() === 'selesai'
                return (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <Link href={route('findings.show', row.id)} style={btnSmall}>
                            <Eye size={11} /> Lihat
                        </Link>
                        {!closed && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (!confirm(`Tutup temuan ${row.finding_code}?`)) return
                                    router.put(route('findings.close', row.id))
                                }}
                                style={btnSmallDanger}
                                title="Tutup temuan"
                            >
                                <XCircle size={11} /> Tutup
                            </button>
                        )}
                    </div>
                )
            },
        },
    ]

    return (
        <AppLayout title="Temuan Audit">
            <PageHeader
                title="Temuan Audit"
                description="Daftar temuan audit, status remediasi, dan tingkat risiko."
                breadcrumbs={[
                    { label: 'Beranda', href: route('dashboard') },
                    { label: 'Temuan Audit' },
                ]}
                actions={
                    <button type="button" style={btnSecondary}>
                        <Download size={14} /> Ekspor
                    </button>
                }
            />

            <div style={{ padding: '20px 32px' }}>
                {/* KPI strip */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 14,
                        marginBottom: 18,
                    }}
                >
                    <StatCard label="Open"             value={stats.open}       sub="butuh tindak lanjut"  icon={AlertTriangle} accent="#b8392a" />
                    <StatCard label="Sedang Dikerjakan" value={stats.inProgress} sub="dalam remediasi"      icon={Clock}         accent="var(--gold-500)" />
                    <StatCard label="Verifikasi"       value={stats.verified}   sub="menunggu konfirmasi"  icon={SearchX}       accent="var(--blue-600)" />
                    <StatCard label="Selesai"          value={stats.closed}     sub="telah ditutup"        icon={CheckCircle2}  accent="var(--green-600)" />
                </div>

                {/* Toolbar + table */}
                <div style={{ ...cardBase, padding: 0, overflow: 'hidden' }}>
                    <Toolbar
                        searchPlaceholder="Cari nomor temuan, deskripsi, atau PIC…"
                        searchValue={search}
                        onSearch={setSearch}
                        filters={severityChips}
                        right={
                            <>
                                {plans.length > 0 && (
                                    <select
                                        value={planFilter}
                                        onChange={(e) => {
                                            setPlanFilter(e.target.value)
                                            applyServerFilter({ audit_plan_id: e.target.value })
                                        }}
                                        style={{
                                            padding: '7px 28px 7px 10px',
                                            border: '1px solid var(--ink-300)',
                                            borderRadius: 8,
                                            background: '#fff',
                                            fontSize: 12.5,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <option value="">Semua Audit</option>
                                        {plans.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.audit_code} — {p.title}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value)
                                        applyServerFilter({ status: e.target.value })
                                    }}
                                    style={{
                                        padding: '7px 28px 7px 10px',
                                        border: '1px solid var(--ink-300)',
                                        borderRadius: 8,
                                        background: '#fff',
                                        fontSize: 12.5,
                                        cursor: 'pointer',
                                    }}
                                >
                                    {STATUS_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </>
                        }
                        count={filtered.length}
                        countLabel="temuan"
                    />
                    <DataTable
                        columns={columns}
                        data={filtered}
                        emptyMessage="Belum ada temuan audit yang tercatat."
                    />
                </div>

                {/* Pagination */}
                {findings?.links && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
                        {findings.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                style={{
                                    padding: '6px 10px',
                                    borderRadius: 6,
                                    fontSize: 12.5,
                                    border: '1px solid var(--ink-200)',
                                    background: link.active ? 'var(--green-700)' : '#fff',
                                    color: link.active ? '#fff' : 'var(--ink-700)',
                                    pointerEvents: link.url ? 'auto' : 'none',
                                    opacity: link.url ? 1 : 0.4,
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
