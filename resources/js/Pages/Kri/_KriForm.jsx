import SectionTitle from '@/Components/SectionTitle'

const PERIODE_OPTIONS = [
    { value: 'monthly',   label: 'Bulanan' },
    { value: 'quarterly', label: 'Triwulanan' },
    { value: 'annual',    label: 'Tahunan' },
]

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

const labelStyle = {
    display: 'block',
    fontSize: 12.5,
    fontWeight: 600,
    color: 'var(--ink-800)',
    marginBottom: 6,
}

const errorStyle = {
    fontSize: 11.5,
    color: '#b8392a',
    marginTop: 5,
}

function Field({ label, required, hint, error, children }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>
                {label}
                {required && <span style={{ color: '#b8392a', marginLeft: 3 }}>*</span>}
            </label>
            {children}
            {hint && !error && (
                <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 5 }}>{hint}</div>
            )}
            {error && <span style={errorStyle}>{error}</span>}
        </div>
    )
}

export default function KriForm({ form, risks = [], users = [], cardBase }) {
    const { data, setData, errors } = form
    const card = { ...(cardBase || {}), padding: 20, marginBottom: 14 }

    return (
        <>
            {/* Informasi Dasar */}
            <div style={card}>
                <SectionTitle title="Informasi Dasar" hint="Identifikasi indikator yang akan dipantau" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <Field label="Risiko Terkait" required error={errors.risk_id}>
                        <select
                            style={inputStyle}
                            value={data.risk_id}
                            onChange={(e) => setData('risk_id', e.target.value)}
                        >
                            <option value="">— Pilih risiko —</option>
                            {risks.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.kode_risiko} — {r.nama_risiko}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Nama KRI" required error={errors.nama_kri}>
                        <input
                            style={inputStyle}
                            value={data.nama_kri}
                            onChange={(e) => setData('nama_kri', e.target.value)}
                            placeholder="Mis. Rasio Kredit Bermasalah (NPL)"
                        />
                    </Field>

                    <Field label="Deskripsi" error={errors.deskripsi}>
                        <textarea
                            style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                            placeholder="Definisi metrik & cara pengukuran…"
                        />
                    </Field>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <Field label="Satuan" required error={errors.satuan}>
                            <input
                                style={inputStyle}
                                value={data.satuan}
                                onChange={(e) => setData('satuan', e.target.value)}
                                placeholder="%, Rp, kasus, hari…"
                            />
                        </Field>
                        <Field label="Periode" error={errors.periode}>
                            <select
                                style={inputStyle}
                                value={data.periode}
                                onChange={(e) => setData('periode', e.target.value)}
                            >
                                {PERIODE_OPTIONS.map((p) => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>
                        </Field>
                    </div>
                </div>
            </div>

            {/* Threshold */}
            <div style={card}>
                <SectionTitle
                    title="Threshold & Nilai Aktual"
                    hint="Tetapkan ambang batas zona Green / Amber / Red"
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                        <Field label="Threshold Green" hint="Batas atas zona aman" error={errors.threshold_green}>
                            <input
                                type="number"
                                step="any"
                                style={{ ...inputStyle, borderColor: 'var(--green-300)' }}
                                value={data.threshold_green}
                                onChange={(e) => setData('threshold_green', e.target.value)}
                                placeholder="0"
                            />
                        </Field>
                        <Field label="Threshold Amber" hint="Batas atas zona pemantauan" error={errors.threshold_amber}>
                            <input
                                type="number"
                                step="any"
                                style={{ ...inputStyle, borderColor: 'var(--gold-300)' }}
                                value={data.threshold_amber}
                                onChange={(e) => setData('threshold_amber', e.target.value)}
                                placeholder="0"
                            />
                        </Field>
                        <Field label="Threshold Red" hint="Batas zona terlampaui" error={errors.threshold_red}>
                            <input
                                type="number"
                                step="any"
                                style={{ ...inputStyle, borderColor: '#f0c9c1' }}
                                value={data.threshold_red}
                                onChange={(e) => setData('threshold_red', e.target.value)}
                                placeholder="0"
                            />
                        </Field>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <Field label="Nilai Aktual" error={errors.nilai_aktual}>
                            <input
                                type="number"
                                step="any"
                                style={inputStyle}
                                value={data.nilai_aktual}
                                onChange={(e) => setData('nilai_aktual', e.target.value)}
                                placeholder="0"
                            />
                        </Field>
                        <Field label="PIC (Penanggung Jawab)" error={errors.pic_user_id}>
                            <select
                                style={inputStyle}
                                value={data.pic_user_id}
                                onChange={(e) => setData('pic_user_id', e.target.value)}
                            >
                                <option value="">— Pilih pengguna —</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        </Field>
                    </div>
                </div>
            </div>
        </>
    )
}
