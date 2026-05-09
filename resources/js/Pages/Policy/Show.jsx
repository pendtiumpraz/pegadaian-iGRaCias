import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { Download, Edit, Link2, History, Sparkles, ChevronLeft } from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import Badge from '@/Components/Badge'
import Tag from '@/Components/Tag'
import RightRail from '@/Components/RightRail'
import DetailRow from '@/Components/DetailRow'
import SectionTitle from '@/Components/SectionTitle'
import HBar from '@/Components/HBar'
import Avatar from '@/Components/Avatar'
import AIGradientBanner from '@/Components/AIGradientBanner'
import DataTable from '@/Components/DataTable'

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

function formatDate(v) {
    if (!v) return '—'
    return new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatDateMono(v) {
    if (!v) return '—'
    return new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function KebijakanShow({ policy, regulations = [] }) {
    const [aiSummary, setAiSummary] = useState(policy.ai_summary || null)
    const [aiLoading, setAiLoading] = useState(false)

    const isExpired = policy.tanggal_kadaluarsa && new Date(policy.tanggal_kadaluarsa) < new Date()

    function handleSummarize() {
        setAiLoading(true)
        // Placeholder summary — replace with backend call when available.
        setTimeout(() => {
            setAiSummary(
                `• Kebijakan ini mengatur tata kelola untuk topik "${policy.judul}" di seluruh unit kerja.\n` +
                `• Berlaku bagi seluruh pegawai dan pihak ketiga yang melaksanakan pekerjaan untuk dan atas nama Perusahaan.\n` +
                `• Pelanggaran dapat dikenakan sanksi administratif sesuai SK Direksi yang berlaku.`,
            )
            setAiLoading(false)
        }, 700)
    }

    function copyLink() {
        if (typeof window !== 'undefined') {
            navigator.clipboard?.writeText(window.location.href)
        }
    }

    // Build version history rows (synthesised from policy field if no riwayat array)
    const riwayat = (policy.riwayat ?? []).length > 0
        ? policy.riwayat
        : [
              {
                  versi: policy.versi ?? '1.0',
                  tanggal: policy.tanggal_berlaku,
                  penyusun: policy.author?.name ?? '—',
                  approver: policy.approver?.name ?? '—',
                  status: 'Aktif',
                  perubahan: 'Versi terkini.',
              },
          ]

    const riwayatColumns = [
        {
            key: 'versi',
            label: 'Versi',
            width: 80,
            render: (_, r) => (
                <span className="mono" style={{ fontWeight: 600, fontSize: 12 }}>
                    {r.versi}
                </span>
            ),
        },
        {
            key: 'tanggal',
            label: 'Tanggal',
            width: 130,
            render: (_, r) => (
                <span className="mono" style={{ fontSize: 12 }}>
                    {formatDateMono(r.tanggal)}
                </span>
            ),
        },
        {
            key: 'penyusun',
            label: 'Penyusun',
            width: 160,
            render: (_, r) => (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Avatar name={r.penyusun} size={20} />
                    <span style={{ fontSize: 12, color: 'var(--ink-800)' }}>{r.penyusun}</span>
                </span>
            ),
        },
        {
            key: 'approver',
            label: 'Disetujui',
            width: 160,
            render: (_, r) => (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Avatar name={r.approver} size={20} />
                    <span style={{ fontSize: 12, color: 'var(--ink-800)' }}>{r.approver}</span>
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            width: 100,
            render: (_, r) => <Tag>{r.status}</Tag>,
        },
        {
            key: 'actions',
            label: 'Aksi',
            width: 100,
            render: () => (
                <button type="button" style={btnSmall}>
                    Lihat
                </button>
            ),
        },
    ]

    // Acknowledged percentage placeholder (87% from reference)
    const ackPct = policy.ack_percentage ?? 87
    const ackRead = policy.ack_read ?? 1247
    const ackTotal = policy.ack_total ?? 1434

    return (
        <AppLayout title={`Kebijakan — ${policy.nomor_kebijakan}`}>
            <PageHeader
                title={policy.judul}
                description={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span className="mono" style={{ fontWeight: 600 }}>{policy.nomor_kebijakan}</span>
                        <span style={{ color: 'var(--ink-300)' }}>·</span>
                        <Badge status={policy.status} />
                        <span style={{ color: 'var(--ink-300)' }}>·</span>
                        <Tag tone="mono">v{policy.versi ?? '—'}</Tag>
                    </span>
                }
                breadcrumbs={[
                    { label: 'Beranda', href: route('dashboard') },
                    { label: 'Kebijakan', href: route('policies.index') },
                    { label: policy.nomor_kebijakan },
                ]}
                actions={
                    <>
                        <Link href={route('policies.index')} style={btnSecondary}>
                            <ChevronLeft size={14} />
                            Kembali
                        </Link>
                        <button type="button" style={btnSecondary} onClick={copyLink}>
                            <Link2 size={14} />
                            Salin Tautan
                        </button>
                        <button type="button" style={btnSecondary}>
                            <History size={14} />
                            Riwayat Versi
                        </button>
                        <Link href={route('policies.edit', policy.id)} style={btnPrimary}>
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
                            {/* AI Summary card (compact AIGradientBanner) */}
                            <AIGradientBanner
                                compact
                                eyebrow="Ringkasan AI"
                                title="Ringkasan kebijakan"
                                body={
                                    aiSummary ? (
                                        <span style={{ whiteSpace: 'pre-wrap', color: '#e6f0e9' }}>
                                            {aiSummary}
                                        </span>
                                    ) : (
                                        'Klik tombol di samping untuk menghasilkan ringkasan eksekutif berbasis AI dari dokumen ini.'
                                    )
                                }
                                loading={aiLoading}
                            />
                            <div style={{ marginTop: -8 }}>
                                <button
                                    type="button"
                                    onClick={handleSummarize}
                                    disabled={aiLoading}
                                    style={{
                                        ...btnPrimary,
                                        opacity: aiLoading ? 0.6 : 1,
                                    }}
                                >
                                    <Sparkles size={14} />
                                    {aiLoading ? 'Menganalisis…' : 'Ringkas dengan AI'}
                                </button>
                            </div>

                            {/* Pratinjau Dokumen */}
                            <div style={cardStyle}>
                                <SectionTitle title="Pratinjau Dokumen" hint="Tampilan ringkas isi kebijakan" />
                                <div
                                    style={{
                                        background: '#fff',
                                        border: '1px solid var(--ink-200)',
                                        borderRadius: 8,
                                        padding: '40px 60px',
                                        minHeight: 480,
                                    }}
                                >
                                    <div
                                        style={{
                                            textAlign: 'center',
                                            marginBottom: 32,
                                            paddingBottom: 20,
                                            borderBottom: '2px solid var(--green-700)',
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 11,
                                                fontWeight: 700,
                                                color: 'var(--ink-600)',
                                                textTransform: 'uppercase',
                                                letterSpacing: 0.6,
                                            }}
                                        >
                                            {(policy.kategori ?? 'Kebijakan').toString().toUpperCase()}
                                        </div>
                                        <h2
                                            className="display"
                                            style={{
                                                fontSize: 24,
                                                color: 'var(--ink-900)',
                                                margin: '8px 0 0',
                                                fontFamily: 'Fraunces, Georgia, serif',
                                            }}
                                        >
                                            {policy.judul}
                                        </h2>
                                        <div
                                            className="mono"
                                            style={{
                                                fontSize: 12,
                                                color: 'var(--ink-500)',
                                                marginTop: 8,
                                            }}
                                        >
                                            {policy.nomor_kebijakan} · Versi {policy.versi ?? '—'} · Berlaku sejak {formatDateMono(policy.tanggal_berlaku)}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 11,
                                                color: 'var(--ink-500)',
                                                marginTop: 4,
                                            }}
                                        >
                                            Penyusun: {policy.author?.name ?? '—'}
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            fontFamily: 'Fraunces, Georgia, serif',
                                            lineHeight: 1.7,
                                            fontSize: 14,
                                            color: 'var(--ink-800)',
                                        }}
                                    >
                                        <p style={{ marginTop: 0, marginBottom: 14 }}>
                                            <strong style={{ display: 'block', marginBottom: 4 }}>
                                                Pasal 1 — Maksud dan Tujuan
                                            </strong>
                                            Kebijakan ini disusun untuk mengatur tata kelola sebagaimana ditetapkan dalam ruang lingkup dokumen ini, dengan tujuan memastikan kepatuhan terhadap regulasi yang berlaku, meningkatkan efektivitas pengendalian internal, dan melindungi kepentingan Perusahaan serta pemangku kepentingan.
                                        </p>
                                        <p style={{ marginBottom: 14 }}>
                                            <strong style={{ display: 'block', marginBottom: 4 }}>
                                                Pasal 2 — Ruang Lingkup
                                            </strong>
                                            Kebijakan ini berlaku bagi seluruh pegawai dan unit kerja di lingkungan Perusahaan, termasuk seluruh kantor cabang, kantor wilayah, dan kantor pusat. Pihak ketiga yang melaksanakan pekerjaan untuk dan atas nama Perusahaan juga tunduk pada kebijakan ini sepanjang relevan.
                                        </p>
                                        <p style={{ marginBottom: 0 }}>
                                            <strong style={{ display: 'block', marginBottom: 4 }}>
                                                Pasal 3 — Kewajiban dan Tanggung Jawab
                                            </strong>
                                            Setiap pegawai wajib memahami, mematuhi, dan menerapkan kebijakan ini dalam pelaksanaan tugasnya sehari-hari. Atasan langsung bertanggung jawab memastikan kepatuhan unit kerjanya terhadap kebijakan ini.
                                        </p>
                                        <div
                                            style={{
                                                marginTop: 22,
                                                color: 'var(--ink-500)',
                                                textAlign: 'center',
                                                fontFamily: 'inherit',
                                                fontSize: 12,
                                                fontStyle: 'italic',
                                            }}
                                        >
                                            — pratinjau dipotong di sini —
                                        </div>
                                    </div>
                                </div>

                                {policy.file_path && (
                                    <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                                        <a
                                            href={`/storage/${policy.file_path}`}
                                            download
                                            style={btnSecondary}
                                        >
                                            <Download size={14} />
                                            Unduh Dokumen
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Riwayat Versi */}
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
                                    Riwayat Versi
                                </div>
                                <DataTable columns={riwayatColumns} data={riwayat} />
                            </div>
                        </>
                    }
                    rail={
                        <>
                            <div style={cardStyle}>
                                <SectionTitle title="Detail Dokumen" />
                                <DetailRow label="Nomor" value={<span className="mono">{policy.nomor_kebijakan}</span>} />
                                <DetailRow label="Kategori" value={policy.kategori ? <Tag>{policy.kategori}</Tag> : '—'} />
                                <DetailRow label="Divisi" value={policy.divisi ?? '—'} />
                                <DetailRow label="Versi" value={<span className="mono">{policy.versi ?? '—'}</span>} />
                                <DetailRow label="Status" value={<Badge status={policy.status} />} />
                                <DetailRow
                                    label="Tanggal Berlaku"
                                    value={<span className="mono">{formatDateMono(policy.tanggal_berlaku)}</span>}
                                />
                                <DetailRow
                                    label="Tanggal Kadaluarsa"
                                    value={
                                        <span
                                            className="mono"
                                            style={{
                                                color: isExpired ? '#b8392a' : 'var(--ink-900)',
                                            }}
                                        >
                                            {formatDateMono(policy.tanggal_kadaluarsa)}
                                        </span>
                                    }
                                />
                                <DetailRow label="Author" value={policy.author?.name ?? '—'} />
                                <DetailRow label="Approver" value={policy.approver?.name ?? '—'} divider={false} />
                            </div>

                            <div style={cardStyle}>
                                <SectionTitle title="Distribusi & Pembacaan" />
                                <div
                                    className="mono display"
                                    style={{
                                        fontSize: 32,
                                        color: 'var(--green-700)',
                                        lineHeight: 1.05,
                                        fontWeight: 600,
                                    }}
                                >
                                    {ackPct}%
                                </div>
                                <div
                                    style={{
                                        fontSize: 12,
                                        color: 'var(--ink-600)',
                                        margin: '6px 0 12px',
                                    }}
                                >
                                    {ackRead.toLocaleString('id-ID')} dari {ackTotal.toLocaleString('id-ID')} karyawan acknowledged
                                </div>
                                <HBar value={ackPct} max={100} color="var(--green-600)" height={8} />
                            </div>

                            <div style={cardStyle}>
                                <SectionTitle title="Regulasi Acuan" />
                                {(regulations && regulations.length > 0)
                                    ? regulations.slice(0, 4).map(r => (
                                          <div
                                              key={r.id}
                                              style={{
                                                  padding: '8px 0',
                                                  borderBottom: '1px solid var(--ink-100)',
                                              }}
                                          >
                                              <div className="mono" style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-500)' }}>
                                                  {r.nomor_regulasi}
                                              </div>
                                              <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 2 }}>
                                                  {r.judul}
                                              </div>
                                          </div>
                                      ))
                                    : (
                                        <div style={{ fontSize: 12.5, color: 'var(--ink-500)', padding: '6px 0' }}>
                                            Belum ada regulasi acuan yang ditautkan.
                                        </div>
                                    )}
                            </div>
                        </>
                    }
                />
            </div>
        </AppLayout>
    )
}
