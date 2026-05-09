import SectionTitle from '@/Components/SectionTitle'
import Toggle from '@/Components/Toggle'

const TYPE_OPTIONS = [
    { value: 'preventif', label: 'Preventif' },
    { value: 'deteksi',   label: 'Deteksi' },
    { value: 'korektif',  label: 'Korektif' },
]

const FREQUENCY_OPTIONS = [
    { value: '',           label: '— Pilih frekuensi —' },
    { value: 'real-time',  label: 'Real-time' },
    { value: 'harian',     label: 'Harian' },
    { value: 'mingguan',   label: 'Mingguan' },
    { value: 'bulanan',    label: 'Bulanan' },
    { value: 'triwulan',   label: 'Triwulan' },
    { value: 'tahunan',    label: 'Tahunan' },
    { value: 'on-demand',  label: 'On-demand' },
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

const monoInputStyle = {
    ...inputStyle,
    fontFamily: 'JetBrains Mono, ui-monospace, monospace',
    fontFeatureSettings: '"tnum" 1',
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

export default function ControlForm({ form, risks = [], cardBase }) {
    const { data, setData, errors } = form
    const card = { ...(cardBase || {}), padding: 20, marginBottom: 14 }

    const eff = Number(data.effectiveness) || 0
    const effColor = eff >= 85 ? 'var(--green-600)' : eff >= 70 ? 'var(--gold-500)' : '#b8392a'

    return (
        <>
            {/* Informasi Dasar */}
            <div style={card}>
                <SectionTitle title="Informasi Dasar" hint="Identitas kontrol dalam katalog" />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    <Field label="Kode Kontrol" required error={errors.control_code}>
                        <input
                            style={monoInputStyle}
                            value={data.control_code}
                            onChange={(e) => setData('control_code', e.target.value)}
                            placeholder="CTRL-OP-001"
                        />
                    </Field>

                    <Field label="Tipe Kontrol" error={errors.type}>
                        <select
                            style={inputStyle}
                            value={data.type ?? ''}
                            onChange={(e) => setData('type', e.target.value)}
                        >
                            <option value="">— Pilih tipe —</option>
                            {TYPE_OPTIONS.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </Field>
                </div>

                <div style={{ marginBottom: 14 }}>
                    <Field
                        label="Deskripsi Kontrol"
                        required
                        error={errors.description}
                        hint="Jelaskan tujuan dan cara kerja kontrol secara ringkas."
                    >
                        <textarea
                            style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Mis. Approval matrix bertingkat di sistem core untuk transaksi besar."
                        />
                    </Field>
                </div>
            </div>

            {/* Pengukuran */}
            <div style={card}>
                <SectionTitle title="Pengukuran & Frekuensi" hint="Efektivitas, frekuensi, dan otomasi kontrol" />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    <Field
                        label="Effectiveness (0–100)"
                        error={errors.effectiveness}
                        hint="Skor efektivitas hasil pengujian terakhir."
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                step={1}
                                value={eff}
                                onChange={(e) => setData('effectiveness', e.target.value)}
                                style={{ flex: 1, accentColor: effColor }}
                            />
                            <input
                                type="number"
                                min={0}
                                max={100}
                                step={1}
                                value={data.effectiveness ?? ''}
                                onChange={(e) => setData('effectiveness', e.target.value)}
                                style={{ ...monoInputStyle, width: 90 }}
                            />
                        </div>
                    </Field>

                    <Field label="Frekuensi" error={errors.frequency}>
                        <select
                            style={inputStyle}
                            value={data.frequency ?? ''}
                            onChange={(e) => setData('frequency', e.target.value)}
                        >
                            {FREQUENCY_OPTIONS.map((f) => (
                                <option key={f.value} value={f.value}>{f.label}</option>
                            ))}
                        </select>
                    </Field>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Field
                        label="Tanggal Pengujian Terakhir"
                        error={errors.test_date}
                        hint="Tanggal pengujian/review terakhir kontrol."
                    >
                        <input
                            type="date"
                            style={monoInputStyle}
                            value={data.test_date ?? ''}
                            onChange={(e) => setData('test_date', e.target.value)}
                        />
                    </Field>

                    <Field
                        label="Tipe Eksekusi"
                        error={errors.automated}
                        hint="Apakah kontrol dijalankan secara otomatis oleh sistem?"
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 4 }}>
                            <Toggle
                                checked={!!data.automated}
                                onChange={(next) => setData('automated', next)}
                                size="md"
                            />
                            <span style={{ fontSize: 13, color: 'var(--ink-700)', fontWeight: 500 }}>
                                {data.automated ? 'Otomatis' : 'Manual'}
                            </span>
                        </div>
                    </Field>
                </div>
            </div>

            {/* Pemilik & Risiko Terkait */}
            <div style={card}>
                <SectionTitle title="Risiko Terkait & Bukti" hint="Hubungkan kontrol dengan risiko dan bukti pendukung" />

                <div style={{ marginBottom: 14 }}>
                    <Field label="Risiko Terkait" required error={errors.risk_id}>
                        <select
                            style={inputStyle}
                            value={data.risk_id ?? ''}
                            onChange={(e) => setData('risk_id', e.target.value)}
                        >
                            <option value="">— Pilih risiko —</option>
                            {risks.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.risk_code} — {r.title}
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>

                <Field
                    label="URL Bukti / Evidence"
                    error={errors.evidence_url}
                    hint="Tautan ke dokumen, dashboard, atau sistem pendukung kontrol."
                >
                    <input
                        type="url"
                        style={inputStyle}
                        value={data.evidence_url ?? ''}
                        onChange={(e) => setData('evidence_url', e.target.value)}
                        placeholder="https://…"
                    />
                </Field>
            </div>
        </>
    )
}
