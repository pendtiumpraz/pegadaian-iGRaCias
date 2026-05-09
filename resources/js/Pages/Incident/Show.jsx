import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { ChevronLeft, Download, Check, Bell, User, FileText, Edit2 } from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import SectionTitle from '@/Components/SectionTitle'
import Stepper from '@/Components/Stepper'
import RightRail from '@/Components/RightRail'
import DetailRow from '@/Components/DetailRow'
import Avatar from '@/Components/Avatar'
import Badge from '@/Components/Badge'
import Tag from '@/Components/Tag'

const INCIDENT_STEPS = ['Diterima', 'Triase', 'Investigasi', 'Tindakan', 'Selesai']

const STATUS_TO_STEP = {
    reported:      0,
    triaged:       1,
    investigating: 2,
    resolved:      3,
    closed:        4,
}

const SEVERITY_LABEL = {
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi',
    critical: 'Tinggi',
}

const TIMELINE_ICON = { bell: Bell, check: Check, user: User, file: FileText, edit: Edit2 }

function formatDate(v) {
    if (!v) return '—'
    return new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatDateMono(v) {
    if (!v) return '—'
    return new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatIDR(v) {
    if (v == null) return '—'
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
}

const cardStyle = {
    background: '#fff',
    border: '1px solid var(--ink-200)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 24px',
}

const cardPadless = {
    background: '#fff',
    border: '1px solid var(--ink-200)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
}

const cardHeader = {
    padding: '14px 20px',
    borderBottom: '1px solid var(--ink-200)',
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--ink-900)',
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

const STATUS_TRANSITIONS = {
    reported:      { next: 'investigating', label: 'Mulai Investigasi' },
    investigating: { next: 'resolved',      label: 'Tandai Selesai' },
    resolved:      { next: 'closed',        label: 'Tutup Insiden' },
    closed:        null,
}

export default function InsidenShow({ incident, timeline = [], recommendations = [], relatedRisks = [] }) {
    const [updating, setUpdating] = useState(false)
    const transition = STATUS_TRANSITIONS[incident.status] ?? null
    const stepIdx = STATUS_TO_STEP[incident.status] ?? 0

    const incidentSteps = INCIDENT_STEPS.map((label, i) => ({
        label,
        status: i < stepIdx ? 'done' : i === stepIdx ? 'current' : 'pending',
    }))

    function updateStatus(newStatus) {
        if (!confirm(`Ubah status insiden menjadi "${newStatus}"?`)) return
        setUpdating(true)
        router.put(
            route('incidents.update', incident.id),
            { status: newStatus },
            { onFinish: () => setUpdating(false) },
        )
    }

    const defaultTimeline = [
        { date: incident.tanggal_lapor, by: 'Sistem', text: 'Laporan diterima', icon: 'bell' },
        ...(incident.status !== 'reported' ? [{ date: null, by: 'PIC Triase', text: 'Triase: laporan tervalidasi, diteruskan ke investigator', icon: 'check' }] : []),
        ...(['investigating', 'resolved', 'closed'].includes(incident.status) ? [{ date: null, by: incident.pic?.name ?? 'Investigator', text: 'Investigasi dimulai, audit log ditarik', icon: 'user' }] : []),
        ...(['resolved', 'closed'].includes(incident.status) ? [{ date: null, by: incident.pic?.name ?? 'Investigator', text: 'Laporan investigasi awal selesai', icon: 'file' }] : []),
    ]
    const tl = timeline.length ? timeline : defaultTimeline

    const defaultRecommendations = [
        { text: 'Audit khusus pada proses terkait',     owner: 'SPI',           deadline: '30 hari ke depan' },
        { text: 'Refresh sosialisasi SOP',              owner: 'Operasional',   deadline: '60 hari ke depan' },
        { text: 'Penambahan kontrol dual-approval',     owner: 'IT Operations', deadline: '90 hari ke depan' },
    ]
    const recs = recommendations.length ? recommendations : defaultRecommendations

    return (
        <AppLayout title={`Insiden — ${incident.nomor_insiden}`} contentPadding="none">
            <PageHeader
                title={`${incident.nomor_insiden} — ${incident.judul}`}
                description={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {incident.kategori && <Tag>{String(incident.kategori).toUpperCase()}</Tag>}
                        {incident.severity && (
                            <Badge status={SEVERITY_LABEL[String(incident.severity).toLowerCase()] ?? incident.severity} />
                        )}
                        <Badge status={incident.status} />
                        <span style={{ color: 'var(--ink-500)' }}>
                            Dilaporkan <span className="mono">{formatDateMono(incident.tanggal_lapor)}</span>
                        </span>
                    </span>
                }
                breadcrumbs={[
                    { label: 'Beranda', href: route('dashboard') },
                    { label: 'Manajemen Insiden', href: route('incidents.index') },
                    { label: incident.nomor_insiden },
                ]}
                actions={
                    <>
                        <Link href={route('incidents.index')} style={btnSecondary}>
                            <ChevronLeft size={14} /> Kembali
                        </Link>
                        <button type="button" style={btnSecondary}>
                            <Download size={14} /> Cetak
                        </button>
                        {transition && (
                            <button
                                onClick={() => updateStatus(transition.next)}
                                disabled={updating}
                                style={{ ...btnPrimary, opacity: updating ? 0.6 : 1, cursor: updating ? 'not-allowed' : 'pointer' }}
                            >
                                <Check size={14} /> {updating ? 'Memproses…' : transition.label}
                            </button>
                        )}
                    </>
                }
            />

            <div style={{ padding: '20px 32px' }}>
                <RightRail
                    main={
                        <>
                            {/* Status Penanganan Stepper */}
                            <div style={cardStyle}>
                                <SectionTitle title="Status Penanganan" hint="Tahapan penanganan insiden" />
                                <Stepper steps={incidentSteps} />
                            </div>

                            {/* Kronologi Pelaporan */}
                            <div style={cardStyle}>
                                <SectionTitle title="Kronologi Pelaporan" />
                                <div style={{
                                    fontSize: 13.5,
                                    color: 'var(--ink-700)',
                                    lineHeight: 1.7,
                                    whiteSpace: 'pre-wrap',
                                }}>
                                    {incident.kronologi || incident.deskripsi || (
                                        <span style={{ color: 'var(--ink-500)', fontStyle: 'italic' }}>
                                            Belum ada kronologi yang dicatat untuk insiden ini.
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Timeline Aktivitas */}
                            <div style={cardPadless}>
                                <div style={cardHeader}>Timeline Aktivitas</div>
                                {tl.map((e, i) => {
                                    const Ic = TIMELINE_ICON[e.icon] || Bell
                                    return (
                                        <div key={i} style={{
                                            padding: '14px 20px',
                                            borderBottom: i < tl.length - 1 ? '1px solid var(--ink-100)' : 'none',
                                            display: 'flex',
                                            gap: 12,
                                        }}>
                                            <div style={{
                                                width: 32, height: 32, borderRadius: 32,
                                                background: 'var(--green-100)',
                                                color: 'var(--green-800)',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}>
                                                <Ic size={14} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-900)' }}>{e.text}</div>
                                                <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 2 }}>
                                                    {e.by ?? '—'}
                                                    {e.date && <> · <span className="mono">{formatDateMono(e.date)}</span></>}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Tindak Lanjut Direkomendasikan */}
                            <div style={cardStyle}>
                                <SectionTitle title="Tindak Lanjut Direkomendasikan" />
                                <ol style={{
                                    margin: 0,
                                    padding: 0,
                                    listStyle: 'none',
                                    counterReset: 'rec',
                                }}>
                                    {recs.map((r, i) => (
                                        <li key={i} style={{
                                            padding: '12px 0',
                                            borderBottom: i < recs.length - 1 ? '1px solid var(--ink-100)' : 'none',
                                            display: 'flex',
                                            gap: 12,
                                            alignItems: 'flex-start',
                                        }}>
                                            <div className="mono" style={{
                                                width: 26, height: 26, borderRadius: 6,
                                                background: 'var(--ink-100)',
                                                color: 'var(--ink-700)',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 12,
                                                fontWeight: 700,
                                                flexShrink: 0,
                                            }}>{i + 1}</div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-900)' }}>{r.text}</div>
                                                <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 3 }}>
                                                    Owner: {r.owner ?? '—'} · Deadline {r.deadline ?? '—'}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </>
                    }
                    rail={
                        <>
                            {/* Detail Insiden */}
                            <div style={cardStyle}>
                                <SectionTitle title="Detail Insiden" />
                                <DetailRow
                                    label="Kategori"
                                    value={incident.kategori ? <Tag>{String(incident.kategori).toUpperCase()}</Tag> : '—'}
                                />
                                <DetailRow
                                    label="Severity"
                                    value={incident.severity ? <Badge status={SEVERITY_LABEL[String(incident.severity).toLowerCase()] ?? incident.severity} /> : '—'}
                                />
                                <DetailRow
                                    label="Status"
                                    value={<Badge status={incident.status} />}
                                />
                                <DetailRow
                                    label="Tanggal Kejadian"
                                    value={<span className="mono">{formatDateMono(incident.tanggal_kejadian)}</span>}
                                />
                                <DetailRow
                                    label="Tanggal Lapor"
                                    value={<span className="mono">{formatDateMono(incident.tanggal_lapor)}</span>}
                                />
                                <DetailRow
                                    label="Pelapor"
                                    value={
                                        incident.is_anonymous
                                            ? <span style={{ color: 'var(--ink-600)', fontStyle: 'italic' }}>Anonim</span>
                                            : incident.reporter?.name
                                                ? <>
                                                    <Avatar name={incident.reporter.name} size={20} />
                                                    <span>{incident.reporter.name}</span>
                                                </>
                                                : '—'
                                    }
                                />
                                <DetailRow
                                    label="PIC"
                                    value={incident.pic?.name
                                        ? <>
                                            <Avatar name={incident.pic.name} size={20} />
                                            <span>{incident.pic.name}</span>
                                        </>
                                        : '—'
                                    }
                                />
                                <DetailRow
                                    label="Dampak Finansial"
                                    value={
                                        <span className="mono" style={{ color: incident.dampak_finansial ? '#b8392a' : 'var(--ink-700)' }}>
                                            {formatIDR(incident.dampak_finansial)}
                                        </span>
                                    }
                                    divider={false}
                                />
                            </div>

                            {/* Risk Terkait */}
                            <div style={cardStyle}>
                                <SectionTitle title="Risk Terkait" hint={`${relatedRisks.length} risiko`} />
                                {relatedRisks.length === 0 ? (
                                    <div style={{ fontSize: 12.5, color: 'var(--ink-500)', padding: '8px 0' }}>
                                        Belum ada risiko ter-link.
                                    </div>
                                ) : (
                                    relatedRisks.map((r, i) => {
                                        const item = (
                                            <>
                                                <div className="mono" style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-500)' }}>
                                                    {r.kode_risiko ?? r.id}
                                                </div>
                                                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-900)', marginTop: 2 }}>
                                                    {r.nama_risiko}
                                                </div>
                                                {r.status && (
                                                    <div style={{ marginTop: 6 }}>
                                                        <Badge status={r.status} />
                                                    </div>
                                                )}
                                            </>
                                        )
                                        const wrapStyle = {
                                            display: 'block',
                                            padding: '10px 0',
                                            borderBottom: i < relatedRisks.length - 1 ? '1px solid var(--ink-100)' : 'none',
                                            textDecoration: 'none',
                                        }
                                        // Try `risk.show` (route name in web.php) — fall back to plain div if route not registered.
                                        let href = null
                                        try { href = route('risk.show', r.id) } catch { href = null }
                                        return href ? (
                                            <Link key={r.id ?? i} href={href} style={wrapStyle}>{item}</Link>
                                        ) : (
                                            <div key={r.id ?? i} style={wrapStyle}>{item}</div>
                                        )
                                    })
                                )}
                            </div>
                        </>
                    }
                />
            </div>
        </AppLayout>
    )
}
