import { useForm, Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import SectionTitle from '@/Components/SectionTitle'

const JENIS_OPTIONS = [
    { value: 'undang_undang',         label: 'Undang-Undang' },
    { value: 'peraturan_pemerintah',  label: 'Peraturan Pemerintah' },
    { value: 'peraturan_ojk',         label: 'Peraturan OJK' },
    { value: 'surat_edaran_bi',       label: 'Surat Edaran BI' },
    { value: 'lainnya',               label: 'Lainnya' },
]

const STATUS_OPTIONS = [
    { value: 'active',     label: 'Active' },
    { value: 'superseded', label: 'Superseded' },
    { value: 'revoked',    label: 'Revoked' },
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

export default function RegulasiEdit({ regulation }) {
    const { data, setData, put, processing, errors } = useForm({
        nomor_regulasi:  regulation.nomor_regulasi  ?? '',
        judul:           regulation.judul           ?? '',
        penerbit:        regulation.penerbit        ?? '',
        jenis:           regulation.jenis           ?? 'peraturan_ojk',
        tanggal_terbit:  regulation.tanggal_terbit  ?? '',
        tanggal_berlaku: regulation.tanggal_berlaku ?? '',
        status:          regulation.status          ?? 'active',
        ringkasan:       regulation.ringkasan       ?? '',
        url_sumber:      regulation.url_sumber      ?? '',
    })

    function submit(e) {
        e.preventDefault()
        put(route('regulations.update', regulation.id))
    }

    const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }

    return (
        <AppLayout title={`Edit Regulasi — ${regulation.nomor_regulasi}`}>
            <PageHeader
                title="Edit Regulasi"
                description={
                    <span className="mono" style={{ fontWeight: 600 }}>
                        {regulation.nomor_regulasi}
                    </span>
                }
                breadcrumbs={[
                    { label: 'Beranda', href: route('dashboard') },
                    { label: 'Regulasi', href: route('regulations.index') },
                    { label: regulation.nomor_regulasi, href: route('regulations.show', regulation.id) },
                    { label: 'Edit' },
                ]}
            />

            <div style={{ padding: '20px 32px' }}>
                <form onSubmit={submit}>
                    <div style={cardStyle}>
                        <SectionTitle title="Informasi Dasar" hint="Identitas regulasi yang dimonitor" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={grid2}>
                                <Field label="Nomor Regulasi" error={errors.nomor_regulasi}>
                                    <input
                                        style={monoInputStyle}
                                        value={data.nomor_regulasi}
                                        onChange={(e) => setData('nomor_regulasi', e.target.value)}
                                    />
                                </Field>
                                <Field label="Penerbit" error={errors.penerbit}>
                                    <input
                                        style={inputStyle}
                                        value={data.penerbit}
                                        onChange={(e) => setData('penerbit', e.target.value)}
                                    />
                                </Field>
                            </div>

                            <Field label="Judul Regulasi" error={errors.judul}>
                                <input
                                    style={inputStyle}
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                />
                            </Field>

                            <div style={grid2}>
                                <Field label="Jenis" error={errors.jenis}>
                                    <select
                                        style={inputStyle}
                                        value={data.jenis}
                                        onChange={(e) => setData('jenis', e.target.value)}
                                    >
                                        {JENIS_OPTIONS.map(j => <option key={j.value} value={j.value}>{j.label}</option>)}
                                    </select>
                                </Field>
                                <Field label="Status" error={errors.status}>
                                    <select
                                        style={inputStyle}
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                    >
                                        {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                    </select>
                                </Field>
                            </div>

                            <div style={grid2}>
                                <Field label="Tanggal Terbit" error={errors.tanggal_terbit}>
                                    <input
                                        type="date"
                                        style={monoInputStyle}
                                        value={data.tanggal_terbit}
                                        onChange={(e) => setData('tanggal_terbit', e.target.value)}
                                    />
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

                            <Field label="URL Sumber (opsional)" error={errors.url_sumber}>
                                <input
                                    type="url"
                                    style={inputStyle}
                                    value={data.url_sumber}
                                    onChange={(e) => setData('url_sumber', e.target.value)}
                                />
                            </Field>
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <SectionTitle title="Ringkasan" hint="Inti regulasi dalam bentuk naratif" />
                        <Field label="Ringkasan Regulasi" error={errors.ringkasan}>
                            <textarea
                                style={{
                                    ...inputStyle,
                                    minHeight: 140,
                                    resize: 'vertical',
                                    fontFamily: 'Fraunces, Georgia, serif',
                                    lineHeight: 1.7,
                                    fontSize: 13.5,
                                }}
                                value={data.ringkasan}
                                onChange={(e) => setData('ringkasan', e.target.value)}
                            />
                        </Field>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            gap: 10,
                            justifyContent: 'flex-end',
                            marginTop: 14,
                        }}
                    >
                        <Link href={route('regulations.show', regulation.id)} style={btnSecondary}>
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            style={{ ...btnPrimary, opacity: processing ? 0.6 : 1 }}
                        >
                            {processing ? 'Menyimpan…' : 'Perbarui Regulasi'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    )
}
