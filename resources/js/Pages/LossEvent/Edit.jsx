import { useForm, Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import SectionTitle from '@/Components/SectionTitle'
import AIGradientBanner from '@/Components/AIGradientBanner'

const KATEGORI_OPTIONS = [
    { value: 'internal_fraud',      label: 'Internal Fraud' },
    { value: 'external_fraud',      label: 'External Fraud' },
    { value: 'employment',          label: 'Employment Practices & Workplace Safety' },
    { value: 'clients_products',    label: 'Clients, Products & Business Practices' },
    { value: 'physical_damage',     label: 'Damage to Physical Assets' },
    { value: 'business_disruption', label: 'Business Disruption & System Failures' },
    { value: 'execution_delivery',  label: 'Execution, Delivery & Process Management' },
]

const STATUS_OPTIONS = ['identified', 'assessed', 'recovery', 'recovered', 'litigation', 'closed']
const CURRENCY_OPTIONS = ['IDR', 'USD', 'EUR', 'SGD']

const AI_CHIPS = [
    'Klasifikasikan ke Internal Fraud',
    'Klasifikasikan ke Execution/Delivery',
    'Estimasi recovery rate',
    'Sarankan action plan',
]

const cardStyle = {
    background: '#fff',
    border: '1px solid var(--ink-200)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 24px',
    marginBottom: 14,
}

const inputStyle = {
    width: '100%',
    background: '#fff',
    border: '1px solid var(--ink-200)',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13.5,
    color: 'var(--ink-900)',
    outline: 'none',
    boxSizing: 'border-box',
}

const inputMonoStyle = {
    ...inputStyle,
    fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
    letterSpacing: 0.3,
}

const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--ink-600)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
}

const errorStyle = {
    fontSize: 11.5,
    color: '#b8392a',
    marginTop: 4,
}

const btnPrimary = {
    background: 'var(--green-700)',
    color: '#fff',
    padding: '9px 18px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13.5,
}

const btnSecondary = {
    background: '#fff',
    color: 'var(--ink-700)',
    padding: '9px 18px',
    borderRadius: 8,
    border: '1px solid var(--ink-200)',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: 13.5,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
}

function Field({ label, error, children, hint }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>{label}</label>
            {children}
            {hint && !error && (
                <span style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 4 }}>{hint}</span>
            )}
            {error && <span style={errorStyle}>{error}</span>}
        </div>
    )
}

export default function LossEdit({ loss, users = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        nomor_loss:        loss.nomor_loss        ?? '',
        judul:             loss.judul             ?? '',
        deskripsi:         loss.deskripsi         ?? '',
        kategori:          loss.kategori          ?? 'internal_fraud',
        tanggal_kejadian:  loss.tanggal_kejadian  ?? '',
        jumlah_kerugian:   loss.jumlah_kerugian   ?? '',
        mata_uang:         loss.mata_uang         ?? 'IDR',
        status:            loss.status            ?? 'identified',
        recovered_amount:  loss.recovered_amount  ?? '',
        pic_user_id:       loss.pic_user_id       ?? '',
    })

    function submit(e) {
        e.preventDefault()
        put(route('loss.update', loss.id))
    }

    function handleAIChip(chip) {
        if (chip.includes('Internal Fraud')) setData('kategori', 'internal_fraud')
        else if (chip.includes('Execution/Delivery')) setData('kategori', 'execution_delivery')
    }

    const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }
    const grid3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }

    return (
        <AppLayout title={`Edit Loss — ${loss.nomor_loss}`} contentPadding="none">
            <PageHeader
                title={`Edit Loss — ${loss.nomor_loss}`}
                description="Perbarui data kejadian kerugian dan status recovery."
                breadcrumbs={[
                    { label: 'Beranda',     href: route('dashboard') },
                    { label: 'Loss Events', href: route('loss.index') },
                    { label: loss.nomor_loss, href: route('loss.show', loss.id) },
                    { label: 'Edit' },
                ]}
            />

            <div style={{ padding: '20px 32px' }}>
                <div style={{ marginBottom: 14 }}>
                    <AIGradientBanner
                        compact
                        eyebrow="AI Klasifikasi"
                        title="Klasifikasikan kerugian otomatis berdasarkan deskripsi"
                        body="Edit kronologi atau kategori — gunakan saran AI untuk re-klasifikasi cepat."
                        chips={AI_CHIPS}
                        onChipClick={handleAIChip}
                    />
                </div>

                <form onSubmit={submit}>
                    {/* Identifikasi */}
                    <div style={cardStyle}>
                        <SectionTitle title="Identifikasi" hint="Nomor referensi & judul kejadian" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={grid2}>
                                <Field label="Nomor Loss" error={errors.nomor_loss}>
                                    <input
                                        style={inputMonoStyle}
                                        value={data.nomor_loss}
                                        onChange={e => setData('nomor_loss', e.target.value)}
                                    />
                                </Field>
                                <Field label="Kategori (Basel)" error={errors.kategori}>
                                    <select style={inputStyle} value={data.kategori} onChange={e => setData('kategori', e.target.value)}>
                                        {KATEGORI_OPTIONS.map(k => (
                                            <option key={k.value} value={k.value}>{k.label}</option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            <Field label="Judul Kejadian" error={errors.judul}>
                                <input
                                    style={inputStyle}
                                    value={data.judul}
                                    onChange={e => setData('judul', e.target.value)}
                                />
                            </Field>

                            <Field label="Deskripsi & Kronologi" error={errors.deskripsi}>
                                <textarea
                                    style={{ ...inputStyle, minHeight: 96, resize: 'vertical', fontFamily: 'inherit' }}
                                    value={data.deskripsi}
                                    onChange={e => setData('deskripsi', e.target.value)}
                                />
                            </Field>
                        </div>
                    </div>

                    {/* Nilai & Recovery */}
                    <div style={cardStyle}>
                        <SectionTitle title="Nilai & Recovery" hint="Jumlah kerugian, recovery, dan tahap penanganan" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={grid3}>
                                <Field label="Jumlah Kerugian" error={errors.jumlah_kerugian}>
                                    <input
                                        type="number"
                                        min={0}
                                        step="any"
                                        style={inputMonoStyle}
                                        value={data.jumlah_kerugian}
                                        onChange={e => setData('jumlah_kerugian', e.target.value)}
                                    />
                                </Field>
                                <Field label="Recovered Amount" error={errors.recovered_amount} hint="Total ter-recover hingga saat ini">
                                    <input
                                        type="number"
                                        min={0}
                                        step="any"
                                        style={inputMonoStyle}
                                        value={data.recovered_amount}
                                        onChange={e => setData('recovered_amount', e.target.value)}
                                    />
                                </Field>
                                <Field label="Mata Uang" error={errors.mata_uang}>
                                    <select style={inputStyle} value={data.mata_uang} onChange={e => setData('mata_uang', e.target.value)}>
                                        {CURRENCY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </Field>
                            </div>

                            <div style={grid2}>
                                <Field label="Status" error={errors.status}>
                                    <select style={inputStyle} value={data.status} onChange={e => setData('status', e.target.value)}>
                                        {STATUS_OPTIONS.map(s => (
                                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Tanggal Kejadian" error={errors.tanggal_kejadian}>
                                    <input
                                        type="date"
                                        style={inputMonoStyle}
                                        value={data.tanggal_kejadian}
                                        onChange={e => setData('tanggal_kejadian', e.target.value)}
                                    />
                                </Field>
                            </div>

                            <Field label="PIC (Penanggung Jawab)" error={errors.pic_user_id}>
                                {users.length > 0 ? (
                                    <select style={inputStyle} value={data.pic_user_id} onChange={e => setData('pic_user_id', e.target.value)}>
                                        <option value="">— Pilih pengguna —</option>
                                        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                ) : (
                                    <input
                                        type="number"
                                        style={inputMonoStyle}
                                        value={data.pic_user_id}
                                        onChange={e => setData('pic_user_id', e.target.value)}
                                        placeholder="User ID"
                                    />
                                )}
                            </Field>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 18 }}>
                        <Link href={route('loss.show', loss.id)} style={btnSecondary}>Batal</Link>
                        <button type="submit" disabled={processing} style={{ ...btnPrimary, opacity: processing ? 0.6 : 1 }}>
                            {processing ? 'Menyimpan…' : 'Perbarui Loss Event'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    )
}
