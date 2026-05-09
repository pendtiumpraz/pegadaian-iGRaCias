import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { TrendingDown, TrendingUp, Banknote, Scale, Plus, Download } from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import StatCard from '@/Components/StatCard'
import SectionTitle from '@/Components/SectionTitle'
import Badge from '@/Components/Badge'
import DataTable from '@/Components/DataTable'
import Toolbar from '@/Components/Toolbar'
import Tag from '@/Components/Tag'
import HBar from '@/Components/HBar'

const KATEGORI_OPTIONS = [
    { value: '',                  label: 'Semua Kategori (Basel)' },
    { value: 'internal_fraud',     label: 'Internal Fraud' },
    { value: 'external_fraud',     label: 'External Fraud' },
    { value: 'employment',         label: 'Employment Practices' },
    { value: 'clients_products',   label: 'Clients/Products' },
    { value: 'physical_damage',    label: 'Damage Physical Assets' },
    { value: 'business_disruption', label: 'Business Disruption' },
    { value: 'execution_delivery', label: 'Execution/Delivery' },
]

const STATUS_OPTIONS = [
    { value: '',           label: 'Semua Status' },
    { value: 'identified', label: 'Identified' },
    { value: 'assessed',   label: 'Assessed' },
    { value: 'recovery',   label: 'Recovery' },
    { value: 'recovered',  label: 'Recovered' },
    { value: 'litigation', label: 'Litigation' },
    { value: 'closed',     label: 'Closed' },
]

const BASEL_KATEGORI_LABEL = {
    internal_fraud:      'Internal Fraud',
    external_fraud:      'External Fraud',
    employment:          'Employment Practices',
    clients_products:    'Clients/Products',
    physical_damage:     'Damage Physical Assets',
    business_disruption: 'Business Disruption',
    execution_delivery:  'Execution/Delivery',
    operasional:         'Operasional',
    fraud:               'Fraud',
    hukum:               'Hukum',
    teknologi:           'Teknologi',
    eksternal:           'Eksternal',
}

function formatDateMono(v) {
    if (!v) return '—'
    return new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatIDR(v) {
    if (v == null || v === '') return '—'
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(v))
}

function formatIDRShort(v) {
    const n = Number(v ?? 0)
    if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(2)} M`
    if (n >= 1_000_000)     return `Rp ${(n / 1_000_000).toFixed(0)} jt`
    if (n >= 1_000)         return `Rp ${(n / 1_000).toFixed(0)} rb`
    return `Rp ${n}`
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

export default function LossIndex({ losses, filters = {}, summary = {}, baselDistribution = [], topUnits = [] }) {
    const [search, setSearch]     = useState(filters.search   ?? '')
    const [kategori, setKategori] = useState(filters.kategori ?? '')
    const [status, setStatus]     = useState(filters.status   ?? '')

    function applyFilter(extra = {}) {
        router.get(route('loss.index'),
            { search, kategori, status, ...extra },
            { preserveState: true, replace: true })
    }

    function handleSearchEnter(e) {
        if (e.key === 'Enter') applyFilter()
    }

    function handleDelete(id) {
        if (!confirm('Hapus loss event ini?')) return
        router.delete(route('loss.destroy', id))
    }

    const rows = losses?.data ?? []

    // Default Basel distribution if not provided by controller
    const baselRows = baselDistribution.length ? baselDistribution : [
        { kategori: 'Internal Fraud',       amount: 1_420_000_000, pct: 43, color: '#b8392a' },
        { kategori: 'External Fraud',       amount:   980_000_000, pct: 30, color: '#c98114' },
        { kategori: 'Employment Practices', amount:   210_000_000, pct: 6,  color: '#7a4f0a' },
        { kategori: 'Clients/Products',     amount:   450_000_000, pct: 14, color: '#2e5a8a' },
        { kategori: 'Damage Physical Assets', amount: 320_000_000, pct: 10, color: '#5a8a72' },
        { kategori: 'Business Disruption',  amount:    90_000_000, pct: 3,  color: 'var(--gold-500)' },
        { kategori: 'Execution/Delivery',   amount:   140_000_000, pct: 4,  color: 'var(--green-600)' },
    ]
    const maxBaselPct = Math.max(...baselRows.map(b => b.pct), 1)

    const topUnitsRows = topUnits.length ? topUnits : [
        { unit: 'Kanwil III — Jawa Barat',       amount: 1_250_000_000 },
        { unit: 'Kanwil II — Jakarta',           amount:   850_000_000 },
        { unit: 'KC Surabaya Tunjungan',         amount:   487_000_000 },
        { unit: 'KC Medan Putri Hijau',          amount:   215_000_000 },
        { unit: 'KC Jakarta Sudirman',           amount:   145_000_000 },
    ]
    const maxTopUnitAmount = Math.max(...topUnitsRows.map(u => Number(u.amount) || 0), 1)

    const columns = [
        {
            key: 'nomor_loss',
            label: 'Nomor',
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
            width: 170,
            render: (v) => v ? <Tag>{BASEL_KATEGORI_LABEL[v] ?? v}</Tag> : '—',
        },
        {
            key: 'jumlah_kerugian',
            label: 'Loss Amount',
            width: 160,
            align: 'right',
            render: (v, row) => (
                <span className="mono" style={{ fontWeight: 700, color: '#b8392a' }}>
                    {formatIDR(v)}
                    {row.mata_uang && row.mata_uang !== 'IDR' ? ` (${row.mata_uang})` : ''}
                </span>
            ),
        },
        {
            key: 'tanggal_kejadian',
            label: 'Tanggal',
            width: 110,
            render: (v) => <span className="mono" style={{ fontSize: 12 }}>{formatDateMono(v)}</span>,
        },
        {
            key: 'status',
            label: 'Status',
            width: 130,
            render: (v) => <Badge status={v} />,
        },
        {
            key: 'recovery',
            label: 'Recovery',
            width: 160,
            render: (_, row) => {
                const total = Number(row.jumlah_kerugian) || 0
                const rec = Number(row.recovered_amount) || 0
                const pct = total > 0 ? Math.min(100, (rec / total) * 100) : 0
                const color = pct >= 80 ? 'var(--green-600)'
                            : pct >= 40 ? 'var(--gold-500)'
                            : '#b8392a'
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                            <HBar value={pct} max={100} color={color} height={6} />
                        </div>
                        <span className="mono" style={{ fontSize: 11, fontWeight: 600, minWidth: 30 }}>{pct.toFixed(0)}%</span>
                    </div>
                )
            },
        },
        {
            key: 'actions',
            label: 'Aksi',
            width: 160,
            render: (_, row) => (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Link href={route('loss.show', row.id)} style={btnSmall}>Lihat</Link>
                    <Link href={route('loss.edit', row.id)} style={btnSmall}>Edit</Link>
                    <button onClick={() => handleDelete(row.id)} style={btnDanger}>Hapus</button>
                </div>
            ),
        },
    ]

    return (
        <AppLayout title="Loss Events" contentPadding="none">
            <PageHeader
                title="Loss Events"
                description="Pencatatan kerugian fraud, bencana, dan tuntutan hukum untuk pemodelan operational risk capital."
                breadcrumbs={[
                    { label: 'Beranda', href: route('dashboard') },
                    { label: 'Loss Events' },
                ]}
                actions={
                    <>
                        <button type="button" style={btnSecondary}>
                            <Download size={14} /> Ekspor Basel
                        </button>
                        <Link href={route('loss.create')} style={btnPrimary}>
                            <Plus size={14} /> Tambah Loss
                        </Link>
                    </>
                }
            />

            <div style={{ padding: '20px 32px' }}>
                {/* KPI strip — 4 cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 14,
                    marginBottom: 18,
                }}>
                    <StatCard
                        label="Total Loss YTD"
                        value={summary.total_amount != null ? formatIDRShort(summary.total_amount) : '—'}
                        sub={`${summary.total_count ?? 0} kejadian`}
                        icon={TrendingDown}
                        accent="#b8392a"
                    />
                    <StatCard
                        label="Recovery Rate"
                        value={summary.recovery_rate_pct != null ? `${summary.recovery_rate_pct}%` : '—'}
                        sub={summary.recovered_amount != null ? `${formatIDRShort(summary.recovered_amount)} ter-recover` : 'Recovery progress'}
                        icon={TrendingUp}
                        accent="var(--green-600)"
                    />
                    <StatCard
                        label="Net Loss"
                        value={summary.net_amount != null ? formatIDRShort(summary.net_amount) : '—'}
                        sub="setelah recovery"
                        icon={Banknote}
                        accent="var(--gold-500)"
                    />
                    <StatCard
                        label="Litigation Active"
                        value={summary.litigation_count ?? 0}
                        sub="kasus berjalan"
                        icon={Scale}
                        accent="#2e5a8a"
                    />
                </div>

                {/* 2-card row: Basel + Top Units */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.4fr 1fr',
                    gap: 14,
                    marginBottom: 18,
                }}>
                    <div style={cardStyle}>
                        <SectionTitle title="Distribusi per Basel Kategori" hint="Loss event 12 bulan terakhir" />
                        {baselRows.map((b, i) => (
                            <div key={i} style={{ marginBottom: 12 }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: 13,
                                    marginBottom: 5,
                                }}>
                                    <span style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{b.kategori}</span>
                                    <span className="mono" style={{ fontWeight: 600, color: 'var(--ink-700)' }}>
                                        {formatIDRShort(b.amount)}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ flex: 1 }}>
                                        <HBar value={b.pct} max={maxBaselPct} color={b.color} height={8} />
                                    </div>
                                    <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-500)', minWidth: 32 }}>
                                        {b.pct}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={cardStyle}>
                        <SectionTitle title="Top 5 Unit Kerja Loss" hint="Berdasarkan total nilai kerugian" />
                        {topUnitsRows.slice(0, 5).map((u, i) => {
                            const amt = Number(u.amount) || 0
                            return (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: '10px 0',
                                    borderBottom: i < topUnitsRows.slice(0, 5).length - 1 ? '1px solid var(--ink-100)' : 'none',
                                }}>
                                    <div className="mono" style={{
                                        width: 26, height: 26, borderRadius: 6,
                                        background: 'var(--ink-100)',
                                        color: 'var(--ink-700)',
                                        fontSize: 12,
                                        fontWeight: 700,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>{i + 1}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-900)' }}>
                                            {u.unit}
                                        </div>
                                        <div style={{ marginTop: 4 }}>
                                            <HBar value={amt} max={maxTopUnitAmount} color="#b8392a" height={5} />
                                        </div>
                                    </div>
                                    <span className="mono" style={{ fontSize: 12.5, fontWeight: 700, color: '#b8392a' }}>
                                        {formatIDRShort(amt)}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Toolbar + Table */}
                <div style={{
                    background: '#fff',
                    border: '1px solid var(--ink-200)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                }}>
                    <Toolbar
                        searchPlaceholder="Cari nomor / judul loss…"
                        searchValue={search}
                        onSearch={setSearch}
                        right={
                            <>
                                <select value={kategori} onChange={e => { setKategori(e.target.value); applyFilter({ kategori: e.target.value }) }} style={filterSelect}>
                                    {KATEGORI_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                                <select value={status} onChange={e => { setStatus(e.target.value); applyFilter({ status: e.target.value }) }} style={filterSelect}>
                                    {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </>
                        }
                        count={rows.length}
                        countLabel="kejadian"
                    />
                    <div onKeyDown={handleSearchEnter}>
                        <DataTable columns={columns} data={rows} />
                    </div>
                </div>

                {/* Pagination */}
                {losses?.links && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
                        {losses.links.map((link, i) => (
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
            </div>
        </AppLayout>
    )
}
