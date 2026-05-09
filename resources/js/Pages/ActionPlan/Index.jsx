import { useMemo, useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { Plus, ListTodo, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import StatCard from '@/Components/StatCard'
import Badge from '@/Components/Badge'
import DataTable from '@/Components/DataTable'
import Tag from '@/Components/Tag'
import Toolbar from '@/Components/Toolbar'
import HBar from '@/Components/HBar'
import Avatar from '@/Components/Avatar'

const STATUS_OPTIONS = [
    { value: '',            label: 'Semua Status' },
    { value: 'open',        label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed',   label: 'Completed' },
    { value: 'overdue',     label: 'Overdue' },
]

const SUMBER_OPTIONS = [
    { value: '',        label: 'Semua' },
    { value: 'risk',    label: 'Risiko' },
    { value: 'finding', label: 'Finding' },
]

const cardBase = {
    background: '#fff',
    borderRadius: 'var(--radius-lg, 12px)',
    border: '1px solid var(--ink-200)',
}

const btnPrimary = {
    background: 'var(--green-700)',
    color: '#fff',
    padding: '7px 14px',
    height: 34,
    borderRadius: 8,
    border: '1px solid var(--green-700)',
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
}

function SumberTag({ type }) {
    if (type === 'risk') return <Tag tone="blue">Risiko</Tag>
    if (type === 'finding') return <Tag tone="amber">Finding</Tag>
    return <Tag>—</Tag>
}

function DeadlineCell({ value, status }) {
    if (!value) return <span style={{ color: 'var(--ink-500)' }}>—</span>
    const date = new Date(value)
    const isOverdue = date < new Date() && status !== 'completed'
    const display = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    return (
        <span
            className="mono"
            style={{
                color: isOverdue ? '#b8392a' : 'var(--ink-800)',
                fontWeight: isOverdue ? 700 : 500,
                fontSize: 11.5,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
            }}
        >
            {display}
            {isOverdue && (
                <span
                    style={{
                        background: '#fbe4df',
                        color: '#8b261b',
                        padding: '1px 6px',
                        borderRadius: 99,
                        fontSize: 10,
                        fontWeight: 700,
                    }}
                >
                    Overdue
                </span>
            )}
        </span>
    )
}

export default function RencanaAksiIndex({ plans, filters = {}, summary = {} }) {
    const [search, setSearch]         = useState(filters.search      ?? '')
    const [status, setStatus]         = useState(filters.status      ?? '')
    const [sumberType, setSumberType] = useState(filters.sumber_type ?? '')

    const data = plans?.data ?? []

    function applyFilter(next = {}) {
        router.get(
            route('action-plans.index'),
            {
                search:      next.search      ?? search,
                status:      next.status      ?? status,
                sumber_type: next.sumber_type ?? sumberType,
            },
            { preserveState: true, replace: true },
        )
    }

    /* fallback summary */
    const counts = useMemo(() => {
        const acc = { open: 0, in_progress: 0, overdue: 0, completed: 0 }
        const now = new Date()
        for (const p of data) {
            const s = (p.status || '').toLowerCase()
            const d = p.deadline ? new Date(p.deadline) : null
            const overdue = d && d < now && s !== 'completed'
            if (overdue) acc.overdue++
            if (s === 'completed') acc.completed++
            else if (s === 'in_progress') acc.in_progress++
            else if (s === 'open') acc.open++
        }
        return acc
    }, [data])

    const sumberChips = SUMBER_OPTIONS.map((s) => ({
        label: s.label,
        value: s.value,
        active: (sumberType || '') === s.value,
        onClick: () => {
            setSumberType(s.value)
            applyFilter({ sumber_type: s.value })
        },
    }))

    const columns = [
        {
            key: 'judul',
            label: 'Judul Rencana',
            render: (_, r) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{r.judul ?? '—'}</div>
                    {r.deskripsi && (
                        <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 2 }}>
                            {r.deskripsi.slice(0, 80)}{r.deskripsi.length > 80 ? '…' : ''}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'sumber_type',
            label: 'Sumber',
            width: 110,
            render: (v) => <SumberTag type={v} />,
        },
        {
            key: 'pic_user_id',
            label: 'PIC',
            width: 170,
            render: (_, r) => r.pic?.name
                ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <Avatar name={r.pic.name} size={22} />
                        <span style={{ fontSize: 12.5 }}>{r.pic.name}</span>
                    </span>
                )
                : <span style={{ color: 'var(--ink-500)' }}>—</span>,
        },
        {
            key: 'deadline',
            label: 'Deadline',
            width: 170,
            render: (v, r) => <DeadlineCell value={v} status={r.status} />,
        },
        {
            key: 'progress_pct',
            label: 'Progress',
            width: 200,
            render: (v) => {
                const pct = Math.max(0, Math.min(100, Number(v) || 0))
                const color = pct >= 100 ? '#187c5b' : pct >= 50 ? '#c98114' : '#b8392a'
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                            <HBar value={pct} max={100} color={color} />
                        </div>
                        <span className="mono" style={{ fontSize: 11.5, fontWeight: 600, minWidth: 40, textAlign: 'right' }}>
                            {pct}%
                        </span>
                    </div>
                )
            },
        },
        {
            key: 'status',
            label: 'Status',
            width: 130,
            render: (v) => <Badge status={v} />,
        },
        {
            key: 'actions',
            label: 'Aksi',
            width: 160,
            render: (_, r) => (
                <Link href={route('action-plans.show', r.id)} style={btnSmall}>
                    Lihat & Update
                </Link>
            ),
        },
    ]

    return (
        <AppLayout title="Rencana Aksi">
            <PageHeader
                title="Rencana Aksi"
                description="Pantau dan perbarui progress rencana aksi mitigasi risiko & finding."
                breadcrumbs={[
                    { label: 'Beranda', href: route('dashboard') },
                    { label: 'Rencana Aksi' },
                ]}
                actions={
                    <Link href={'#'} style={btnPrimary}>
                        <Plus size={14} /> Tambah
                    </Link>
                }
            />

            <div style={{ padding: '20px 32px' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 14,
                        marginBottom: 18,
                    }}
                >
                    <StatCard label="Open"        value={summary.open        ?? counts.open}        icon={ListTodo}      accent="var(--blue-600)" />
                    <StatCard label="In Progress" value={summary.in_progress ?? counts.in_progress} icon={Loader2}       accent="var(--gold-500)" />
                    <StatCard label="Overdue"     value={summary.overdue     ?? counts.overdue}     icon={AlertTriangle} accent="#b8392a" />
                    <StatCard label="Completed"   value={summary.completed   ?? counts.completed}   icon={CheckCircle2}  accent="var(--green-600)" />
                </div>

                <div style={{ ...cardBase, padding: 0, overflow: 'hidden' }}>
                    <Toolbar
                        searchPlaceholder="Cari judul rencana aksi…"
                        searchValue={search}
                        onSearch={(v) => setSearch(v)}
                        filters={sumberChips}
                        right={
                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value)
                                    applyFilter({ status: e.target.value })
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
                        }
                        count={data.length}
                        countLabel="rencana"
                    />
                    <DataTable columns={columns} data={data} />
                </div>

                {plans?.links && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
                        {plans.links.map((link, i) => (
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
