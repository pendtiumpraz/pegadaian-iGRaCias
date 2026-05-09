import { useMemo, useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import {
    Shield,
    ShieldCheck,
    ShieldAlert,
    Activity,
    Plus,
    Download,
    Eye,
    Pencil,
    Trash2,
} from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import StatCard from '@/Components/StatCard'
import DataTable from '@/Components/DataTable'
import Tag from '@/Components/Tag'
import Toolbar from '@/Components/Toolbar'
import Avatar from '@/Components/Avatar'
import HBar from '@/Components/HBar'
import Badge from '@/Components/Badge'

/* ─────────────── helpers ─────────────── */

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
    gap: 4,
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
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
}

const TYPE_OPTIONS = [
    { value: '',          label: 'Semua' },
    { value: 'preventif', label: 'Preventif' },
    { value: 'deteksi',   label: 'Deteksi' },
    { value: 'korektif',  label: 'Korektif' },
]

function typeTone(t) {
    const v = String(t || '').toLowerCase()
    if (v.includes('preven')) return 'green'
    if (v.includes('detek') || v.includes('detect')) return 'gold'
    if (v.includes('korek') || v.includes('correct')) return 'amber'
    return 'mono'
}

function effectivenessTone(eff) {
    const n = Number(eff) || 0
    if (n >= 85) return 'var(--green-600)'
    if (n >= 70) return 'var(--gold-500)'
    return '#b8392a'
}

/* ─────────────── sample fallback ─────────────── */

const SAMPLE_ROWS = [
    { id: 's1', control_code: 'CTRL-OP-022', description: 'Approval matrix bertingkat di sistem core', type: 'Preventif', frequency: 'Real-time', automated: true,  effectiveness: 90, test_date: '2026-05-04', risk: { id: 1, risk_code: 'RSK-OPS-001' } },
    { id: 's2', control_code: 'CTRL-OP-014', description: 'Rekonsiliasi kas harian dengan dual control', type: 'Deteksi',   frequency: 'Harian',    automated: false, effectiveness: 84, test_date: '2026-05-02', risk: { id: 2, risk_code: 'RSK-OPS-014' } },
    { id: 's3', control_code: 'CTRL-CY-008', description: 'Multi-factor authentication wajib',         type: 'Preventif', frequency: 'Real-time', automated: true,  effectiveness: 92, test_date: '2026-05-03', risk: { id: 3, risk_code: 'RSK-CYB-008' } },
    { id: 's4', control_code: 'CTRL-CP-031', description: 'Auto-flag transaksi LTKT/LTKM ke PPATK',    type: 'Deteksi',   frequency: 'Harian',    automated: true,  effectiveness: 88, test_date: '2026-05-01', risk: { id: 4, risk_code: 'RSK-CMP-031' } },
    { id: 's5', control_code: 'CTRL-CR-019', description: 'Re-appraisal agunan setiap 6 bulan',        type: 'Deteksi',   frequency: 'Per 6 Bulan', automated: false, effectiveness: 78, test_date: '2026-04-28', risk: { id: 5, risk_code: 'RSK-CRD-019' } },
    { id: 's6', control_code: 'CTRL-LG-007', description: 'Privacy Impact Assessment untuk produk baru', type: 'Preventif', frequency: 'On-demand', automated: false, effectiveness: 80, test_date: '2026-04-30', risk: { id: 6, risk_code: 'RSK-LGL-007' } },
    { id: 's7', control_code: 'CTRL-OP-058', description: 'CCTV monitoring real-time pada area sensitif', type: 'Deteksi',   frequency: 'Real-time', automated: true,  effectiveness: 86, test_date: '2026-05-02', risk: { id: 7, risk_code: 'RSK-OPS-058' } },
    { id: 's8', control_code: 'CTRL-OP-045', description: 'Mandatory leave bagi pejabat operasional', type: 'Preventif', frequency: 'Tahunan',   automated: false, effectiveness: 75, test_date: '2026-04-27', risk: { id: 8, risk_code: 'RSK-OPS-045' } },
    { id: 's9', control_code: 'CTRL-RP-003', description: 'Crisis communication playbook',           type: 'Korektif',  frequency: 'On-demand', automated: false, effectiveness: 70, test_date: '2026-04-20', risk: { id: 9, risk_code: 'RSK-REP-003' } },
    { id: 's10', control_code: 'CTRL-CR-027', description: 'Re-rating debitur otomatis berbasis perilaku', type: 'Deteksi', frequency: 'Bulanan', automated: true, effectiveness: 82, test_date: '2026-05-02', risk: { id: 10, risk_code: 'RSK-CRD-027' } },
]

/* ─────────────── page ─────────────── */

export default function ControlIndex({ controls }) {
    const [search, setSearch] = useState('')
    const [type, setType]     = useState('')

    const rawData = controls?.data ?? []
    const data = rawData.length > 0 ? rawData : SAMPLE_ROWS
    const isFallback = rawData.length === 0

    const filtered = useMemo(() => {
        return data.filter((r) => {
            if (type) {
                const v = String(r.type || '').toLowerCase()
                if (!v.includes(type.toLowerCase())) return false
            }
            if (search) {
                const q = search.toLowerCase()
                const haystack = [
                    r.control_code,
                    r.description,
                    r.type,
                    r.frequency,
                    r.risk?.risk_code,
                    r.risk?.title,
                ].filter(Boolean).join(' ').toLowerCase()
                if (!haystack.includes(q)) return false
            }
            return true
        })
    }, [data, search, type])

    const stats = useMemo(() => {
        const total = data.length
        let active = 0
        let highEff = 0
        let needReview = 0
        const now = new Date()
        data.forEach((r) => {
            const eff = Number(r.effectiveness) || 0
            if (eff >= 70) active += 1
            if (eff >= 85) highEff += 1
            if (r.test_date) {
                const t = new Date(r.test_date)
                const monthsAgo = (now - t) / (1000 * 60 * 60 * 24 * 30)
                if (monthsAgo > 6) needReview += 1
            } else {
                needReview += 1
            }
        })
        return { total, active, highEff, needReview }
    }, [data])

    const filterChips = TYPE_OPTIONS.map((t) => ({
        label:   t.label,
        value:   t.value,
        active:  type === t.value,
        onClick: () => setType(t.value),
    }))

    function handleDelete(row) {
        if (!confirm(`Hapus kontrol "${row.control_code}"? Tindakan ini tidak dapat dibatalkan.`)) return
        router.delete(route('controls.destroy', row.id))
    }

    const columns = [
        {
            key: 'control_code',
            label: 'Kode',
            width: 140,
            render: (v) => (
                <span className="mono" style={{ fontSize: 11.5, fontWeight: 600 }}>
                    {v ?? '—'}
                </span>
            ),
        },
        {
            key: 'description',
            label: 'Nama Kontrol',
            render: (_, row) => (
                <div style={{ fontWeight: 600, lineHeight: 1.4 }}>
                    {row.description ?? '—'}
                </div>
            ),
        },
        {
            key: 'type',
            label: 'Tipe',
            width: 120,
            render: (v) => v ? <Tag tone={typeTone(v)}>{v}</Tag> : <span style={{ color: 'var(--ink-500)' }}>—</span>,
        },
        {
            key: 'risk',
            label: 'Risk Linked',
            width: 150,
            render: (_, r) => r.risk?.risk_code
                ? (
                    <Tag tone="mono" size="xs">
                        {r.risk.risk_code}
                    </Tag>
                )
                : <span style={{ color: 'var(--ink-500)' }}>—</span>,
        },
        {
            key: 'effectiveness',
            label: 'Effectiveness',
            width: 200,
            render: (_, r) => {
                const e = Number(r.effectiveness) || 0
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                            <HBar value={e} max={100} color={effectivenessTone(e)} />
                        </div>
                        <span className="mono" style={{ fontSize: 11.5, fontWeight: 600, minWidth: 36 }}>
                            {e ? `${e}%` : '—'}
                        </span>
                    </div>
                )
            },
        },
        {
            key: 'frequency',
            label: 'Frekuensi',
            width: 130,
            render: (v) => v
                ? <span style={{ fontSize: 12.5, color: 'var(--ink-700)' }}>{v}</span>
                : <span style={{ color: 'var(--ink-500)' }}>—</span>,
        },
        {
            key: 'automated',
            label: 'Status',
            width: 110,
            render: (v) => (
                <Badge status={v ? 'Otomatis' : 'Manual'} label={v ? 'Otomatis' : 'Manual'} />
            ),
        },
        {
            key: 'actions',
            label: 'Aksi',
            width: 150,
            render: (_, row) => (
                isFallback ? (
                    <span style={{ color: 'var(--ink-400)', fontSize: 11.5 }}>—</span>
                ) : (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <Link href={route('controls.edit', row.id)} style={btnSmall}>
                            <Pencil size={11} /> Edit
                        </Link>
                        <button type="button" onClick={() => handleDelete(row)} style={btnDanger}>
                            <Trash2 size={11} /> Hapus
                        </button>
                    </div>
                )
            ),
        },
    ]

    return (
        <AppLayout title="Kontrol & Mitigasi">
            <PageHeader
                title="Kontrol & Mitigasi"
                description="Katalog kontrol terstandar, efektivitas, dan keterhubungan dengan risiko."
                breadcrumbs={[
                    { label: 'Beranda', href: route('dashboard') },
                    { label: 'Kontrol & Mitigasi' },
                ]}
                actions={
                    <>
                        <button type="button" style={btnSecondary}>
                            <Download size={14} /> Ekspor
                        </button>
                        <Link href={route('controls.create')} style={btnPrimary}>
                            <Plus size={14} /> Tambah Kontrol
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
                        label="Total Kontrol"
                        value={stats.total}
                        sub={isFallback ? 'sample data' : 'kontrol terdaftar'}
                        icon={Shield}
                        accent="var(--green-600)"
                    />
                    <StatCard
                        label="Kontrol Aktif"
                        value={stats.active}
                        sub="effectiveness ≥ 70%"
                        icon={ShieldCheck}
                        accent="var(--green-600)"
                    />
                    <StatCard
                        label="Highly Effective"
                        value={stats.highEff}
                        sub="effectiveness ≥ 85%"
                        icon={Activity}
                        accent="var(--blue-600)"
                    />
                    <StatCard
                        label="Perlu Review"
                        value={stats.needReview}
                        sub="test_date > 6 bulan"
                        icon={ShieldAlert}
                        accent="#b8392a"
                    />
                </div>

                {/* Toolbar + table */}
                <div style={{ ...cardBase, padding: 0, overflow: 'hidden' }}>
                    <Toolbar
                        searchPlaceholder="Cari kode, nama kontrol, atau risk code…"
                        searchValue={search}
                        onSearch={setSearch}
                        filters={filterChips}
                        count={filtered.length}
                        countLabel="kontrol"
                    />
                    <DataTable
                        columns={columns}
                        data={filtered}
                        emptyMessage="Belum ada kontrol yang terdaftar."
                    />
                </div>

                {/* Pagination */}
                {!isFallback && controls?.links && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
                        {controls.links.map((link, i) => (
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
