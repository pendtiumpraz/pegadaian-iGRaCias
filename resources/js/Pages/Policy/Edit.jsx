import { useState } from 'react'
import { useForm, Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { Upload, FileText, X, Download } from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import SectionTitle from '@/Components/SectionTitle'
import AIGradientBanner from '@/Components/AIGradientBanner'

const STATUS_OPTIONS = ['draft', 'review', 'approved', 'active', 'expired']

const KATEGORI_OPTIONS = [
    'Operasional',
    'Kepatuhan',
    'IT',
    'Sumber Daya Manusia',
    'Keuangan',
    'Risiko',
    'Audit',
    'Lainnya',
]

const DIVISI_OPTIONS = [
    'Direksi',
    'Audit Internal',
    'Manajemen Risiko',
    'Kepatuhan',
    'Operasional',
    'IT',
    'SDM',
    'Keuangan',
    'Treasury',
    'Hukum',
    'Lainnya',
]

const AI_CHIPS = [
    'Sarankan revisi pasal terhadap regulasi terbaru',
    'Tulis ulang ringkasan dengan bahasa lebih jelas',
    'Cek konsistensi dengan kebijakan terkait',
]

const inputStyle = {
    width: '100%',
    background: '#fff',
    border: '1px solid var(--ink-300)',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13,
    color: 'var(--ink-900)',
    outline: 'none',
    boxSizing: 'border-box',
}

const monoInputStyle = {
    ...inputStyle,
    fontFamily: 'JetBrains Mono, ui-monospace, monospace',
    fontFeatureSettings: '"tnum" 1',
}

const labelStyle = {
    display: 'block',
    fontSize: 11.5,
    fontWeight: 700,
    color: 'var(--ink-700)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
}

const errorStyle = {
    fontSize: 11.5,
    color: '#b8392a',
    marginTop: 4,
}

const cardStyle = {
    background: 'var(--paper)',
    border: '1px solid var(--ink-200)',
    borderRadius: 'var(--radius-lg)',
    padding: 18,
    marginBottom: 14,
}

const btnPrimary = {
    background: 'var(--green-700)',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: 8,
    border: '1px solid var(--green-700)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13.5,
}

const btnSecondary = {
    background: '#fff',
    color: 'var(--ink-800)',
    padding: '10px 18px',
    borderRadius: 8,
    border: '1px solid var(--ink-300)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13.5,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
}

const btnSmall = {
    background: '#fff',
    color: 'var(--ink-800)',
    padding: '6px 12px',
    borderRadius: 6,
    border: '1px solid var(--ink-300)',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
}

function Field({ label, error, hint, children }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>{label}</label>
            {children}
            {hint && (
                <span style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 4 }}>
                    {hint}
                </span>
            )}
            {error && <span style={errorStyle}>{error}</span>}
        </div>
    )
}

function FileDropzone({ file, onSelect, onClear, error }) {
    const [drag, setDrag] = useState(false)
    return (
        <>
            {file ? (
                <div
                    style={{
                        border: '1px solid var(--ink-200)',
                        borderRadius: 10,
                        padding: '12px 14px',
                        background: 'var(--green-50)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    <span
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: 'var(--green-100)',
                            color: 'var(--green-800)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <FileText size={18} />
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-900)' }}>
                            {file.name}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--ink-600)' }}>
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClear}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--ink-300)',
                            borderRadius: 6,
                            padding: 6,
                            cursor: 'pointer',
                            color: 'var(--ink-700)',
                            display: 'inline-flex',
                            alignItems: 'center',
                        }}
                    >
                        <X size={14} />
                    </button>
                </div>
            ) : (
                <label
                    onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={(e) => {
                        e.preventDefault()
                        setDrag(false)
                        const f = e.dataTransfer.files?.[0]
                        if (f) onSelect(f)
                    }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        padding: '32px 18px',
                        border: '2px dashed',
                        borderColor: drag ? 'var(--green-600)' : 'var(--ink-300)',
                        borderRadius: 10,
                        background: drag ? 'var(--green-50)' : '#fff',
                        cursor: 'pointer',
                    }}
                >
                    <Upload size={22} style={{ color: 'var(--green-700)' }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-900)' }}>
                        Tarik file ke sini atau klik untuk pilih
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-500)' }}>
                        PDF, DOC, DOCX, XLS, XLSX — maks. 10 MB
                    </div>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        onChange={(e) => e.target.files?.[0] && onSelect(e.target.files[0])}
                        style={{ display: 'none' }}
                    />
                </label>
            )}
            {error && <span style={errorStyle}>{error}</span>}
        </>
    )
}

export default function KebijakanEdit({ policy }) {
    const [aiQ, setAiQ] = useState('')

    const { data, setData, post, processing, errors } = useForm({
        _method:            'PUT',
        nomor_kebijakan:    policy.nomor_kebijakan    ?? '',
        judul:              policy.judul              ?? '',
        deskripsi:          policy.deskripsi          ?? '',
        kategori:           policy.kategori           ?? '',
        divisi:             policy.divisi             ?? '',
        versi:              policy.versi              ?? '1.0',
        status:             policy.status             ?? 'draft',
        tanggal_berlaku:    policy.tanggal_berlaku    ?? '',
        tanggal_kadaluarsa: policy.tanggal_kadaluarsa ?? '',
        file:               null,
    })

    function submit(e) {
        e.preventDefault()
        post(route('policies.update', policy.id), { forceFormData: true })
    }

    const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }

    return (
        <AppLayout title={`Edit Kebijakan — ${policy.nomor_kebijakan}`}>
            <PageHeader
                title={`Edit Kebijakan`}
                description={
                    <span className="mono" style={{ fontWeight: 600 }}>
                        {policy.nomor_kebijakan}
                    </span>
                }
                breadcrumbs={[
                    { label: 'Beranda', href: route('dashboard') },
                    { label: 'Kebijakan', href: route('policies.index') },
                    { label: policy.nomor_kebijakan, href: route('policies.show', policy.id) },
                    { label: 'Edit' },
                ]}
            />

            <div style={{ padding: '20px 32px' }}>
                <div style={{ marginBottom: 16 }}>
                    <AIGradientBanner
                        compact
                        eyebrow="AI Editing Assistant"
                        title="Saran revisi otomatis"
                        body="AI dapat membantu menyempurnakan bahasa, mengecek konsistensi pasal, atau menyesuaikan dengan regulasi terbaru."
                        inputValue={aiQ}
                        onInputChange={setAiQ}
                        placeholder="contoh: Sesuaikan dengan POJK terbaru tentang manajemen risiko"
                        onAsk={() => console.log('[AI Edit] ask:', aiQ)}
                        chips={AI_CHIPS}
                        onChipClick={setAiQ}
                    />
                </div>

                <form onSubmit={submit} encType="multipart/form-data">
                    <div style={cardStyle}>
                        <SectionTitle title="Informasi Dasar" hint="Identitas dokumen kebijakan" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={grid2}>
                                <Field label="Nomor Kebijakan" error={errors.nomor_kebijakan}>
                                    <input
                                        style={monoInputStyle}
                                        value={data.nomor_kebijakan}
                                        onChange={(e) => setData('nomor_kebijakan', e.target.value)}
                                    />
                                </Field>
                                <Field label="Versi" error={errors.versi}>
                                    <input
                                        style={monoInputStyle}
                                        value={data.versi}
                                        onChange={(e) => setData('versi', e.target.value)}
                                    />
                                </Field>
                            </div>

                            <Field label="Judul Kebijakan" error={errors.judul}>
                                <input
                                    style={inputStyle}
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                />
                            </Field>

                            <Field label="Deskripsi" error={errors.deskripsi}>
                                <textarea
                                    style={{
                                        ...inputStyle,
                                        minHeight: 100,
                                        resize: 'vertical',
                                        fontFamily: 'inherit',
                                        lineHeight: 1.55,
                                    }}
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                />
                            </Field>

                            <div style={grid2}>
                                <Field label="Kategori" error={errors.kategori}>
                                    <select
                                        style={inputStyle}
                                        value={data.kategori}
                                        onChange={(e) => setData('kategori', e.target.value)}
                                    >
                                        <option value="">Pilih kategori…</option>
                                        {KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                                    </select>
                                </Field>
                                <Field label="Divisi" error={errors.divisi}>
                                    <select
                                        style={inputStyle}
                                        value={data.divisi}
                                        onChange={(e) => setData('divisi', e.target.value)}
                                    >
                                        <option value="">Pilih divisi…</option>
                                        {DIVISI_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </Field>
                            </div>

                            <div style={grid2}>
                                <Field label="Status" error={errors.status}>
                                    <select
                                        style={inputStyle}
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                    >
                                        {STATUS_OPTIONS.map(s => (
                                            <option key={s} value={s}>
                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Tanggal Berlaku" error={errors.tanggal_berlaku}>
                                    <input
                                        type="date"
                                        style={monoInputStyle}
                                        value={data.tanggal_berlaku}
                                        onChange={(e) => setData('tanggal_berlaku', e.target.value)}
                                    />
                                </Field>
                            </div>

                            <Field label="Tanggal Kadaluarsa" error={errors.tanggal_kadaluarsa}>
                                <input
                                    type="date"
                                    style={monoInputStyle}
                                    value={data.tanggal_kadaluarsa}
                                    onChange={(e) => setData('tanggal_kadaluarsa', e.target.value)}
                                />
                            </Field>
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <SectionTitle title="Dokumen" hint="File kebijakan saat ini & ganti file" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {policy.file_path && (
                                <div
                                    style={{
                                        background: '#fff',
                                        borderRadius: 8,
                                        padding: '12px 14px',
                                        border: '1px solid var(--ink-200)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 12,
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                                        <FileText size={18} style={{ color: 'var(--green-700)', flexShrink: 0 }} />
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-900)' }}>
                                                File saat ini
                                            </div>
                                            <div style={{ fontSize: 11.5, color: 'var(--ink-600)', wordBreak: 'break-all' }}>
                                                {policy.file_path.split('/').pop()}
                                            </div>
                                        </div>
                                    </div>
                                    <a href={`/storage/${policy.file_path}`} download style={btnSmall}>
                                        <Download size={13} />
                                        Unduh
                                    </a>
                                </div>
                            )}
                            <Field
                                label={policy.file_path ? 'Ganti File (opsional)' : 'Upload File'}
                                error={errors.file}
                                hint="PDF, DOC, DOCX, XLS, XLSX — maks. 10 MB"
                            >
                                <FileDropzone
                                    file={data.file}
                                    onSelect={(f) => setData('file', f)}
                                    onClear={() => setData('file', null)}
                                />
                            </Field>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            gap: 10,
                            justifyContent: 'flex-end',
                            marginTop: 14,
                        }}
                    >
                        <Link href={route('policies.show', policy.id)} style={btnSecondary}>
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            style={{ ...btnPrimary, opacity: processing ? 0.6 : 1 }}
                        >
                            {processing ? 'Menyimpan…' : 'Perbarui Kebijakan'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    )
}
