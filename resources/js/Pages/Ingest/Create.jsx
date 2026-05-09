import { useRef, useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import {
    UploadCloud,
    Sparkles,
    FileText,
    X as XIcon,
    Info,
    ArrowLeft,
} from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import SectionTitle from '@/Components/SectionTitle'
import Tag from '@/Components/Tag'
import AICard from '@/Components/AICard'

const TYPES = [
    { value: 'policy',     label: 'Policy / Kebijakan' },
    { value: 'regulation', label: 'Regulation / Regulasi' },
    { value: 'contract',   label: 'Contract / Kontrak' },
    { value: 'sop',        label: 'SOP / Prosedur' },
]

const ACCEPT = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

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

export default function IngestCreate() {
    const inputRef = useRef(null)
    const [file, setFile] = useState(null)
    const [type, setType] = useState('policy')
    const [drag, setDrag] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const onPick = () => inputRef.current?.click()

    const onFile = (f) => {
        setError(null)
        if (!f) return setFile(null)
        if (f.size > 20 * 1024 * 1024) {
            setError('Ukuran file melebihi 20MB.')
            return
        }
        setFile(f)
    }

    const onDrop = (e) => {
        e.preventDefault()
        setDrag(false)
        const f = e.dataTransfer?.files?.[0]
        if (f) onFile(f)
    }

    const submit = () => {
        if (!file) {
            setError('Pilih dokumen terlebih dahulu.')
            return
        }
        setSubmitting(true)
        const fd = new FormData()
        fd.append('file', file)
        fd.append('target_entity_type', type)
        router.post(route('ingest.store'), fd, {
            forceFormData: true,
            onError: (errs) => {
                setSubmitting(false)
                setError(Object.values(errs)[0] ?? 'Gagal upload dokumen.')
            },
            onFinish: () => setSubmitting(false),
        })
    }

    return (
        <AppLayout
            title="Upload Dokumen Baru"
            breadcrumb={['Beranda', 'AI Ingestion', 'Upload']}
        >
            <PageHeader
                breadcrumbs={[
                    { label: 'Beranda', href: '/' },
                    { label: 'AI Ingestion', href: route('ingest.index') },
                    { label: 'Upload' },
                ]}
                title="Upload Dokumen Baru"
                description="Pilih jenis dokumen target dan upload file. AI akan mengekstrak metadata, kategori, dan ringkasan untuk Anda review sebelum di-commit ke database."
                actions={
                    <Link href={route('ingest.index')} style={btnSecondary}>
                        <ArrowLeft size={14} /> Kembali
                    </Link>
                }
            />

            <div style={{ padding: '20px 32px' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 320px',
                        gap: 18,
                    }}
                >
                    <div
                        style={{
                            background: '#fff',
                            border: '1px solid var(--ink-200)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 22,
                        }}
                    >
                        <SectionTitle
                            title="Pilih Tipe Dokumen"
                            hint="Membantu AI memetakan ke skema database yang sesuai"
                        />
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: 10,
                                marginBottom: 22,
                            }}
                        >
                            {TYPES.map((t) => {
                                const active = type === t.value
                                return (
                                    <button
                                        key={t.value}
                                        type="button"
                                        onClick={() => setType(t.value)}
                                        style={{
                                            padding: '12px 14px',
                                            border: active
                                                ? '2px solid var(--green-600)'
                                                : '1px solid var(--ink-300)',
                                            borderRadius: 10,
                                            background: active
                                                ? 'var(--green-50)'
                                                : '#fff',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 13.5,
                                                fontWeight: 700,
                                                color: active
                                                    ? 'var(--green-800)'
                                                    : 'var(--ink-900)',
                                            }}
                                        >
                                            {t.label}
                                        </div>
                                        <div
                                            className="mono"
                                            style={{
                                                fontSize: 11,
                                                color: 'var(--ink-500)',
                                                marginTop: 3,
                                            }}
                                        >
                                            target: {t.value}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>

                        <SectionTitle
                            title="Upload Dokumen"
                            hint="Drag & drop atau klik untuk memilih · PDF, DOCX · maks 20MB"
                        />
                        <input
                            ref={inputRef}
                            type="file"
                            accept={ACCEPT}
                            style={{ display: 'none' }}
                            onChange={(e) => onFile(e.target.files?.[0])}
                        />

                        <div
                            onDragOver={(e) => {
                                e.preventDefault()
                                setDrag(true)
                            }}
                            onDragLeave={() => setDrag(false)}
                            onDrop={onDrop}
                            onClick={onPick}
                            style={{
                                border: drag
                                    ? '2px dashed var(--green-600)'
                                    : '2px dashed var(--green-400)',
                                borderRadius: 12,
                                padding: '40px 20px',
                                textAlign: 'center',
                                background: drag
                                    ? 'var(--green-100)'
                                    : 'var(--green-50)',
                                cursor: 'pointer',
                                transition: 'all 120ms',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                    'var(--green-100)'
                            }}
                            onMouseLeave={(e) => {
                                if (!drag)
                                    e.currentTarget.style.background =
                                        'var(--green-50)'
                            }}
                        >
                            <UploadCloud
                                size={32}
                                style={{
                                    color: 'var(--green-700)',
                                    margin: '0 auto 10px',
                                    display: 'block',
                                }}
                            />
                            <div
                                style={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    marginBottom: 4,
                                    color: 'var(--ink-900)',
                                }}
                            >
                                Drop file di sini atau klik untuk pilih
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--ink-600)' }}>
                                PDF · DOCX · max 20MB
                            </div>
                        </div>

                        {file && (
                            <div
                                style={{
                                    marginTop: 16,
                                    padding: '10px 14px',
                                    background: 'var(--ink-50)',
                                    borderRadius: 8,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                }}
                            >
                                <div
                                    style={{
                                        width: 32,
                                        height: 36,
                                        borderRadius: 4,
                                        background: '#fff',
                                        border: '1px solid var(--ink-200)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--green-700)',
                                    }}
                                >
                                    <FileText size={14} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div
                                        style={{
                                            fontSize: 12.5,
                                            fontWeight: 600,
                                            color: 'var(--ink-900)',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {file.name}
                                    </div>
                                    <div
                                        className="mono"
                                        style={{ fontSize: 11, color: 'var(--ink-500)' }}
                                    >
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setFile(null)
                                    }}
                                    style={{
                                        padding: 6,
                                        color: 'var(--ink-500)',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <XIcon size={14} />
                                </button>
                            </div>
                        )}

                        {error && (
                            <div
                                style={{
                                    marginTop: 12,
                                    padding: '10px 14px',
                                    background: '#fbe4df',
                                    color: '#8b261b',
                                    borderRadius: 8,
                                    fontSize: 12.5,
                                }}
                            >
                                {error}
                            </div>
                        )}

                        <div
                            style={{
                                marginTop: 22,
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 8,
                            }}
                        >
                            <Link href={route('ingest.index')} style={btnSecondary}>
                                Batal
                            </Link>
                            <button
                                type="button"
                                onClick={submit}
                                disabled={!file || submitting}
                                style={{
                                    ...btnPrimary,
                                    opacity: !file || submitting ? 0.5 : 1,
                                    cursor: !file || submitting ? 'not-allowed' : 'pointer',
                                }}
                            >
                                <Sparkles size={14} />{' '}
                                {submitting ? 'Memproses…' : 'Upload & Ekstraksi AI'}
                            </button>
                        </div>
                    </div>

                    {/* Right rail */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <AICard
                            severity="low"
                            title="Apa yang akan AI lakukan?"
                            body="AI mengekstrak metadata, judul, kategori, tanggal berlaku, dan ringkasan otomatis. Setiap field memiliki indikator confidence sehingga Anda tahu mana yang perlu diverifikasi manual."
                            pasal="Powered by claude-haiku-4.5 · OCR Tesseract"
                        />

                        <div
                            style={{
                                background: '#fff',
                                border: '1px solid var(--ink-200)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 14,
                            }}
                        >
                            <SectionTitle title="Tips Upload" level={4} display={false} />
                            {[
                                'Gunakan PDF dengan teks selectable (bukan gambar) untuk akurasi terbaik.',
                                'Jika dokumen kebijakan, pastikan kode KU/PD/JK terlihat di halaman pertama.',
                                'Untuk regulasi, AI mendeteksi POJK/PBI/SE OJK secara otomatis.',
                                'Field dengan confidence < 85% akan ditandai untuk verifikasi manual.',
                            ].map((tip, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: 'flex',
                                        gap: 8,
                                        padding: '7px 0',
                                        borderBottom: '1px solid var(--ink-100)',
                                        fontSize: 12.5,
                                        color: 'var(--ink-700)',
                                        lineHeight: 1.45,
                                    }}
                                >
                                    <Info
                                        size={13}
                                        style={{
                                            color: 'var(--green-700)',
                                            marginTop: 2,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <span>{tip}</span>
                                </div>
                            ))}
                        </div>

                        <div
                            style={{
                                background: 'var(--paper)',
                                border: '1px solid var(--ink-200)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 14,
                            }}
                        >
                            <SectionTitle title="Skema Target" level={4} display={false} />
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    marginBottom: 10,
                                }}
                            >
                                <Tag tone="green">{type}</Tag>
                                <Tag tone="mono">policies / regulations</Tag>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--ink-600)', lineHeight: 1.55 }}>
                                Setelah Approve, record baru otomatis dibuat di tabel
                                target dengan status <Tag size="xs">draft</Tag>. Anda
                                dapat mengeditnya kemudian dari modul terkait.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
