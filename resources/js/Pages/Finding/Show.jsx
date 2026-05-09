import { useState } from 'react'
import { Link, router, useForm } from '@inertiajs/react'
import { route } from 'ziggy-js'
import {
    Calendar,
    XCircle,
    Save,
    ClipboardCheck,
    AlertTriangle,
    FileText,
} from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import SectionTitle from '@/Components/SectionTitle'
import Badge from '@/Components/Badge'
import Tag from '@/Components/Tag'
import Avatar from '@/Components/Avatar'
import RightRail from '@/Components/RightRail'
import DetailRow from '@/Components/DetailRow'
import HBar from '@/Components/HBar'

/* ─────────────── helpers ─────────────── */

const cardBase = {
    background: '#fff',
    borderRadius: 'var(--radius-lg, 12px)',
    border: '1px solid var(--ink-200)',
}

const btnPrimary = {
    background: 'var(--green-700)',
    color: '#fff',
    padding: '8px 16px',
    height: 36,
    borderRadius: 8,
    border: '1px solid var(--green-700)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
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

const btnDanger = {
    background: '#fff',
    color: '#8b261b',
    padding: '8px 16px',
    height: 36,
    borderRadius: 8,
    border: '1px solid #f0c9c1',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
}

const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid var(--ink-300)',
    borderRadius: 8,
    background: '#fff',
    fontSize: 13,
    color: 'var(--ink-900)',
    outline: 'none',
    boxSizing: 'border-box',
}

const STATUS_OPTIONS = [
    { value: 'open',         label: 'Open' },
    { value: 'in_progress',  label: 'Sedang Dikerjakan' },
    { value: 'verifikasi',   label: 'Verifikasi' },
    { value: 'selesai',      label: 'Selesai' },
]

const SEVERITY_OPTIONS = [
    { value: 'low',      label: 'Rendah' },
    { value: 'medium',   label: 'Sedang' },
    { value: 'high',     label: 'Tinggi' },
    { value: 'critical', label: 'Kritis' },
]

function severityTone(s) {
    const v = String(s || '').toLowerCase()
    if (v === 'critical') return 'red'
    if (v === 'high')     return 'red'
    if (v === 'medium')   return 'gold'
    if (v === 'low')      return 'green'
    return 'mono'
}

function severityLabel(s) {
    const map = { low: 'Rendah', medium: 'Sedang', high: 'Tinggi', critical: 'Kritis' }
    return map[String(s || '').toLowerCase()] || s || '—'
}

function formatDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

function isOverdue(deadline, status) {
    if (!deadline) return false
    if (String(status || '').toLowerCase() === 'selesai') return false
    return new Date(deadline) < new Date()
}

/* ─────────────── page ─────────────── */

export default function FindingShow({ finding }) {
    const closed = String(finding.status || '').toLowerCase() === 'selesai'

    const form = useForm({
        finding_code:   finding.finding_code   ?? '',
        description:    finding.description    ?? '',
        severity:       finding.severity       ?? 'medium',
        owner_id:       finding.owner_id       ?? '',
        deadline:       finding.deadline ? String(finding.deadline).slice(0, 10) : '',
        status:         finding.status         ?? 'open',
        recommendation: finding.recommendation ?? '',
    })

    function submitUpdate(e) {
        e.preventDefault()
        form.put(route('findings.update', finding.id), { preserveScroll: true })
    }

    function handleClose() {
        if (!confirm(`Tutup temuan ${finding.finding_code}? Status akan berubah menjadi Selesai.`)) return
        router.put(route('findings.close', finding.id), {}, { preserveScroll: true })
    }

    /* ─────────── main column ─────────── */
    const main = (
        <>
            {/* Deskripsi temuan */}
            <div style={{ ...cardBase, padding: 20 }}>
                <SectionTitle title="Temuan" hint="Uraian lengkap temuan audit" />
                <div
                    className="display"
                    style={{
                        fontSize: 15,
                        color: 'var(--ink-800)',
                        lineHeight: 1.65,
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'Fraunces, Georgia, serif',
                    }}
                >
                    {finding.description || (
                        <span style={{ color: 'var(--ink-500)', fontStyle: 'italic' }}>
                            Belum ada deskripsi.
                        </span>
                    )}
                </div>
            </div>

            {/* Rekomendasi */}
            {finding.recommendation && (
                <div style={{ ...cardBase, padding: 20 }}>
                    <SectionTitle title="Rekomendasi" hint="Saran tindak lanjut dari auditor" />
                    <div
                        style={{
                            background: 'var(--ink-50)',
                            borderLeft: '4px solid var(--green-700)',
                            borderRadius: '0 8px 8px 0',
                            padding: '14px 16px',
                            fontSize: 13.5,
                            color: 'var(--ink-800)',
                            lineHeight: 1.6,
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {finding.recommendation}
                    </div>
                </div>
            )}

            {/* Action plans */}
            {Array.isArray(finding.action_plans) && finding.action_plans.length > 0 && (
                <div style={{ ...cardBase, padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ink-200)' }}>
                        <SectionTitle
                            title="Rencana Aksi Terkait"
                            hint={`${finding.action_plans.length} rencana mitigasi`}
                            style={{ marginBottom: 0 }}
                        />
                    </div>
                    {finding.action_plans.map((a) => {
                        const pct = Number(a.progress_pct) || 0
                        const barColor = pct < 30 ? '#b8392a' : pct < 70 ? '#c98114' : '#187c5b'
                        return (
                            <div
                                key={a.id}
                                style={{
                                    padding: '14px 20px',
                                    borderBottom: '1px solid var(--ink-100)',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: 12,
                                        marginBottom: 8,
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-900)' }}>
                                            {a.judul ?? a.title ?? '—'}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 11.5,
                                                color: 'var(--ink-500)',
                                                marginTop: 4,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8,
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            {a.owner?.name && (
                                                <>
                                                    <Avatar name={a.owner.name} size={18} />
                                                    <span>{a.owner.name}</span>
                                                </>
                                            )}
                                            {a.deadline && (
                                                <>
                                                    <span>·</span>
                                                    <Calendar size={11} />
                                                    <span>Deadline {formatDate(a.deadline)}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <Badge status={a.status} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ flex: 1 }}>
                                        <HBar value={pct} max={100} color={barColor} />
                                    </div>
                                    <span className="mono" style={{ fontSize: 11.5, fontWeight: 600, minWidth: 40, textAlign: 'right' }}>
                                        {pct}%
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Update form */}
            <div style={{ ...cardBase, padding: 20 }}>
                <SectionTitle
                    title="Pembaruan Temuan"
                    hint="Perbarui status remediasi, target, dan rekomendasi."
                />

                <form onSubmit={submitUpdate}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: 12.5,
                                    fontWeight: 600,
                                    color: 'var(--ink-800)',
                                    marginBottom: 6,
                                }}
                            >
                                Status
                            </label>
                            <select
                                style={inputStyle}
                                value={form.data.status}
                                onChange={(e) => form.setData('status', e.target.value)}
                            >
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                            {form.errors.status && (
                                <div style={{ fontSize: 11.5, color: '#b8392a', marginTop: 5 }}>
                                    {form.errors.status}
                                </div>
                            )}
                        </div>

                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: 12.5,
                                    fontWeight: 600,
                                    color: 'var(--ink-800)',
                                    marginBottom: 6,
                                }}
                            >
                                Tingkat Risiko
                            </label>
                            <select
                                style={inputStyle}
                                value={form.data.severity}
                                onChange={(e) => form.setData('severity', e.target.value)}
                            >
                                {SEVERITY_OPTIONS.map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                            {form.errors.severity && (
                                <div style={{ fontSize: 11.5, color: '#b8392a', marginTop: 5 }}>
                                    {form.errors.severity}
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                        <label
                            style={{
                                display: 'block',
                                fontSize: 12.5,
                                fontWeight: 600,
                                color: 'var(--ink-800)',
                                marginBottom: 6,
                            }}
                        >
                            Target Penyelesaian
                        </label>
                        <input
                            type="date"
                            style={{ ...inputStyle, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}
                            value={form.data.deadline ?? ''}
                            onChange={(e) => form.setData('deadline', e.target.value)}
                        />
                        {form.errors.deadline && (
                            <div style={{ fontSize: 11.5, color: '#b8392a', marginTop: 5 }}>
                                {form.errors.deadline}
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: 14 }}>
                        <label
                            style={{
                                display: 'block',
                                fontSize: 12.5,
                                fontWeight: 600,
                                color: 'var(--ink-800)',
                                marginBottom: 6,
                            }}
                        >
                            Catatan / Rekomendasi
                        </label>
                        <textarea
                            style={{ ...inputStyle, minHeight: 110, resize: 'vertical' }}
                            value={form.data.recommendation ?? ''}
                            onChange={(e) => form.setData('recommendation', e.target.value)}
                            placeholder="Tambahkan catatan progress atau perubahan rekomendasi…"
                        />
                        {form.errors.recommendation && (
                            <div style={{ fontSize: 11.5, color: '#b8392a', marginTop: 5 }}>
                                {form.errors.recommendation}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                        {!closed ? (
                            <button
                                type="button"
                                onClick={handleClose}
                                style={btnDanger}
                            >
                                <XCircle size={14} /> Tutup Temuan
                            </button>
                        ) : (
                            <span style={{ fontSize: 12, color: 'var(--ink-500)' }}>
                                Temuan ini telah ditutup pada {formatDate(finding.closed_at)}.
                            </span>
                        )}
                        <button
                            type="submit"
                            disabled={form.processing}
                            style={{ ...btnPrimary, opacity: form.processing ? 0.6 : 1 }}
                        >
                            <Save size={14} /> {form.processing ? 'Menyimpan…' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )

    /* ─────────── rail ─────────── */
    const overdue = isOverdue(finding.deadline, finding.status)
    const rail = (
        <>
            <div style={{ ...cardBase, padding: 20 }}>
                <SectionTitle title="Detail Temuan" />
                <DetailRow
                    label="Nomor"
                    value={<span className="mono">{finding.finding_code ?? '—'}</span>}
                />
                <DetailRow
                    label="Audit"
                    value={finding.audit_plan?.audit_code
                        ? <Tag tone="mono" size="xs">{finding.audit_plan.audit_code}</Tag>
                        : '—'}
                />
                <DetailRow
                    label="Tingkat Risiko"
                    value={<Tag tone={severityTone(finding.severity)} size="sm">{severityLabel(finding.severity)}</Tag>}
                />
                <DetailRow
                    label="Status"
                    value={<Badge status={finding.status} />}
                />
                <DetailRow
                    label="Unit"
                    value={finding.unit?.name ?? '—'}
                />
                <DetailRow
                    label="PIC"
                    value={finding.owner?.name
                        ? (
                            <>
                                <Avatar name={finding.owner.name} size={18} />
                                <span>{finding.owner.name}</span>
                            </>
                        )
                        : '—'}
                />
                <DetailRow
                    label="Target"
                    value={
                        <span
                            className="mono"
                            style={{
                                color: overdue ? '#b8392a' : 'var(--ink-900)',
                                fontWeight: overdue ? 700 : 600,
                            }}
                        >
                            {formatDate(finding.deadline)}
                            {overdue && (
                                <span style={{ marginLeft: 6, fontSize: 10.5 }}>(overdue)</span>
                            )}
                        </span>
                    }
                />
                <DetailRow
                    label="Tgl Buat"
                    value={<span className="mono">{formatDate(finding.created_at)}</span>}
                />
                <DetailRow
                    label="Last Update"
                    value={<span className="mono">{formatDate(finding.updated_at)}</span>}
                    divider={!finding.closed_at}
                />
                {finding.closed_at && (
                    <DetailRow
                        label="Ditutup"
                        value={<span className="mono">{formatDate(finding.closed_at)}</span>}
                        divider={false}
                    />
                )}
            </div>

            {finding.audit_plan && (
                <div style={{ ...cardBase, padding: 20 }}>
                    <SectionTitle title="Audit Terkait" />
                    <Link
                        href={(() => {
                            try { return route('audit.show', finding.audit_plan.id) } catch { return '#' }
                        })()}
                        style={{
                            display: 'flex',
                            gap: 10,
                            padding: '8px 0',
                            textDecoration: 'none',
                        }}
                    >
                        <ClipboardCheck
                            size={16}
                            style={{ color: 'var(--green-700)', marginTop: 2, flexShrink: 0 }}
                        />
                        <div style={{ minWidth: 0 }}>
                            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', fontWeight: 600 }}>
                                {finding.audit_plan.audit_code}
                            </div>
                            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-900)', marginTop: 2 }}>
                                {finding.audit_plan.title ?? '—'}
                            </div>
                            {finding.audit_plan.status && (
                                <div style={{ marginTop: 6 }}>
                                    <Badge status={finding.audit_plan.status} />
                                </div>
                            )}
                        </div>
                    </Link>
                </div>
            )}
        </>
    )

    return (
        <AppLayout title={`Temuan — ${finding.finding_code}`}>
            <PageHeader
                title={finding.finding_code ?? 'Temuan Audit'}
                description={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Tag tone={severityTone(finding.severity)} size="sm">
                            {severityLabel(finding.severity)}
                        </Tag>
                        <span style={{ color: 'var(--ink-300)' }}>·</span>
                        <Badge status={finding.status} />
                        {finding.audit_plan?.audit_code && (
                            <>
                                <span style={{ color: 'var(--ink-300)' }}>·</span>
                                <span style={{ color: 'var(--ink-600)' }}>
                                    Audit{' '}
                                    <span className="mono" style={{ fontWeight: 600, color: 'var(--ink-700)' }}>
                                        {finding.audit_plan.audit_code}
                                    </span>
                                </span>
                            </>
                        )}
                        {overdue && (
                            <>
                                <span style={{ color: 'var(--ink-300)' }}>·</span>
                                <span style={{ color: '#b8392a', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                                    <AlertTriangle size={12} /> Overdue
                                </span>
                            </>
                        )}
                    </span>
                }
                breadcrumbs={[
                    { label: 'Beranda',      href: route('dashboard') },
                    { label: 'Temuan Audit', href: route('findings.index') },
                    { label: finding.finding_code ?? '—' },
                ]}
                actions={
                    <>
                        <Link href={route('findings.index')} style={btnSecondary}>
                            <FileText size={14} /> Daftar Temuan
                        </Link>
                        {!closed && (
                            <button type="button" onClick={handleClose} style={btnDanger}>
                                <XCircle size={14} /> Tutup Temuan
                            </button>
                        )}
                    </>
                }
            />

            <div style={{ padding: '20px 32px' }}>
                <RightRail main={main} rail={rail} />
            </div>
        </AppLayout>
    )
}
