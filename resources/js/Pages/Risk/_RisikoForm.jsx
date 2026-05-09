import SectionTitle from '@/Components/SectionTitle'

/* Shared form fields used by Risiko/Create.jsx and Risiko/Edit.jsx. */

const KATEGORI_OPTIONS = [
    { value: 'operasional', label: 'Operasional' },
    { value: 'finansial',   label: 'Finansial' },
    { value: 'kepatuhan',   label: 'Kepatuhan' },
    { value: 'reputasi',    label: 'Reputasi' },
    { value: 'strategis',   label: 'Strategis' },
]

const STATUS_OPTIONS = [
    { value: 'identified', label: 'Teridentifikasi' },
    { value: 'assessed',   label: 'Dinilai' },
    { value: 'mitigated',  label: 'Termitigasi' },
    { value: 'accepted',   label: 'Diterima' },
    { value: 'closed',     label: 'Selesai' },
]

const SCALE_OPTIONS = [1, 2, 3, 4, 5]

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
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

function chipStyle(score) {
    const n = Number(score) || 0
    let bg = 'var(--ink-100)', fg = 'var(--ink-600)'
    if (n >= 16)      { bg = '#fbe4df'; fg = '#8b261b' }
    else if (n >= 7)  { bg = '#fbecd1'; fg = '#7a4f0a' }
    else if (n >= 1)  { bg = '#d6f0e3'; fg = '#0f4a37' }
    return { background: bg, color: fg }
}

function ScoreChip({ likelihood, impact, label }) {
    const score = (Number(likelihood) || 0) * (Number(impact) || 0)
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={labelStyle}>{label}</span>
            <div
                className="mono"
                style={{
                    ...chipStyle(score),
                    border: '1px solid var(--ink-200)',
                    borderRadius: 8,
                    padding: '8px 10px',
                    fontSize: 22,
                    fontWeight: 700,
                    minWidth: 64,
                    textAlign: 'center',
                }}
            >
                {score || '—'}
            </div>
            <span style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 5 }}>
                Likelihood × Dampak
            </span>
        </div>
    )
}

export default function RisikoForm({ form, users = [], cardBase }) {
    const { data, setData, errors } = form
    const card = { ...(cardBase || {}), padding: 20, marginBottom: 14 }

    return (
        <>
            {/* Informasi Dasar */}
            <div style={card}>
                <SectionTitle title="Informasi Dasar" hint="Identitas risiko dalam register" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    <Field label="Kode Risiko" required error={errors.kode_risiko}>
                        <input
                            style={inputStyle}
                            value={data.kode_risiko}
                            onChange={(e) => setData('kode_risiko', e.target.value)}
                            placeholder="RSK-OPS-001"
                        />
                    </Field>
                    <Field label="Kategori" required error={errors.kategori}>
                        <select
                            style={inputStyle}
                            value={data.kategori}
                            onChange={(e) => setData('kategori', e.target.value)}
                        >
                            {KATEGORI_OPTIONS.map((k) => (
                                <option key={k.value} value={k.value}>{k.label}</option>
                            ))}
                        </select>
                    </Field>
                </div>

                <div style={{ marginBottom: 14 }}>
                    <Field label="Nama Risiko" required error={errors.nama_risiko}>
                        <input
                            style={inputStyle}
                            value={data.nama_risiko}
                            onChange={(e) => setData('nama_risiko', e.target.value)}
                            placeholder="Nama risiko yang jelas dan deskriptif"
                        />
                    </Field>
                </div>

                <div style={{ marginBottom: 14 }}>
                    <Field label="Deskripsi" error={errors.deskripsi}>
                        <textarea
                            style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                            placeholder="Uraikan risiko, penyebab, dan dampaknya…"
                        />
                    </Field>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Field label="Unit Pemilik" error={errors.unit_pemilik}>
                        <input
                            style={inputStyle}
                            value={data.unit_pemilik}
                            onChange={(e) => setData('unit_pemilik', e.target.value)}
                            placeholder="Mis. Divisi Operasional"
                        />
                    </Field>
                    <Field label="Status" error={errors.status}>
                        <select
                            style={inputStyle}
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                        >
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </Field>
                </div>
            </div>

            {/* Inherent */}
            <div style={card}>
                <SectionTitle title="Inherent Risk" hint="Penilaian sebelum penerapan kontrol" />
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: 14,
                        alignItems: 'end',
                    }}
                >
                    <Field label="Likelihood (1–5)" error={errors.inherent_likelihood}>
                        <select
                            style={inputStyle}
                            value={data.inherent_likelihood}
                            onChange={(e) => setData('inherent_likelihood', e.target.value)}
                        >
                            <option value="">Pilih…</option>
                            {SCALE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </Field>
                    <Field label="Dampak (1–5)" error={errors.inherent_impact}>
                        <select
                            style={inputStyle}
                            value={data.inherent_impact}
                            onChange={(e) => setData('inherent_impact', e.target.value)}
                        >
                            <option value="">Pilih…</option>
                            {SCALE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </Field>
                    <ScoreChip
                        likelihood={data.inherent_likelihood}
                        impact={data.inherent_impact}
                        label="Inherent Score"
                    />
                </div>
            </div>

            {/* Residual */}
            <div style={card}>
                <SectionTitle title="Residual Risk" hint="Penilaian setelah penerapan kontrol" />
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: 14,
                        alignItems: 'end',
                    }}
                >
                    <Field label="Likelihood (1–5)" error={errors.residual_likelihood}>
                        <select
                            style={inputStyle}
                            value={data.residual_likelihood}
                            onChange={(e) => setData('residual_likelihood', e.target.value)}
                        >
                            <option value="">Pilih…</option>
                            {SCALE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </Field>
                    <Field label="Dampak (1–5)" error={errors.residual_impact}>
                        <select
                            style={inputStyle}
                            value={data.residual_impact}
                            onChange={(e) => setData('residual_impact', e.target.value)}
                        >
                            <option value="">Pilih…</option>
                            {SCALE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </Field>
                    <ScoreChip
                        likelihood={data.residual_likelihood}
                        impact={data.residual_impact}
                        label="Residual Score"
                    />
                </div>
            </div>

            {/* Appetite + PIC */}
            <div style={card}>
                <SectionTitle title="Risk Appetite & PIC" hint="Toleransi residual & penanggung jawab" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Field
                        label="Risk Appetite"
                        hint="Skor maksimum residual yang dapat diterima (1–25)"
                        error={errors.risk_appetite}
                    >
                        <input
                            type="number"
                            min={1}
                            max={25}
                            style={inputStyle}
                            value={data.risk_appetite}
                            onChange={(e) => setData('risk_appetite', e.target.value)}
                            placeholder="Mis. 8"
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
        </>
    )
}
