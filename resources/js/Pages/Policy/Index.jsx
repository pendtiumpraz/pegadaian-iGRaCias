import { useState, useMemo } from 'react'
import { Link, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import {
    FileText,
    Plus,
    Upload,
    CheckCircle2,
    Clock,
    ShieldCheck,
    AlertTriangle,
    ShieldAlert,
    Eye,
    Award,
} from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import StatCard from '@/Components/StatCard'
import Badge from '@/Components/Badge'
import DataTable from '@/Components/DataTable'
import Tag from '@/Components/Tag'
import Toolbar from '@/Components/Toolbar'
import AIGradientBanner from '@/Components/AIGradientBanner'
import SectionTitle from '@/Components/SectionTitle'
import Avatar from '@/Components/Avatar'
import Donut from '@/Components/Donut'
import Stepper from '@/Components/Stepper'

const STATUS_OPTIONS = [
    { value: '',         label: 'Semua Status' },
    { value: 'draft',    label: 'Draft' },
    { value: 'review',   label: 'Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'active',   label: 'Active' },
    { value: 'expired',  label: 'Expired' },
]

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

const AI_CHIPS = [
    'Cari kebijakan tentang anti-fraud',
    'Ringkas POJK 6/2017',
    'Bandingkan dua kebijakan',
    'Pasal 12 ayat 3 ada di kebijakan apa?',
]

/* ─────────────────────── Sub-tab samples ──────────────────────── */

const WORKFLOW_STEPS = ['Drafter', 'Komite Kebijakan', 'Direktur Bidang', 'Direktur Utama', 'Publish']

const WORKFLOW_ROWS = [
    { id: 'WF-2026-031', title: 'JK-088/IT/2025 — Juklak Manajemen Akses & Identitas', pemrakarsa: 'Galih Wibowo',    step: 3, days: 2,  s: 'Review' },
    { id: 'WF-2026-030', title: 'PD-061/CR/2026 — Pedoman Pembiayaan Multiguna',        pemrakarsa: 'Nadia Rahman',    step: 2, days: 4,  s: 'Review' },
    { id: 'WF-2026-029', title: 'KU-027/RM/2026 — Kebijakan Stress Testing',            pemrakarsa: 'Dimas Pranata',   step: 4, days: 1,  s: 'Approved' },
    { id: 'WF-2026-028', title: 'JK-105/CY/2026 — Juklak Incident Response Cyber',      pemrakarsa: 'Hafidz Al-Faruq', step: 1, days: 0,  s: 'Draft' },
    { id: 'WF-2026-027', title: 'PD-072/HR/2026 — Pedoman Whistleblowing',              pemrakarsa: 'Maya Indira',     step: 3, days: 5,  s: 'Review' },
    { id: 'WF-2026-026', title: 'KU-019/CP/2026 — Kebijakan APU-PPT v3',                 pemrakarsa: 'Sinta Permata',   step: 5, days: 0,  s: 'Active' },
    { id: 'WF-2026-025', title: 'JK-099/OP/2026 — Juklak Penanganan Selisih Kas',       pemrakarsa: 'Reza Anggara',    step: 2, days: 7,  s: 'Review' },
    { id: 'WF-2026-024', title: 'PD-068/LG/2026 — Pedoman Klausul Vendor PDP',          pemrakarsa: 'Kartika Dewi',    step: 4, days: 3,  s: 'Approved' },
]

function MiniStepper({ step, total }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {Array.from({ length: total }).map((_, i) => {
                const done    = i < step - 1
                const current = i === step - 1
                return (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <span
                            style={{
                                width: 18, height: 18, borderRadius: 18,
                                background: done ? 'var(--green-600)' : current ? '#fff' : 'var(--ink-100)',
                                border: current ? '2px solid var(--green-600)' : `2px solid ${done ? 'var(--green-600)' : 'var(--ink-200)'}`,
                                color: done ? '#fff' : current ? 'var(--green-700)' : 'var(--ink-500)',
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 9, fontWeight: 700,
                            }}
                        >
                            {done ? '✓' : i + 1}
                        </span>
                        {i < total - 1 && (
                            <span style={{ width: 10, height: 2, background: done ? 'var(--green-600)' : 'var(--ink-200)' }} />
                        )}
                    </span>
                )
            })}
        </div>
    )
}

function WorkflowTab({ btnSmall }) {
    const cols = [
        {
            key: 'title', label: 'Kebijakan',
            render: (_, r) => (
                <div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', fontWeight: 600 }}>{r.id}</div>
                    <div style={{ fontWeight: 600, marginTop: 2 }}>{r.title}</div>
                </div>
            ),
        },
        {
            key: 'pemrakarsa', label: 'Pemrakarsa', width: 180,
            render: (_, r) => (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name={r.pemrakarsa} size={22} />
                    <span style={{ fontSize: 12.5 }}>{r.pemrakarsa}</span>
                </span>
            ),
        },
        {
            key: 'step', label: 'Stage', width: 200,
            render: (_, r) => (
                <div>
                    <MiniStepper step={r.step} total={WORKFLOW_STEPS.length} />
                    <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 4 }}>
                        Step {r.step}/{WORKFLOW_STEPS.length} · {WORKFLOW_STEPS[r.step - 1]}
                    </div>
                </div>
            ),
        },
        {
            key: 'days', label: 'Days Pending', width: 130, align: 'center',
            render: (_, r) => (
                <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: r.days > 5 ? '#b8392a' : 'var(--ink-700)' }}>
                    {r.days === 0 ? 'hari ini' : `${r.days} hari`}
                </span>
            ),
        },
        { key: 's', label: 'Status', width: 110, render: (_, r) => <Badge status={r.s} /> },
        {
            key: 'actions', label: 'Aksi', width: 100,
            render: () => (
                <button type="button" style={btnSmall}>
                    <Eye size={12} style={{ marginRight: 4 }} /> Lihat
                </button>
            ),
        },
    ]
    return (
        <>
            <SectionTitle
                title="Workflow Persetujuan Aktif"
                hint={`${WORKFLOW_ROWS.length} kebijakan dalam pipeline approval lintas direktorat`}
            />
            <div style={cardStyle}>
                <DataTable columns={cols} data={WORKFLOW_ROWS} />
            </div>
        </>
    )
}

const CERTS = [
    {
        code: 'ISO 37001:2016',
        name: 'Sistem Manajemen Anti Penyuapan',
        valid: '01 Jan 2024 — 31 Des 2026',
        next: 'Surveillance · Sep 2026',
        body: 'Bureau Veritas',
        coverage: 92,
    },
    {
        code: 'ISO 37301:2021',
        name: 'Sistem Manajemen Kepatuhan',
        valid: '15 Mar 2024 — 14 Mar 2027',
        next: 'Surveillance · Sep 2026',
        body: 'TÜV Rheinland',
        coverage: 88,
    },
]

const CERT_HISTORY = [
    { year: 2025, auditor: 'Bureau Veritas', cert: 'ISO 37001', result: 'Pass',          score: 92, issued: '15 Sep 2025' },
    { year: 2025, auditor: 'TÜV Rheinland',  cert: 'ISO 37301', result: 'Pass',          score: 88, issued: '20 Sep 2025' },
    { year: 2024, auditor: 'Bureau Veritas', cert: 'ISO 37001', result: 'Pass',          score: 90, issued: '01 Jan 2024' },
    { year: 2024, auditor: 'TÜV Rheinland',  cert: 'ISO 37301', result: 'Pass',          score: 86, issued: '15 Mar 2024' },
    { year: 2023, auditor: 'Bureau Veritas', cert: 'ISO 37001', result: 'Pass w/ Minor', score: 84, issued: '10 Sep 2023' },
    { year: 2023, auditor: 'SGS Indonesia',  cert: 'ISO 9001',  result: 'Pass',          score: 89, issued: '20 Mei 2023' },
]

function CertTab() {
    const histCols = [
        { key: 'year',    label: 'Tahun',     width: 80,  render: (_, r) => <span className="mono" style={{ fontWeight: 600 }}>{r.year}</span> },
        { key: 'auditor', label: 'Auditor',   render: (_, r) => <span style={{ fontWeight: 600 }}>{r.auditor}</span> },
        { key: 'cert',    label: 'Sertifikat', width: 140, render: (_, r) => <Tag>{r.cert}</Tag> },
        {
            key: 'result', label: 'Result', width: 150,
            render: (_, r) => <Badge status={r.result.startsWith('Pass') ? 'Selesai' : 'Pemantauan'} label={r.result} />,
        },
        { key: 'score',  label: 'Score',      width: 90, align: 'center', render: (_, r) => <span className="mono" style={{ fontWeight: 700 }}>{r.score}</span> },
        { key: 'issued', label: 'Issued Date', width: 130, render: (_, r) => <span className="mono" style={{ fontSize: 12 }}>{r.issued}</span> },
    ]
    return (
        <>
            <SectionTitle
                title="Sertifikasi Kepatuhan"
                hint="Sertifikasi aktif & roadmap surveillance audit"
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
                {CERTS.map((c) => (
                    <div key={c.code} style={{ ...cardStyle, padding: 22 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                            <div style={{
                                width: 52, height: 52, borderRadius: 10,
                                background: 'var(--green-100)', color: 'var(--green-800)',
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                                <Award size={24} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="display" style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink-900)' }}>{c.code}</div>
                                <div style={{ fontSize: 12.5, color: 'var(--ink-600)', marginTop: 2 }}>{c.name}</div>
                                <div style={{ marginTop: 6 }}><Badge status="Aktif" tone="success" label="Aktif" /></div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 18, alignItems: 'center' }}>
                            <div style={{ fontSize: 12.5 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--ink-100)' }}>
                                    <span style={{ color: 'var(--ink-500)' }}>Validity Period</span>
                                    <span className="mono" style={{ fontWeight: 600 }}>{c.valid}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--ink-100)' }}>
                                    <span style={{ color: 'var(--ink-500)' }}>Next Audit</span>
                                    <span style={{ fontWeight: 600 }}>{c.next}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                                    <span style={{ color: 'var(--ink-500)' }}>Lembaga Sertifikasi</span>
                                    <span style={{ fontWeight: 600 }}>{c.body}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <Donut
                                    size={96}
                                    thickness={12}
                                    segments={[
                                        { value: c.coverage,         color: '#187c5b' },
                                        { value: 100 - c.coverage,   color: 'var(--ink-100)' },
                                    ]}
                                    centerValue={`${c.coverage}%`}
                                    centerLabel="Coverage"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <SectionTitle
                title="Riwayat Audit Sertifikasi"
                hint="Hasil surveillance & re-certification 3 tahun terakhir"
                level={4}
                display={false}
            />
            <div style={cardStyle}>
                <DataTable columns={histCols} data={CERT_HISTORY} />
            </div>
        </>
    )
}

export default function KebijakanIndex({ policies, filters = {} }) {
    const [tab, setTab]           = useState('library')
    const [search, setSearch]     = useState(filters.search   ?? '')
    const [kategori, setKategori] = useState(filters.kategori ?? '')
    const [status, setStatus]     = useState(filters.status   ?? '')
    const [aiQ, setAiQ]           = useState('')

    function applyFilter(next = {}) {
        router.get(
            route('policies.index'),
            { search, kategori, status, ...next },
            { preserveState: true, replace: true },
        )
    }

    function handleDelete(id) {
        if (!confirm('Hapus kebijakan ini?')) return
        router.delete(route('policies.destroy', id))
    }

    const rows = policies?.data ?? []

    // Compute KPI summary from current page
    const summary = useMemo(() => {
        const total = rows.length
        const aktif = rows.filter(r => r.status === 'active').length
        const review = rows.filter(r => r.status === 'review').length
        const approved = rows.filter(r => r.status === 'approved').length
        const expired = rows.filter(r => {
            if (r.status === 'expired') return true
            if (!r.tanggal_kadaluarsa) return false
            return new Date(r.tanggal_kadaluarsa) < new Date()
        }).length
        return { total, aktif, review, approved, expired }
    }, [rows])

    const allKategori = [...new Set(rows.map(p => p.kategori).filter(Boolean))]

    const columns = [
        {
            key: 'nomor_kebijakan',
            label: 'Nomor',
            width: 160,
            render: (_, row) => (
                <span className="mono" style={{ fontSize: 11.5, fontWeight: 600 }}>
                    {row.nomor_kebijakan}
                </span>
            ),
        },
        {
            key: 'judul',
            label: 'Judul',
            render: (_, row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FileText size={16} style={{ color: 'var(--green-700)', flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>
                            {row.judul}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--ink-600)', marginTop: 2 }}>
                            Owner: {row.author?.name ?? '—'}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'kategori',
            label: 'Kategori',
            width: 140,
            render: (v) => v ? <Tag>{v}</Tag> : <span style={{ color: 'var(--ink-500)' }}>—</span>,
        },
        {
            key: 'versi',
            label: 'Versi',
            width: 80,
            render: (v) => (
                <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>
                    {v ?? '—'}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            width: 110,
            render: (v) => <Badge status={v} />,
        },
        {
            key: 'tanggal_kadaluarsa',
            label: 'Berlaku s/d',
            width: 130,
            render: (v) => {
                if (!v) return <span style={{ color: 'var(--ink-500)' }}>—</span>
                const date = new Date(v)
                const expired = date < new Date()
                return (
                    <span
                        className="mono"
                        style={{
                            fontSize: 12,
                            color: expired ? '#b8392a' : 'var(--ink-800)',
                            fontWeight: expired ? 700 : 500,
                        }}
                    >
                        {date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                )
            },
        },
        {
            key: 'actions',
            label: 'Aksi',
            width: 200,
            render: (_, row) => (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Link href={route('policies.show', row.id)} style={btnSmall}>Lihat</Link>
                    <Link href={route('policies.edit', row.id)} style={btnSmall}>Edit</Link>
                    <button onClick={() => handleDelete(row.id)} style={btnDanger}>Hapus</button>
                </div>
            ),
        },
    ]

    return (
        <AppLayout title="Manajemen Kebijakan">
            <PageHeader
                title="Manajemen Kebijakan"
                description="Penyusunan, persetujuan, review, pengelolaan, dan distribusi dokumen kebijakan dengan AI-powered search."
                breadcrumbs={[
                    { label: 'Beranda', href: route('dashboard') },
                    { label: 'Kebijakan' },
                ]}
                actions={
                    <Link href={route('policies.create')} style={btnPrimary}>
                        <Plus size={14} />
                        Tambah Kebijakan
                    </Link>
                }
                tabs={[
                    { id: 'library',  label: 'Pustaka',     count: summary.total },
                    { id: 'workflow', label: 'Workflow',    count: summary.review },
                    { id: 'cert',     label: 'Sertifikasi' },
                ]}
                activeTab={tab}
                onTabChange={setTab}
            />

            <div style={{ padding: '20px 32px' }}>
                {tab === 'library' && (
                    <>
                        {/* AI Policy Assistant */}
                        <div style={{ marginBottom: 20 }}>
                            <AIGradientBanner
                                eyebrow="AI Policy Assistant"
                                title="Tanya tentang kebijakan, cari pasal, generate ringkasan"
                                body="Asisten AI mencari di seluruh dokumen kebijakan internal dan regulasi eksternal. Cocok untuk klarifikasi prosedur, pencarian acuan, atau menjawab pertanyaan operasional."
                                inputValue={aiQ}
                                onInputChange={setAiQ}
                                placeholder="contoh: Bagaimana prosedur pelaporan gratifikasi dari rekanan vendor?"
                                onAsk={() => {
                                    // Placeholder — integrasi AI akan ditambahkan via controller
                                    console.log('[AI Policy] ask:', aiQ)
                                }}
                                chips={AI_CHIPS}
                                onChipClick={setAiQ}
                            />
                        </div>

                        {/* KPI Strip */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: 14,
                                marginBottom: 18,
                            }}
                        >
                            <StatCard
                                label="Aktif"
                                value={summary.aktif}
                                sub="berlaku saat ini"
                                accent="var(--green-600)"
                                icon={CheckCircle2}
                            />
                            <StatCard
                                label="Review"
                                value={summary.review}
                                sub="menunggu approval"
                                accent="var(--gold-500)"
                                icon={Clock}
                            />
                            <StatCard
                                label="Approved"
                                value={summary.approved}
                                sub="siap publish"
                                accent="var(--blue-600)"
                                icon={ShieldCheck}
                            />
                            <StatCard
                                label="Expired"
                                value={summary.expired}
                                sub="perlu pembaruan"
                                accent="var(--red-600)"
                                icon={AlertTriangle}
                            />
                        </div>

                        {/* Toolbar inside card */}
                        <div style={cardStyle}>
                            <Toolbar
                                searchPlaceholder="Cari nomor / judul kebijakan…"
                                searchValue={search}
                                onSearch={(v) => { setSearch(v); }}
                                right={
                                    <>
                                        <select
                                            value={kategori}
                                            onChange={(e) => { setKategori(e.target.value); applyFilter({ kategori: e.target.value }) }}
                                            style={selectStyle}
                                        >
                                            <option value="">Semua Kategori</option>
                                            {allKategori.map(k => <option key={k} value={k}>{k}</option>)}
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
                                countLabel="dokumen"
                            />

                            <DataTable columns={columns} data={rows} />
                        </div>

                        {/* Pagination */}
                        {policies?.links && (
                            <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
                                {policies.links.map((link, i) => (
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
                    </>
                )}

                {tab === 'workflow' && <WorkflowTab btnSmall={btnSmall} />}
                {tab === 'cert'     && <CertTab />}
            </div>
        </AppLayout>
    )
}
