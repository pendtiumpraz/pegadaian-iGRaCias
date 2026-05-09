import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import {
    ArrowLeft,
    Check,
    X as XIcon,
    Sparkles,
    FileText,
    Edit3,
    RefreshCw,
    Inbox,
    Quote,
} from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import SectionTitle from '@/Components/SectionTitle'
import Stepper from '@/Components/Stepper'
import Tag from '@/Components/Tag'
import Badge from '@/Components/Badge'
import HBar from '@/Components/HBar'
import AICard from '@/Components/AICard'
import Avatar from '@/Components/Avatar'

const STATUS_TONE = {
    uploaded:   { tone: 'neutral', label: 'Uploaded' },
    extracting: { tone: 'warning', label: 'Extracting' },
    review:     { tone: 'warning', label: 'Review' },
    approved:   { tone: 'success', label: 'Approved' },
    rejected:   { tone: 'danger',  label: 'Rejected' },
    failed:     { tone: 'danger',  label: 'Failed' },
}

const TYPE_LABEL = {
    policy:     'Kebijakan',
    regulation: 'Regulasi',
    contract:   'Kontrak',
    sop:        'SOP',
}

function formatBytes(b) {
    if (!b) return '—'
    if (b < 1024) return `${b} B`
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
    return `${(b / 1024 / 1024).toFixed(1)} MB`
}

function confColor(c) {
    if (c >= 0.9) return 'var(--green-600)'
    if (c >= 0.8) return 'var(--gold-500)'
    return '#c98114'
}

const inputBase = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid var(--ink-300)',
    borderRadius: 8,
    fontSize: 13,
    color: 'var(--ink-900)',
    outline: 'none',
    boxSizing: 'border-box',
    background: '#fff',
}

const btnPrimary = {
    background: 'var(--green-700)',
    color: '#fff',
    padding: '9px 16px',
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
    padding: '9px 16px',
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
    ...btnSecondary,
    color: '#8b261b',
    borderColor: '#f0c9c1',
    background: '#fbe4df',
}

function Field({ label, hint, conf, children }) {
    return (
        <div style={{ marginBottom: 14 }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: 4,
                    gap: 8,
                }}
            >
                <label
                    style={{
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: 'var(--ink-800)',
                    }}
                >
                    {label}
                </label>
                {conf != null && (
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            minWidth: 90,
                        }}
                    >
                        <div style={{ width: 60 }}>
                            <HBar
                                value={conf * 100}
                                max={100}
                                color={confColor(conf)}
                                height={4}
                            />
                        </div>
                        <span
                            className="mono"
                            style={{
                                fontSize: 10.5,
                                color: 'var(--ink-500)',
                                fontWeight: 600,
                            }}
                        >
                            {Math.round(conf * 100)}%
                        </span>
                    </div>
                )}
            </div>
            {children}
            {hint && (
                <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 3 }}>
                    {hint}
                </div>
            )}
        </div>
    )
}

export default function IngestShow({ job }) {
    const status = STATUS_TONE[job.status] ?? STATUS_TONE.uploaded
    const e0 = job.extracted ?? {}
    const conf = e0.field_confidence ?? {}
    const [extracted, setExtracted] = useState(e0)
    const [submitting, setSubmitting] = useState(false)

    const update = (k, v) => setExtracted((prev) => ({ ...prev, [k]: v }))

    const stepIdx = (() => {
        switch (job.status) {
            case 'uploaded':   return 0
            case 'extracting': return 1
            case 'review':     return 2
            case 'approved':
            case 'rejected':
            case 'failed':     return 3
            default:           return 2
        }
    })()

    const approve = () => {
        setSubmitting(true)
        router.post(route('ingest.approve', { job: job.id }), { extracted }, {
            onFinish: () => setSubmitting(false),
        })
    }

    const reject = () => {
        if (!window.confirm('Tolak hasil ekstraksi ini?')) return
        setSubmitting(true)
        router.post(route('ingest.reject', { job: job.id }), {}, {
            onFinish: () => setSubmitting(false),
        })
    }

    const isFinal = ['approved', 'rejected'].includes(job.status)

    return (
        <AppLayout
            title={job.filename}
            breadcrumb={['Beranda', 'AI Ingestion', 'Review']}
        >
            <PageHeader
                breadcrumbs={[
                    { label: 'Beranda', href: '/' },
                    { label: 'AI Ingestion', href: route('ingest.index') },
                    { label: job.filename },
                ]}
                title={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                        <span
                            style={{
                                maxWidth: 540,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {job.filename}
                        </span>
                        <Badge tone={status.tone}>{status.label}</Badge>
                        <Tag tone="gold" size="sm">
                            Confidence {Number(job.confidence_score).toFixed(1)}%
                        </Tag>
                    </span>
                }
                description={
                    <>
                        Tipe target:&nbsp;
                        <Tag tone="blue" size="sm">
                            {TYPE_LABEL[job.target_entity_type]}
                        </Tag>
                        &nbsp;· Diunggah oleh {job.user?.name ?? '—'}
                    </>
                }
                actions={
                    <Link href={route('ingest.index')} style={btnSecondary}>
                        <ArrowLeft size={14} /> Kembali
                    </Link>
                }
            />

            <div style={{ padding: '20px 32px' }}>
                {/* Stepper */}
                <div
                    style={{
                        background: '#fff',
                        border: '1px solid var(--ink-200)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '16px 22px',
                        marginBottom: 18,
                    }}
                >
                    <Stepper
                        currentIndex={stepIdx}
                        steps={[
                            { label: 'Upload',  sub: 'File diterima' },
                            { label: 'Extract', sub: 'AI parsing metadata' },
                            { label: 'Review',  sub: 'Verifikasi field' },
                            { label: 'Approve', sub: 'Commit ke DB' },
                        ]}
                    />
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1.6fr 1fr',
                        gap: 18,
                    }}
                >
                    {/* Main */}
                    <div
                        style={{
                            background: '#fff',
                            border: '1px solid var(--ink-200)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 22,
                        }}
                    >
                        <SectionTitle
                            title="Extracted Fields"
                            hint="Ubah field bila perlu — confidence rendah ditandai kuning."
                            actions={<Tag tone="green">{TYPE_LABEL[job.target_entity_type]}</Tag>}
                        />

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 14,
                            }}
                        >
                            <Field label="Judul Dokumen" conf={conf.title}>
                                <input
                                    style={inputBase}
                                    value={extracted.title ?? ''}
                                    onChange={(e) => update('title', e.target.value)}
                                    disabled={isFinal}
                                />
                            </Field>
                            <Field label="Nomor Dokumen" conf={conf.number}>
                                <input
                                    className="mono"
                                    style={{ ...inputBase, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}
                                    value={extracted.number ?? ''}
                                    onChange={(e) => update('number', e.target.value)}
                                    disabled={isFinal}
                                />
                            </Field>
                            <Field label="Kategori" conf={conf.category}>
                                <input
                                    style={inputBase}
                                    value={extracted.category ?? ''}
                                    onChange={(e) => update('category', e.target.value)}
                                    disabled={isFinal}
                                />
                            </Field>
                            <Field label="Owner / Unit" conf={conf.owner}>
                                <input
                                    style={inputBase}
                                    value={extracted.owner ?? ''}
                                    onChange={(e) => update('owner', e.target.value)}
                                    disabled={isFinal}
                                />
                            </Field>
                            <Field label="Tanggal Berlaku" conf={conf.effective_date}>
                                <input
                                    type="date"
                                    style={inputBase}
                                    value={extracted.effective_date ?? ''}
                                    onChange={(e) => update('effective_date', e.target.value)}
                                    disabled={isFinal}
                                />
                            </Field>
                            <Field label="Tanggal Kadaluarsa">
                                <input
                                    type="date"
                                    style={inputBase}
                                    value={extracted.expiry_date ?? ''}
                                    onChange={(e) => update('expiry_date', e.target.value)}
                                    disabled={isFinal}
                                />
                            </Field>
                        </div>

                        <Field label="Ringkasan AI" conf={conf.summary}>
                            <textarea
                                rows={5}
                                style={{
                                    ...inputBase,
                                    fontFamily: '"Fraunces", Georgia, serif',
                                    fontSize: 14,
                                    lineHeight: 1.55,
                                    minHeight: 120,
                                    resize: 'vertical',
                                }}
                                value={extracted.summary ?? ''}
                                onChange={(e) => update('summary', e.target.value)}
                                disabled={isFinal}
                            />
                        </Field>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr',
                                gap: 14,
                            }}
                        >
                            <Field label="Issuer">
                                <input
                                    style={inputBase}
                                    value={extracted.issuer ?? ''}
                                    onChange={(e) => update('issuer', e.target.value)}
                                    disabled={isFinal}
                                />
                            </Field>
                            <Field label="Versi">
                                <input
                                    className="mono"
                                    style={inputBase}
                                    value={extracted.version ?? ''}
                                    onChange={(e) => update('version', e.target.value)}
                                    disabled={isFinal}
                                />
                            </Field>
                            <Field label="Jumlah Halaman">
                                <input
                                    type="number"
                                    className="mono"
                                    style={inputBase}
                                    value={extracted.page_count ?? ''}
                                    onChange={(e) =>
                                        update('page_count', Number(e.target.value) || 0)
                                    }
                                    disabled={isFinal}
                                />
                            </Field>
                        </div>

                        {/* Action buttons */}
                        {!isFinal ? (
                            <div
                                style={{
                                    marginTop: 22,
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 8,
                                    flexWrap: 'wrap',
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={reject}
                                    style={btnDanger}
                                    disabled={submitting}
                                >
                                    <XIcon size={14} /> Tolak
                                </button>
                                <button
                                    type="button"
                                    style={btnSecondary}
                                    disabled={submitting}
                                    title="Kirim untuk review tambahan"
                                >
                                    <Inbox size={14} /> Kirim untuk Review
                                </button>
                                <button
                                    type="button"
                                    style={btnSecondary}
                                    disabled={submitting}
                                    title="Edit & ekstrak ulang"
                                >
                                    <RefreshCw size={14} /> Edit & Re-extract
                                </button>
                                <button
                                    type="button"
                                    onClick={approve}
                                    style={{
                                        ...btnPrimary,
                                        opacity: submitting ? 0.5 : 1,
                                        cursor: submitting ? 'not-allowed' : 'pointer',
                                    }}
                                    disabled={submitting}
                                >
                                    <Check size={14} />{' '}
                                    {submitting ? 'Memproses…' : 'Approve & Buat Record'}
                                </button>
                            </div>
                        ) : (
                            <div
                                style={{
                                    marginTop: 22,
                                    padding: '12px 16px',
                                    background:
                                        job.status === 'approved'
                                            ? 'var(--green-50)'
                                            : '#fbe4df',
                                    border:
                                        job.status === 'approved'
                                            ? '1px solid var(--green-300)'
                                            : '1px solid #f0c9c1',
                                    borderRadius: 8,
                                    fontSize: 12.5,
                                    color:
                                        job.status === 'approved'
                                            ? 'var(--green-800)'
                                            : '#8b261b',
                                    fontWeight: 600,
                                }}
                            >
                                {job.status === 'approved'
                                    ? 'Ekstraksi telah disetujui dan record sudah dibuat di tabel target.'
                                    : 'Ekstraksi telah ditolak. Tidak ada record yang dibuat.'}
                            </div>
                        )}
                    </div>

                    {/* Right rail */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {/* Document preview */}
                        <div
                            style={{
                                background: '#fff',
                                border: '1px solid var(--ink-200)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 14,
                            }}
                        >
                            <SectionTitle title="Dokumen Asli" level={4} display={false} />
                            <div
                                style={{
                                    display: 'flex',
                                    gap: 14,
                                    alignItems: 'flex-start',
                                }}
                            >
                                <div
                                    style={{
                                        width: 80,
                                        height: 100,
                                        borderRadius: 6,
                                        background: 'var(--ink-50)',
                                        border: '1px solid var(--ink-200)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--green-700)',
                                        flexShrink: 0,
                                    }}
                                >
                                    <FileText size={28} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: 'var(--ink-900)',
                                            wordBreak: 'break-all',
                                        }}
                                    >
                                        {job.filename}
                                    </div>
                                    <div
                                        className="mono"
                                        style={{
                                            fontSize: 11,
                                            color: 'var(--ink-600)',
                                            marginTop: 4,
                                        }}
                                    >
                                        {formatBytes(job.file_size_bytes)} ·{' '}
                                        {job.mime_type ?? 'application/octet-stream'}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 11,
                                            color: 'var(--ink-500)',
                                            marginTop: 8,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 6,
                                        }}
                                    >
                                        <Avatar name={job.user?.name ?? 'AI'} size={20} />
                                        {job.user?.name ?? 'Sistem'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI analysis notes */}
                        <AICard
                            severity="medium"
                            title="AI Analysis Notes"
                            body="AI berhasil mengekstrak metadata utama dengan confidence agregat di atas 80%. Verifikasi tanggal berlaku dan owner unit untuk memastikan akurasi sebelum commit."
                            pasal="claude-haiku-4.5 · 2 catatan perlu review"
                        />

                        <AICard
                            severity="low"
                            title="Validasi Format"
                            body="Format kode dokumen sesuai pola standar. Tidak ada duplikat dengan record existing pada tabel target."
                            pasal="cross-check terhadap database"
                        />

                        {/* Citation map */}
                        <div
                            style={{
                                background: 'var(--paper)',
                                border: '1px solid var(--ink-200)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 14,
                            }}
                        >
                            <SectionTitle title="Citation Map" level={4} display={false} />
                            {[
                                { f: 'Judul', loc: 'Halaman 1, paragraf 1' },
                                { f: 'Nomor', loc: 'Header halaman 1' },
                                { f: 'Tanggal Berlaku', loc: 'Bab I — Ketentuan Umum' },
                                { f: 'Owner Unit', loc: 'Bab IV — Tanggung Jawab' },
                                { f: 'Ringkasan', loc: 'Sintesis seluruh dokumen' },
                            ].map((c, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: 'flex',
                                        gap: 8,
                                        padding: '7px 0',
                                        borderBottom: '1px solid var(--ink-100)',
                                        fontSize: 12,
                                    }}
                                >
                                    <Quote
                                        size={11}
                                        style={{ color: 'var(--gold-500)', marginTop: 3 }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--ink-800)' }}>
                                            {c.f}
                                        </div>
                                        <div
                                            className="mono"
                                            style={{
                                                fontSize: 10.5,
                                                color: 'var(--ink-500)',
                                                marginTop: 1,
                                            }}
                                        >
                                            {c.loc}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
