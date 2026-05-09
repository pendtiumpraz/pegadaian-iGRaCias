import { useState, useMemo } from 'react'
import { Link, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { Plus, RefreshCw, Eye, Building2, Activity, AlertOctagon, Send } from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import StatCard from '@/Components/StatCard'
import Badge from '@/Components/Badge'
import DataTable from '@/Components/DataTable'
import Tag from '@/Components/Tag'
import Toolbar from '@/Components/Toolbar'

const JENIS_OPTIONS = [
    { value: '',                      label: 'Semua Jenis' },
    { value: 'undang_undang',         label: 'Undang-Undang' },
    { value: 'peraturan_pemerintah',  label: 'Peraturan Pemerintah' },
    { value: 'peraturan_ojk',         label: 'Peraturan OJK' },
    { value: 'surat_edaran_bi',       label: 'Surat Edaran BI' },
    { value: 'lainnya',               label: 'Lainnya' },
]

const STATUS_OPTIONS = [
    { value: '',           label: 'Semua Status' },
    { value: 'active',     label: 'Active' },
    { value: 'superseded', label: 'Superseded' },
    { value: 'revoked',    label: 'Revoked' },
]

const JENIS_LABEL = {
    undang_undang:        'UU',
    peraturan_pemerintah: 'PP',
    peraturan_ojk:        'POJK',
    surat_edaran_bi:      'SEBI',
    lainnya:              'Lainnya',
}

const JENIS_TONE = {
    undang_undang:        'blue',
    peraturan_pemerintah: 'gold',
    peraturan_ojk:        'green',
    surat_edaran_bi:      'amber',
    lainnya:              'neutral',
}

const cardStyle = {
    background: 'var(--paper)',
    border: '1px solid var(--ink-200)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
}

const btnPrimary = {
    background: 'var(--green-700)',
    color: '#fff',
    padding: '8px 14px',
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
    padding: '8px 12px',
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
    color: 'var(--ink-800)',
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

const btnDanger = {
    background: 'transparent',
    color: '#b8392a',
    padding: '4px 10px',
    borderRadius: 6,
    border: '1px solid var(--red-100)',
    cursor: 'pointer',
    fontSize: 11.5,
    fontWeight: 600,
}

const selectStyle = {
    padding: '8px 12px',
    border: '1px solid var(--ink-300)',
    borderRadius: 8,
    background: '#fff',
    fontSize: 13,
    color: 'var(--ink-800)',
    outline: 'none',
}

function GapChip({ gap }) {
    const n = Number(gap ?? 0)
    let bg, fg
    if (n === 0) {
        bg = 'var(--green-100)'; fg = 'var(--green-800)'
    } else if (n <= 15) {
        bg = 'var(--gold-100)'; fg = '#7a4f0a'
    } else {
        bg = 'var(--red-100)'; fg = '#8b261b'
    }
    return (
        <span
            className="mono"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 36,
                height: 24,
                padding: '0 8px',
                borderRadius: 6,
                background: bg,
                color: fg,
                fontWeight: 700,
                fontSize: 11.5,
            }}
        >
            {n}%
        </span>
    )
}

export default function RegulasiIndex({ regulations, filters = {} }) {
    const [search, setSearch] = useState(filters.search ?? '')
    const [jenis, setJenis]   = useState(filters.jenis  ?? '')
    const [status, setStatus] = useState(filters.status ?? '')

    function applyFilter(next = {}) {
        router.get(
            route('regulations.index'),
            { search, jenis, status, ...next },
            { preserveState: true, replace: true },
        )
    }

    function handleDelete(id) {
        if (!confirm('Hapus regulasi ini?')) return
        router.delete(route('regulations.destroy', id))
    }

    const rows = regulations?.data ?? []

    // Compute KPI summary
    const summary = useMemo(() => {
        const termonitor = rows.length
        const active = rows.filter(r => r.status === 'active').length
        const totalGap = rows.reduce((s, r) => s + (Number(r.compliance_gap ?? 0)), 0)
        const compliance = termonitor === 0 ? 100 : Math.max(0, 100 - Math.round(totalGap / termonitor))
        const pelaporan = rows.filter(r => r.status === 'active').length
        return { termonitor, compliance, totalGap, pelaporan }
    }, [rows])

    const columns = [
        {
            key: 'nomor_regulasi',
            label: 'Nomor',
            width: 180,
            render: (_, r) => (
                <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>
                    {r.nomor_regulasi}
                </span>
            ),
        },
        {
            key: 'judul',
            label: 'Judul',
            render: (_, r) => (
                <div>
                    <div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{r.judul}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-600)', marginTop: 2 }}>
                        {r.penerbit ?? '—'}
                    </div>
                </div>
            ),
        },
        {
            key: 'jenis',
            label: 'Jenis',
            width: 110,
            render: (v) => (
                <Tag tone={JENIS_TONE[v] ?? 'neutral'}>
                    {JENIS_LABEL[v] ?? v ?? '—'}
                </Tag>
            ),
        },
        {
            key: 'tanggal_berlaku',
            label: 'Berlaku',
            width: 120,
            render: (v) => (
                <span className="mono" style={{ fontSize: 12 }}>
                    {v
                        ? new Date(v).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                          })
                        : '—'}
                </span>
            ),
        },
        {
            key: 'compliance_gap',
            label: 'Gap',
            width: 80,
            align: 'center',
            render: (v) => <GapChip gap={v ?? 0} />,
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
            width: 200,
            render: (_, row) => (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Link href={route('regulations.show', row.id)} style={btnSmall}>Lihat</Link>
                    <Link href={route('regulations.edit', row.id)} style={btnSmall}>Edit</Link>
                    <button onClick={() => handleDelete(row.id)} style={btnDanger}>Hapus</button>
                </div>
            ),
        },
    ]

    return (
        <AppLayout title="Regulasi">
            <PageHeader
                title="Regulasi"
                description="Memastikan kepatuhan terhadap regulasi internal dan eksternal melalui regulatory tracking."
                breadcrumbs={[
                    { label: 'Beranda', href: route('dashboard') },
                    { label: 'Regulasi' },
                ]}
                actions={
                    <>
                        <button type="button" style={btnSecondary}>
                            <RefreshCw size={14} />
                            Sync Eksternal
                        </button>
                        <Link href={route('regulations.create')} style={btnPrimary}>
                            <Plus size={14} />
                            Tambah Regulasi
                        </Link>
                    </>
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
                    <StatCard
                        label="Regulasi Termonitor"
                        value={summary.termonitor}
                        sub="OJK · BI · Pemerintah"
                        accent="var(--green-600)"
                        icon={Eye}
                    />
                    <StatCard
                        label="Tingkat Kepatuhan"
                        value={`${summary.compliance}%`}
                        sub="rata-rata seluruh regulasi"
                        accent="var(--green-600)"
                        icon={Activity}
                    />
                    <StatCard
                        label="Gap Compliance"
                        value={summary.totalGap}
                        sub="point gap kumulatif"
                        accent="var(--gold-500)"
                        icon={AlertOctagon}
                    />
                    <StatCard
                        label="Pelaporan Aktif"
                        value={summary.pelaporan}
                        sub="regulasi berlaku"
                        accent="var(--blue-600)"
                        icon={Send}
                    />
                </div>

                {/* Toolbar inside card */}
                <div style={cardStyle}>
                    <Toolbar
                        searchPlaceholder="Cari regulasi (POJK, PBI, UU)…"
                        searchValue={search}
                        onSearch={setSearch}
                        right={
                            <>
                                <select
                                    value={jenis}
                                    onChange={(e) => { setJenis(e.target.value); applyFilter({ jenis: e.target.value }) }}
                                    style={selectStyle}
                                >
                                    {JENIS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                                <select
                                    value={status}
                                    onChange={(e) => { setStatus(e.target.value); applyFilter({ status: e.target.value }) }}
                                    style={selectStyle}
                                >
                                    {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                                <button onClick={() => applyFilter()} style={btnSecondary}>
                                    Cari
                                </button>
                            </>
                        }
                        count={rows.length}
                        countLabel="regulasi"
                    />

                    <DataTable columns={columns} data={rows} />
                </div>

                {/* Pagination */}
                {regulations?.links && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
                        {regulations.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                style={{
                                    padding: '6px 10px',
                                    borderRadius: 6,
                                    fontSize: 12.5,
                                    border: '1px solid var(--ink-200)',
                                    background: link.active ? 'var(--green-700)' : '#fff',
                                    color: link.active ? '#fff' : 'var(--ink-800)',
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
