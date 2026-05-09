import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { AlertTriangle, Search as SearchIcon, ShieldCheck, Activity, Plus, AlertOctagon } from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import StatCard from '@/Components/StatCard'
import SectionTitle from '@/Components/SectionTitle'
import Badge from '@/Components/Badge'
import DataTable from '@/Components/DataTable'
import Toolbar from '@/Components/Toolbar'
import Tag from '@/Components/Tag'
import Avatar from '@/Components/Avatar'
import HBar from '@/Components/HBar'
import Sparkline from '@/Components/Sparkline'

const TABS = [
    { id: 'all',         label: 'Semua' },
    { id: 'wbs',         label: 'WBS' },
    { id: 'gratifikasi', label: 'Gratifikasi' },
    { id: 'coi',         label: 'CoI' },
    { id: 'helpdesk',    label: 'Helpdesk' },
]

const KATEGORI_OPTIONS = [
    { value: '',            label: 'Semua Kategori' },
    { value: 'operasional', label: 'Operasional' },
    { value: 'it',          label: 'IT' },
    { value: 'sdm',         label: 'SDM' },
    { value: 'eksternal',   label: 'Eksternal' },
]

const SEVERITY_OPTIONS = [
    { value: '',         label: 'Semua Severity' },
    { value: 'low',      label: 'Low' },
    { value: 'medium',   label: 'Medium' },
    { value: 'high',     label: 'High' },
    { value: 'critical', label: 'Critical' },
]

const STATUS_OPTIONS = [
    { value: '',              label: 'Semua Status' },
    { value: 'reported',      label: 'Reported' },
    { value: 'investigating', label: 'Investigating' },
    { value: 'resolved',      label: 'Resolved' },
    { value: 'closed',        label: 'Closed' },
]

const SEVERITY_LABEL = {
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi',
    critical: 'Tinggi',
}

function formatDateMono(v) {
    if (!v) return '—'
    return new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const btnPrimary = {
    background: 'var(--green-700)',
    color: '#fff',
    padding: '8px 14px',
    borderRadius: 8,
    border: 'none',
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
    color: 'var(--ink-700)',
    padding: '8px 14px',
    borderRadius: 8,
    border: '1px solid var(--ink-200)',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: 13,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
}

const btnSmall = {
    background: 'var(--ink-50)',
    color: 'var(--ink-700)',
    padding: '4px 8px',
    borderRadius: 6,
    border: '1px solid var(--ink-200)',
    cursor: 'pointer',
    fontSize: 11.5,
    fontWeight: 500,
    textDecoration: 'none',
}

const btnDanger = {
    background: 'transparent',
    color: '#b8392a',
    padding: '4px 8px',
    borderRadius: 6,
    border: '1px solid #f4cfc7',
    cursor: 'pointer',
    fontSize: 11.5,
    fontWeight: 500,
}

const filterSelect = {
    padding: '8px 12px',
    border: '1px solid var(--ink-200)',
    borderRadius: 8,
    background: '#fff',
    fontSize: 13,
    color: 'var(--ink-700)',
    outline: 'none',
}

const cardStyle = {
    background: '#fff',
    border: '1px solid var(--ink-200)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 24px',
}

export default function InsidenIndex({ incidents, filters = {}, summary = {}, channelStats = {} }) {
    const [tab, setTab]           = useState(filters.tab ?? 'all')
    const [search, setSearch]     = useState(filters.search   ?? '')
    const [kategori, setKategori] = useState(filters.kategori ?? '')
    const [severity, setSeverity] = useState(filters.severity ?? '')
    const [status, setStatus]     = useState(filters.status   ?? '')

    function applyFilter(extra = {}) {
        router.get(
            route('incidents.index'),
            { search, kategori, severity, status, ...extra },
            { preserveState: true, replace: true },
        )
    }

    function handleSearchEnter(e) {
        if (e.key === 'Enter') applyFilter()
    }

    function handleDelete(id) {
        if (!confirm('Hapus insiden ini?')) return
        router.delete(route('incidents.destroy', id))
    }

    const rows = incidents?.data ?? []

    const columns = [
        {
            key: 'nomor_insiden',
            label: 'No Insiden',
            width: 130,
            render: (v) => <span className="mono" style={{ fontSize: 11.5, fontWeight: 600 }}>{v ?? '—'}</span>,
        },
        {
            key: 'judul',
            label: 'Judul',
            render: (_, row) => (
                <div>
                    <div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{row.judul}</div>
                    {row.unit_kerja && (
                        <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 2 }}>{row.unit_kerja}</div>
                    )}
                </div>
            ),
        },
        {
            key: 'kategori',
            label: 'Kategori',
            width: 130,
            render: (v) => v ? <Tag>{String(v).toUpperCase()}</Tag> : '—',
        },
        {
            key: 'severity',
            label: 'Severity',
            width: 100,
            render: (v) => v ? <Badge status={SEVERITY_LABEL[String(v).toLowerCase()] ?? v} /> : '—',
        },
        {
            key: 'status',
            label: 'Status',
            width: 130,
            render: (v) => <Badge status={v} />,
        },
        {
            key: 'tanggal_kejadian',
            label: 'Tanggal',
            width: 110,
            render: (v) => <span className="mono" style={{ fontSize: 12 }}>{formatDateMono(v)}</span>,
        },
        {
            key: 'pelapor',
            label: 'Pelapor',
            width: 150,
            render: (_, row) => {
                if (row.is_anonymous) {
                    return (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
                            <span style={{
                                width: 22, height: 22, borderRadius: 22,
                                background: 'var(--ink-200)', color: 'var(--ink-600)',
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: 11,
                            }}>?</span>
                            <span style={{ color: 'var(--ink-600)', fontStyle: 'italic' }}>Anonim</span>
                        </span>
                    )
                }
                const name = row.reporter?.name
                if (!name) return '—'
                return (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <Avatar name={name} size={22} />
                        <span style={{ fontSize: 12.5 }}>{name}</span>
                    </span>
                )
            },
        },
        {
            key: 'pic',
            label: 'PIC',
            width: 150,
            render: (_, row) => {
                const name = row.pic?.name
                if (!name) return '—'
                return (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <Avatar name={name} size={22} />
                        <span style={{ fontSize: 12.5 }}>{name}</span>
                    </span>
                )
            },
        },
        {
            key: 'actions',
            label: 'Aksi',
            width: 130,
            render: (_, row) => (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Link href={route('incidents.show', row.id)} style={btnSmall}>Lihat</Link>
                    <button onClick={() => handleDelete(row.id)} style={btnDanger}>Hapus</button>
                </div>
            ),
        },
    ]

    const wbsTrend = channelStats.wbs_trend ?? [12, 18, 22, 19, 24, 28, 32, 38, 35, 42, 39, 42]
    const gratifikasiTop = channelStats.gratifikasi_top ?? [
        { kategori: 'Parsel hari raya',   count: 42 },
        { kategori: 'Jamuan makan',        count: 31 },
        { kategori: 'Cinderamata vendor',  count: 18 },
        { kategori: 'Tiket undangan',      count: 12 },
    ]
    const helpdeskBreakdown = channelStats.helpdesk_breakdown ?? [
        { label: 'Akses',      count: 14, color: '#2e5a8a' },
        { label: 'Bug',        count: 7,  color: '#b8392a' },
        { label: 'Permintaan', count: 4,  color: 'var(--gold-500)' },
        { label: 'Konsultasi', count: 2,  color: 'var(--green-600)' },
    ]
    const maxGratifikasi = Math.max(...gratifikasiTop.map(g => g.count), 1)
    const maxHelpdesk = Math.max(...helpdeskBreakdown.map(h => h.count), 1)

    return (
        <AppLayout title="Manajemen Insiden" contentPadding="none">
            <PageHeader
                title="Manajemen Insiden"
                description="Pencatatan dan penanganan insiden lintas kanal: WBS, gratifikasi, benturan kepentingan, helpdesk, dan pelaporan bencana."
                breadcrumbs={[{ label: 'Beranda', href: route('dashboard') }, { label: 'Manajemen Insiden' }]}
                actions={
                    <>
                        <button type="button" style={btnSecondary}>
                            <AlertOctagon size={14} /> Lapor Anonim
                        </button>
                        <Link href={route('incidents.create')} style={btnPrimary}>
                            <Plus size={14} /> Lapor Insiden
                        </Link>
                    </>
                }
                tabs={TABS}
                activeTab={tab}
                onTabChange={(t) => { setTab(t); applyFilter({ tab: t }) }}
            />

            <div style={{ padding: '20px 32px' }}>
                {/* KPI strip */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 14,
                    marginBottom: 18,
                }}>
                    <StatCard
                        label="Insiden Aktif"
                        value={summary.active ?? 0}
                        sub="sedang berjalan"
                        icon={AlertTriangle}
                        accent="var(--gold-500)"
                    />
                    <StatCard
                        label="Investigasi"
                        value={summary.investigating ?? 0}
                        sub="rata-rata 12 hari closing"
                        icon={SearchIcon}
                        accent="#2e5a8a"
                    />
                    <StatCard
                        label="WBS Tervalidasi"
                        value={summary.wbs_validated_pct != null ? `${summary.wbs_validated_pct}%` : '—'}
                        sub="bukan repetitive/spam"
                        icon={ShieldCheck}
                        accent="var(--green-600)"
                    />
                    <StatCard
                        label="SLA Helpdesk"
                        value={summary.sla_helpdesk_pct != null ? `${summary.sla_helpdesk_pct}%` : '—'}
                        sub="response < 4 jam"
                        icon={Activity}
                        accent="var(--green-600)"
                    />
                </div>

                {/* Card with Toolbar + Table */}
                <div style={{
                    background: '#fff',
                    border: '1px solid var(--ink-200)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    marginBottom: 18,
                }}>
                    <Toolbar
                        searchPlaceholder="Cari nomor / judul insiden…"
                        searchValue={search}
                        onSearch={setSearch}
                        right={
                            <>
                                <select value={kategori} onChange={e => { setKategori(e.target.value); applyFilter({ kategori: e.target.value }) }} style={filterSelect}>
                                    {KATEGORI_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                                <select value={severity} onChange={e => { setSeverity(e.target.value); applyFilter({ severity: e.target.value }) }} style={filterSelect}>
                                    {SEVERITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                                <select value={status} onChange={e => { setStatus(e.target.value); applyFilter({ status: e.target.value }) }} style={filterSelect}>
                                    {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </>
                        }
                        count={rows.length}
                        countLabel="insiden"
                    />
                    <div onKeyDown={handleSearchEnter}>
                        <DataTable columns={columns} data={rows} />
                    </div>
                </div>

                {/* Pagination */}
                {incidents?.links && (
                    <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
                        {incidents.links.map((link, i) => (
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
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

                {/* 3-card row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                    {/* WBS Trend */}
                    <div style={cardStyle}>
                        <SectionTitle title="Pertumbuhan WBS Bulanan" hint="12 bulan terakhir" />
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 12 }}>
                            <div className="display mono" style={{ fontSize: 32, color: 'var(--green-700)', lineHeight: 1 }}>
                                {wbsTrend[wbsTrend.length - 1]}
                            </div>
                            <Sparkline data={wbsTrend} width={120} height={36} color="var(--green-600)" />
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--ink-500)', marginBottom: 12 }}>
                            laporan diterima · indikasi peningkatan kepercayaan
                        </div>
                        {wbsTrend.slice(-6).map((v, i) => {
                            const labels = ['Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei']
                            const max = Math.max(...wbsTrend, 1)
                            return (
                                <div key={i} style={{ marginBottom: 6 }}>
                                    <HBar
                                        value={v}
                                        max={max}
                                        color="var(--green-600)"
                                        height={6}
                                        label={labels[i]}
                                        valueLabel={v}
                                    />
                                </div>
                            )
                        })}
                    </div>

                    {/* Top Kategori Gratifikasi */}
                    <div style={cardStyle}>
                        <SectionTitle title="Top Kategori Gratifikasi" hint="Bulan ini" />
                        {gratifikasiTop.map((g, i) => (
                            <div key={i} style={{ marginBottom: 10 }}>
                                <HBar
                                    value={g.count}
                                    max={maxGratifikasi}
                                    color={i === 0 ? 'var(--gold-500)' : 'var(--green-600)'}
                                    height={8}
                                    label={g.kategori}
                                    valueLabel={g.count}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Helpdesk Tickets */}
                    <div style={cardStyle}>
                        <SectionTitle title="Helpdesk Tickets" hint="Real-time" />
                        <div className="display mono" style={{
                            fontSize: 32,
                            color: '#2e5a8a',
                            lineHeight: 1,
                            marginBottom: 4,
                        }}>
                            {helpdeskBreakdown.reduce((s, h) => s + h.count, 0)}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--ink-500)', marginBottom: 14 }}>
                            tiket terbuka
                        </div>
                        {helpdeskBreakdown.map((h, i) => (
                            <div key={i} style={{ marginBottom: 10 }}>
                                <HBar
                                    value={h.count}
                                    max={maxHelpdesk}
                                    color={h.color}
                                    height={8}
                                    label={h.label}
                                    valueLabel={h.count}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
