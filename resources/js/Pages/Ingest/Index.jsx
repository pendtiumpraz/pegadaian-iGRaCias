import { Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import {
    Upload,
    Sparkles,
    FileScan,
    Eye,
    Check,
    Clock,
    BarChart3,
    FileText,
    Plus,
} from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import StatCard from '@/Components/StatCard'
import DataTable from '@/Components/DataTable'
import Tag from '@/Components/Tag'
import Badge from '@/Components/Badge'
import Avatar from '@/Components/Avatar'
import HBar from '@/Components/HBar'
import Stepper from '@/Components/Stepper'

const TYPE_LABEL = {
    policy:     'Kebijakan',
    regulation: 'Regulasi',
    contract:   'Kontrak',
    sop:        'SOP',
}

const STATUS_TONE = {
    uploaded:   { tone: 'neutral', label: 'Uploaded' },
    extracting: { tone: 'warning', label: 'Extracting' },
    review:     { tone: 'warning', label: 'Review' },
    approved:   { tone: 'success', label: 'Approved' },
    rejected:   { tone: 'danger',  label: 'Rejected' },
    failed:     { tone: 'danger',  label: 'Failed' },
}

function formatBytes(b) {
    if (!b) return '—'
    if (b < 1024) return `${b} B`
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
    return `${(b / 1024 / 1024).toFixed(1)} MB`
}

function fmtDate(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const btnPrimary = {
    background: 'var(--green-700)',
    color: '#fff',
    padding: '7px 14px',
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

export default function IngestIndex({ jobs, stats }) {
    const rows = jobs?.data ?? []

    const columns = [
        {
            key: 'filename',
            label: 'Dokumen',
            render: (row) => (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div
                        style={{
                            width: 32,
                            height: 36,
                            borderRadius: 4,
                            background: 'var(--ink-50)',
                            border: '1px solid var(--ink-200)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--green-700)',
                            flexShrink: 0,
                        }}
                    >
                        <FileText size={14} />
                    </div>
                    <div>
                        <div
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: 'var(--ink-900)',
                                maxWidth: 320,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                            title={row.filename}
                        >
                            {row.filename}
                        </div>
                        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>
                            {formatBytes(row.file_size_bytes)}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'target_entity_type',
            label: 'Tipe',
            width: 110,
            render: (row) => (
                <Tag tone="blue">{TYPE_LABEL[row.target_entity_type] ?? row.target_entity_type}</Tag>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            width: 120,
            render: (row) => {
                const t = STATUS_TONE[row.status] || STATUS_TONE.uploaded
                return <Badge tone={t.tone}>{t.label}</Badge>
            },
        },
        {
            key: 'confidence_score',
            label: 'Confidence',
            width: 160,
            render: (row) => {
                const v = Number(row.confidence_score) || 0
                const color =
                    v >= 90 ? 'var(--green-600)' : v >= 80 ? 'var(--gold-500)' : '#c98114'
                return (
                    <div style={{ minWidth: 130 }}>
                        <HBar value={v} max={100} color={color} height={6} />
                        <div
                            className="mono"
                            style={{ fontSize: 11, color: 'var(--ink-600)', marginTop: 3 }}
                        >
                            {v.toFixed(1)}%
                        </div>
                    </div>
                )
            },
        },
        {
            key: 'processed_at',
            label: 'Diproses',
            width: 150,
            render: (row) => (
                <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-700)' }}>
                    {fmtDate(row.processed_at || row.created_at)}
                </span>
            ),
        },
        {
            key: 'user',
            label: 'Aktor',
            width: 160,
            render: (row) => (
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                    }}
                >
                    <Avatar name={row.user?.name ?? 'AI'} size={24} />
                    <span style={{ fontSize: 12, color: 'var(--ink-700)' }}>
                        {row.user?.name ?? '—'}
                    </span>
                </div>
            ),
        },
        {
            key: 'actions',
            label: 'Aksi',
            width: 160,
            align: 'right',
            render: (row) => (
                <div style={{ display: 'inline-flex', gap: 6 }}>
                    <Link href={route('ingest.show', { job: row.id })} style={btnSmall}>
                        <Eye size={11} /> Lihat
                    </Link>
                    {row.status === 'review' && (
                        <Link
                            href={route('ingest.show', { job: row.id })}
                            style={{
                                ...btnSmall,
                                background: 'var(--green-700)',
                                color: '#fff',
                                borderColor: 'var(--green-700)',
                            }}
                        >
                            <Check size={11} /> Review
                        </Link>
                    )}
                </div>
            ),
        },
    ]

    return (
        <AppLayout title="AI Document Ingestion" breadcrumb={['Beranda', 'AI Ingestion']}>
            <PageHeader
                breadcrumbs={[{ label: 'Beranda', href: '/' }, { label: 'AI Ingestion' }]}
                title={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                        AI Document Ingestion <Tag tone="gold">BETA</Tag>
                    </span>
                }
                description="Upload dokumen kebijakan, regulasi, kontrak, atau SOP — AI akan mengekstrak metadata, judul, kategori, tanggal berlaku, dan ringkasan otomatis untuk Anda review."
                actions={
                    <Link href={route('ingest.create')} style={btnPrimary}>
                        <Plus size={14} /> Upload Dokumen
                    </Link>
                }
            />

            <div style={{ padding: '20px 32px' }}>
                {/* Stats */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 14,
                        marginBottom: 18,
                    }}
                >
                    <StatCard
                        label="Diproses Hari Ini"
                        value={stats?.today_count ?? 0}
                        sub="dokumen"
                        accent="var(--green-600)"
                        icon={Upload}
                    />
                    <StatCard
                        label="Menunggu Review"
                        value={stats?.in_review ?? 0}
                        sub="perlu verifikasi"
                        accent="var(--gold-500)"
                        icon={Clock}
                    />
                    <StatCard
                        label="Approved YTD"
                        value={stats?.approved_ytd ?? 0}
                        sub="ter-commit ke DB"
                        accent="var(--green-700)"
                        icon={Check}
                    />
                    <StatCard
                        label="Avg Confidence"
                        value={`${(stats?.avg_confidence ?? 0).toFixed(1)}%`}
                        sub="agregat semua field"
                        accent="#1c3d5e"
                        icon={BarChart3}
                    />
                </div>

                {/* Flow stepper */}
                <div
                    style={{
                        background: '#fff',
                        border: '1px solid var(--ink-200)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '16px 22px',
                        marginBottom: 18,
                    }}
                >
                    <div
                        style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: 'var(--ink-500)',
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            marginBottom: 10,
                        }}
                    >
                        Alur Tipikal
                    </div>
                    <Stepper
                        steps={[
                            { label: 'Upload', sub: 'PDF / DOCX', status: 'done' },
                            { label: 'Extract', sub: 'AI parsing', status: 'done' },
                            { label: 'Review', sub: 'Verifikasi field', status: 'current' },
                            { label: 'Approve', sub: 'Commit ke DB', status: 'pending' },
                        ]}
                    />
                </div>

                {/* Table */}
                <DataTable
                    columns={columns}
                    data={rows}
                    emptyMessage="Belum ada dokumen yang di-ingest. Mulai dengan tombol Upload Dokumen di atas."
                />

                {jobs?.links && (
                    <div
                        style={{
                            marginTop: 14,
                            display: 'flex',
                            gap: 6,
                            justifyContent: 'flex-end',
                        }}
                    >
                        {jobs.links.map((l, i) =>
                            l.url ? (
                                <Link
                                    key={i}
                                    href={l.url}
                                    style={{
                                        ...btnSmall,
                                        background: l.active
                                            ? 'var(--green-700)'
                                            : '#fff',
                                        color: l.active ? '#fff' : 'var(--ink-700)',
                                        borderColor: l.active
                                            ? 'var(--green-700)'
                                            : 'var(--ink-300)',
                                    }}
                                    dangerouslySetInnerHTML={{ __html: l.label }}
                                />
                            ) : (
                                <span
                                    key={i}
                                    style={{ ...btnSmall, opacity: 0.4 }}
                                    dangerouslySetInnerHTML={{ __html: l.label }}
                                />
                            ),
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
