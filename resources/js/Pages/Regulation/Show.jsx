import { Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { ChevronLeft, Edit, ExternalLink, Plus, Download } from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import Badge from '@/Components/Badge'
import Tag from '@/Components/Tag'
import RightRail from '@/Components/RightRail'
import DetailRow from '@/Components/DetailRow'
import SectionTitle from '@/Components/SectionTitle'
import Donut from '@/Components/Donut'
import HBar from '@/Components/HBar'
import Sparkline from '@/Components/Sparkline'
import Avatar from '@/Components/Avatar'
import DataTable from '@/Components/DataTable'

const JENIS_LABEL = {
    undang_undang:        'Undang-Undang',
    peraturan_pemerintah: 'Peraturan Pemerintah',
    peraturan_ojk:        'Peraturan OJK',
    surat_edaran_bi:      'Surat Edaran BI',
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
    padding: 18,
}

const cardStyleNoPad = {
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

function formatDate(v) {
    if (!v) return '—'
    return new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatDateMono(v) {
    if (!v) return '—'
    return new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function RegulasiShow({ regulation, policies = [], pasal = [], actionPlans = [] }) {
    const jenisLabel = JENIS_LABEL[regulation.jenis] ?? regulation.jenis
    const jenisTone = JENIS_TONE[regulation.jenis] ?? 'neutral'

    // Compliance summary placeholders. Compute from `pasal` if provided.
    const totalPasal = pasal.length > 0 ? pasal.length : 18
    const gap = Number(regulation.compliance_gap ?? (pasal.filter(p => p.status === 'gap' || p.status === 'Gap').length || 2))
    const patuh = Math.max(0, totalPasal - gap)
    const compliancePct = Math.round((patuh / Math.max(totalPasal, 1)) * 100)

    // Pasal table
    const pasalRows = pasal.length > 0 ? pasal : [
        { pasal: 'Pasal 3', ringkasan: 'Penyusunan rencana strategis manajemen risiko terintegrasi', pic: 'Manajemen Risiko', status: 'Patuh' },
        { pasal: 'Pasal 5', ringkasan: 'Pelaporan profil risiko triwulanan ke OJK', pic: 'Manajemen Risiko', status: 'Patuh' },
        { pasal: 'Pasal 8', ringkasan: 'Stress testing skenario sistemik minimal semesteran', pic: 'Treasury', status: 'Patuh' },
        { pasal: 'Pasal 12', ringkasan: 'Pengelolaan risiko siber sesuai standar nasional', pic: 'Cybersecurity', status: 'Gap' },
        { pasal: 'Pasal 15', ringkasan: 'Independensi fungsi manajemen risiko dari unit bisnis', pic: 'Manajemen Risiko', status: 'Patuh' },
    ]

    const pasalColumns = [
        {
            key: 'pasal',
            label: 'Pasal',
            width: 90,
            render: (_, r) => (
                <span className="mono" style={{ fontWeight: 600, fontSize: 12 }}>{r.pasal}</span>
            ),
        },
        {
            key: 'ringkasan',
            label: 'Ringkasan',
            render: (_, r) => (
                <span style={{ fontSize: 13, color: 'var(--ink-800)' }}>{r.ringkasan}</span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            width: 110,
            render: (_, r) => <Tag tone={(r.status || '').toLowerCase().includes('gap') ? 'red' : 'green'}>{r.status}</Tag>,
        },
        {
            key: 'pic',
            label: 'PIC',
            width: 170,
            render: (_, r) => (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Avatar name={r.pic ?? '—'} size={20} />
                    <span style={{ fontSize: 12 }}>{r.pic ?? '—'}</span>
                </span>
            ),
        },
    ]

    // Action plan placeholder
    const planRows = actionPlans.length > 0 ? actionPlans : [
        { judul: 'Penambahan kontrol siber sesuai POJK terkait', deadline: '30 Sep 2026', progress: 42, status: 'Pelaksanaan' },
        { judul: 'Penyusunan annual report sesuai format baru', deadline: '31 Mar 2027', progress: 18, status: 'Perencanaan' },
    ]

    // Reporting trend sparkline placeholder
    const trendData = [4, 6, 5, 8, 7, 9, 11]

    return (
        <AppLayout title={`Regulasi — ${regulation.nomor_regulasi}`}>
            <PageHeader
                title={regulation.judul}
                description={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span className="mono" style={{ fontWeight: 600 }}>{regulation.nomor_regulasi}</span>
                        <span style={{ color: 'var(--ink-300)' }}>·</span>
                        <Tag tone={jenisTone}>{jenisLabel}</Tag>
                        <span style={{ color: 'var(--ink-300)' }}>·</span>
                        <Badge status={regulation.status} />
                    </span>
                }
                breadcrumbs={[
                    { label: 'Beranda', href: route('dashboard') },
                    { label: 'Regulasi', href: route('regulations.index') },
                    { label: regulation.nomor_regulasi },
                ]}
                actions={
                    <>
                        <Link href={route('regulations.index')} style={btnSecondary}>
                            <ChevronLeft size={14} />
                            Kembali
                        </Link>
                        <button type="button" style={btnSecondary}>
                            <Download size={14} />
                            Unduh
                        </button>
                        <button type="button" style={btnSecondary}>
                            <Plus size={14} />
                            Action Plan Gap
                        </button>
                        <Link href={route('regulations.edit', regulation.id)} style={btnPrimary}>
                            <Edit size={14} />
                            Edit
                        </Link>
                    </>
                }
            />

            <div style={{ padding: '20px 32px' }}>
                <RightRail
                    main={
                        <>
                            {/* 3-tile compliance grid */}
                            <div style={cardStyle}>
                                <SectionTitle title="Compliance Status" hint="Status pemenuhan kewajiban regulasi" />
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                                    {/* Compliance Donut */}
                                    <div
                                        style={{
                                            padding: '14px 16px',
                                            background: 'var(--green-50)',
                                            borderRadius: 10,
                                            border: '1px solid var(--green-100)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 12,
                                        }}
                                    >
                                        <Donut
                                            size={84}
                                            thickness={12}
                                            segments={[
                                                { value: patuh, color: '#187c5b' },
                                                { value: gap, color: '#c98114' },
                                            ]}
                                            centerValue={`${compliancePct}%`}
                                            centerLabel="Patuh"
                                        />
                                        <div style={{ minWidth: 0 }}>
                                            <div
                                                style={{
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    color: 'var(--green-800)',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: 0.4,
                                                }}
                                            >
                                                Compliance
                                            </div>
                                            <div
                                                className="mono"
                                                style={{
                                                    fontSize: 13,
                                                    color: 'var(--green-800)',
                                                    marginTop: 4,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {patuh} dari {totalPasal} pasal
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tindakan diambil */}
                                    <div
                                        style={{
                                            padding: '14px 16px',
                                            background: 'var(--gold-100)',
                                            borderRadius: 10,
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 11,
                                                fontWeight: 700,
                                                color: '#7a4f0a',
                                                textTransform: 'uppercase',
                                                letterSpacing: 0.4,
                                            }}
                                        >
                                            Tindakan Diambil
                                        </div>
                                        <div
                                            className="mono"
                                            style={{
                                                fontSize: 24,
                                                fontWeight: 600,
                                                marginTop: 4,
                                                color: '#7a4f0a',
                                            }}
                                        >
                                            {planRows.length}
                                        </div>
                                        <div style={{ marginTop: 10 }}>
                                            <HBar
                                                value={planRows.reduce((s, r) => s + (Number(r.progress) || 0), 0) / Math.max(planRows.length, 1)}
                                                max={100}
                                                color="#c98114"
                                                track="#fbf0d2"
                                                height={6}
                                            />
                                        </div>
                                        <div style={{ fontSize: 11, color: '#7a4f0a', marginTop: 6 }}>
                                            rata-rata progress
                                        </div>
                                    </div>

                                    {/* Pelaporan Berkala */}
                                    <div
                                        style={{
                                            padding: '14px 16px',
                                            background: 'var(--blue-100)',
                                            borderRadius: 10,
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 11,
                                                fontWeight: 700,
                                                color: '#1c3d5e',
                                                textTransform: 'uppercase',
                                                letterSpacing: 0.4,
                                            }}
                                        >
                                            Pelaporan Berkala
                                        </div>
                                        <div
                                            className="mono"
                                            style={{
                                                fontSize: 24,
                                                fontWeight: 600,
                                                marginTop: 4,
                                                color: '#1c3d5e',
                                            }}
                                        >
                                            {trendData[trendData.length - 1]}
                                        </div>
                                        <div style={{ marginTop: 6 }}>
                                            <Sparkline
                                                data={trendData}
                                                width={140}
                                                height={28}
                                                color="#2e5a8a"
                                            />
                                        </div>
                                        <div style={{ fontSize: 11, color: '#1c3d5e', marginTop: 4 }}>
                                            tren 7 periode terakhir
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pasal table */}
                            <div style={cardStyleNoPad}>
                                <div
                                    style={{
                                        padding: '14px 20px',
                                        borderBottom: '1px solid var(--ink-200)',
                                        fontSize: 13,
                                        fontWeight: 700,
                                        color: 'var(--ink-900)',
                                    }}
                                >
                                    Pasal-Pasal Relevan
                                </div>
                                <DataTable columns={pasalColumns} data={pasalRows} />
                            </div>

                            {/* Action plan */}
                            <div style={cardStyle}>
                                <SectionTitle title="Action Plan untuk Gap" hint="Penanganan ketidakpatuhan terbuka" />
                                {planRows.map((a, i) => {
                                    const p = Number(a.progress) || 0
                                    const color = p < 30 ? '#b8392a' : p < 70 ? '#c98114' : 'var(--green-600)'
                                    return (
                                        <div
                                            key={i}
                                            style={{
                                                padding: '12px 0',
                                                borderBottom: i < planRows.length - 1 ? '1px solid var(--ink-100)' : 'none',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: 6,
                                                }}
                                            >
                                                <div style={{ fontSize: 13, fontWeight: 600 }}>{a.judul}</div>
                                                <Badge status={a.status} />
                                            </div>
                                            <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginBottom: 6 }}>
                                                Deadline: {a.deadline}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ flex: 1 }}>
                                                    <HBar value={p} max={100} color={color} height={6} />
                                                </div>
                                                <span className="mono" style={{ fontSize: 11.5, fontWeight: 600 }}>
                                                    {p}%
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    }
                    rail={
                        <>
                            <div style={cardStyle}>
                                <SectionTitle title="Detail Regulasi" />
                                <DetailRow label="Nomor" value={<span className="mono">{regulation.nomor_regulasi}</span>} />
                                <DetailRow label="Penerbit" value={regulation.penerbit ?? '—'} />
                                <DetailRow label="Jenis" value={<Tag tone={jenisTone}>{jenisLabel}</Tag>} />
                                <DetailRow
                                    label="Tanggal Terbit"
                                    value={<span className="mono">{formatDateMono(regulation.tanggal_terbit)}</span>}
                                />
                                <DetailRow
                                    label="Tanggal Berlaku"
                                    value={<span className="mono">{formatDateMono(regulation.tanggal_berlaku)}</span>}
                                />
                                <DetailRow label="Status" value={<Badge status={regulation.status} />} divider={false} />
                            </div>

                            {regulation.ringkasan && (
                                <div style={cardStyle}>
                                    <SectionTitle title="Ringkasan" />
                                    <div
                                        style={{
                                            fontFamily: 'Fraunces, Georgia, serif',
                                            fontSize: 13.5,
                                            lineHeight: 1.7,
                                            color: 'var(--ink-800)',
                                            whiteSpace: 'pre-wrap',
                                        }}
                                    >
                                        {regulation.ringkasan}
                                    </div>
                                </div>
                            )}

                            {regulation.url_sumber && (
                                <div style={cardStyle}>
                                    <SectionTitle title="URL Sumber" />
                                    <a
                                        href={regulation.url_sumber}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            color: 'var(--green-700)',
                                            fontSize: 13,
                                            fontWeight: 600,
                                            wordBreak: 'break-all',
                                        }}
                                    >
                                        Buka sumber resmi
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            )}

                            {policies && policies.length > 0 && (
                                <div style={cardStyle}>
                                    <SectionTitle title="Kebijakan Internal Terkait" />
                                    {policies.slice(0, 4).map(p => (
                                        <div
                                            key={p.id}
                                            style={{ padding: '8px 0', borderBottom: '1px solid var(--ink-100)' }}
                                        >
                                            <div className="mono" style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-500)' }}>
                                                {p.nomor_kebijakan}
                                            </div>
                                            <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 2 }}>
                                                {p.judul}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    }
                />
            </div>
        </AppLayout>
    )
}
