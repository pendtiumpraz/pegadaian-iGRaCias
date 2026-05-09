import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { Plus, RefreshCw, TrendingUp, AlertCircle, AlertTriangle, Hourglass } from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import StatCard from '@/Components/StatCard'
import Badge from '@/Components/Badge'
import DataTable from '@/Components/DataTable'
import Tag from '@/Components/Tag'
import Toolbar from '@/Components/Toolbar'
import Sparkline from '@/Components/Sparkline'

const PERIODE_OPTIONS = [
    { value: '',          label: 'Semua' },
    { value: 'monthly',   label: 'Bulanan' },
    { value: 'quarterly', label: 'Triwulanan' },
    { value: 'annual',    label: 'Tahunan' },
]

const STATUS_OPTIONS = [
    { value: '',      label: 'Semua Status' },
    { value: 'green', label: 'Green' },
    { value: 'amber', label: 'Amber' },
    { value: 'red',   label: 'Red' },
]

const STATUS_BREACH_COLOR = {
    green: '#187c5b',
    amber: '#c98114',
    red:   '#b8392a',
}

const STATUS_BADGE_LABEL = {
    green: 'Aman',
    amber: 'Pemantauan',
    red:   'Terlampaui',
}

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
}

const btnDanger = {
    background: '#fff',
    color: '#8b261b',
    padding: '4px 10px',
    borderRadius: 6,
    border: '1px solid #f0c9c1',
    cursor: 'pointer',
    fontSize: 11.5,
    fontWeight: 600,
}

function ThresholdInline({ green, amber, red }) {
    return (
        <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-700)' }}>
            <span style={{ color: '#0f4a37', fontWeight: 600 }}>≤{green ?? '?'}</span>
            <span style={{ color: 'var(--ink-400)', margin: '0 4px' }}>/</span>
            <span style={{ color: '#7a4f0a', fontWeight: 600 }}>≤{amber ?? '?'}</span>
            <span style={{ color: 'var(--ink-400)', margin: '0 4px' }}>/</span>
            <span style={{ color: '#8b261b', fontWeight: 600 }}>&gt;{red ?? amber ?? '?'}</span>
        </span>
    )
}

export default function KriIndex({ kris, filters = {}, summary = {} }) {
    const [search, setSearch]     = useState(filters.search     ?? '')
    const [periode, setPeriode]   = useState(filters.periode    ?? '')
    const [statusKri, setStatus]  = useState(filters.status_kri ?? '')

    const data = kris?.data ?? []

    function applyFilter(next = {}) {
        router.get(
            route('kri.index'),
            {
                search:     next.search     ?? search,
                periode:    next.periode    ?? periode,
                status_kri: next.status_kri ?? statusKri,
            },
            { preserveState: true, replace: true },
        )
    }

    function refresh() {
        router.reload({ preserveScroll: true })
    }

    function handleDelete(id) {
        if (!confirm('Hapus KRI ini?')) return
        router.delete(route('kri.destroy', id))
    }

    /* Summary fallback */
    const counts = data.reduce(
        (acc, k) => {
            const s = (k.status_kri || '').toLowerCase()
            if (s === 'green' || s === 'amber' || s === 'red') acc[s]++
            else acc.pending++
            return acc
        },
        { green: 0, amber: 0, red: 0, pending: 0 },
    )

    /* periode filter chips */
    const periodeChips = PERIODE_OPTIONS.map((p) => ({
        label: p.label,
        value: p.value,
        active: (periode || '') === p.value,
        onClick: () => {
            setPeriode(p.value)
            applyFilter({ periode: p.value })
        },
    }))

    const lastUpdateLabel = (() => {
        const updates = data.map((k) => k.last_update).filter(Boolean).sort().reverse()
        if (!updates.length) return '—'
        return new Date(updates[0]).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })
    })()

    const columns = [
        {
            key: 'nama_kri',
            label: 'Nama KRI',
            render: (_, r) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{r.nama_kri}</div>
                    {r.deskripsi && (
                        <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 2 }}>
                            {r.deskripsi.slice(0, 60)}{r.deskripsi.length > 60 ? '…' : ''}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'risk',
            label: 'Risk Terkait',
            width: 160,
            render: (_, r) => r.risk?.kode_risiko
                ? (
                    <Tag tone="mono">
                        {r.risk.kode_risiko}
                    </Tag>
                )
                : <span style={{ color: 'var(--ink-500)' }}>—</span>,
        },
        {
            key: 'satuan',
            label: 'Satuan',
            width: 90,
            render: (v) => <span style={{ fontSize: 12.5 }}>{v ?? '—'}</span>,
        },
        {
            key: 'nilai_aktual',
            label: 'Nilai Aktual',
            width: 110,
            render: (v, r) => {
                const status = (r.status_kri || '').toLowerCase()
                const color = STATUS_BREACH_COLOR[status] || 'var(--ink-900)'
                return (
                    <span className="mono" style={{ fontSize: 14, fontWeight: 700, color }}>
                        {v ?? '—'}
                    </span>
                )
            },
        },
        {
            key: 'threshold',
            label: 'Threshold (G / A / R)',
            width: 200,
            render: (_, r) => (
                <ThresholdInline
                    green={r.threshold_green}
                    amber={r.threshold_amber}
                    red={r.threshold_red}
                />
            ),
        },
        {
            key: 'sparkline',
            label: 'Tren 7 periode',
            width: 130,
            render: (_, r) => {
                const trend = Array.isArray(r.trend) && r.trend.length > 1
                    ? r.trend.slice(-7).map(Number).filter((n) => !Number.isNaN(n))
                    : []
                if (trend.length < 2) {
                    return <span style={{ fontSize: 11.5, color: 'var(--ink-400)' }}>—</span>
                }
                const status = (r.status_kri || '').toLowerCase()
                const color = STATUS_BREACH_COLOR[status] || '#187c5b'
                return <Sparkline data={trend} width={110} height={32} color={color} />
            },
        },
        {
            key: 'status_kri',
            label: 'Status',
            width: 130,
            render: (v) => v ? <Badge label={STATUS_BADGE_LABEL[v] ?? v} tone={v === 'green' ? 'success' : v === 'amber' ? 'warning' : 'danger'} /> : '—',
        },
        {
            key: 'periode',
            label: 'Periode',
            width: 110,
            render: (v) => v ? <span style={{ textTransform: 'capitalize', fontSize: 12.5 }}>{v}</span> : '—',
        },
        {
            key: 'last_update',
            label: 'Last Update',
            width: 120,
            render: (v) => (
                <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-600)' }}>
                    {v ? new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Aksi',
            width: 200,
            render: (_, r) => (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Link href={route('kri.show', r.id)} style={btnSmall}>Lihat</Link>
                    <Link href={route('kri.edit', r.id)} style={btnSmall}>Edit</Link>
                    <button onClick={() => handleDelete(r.id)} style={btnDanger}>Hapus</button>
                </div>
            ),
        },
    ]

    return (
        <AppLayout title="Key Risk Indicators">
            <PageHeader
                title="Key Risk Indicators"
                description={`${data.length} indikator termonitor real-time · pembaruan terakhir ${lastUpdateLabel} WIB`}
                breadcrumbs={[
                    { label: 'Beranda', href: route('dashboard') },
                    { label: 'Key Risk Indicator' },
                ]}
                actions={
                    <>
                        <button type="button" onClick={refresh} style={btnSecondary}>
                            <RefreshCw size={14} /> Refresh
                        </button>
                        <Link href={route('kri.create')} style={btnPrimary}>
                            <Plus size={14} /> Tambah KRI
                        </Link>
                    </>
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
                    <StatCard label="Green"          value={summary.green   ?? counts.green}   icon={TrendingUp}   accent="#187c5b" />
                    <StatCard label="Amber"          value={summary.amber   ?? counts.amber}   icon={AlertCircle}  accent="#c98114" />
                    <StatCard label="Red"            value={summary.red     ?? counts.red}     icon={AlertTriangle} accent="#b8392a" />
                    <StatCard label="Pending Update" value={summary.pending ?? counts.pending} icon={Hourglass}    accent="var(--ink-500)" />
                </div>

                <div style={{ ...cardBase, padding: 0, overflow: 'hidden' }}>
                    <Toolbar
                        searchPlaceholder="Cari nama KRI…"
                        searchValue={search}
                        onSearch={(v) => setSearch(v)}
                        filters={periodeChips}
                        right={
                            <select
                                value={statusKri}
                                onChange={(e) => {
                                    setStatus(e.target.value)
                                    applyFilter({ status_kri: e.target.value })
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
                        countLabel="KRI"
                    />
                    <DataTable columns={columns} data={data} />
                </div>

                {kris?.links && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
                        {kris.links.map((link, i) => (
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
