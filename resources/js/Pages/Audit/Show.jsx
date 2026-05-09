import { Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { ChevronLeft, Download, Edit, Plus } from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import SectionTitle from '@/Components/SectionTitle'
import Stepper from '@/Components/Stepper'
import RightRail from '@/Components/RightRail'
import DetailRow from '@/Components/DetailRow'
import Avatar from '@/Components/Avatar'
import AvatarStack from '@/Components/AvatarStack'
import Badge from '@/Components/Badge'
import Tag from '@/Components/Tag'

function formatDate(v) {
    if (!v) return '—'
    return new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatDateMono(v) {
    if (!v) return '—'
    return new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const AUDIT_STEPS = ['Perencanaan', 'Lapangan', 'Pengujian', 'Pelaporan', 'Tindak Lanjut']

const STATUS_TO_STEP = {
    draft:        0,
    planned:      0,
    in_progress:  1,
    pengujian:    2,
    pelaporan:    3,
    completed:    4,
    cancelled:    0,
}

const RISK_LEVEL_LABEL = {
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi',
    critical: 'Tinggi',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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

export default function AuditShow({ audit, findings = [], team = [], kka = [] }) {
    const stepIdx = STATUS_TO_STEP[audit.status] ?? 0
    const teamMembers = team.length
        ? team
        : audit.auditor?.name
            ? [{ name: audit.auditor.name, role: 'Lead Auditor' }]
            : []

    const auditSteps = AUDIT_STEPS.map((label, i) => ({
        label,
        status: i < stepIdx ? 'done' : i === stepIdx ? 'current' : 'pending',
    }))

    return (
        <AppLayout title={`Audit — ${audit.judul}`} contentPadding="none">
            <PageHeader
                title={audit.judul}
                description={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {audit.unit_audit && <Tag>{audit.unit_audit}</Tag>}
                        <Badge status={audit.status} />
                        <span style={{ color: 'var(--ink-500)' }}>
                            Periode <span className="mono">{formatDateMono(audit.tanggal_mulai)}</span>
                            {' — '}
                            <span className="mono">{formatDateMono(audit.tanggal_selesai)}</span>
                        </span>
                    </span>
                }
                breadcrumbs={[
                    { label: 'Beranda', href: route('dashboard') },
                    { label: 'Manajemen Audit', href: route('audit.index') },
                    { label: audit.judul },
                ]}
                actions={
                    <>
                        <Link href={route('audit.index')} style={btnSecondary}>
                            <ChevronLeft size={14} /> Kembali
                        </Link>
                        <button type="button" style={btnSecondary}>
                            <Download size={14} /> LHA
                        </button>
                        <Link href={route('audit.edit', audit.id)} style={btnPrimary}>
                            <Edit size={14} /> Edit
                        </Link>
                    </>
                }
            />

            <div style={{ padding: '20px 32px' }}>
                <RightRail
                    main={
                        <>
                            {/* Tahapan Audit Stepper */}
                            <div style={cardStyle}>
                                <SectionTitle title="Tahapan Audit" hint="Workflow penugasan audit internal" />
                                <Stepper steps={auditSteps} />
                            </div>

                            {/* KKA */}
                            <div style={cardPadless}>
                                <div style={cardHeader}>
                                    <span>Kertas Kerja Audit (KKA)</span>
                                    <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-500)', fontWeight: 600 }}>
                                        {kka.length} KKA
                                    </span>
                                </div>
                                {kka.length === 0 ? (
                                    <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--ink-500)', fontSize: 13 }}>
                                        Belum ada KKA tercatat untuk audit ini.
                                    </div>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                        <thead>
                                            <tr style={{ background: 'var(--ink-50)' }}>
                                                {['No KKA', 'Tahapan', 'Reviewer', 'Tanggal', 'Status'].map(h => (
                                                    <th key={h} style={{
                                                        textAlign: 'left',
                                                        padding: '10px 16px',
                                                        fontSize: 11.5,
                                                        fontWeight: 700,
                                                        color: 'var(--ink-600)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: 0.4,
                                                        borderBottom: '1px solid var(--ink-200)',
                                                    }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {kka.map((k, i) => (
                                                <tr key={k.id ?? i} style={{ borderBottom: '1px solid var(--ink-100)' }}>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <span className="mono" style={{ fontSize: 11.5, fontWeight: 600 }}>
                                                            {k.kode ?? `KKA-${String(i + 1).padStart(3, '0')}`}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>{k.tahapan ?? k.judul ?? '—'}</td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        {k.reviewer?.name ? (
                                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                                                <Avatar name={k.reviewer.name} size={22} />
                                                                <span style={{ fontSize: 12.5 }}>{k.reviewer.name}</span>
                                                            </span>
                                                        ) : '—'}
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <span className="mono" style={{ fontSize: 12 }}>{formatDateMono(k.tanggal)}</span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <Tag tone={k.status === 'Selesai' ? 'green' : 'neutral'}>{k.status ?? 'Pelaksanaan'}</Tag>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* Findings */}
                            <div style={cardPadless}>
                                <div style={cardHeader}>
                                    <span>
                                        Findings
                                        <span style={{ marginLeft: 8, fontWeight: 500, color: 'var(--ink-500)', fontSize: 12 }}>
                                            ({findings.length})
                                        </span>
                                    </span>
                                    <Link href={route('findings.index')} style={{ ...btnSmall, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                        <Plus size={12} /> Lihat Semua
                                    </Link>
                                </div>
                                {findings.length === 0 ? (
                                    <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--ink-500)', fontSize: 13 }}>
                                        Belum ada temuan tercatat untuk audit ini.
                                    </div>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                        <thead>
                                            <tr style={{ background: 'var(--ink-50)' }}>
                                                {['Nomor', 'Judul', 'Risiko', 'Status', 'PIC', 'Target Date', 'Aksi'].map(h => (
                                                    <th key={h} style={{
                                                        textAlign: 'left',
                                                        padding: '10px 16px',
                                                        fontSize: 11.5,
                                                        fontWeight: 700,
                                                        color: 'var(--ink-600)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: 0.4,
                                                        borderBottom: '1px solid var(--ink-200)',
                                                    }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {findings.map((f, i) => {
                                                const isOverdue = f.target_date
                                                    && new Date(f.target_date) < new Date()
                                                    && f.status !== 'closed'
                                                    && f.status !== 'verified'
                                                return (
                                                    <tr key={f.id ?? i} style={{ borderBottom: '1px solid var(--ink-100)' }}>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <span className="mono" style={{ fontSize: 11.5, fontWeight: 600 }}>
                                                                {f.nomor_temuan ?? `F-${String(i + 1).padStart(3, '0')}`}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Link href={route('findings.show', f.id)} style={{
                                                                color: 'var(--green-700)',
                                                                textDecoration: 'none',
                                                                fontWeight: 600,
                                                            }}>
                                                                {f.judul}
                                                            </Link>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Badge status={RISK_LEVEL_LABEL[String(f.tingkat_risiko ?? '').toLowerCase()] ?? f.tingkat_risiko ?? '—'} />
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Badge status={f.status} />
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            {f.pic?.name ? (
                                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                                                    <Avatar name={f.pic.name} size={22} />
                                                                    <span style={{ fontSize: 12.5 }}>{f.pic.name}</span>
                                                                </span>
                                                            ) : '—'}
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <span className="mono" style={{
                                                                fontSize: 12,
                                                                color: isOverdue ? '#b8392a' : 'var(--ink-700)',
                                                                fontWeight: isOverdue ? 700 : 500,
                                                            }}>
                                                                {formatDateMono(f.target_date)}
                                                                {isOverdue && ' ⚠'}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Link href={route('findings.show', f.id)} style={btnSmall}>Lihat</Link>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </>
                    }
                    rail={
                        <>
                            {/* Detail Penugasan */}
                            <div style={cardStyle}>
                                <SectionTitle title="Detail Penugasan" />
                                <DetailRow label="Tujuan" value={audit.tujuan ?? '—'} />
                                <DetailRow label="Ruang Lingkup" value={audit.ruang_lingkup ?? '—'} />
                                <DetailRow label="Unit Audit" value={audit.unit_audit ?? '—'} />
                                <DetailRow label="Tanggal Mulai" value={<span className="mono">{formatDateMono(audit.tanggal_mulai)}</span>} />
                                <DetailRow label="Tanggal Selesai" value={<span className="mono">{formatDateMono(audit.tanggal_selesai)}</span>} />
                                <DetailRow
                                    label="Lead Auditor"
                                    value={audit.auditor?.name ? (
                                        <>
                                            <Avatar name={audit.auditor.name} size={20} />
                                            <span>{audit.auditor.name}</span>
                                        </>
                                    ) : '—'}
                                    divider={false}
                                />
                            </div>

                            {/* Tim Audit */}
                            <div style={cardStyle}>
                                <SectionTitle title="Tim Audit" hint={`${teamMembers.length} anggota`} />
                                {teamMembers.length === 0 ? (
                                    <div style={{ fontSize: 13, color: 'var(--ink-500)', padding: '8px 0' }}>
                                        Belum ada tim ditugaskan.
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ marginBottom: 12 }}>
                                            <AvatarStack users={teamMembers} max={4} size={32} />
                                        </div>
                                        {teamMembers.map((m, i) => (
                                            <div key={i} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 10,
                                                padding: '8px 0',
                                                borderBottom: i < teamMembers.length - 1 ? '1px solid var(--ink-100)' : 'none',
                                            }}>
                                                <Avatar name={m.name} size={28} />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-900)' }}>{m.name}</div>
                                                    <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>
                                                        {m.role ?? (i === 0 ? 'Lead Auditor' : 'Auditor')}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </>
                    }
                />
            </div>
        </AppLayout>
    )
}
