import { useState, useMemo } from 'react'
import { router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { Check, Save, Settings as SettingsIcon } from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import SectionTitle from '@/Components/SectionTitle'
import Toggle from '@/Components/Toggle'

const cardStyle = {
    background: 'var(--paper)',
    border: '1px solid var(--ink-200)',
    borderRadius: 'var(--radius-lg)',
    padding: 18,
    marginBottom: 14,
}

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

const btnPrimary = {
    background: 'var(--green-700)',
    color: '#fff',
    padding: '8px 14px',
    borderRadius: 8,
    border: '1px solid var(--green-700)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
}

const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--ink-900)',
    marginBottom: 4,
}

const hintStyle = {
    fontSize: 12,
    color: 'var(--ink-600)',
    lineHeight: 1.5,
}

function asBoolean(v) {
    return v === true || v === 'true' || v === 1 || v === '1'
}

/** Single setting row with 2-col layout (label+description / input). */
function SettingField({ setting, value, onChange }) {
    const { type, label, description, key } = setting

    let input
    if (type === 'boolean') {
        const checked = asBoolean(value)
        input = (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Toggle checked={checked} onChange={(next) => onChange(next)} size="md" />
                <span style={{ fontSize: 12.5, color: 'var(--ink-600)', fontWeight: 500 }}>
                    {checked ? 'Aktif' : 'Nonaktif'}
                </span>
            </div>
        )
    } else if (type === 'integer') {
        input = (
            <input
                type="number"
                style={monoInputStyle}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
            />
        )
    } else if (type === 'json') {
        input = (
            <textarea
                style={{
                    ...monoInputStyle,
                    minHeight: 110,
                    resize: 'vertical',
                    fontSize: 12,
                    lineHeight: 1.5,
                }}
                value={typeof value === 'string' ? value : JSON.stringify(value ?? {}, null, 2)}
                onChange={(e) => onChange(e.target.value)}
                spellCheck={false}
            />
        )
    } else {
        input = (
            <input
                type="text"
                style={inputStyle}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
            />
        )
    }

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.4fr',
                gap: 18,
                alignItems: 'start',
                padding: '14px 0',
                borderBottom: '1px solid var(--ink-100)',
            }}
        >
            <div>
                <div style={labelStyle}>{label ?? key}</div>
                {description && <div style={hintStyle}>{description}</div>}
                <code
                    className="mono"
                    style={{
                        fontSize: 11,
                        color: 'var(--ink-500)',
                        marginTop: 4,
                        display: 'inline-block',
                    }}
                >
                    {key}
                </code>
            </div>
            <div>{input}</div>
        </div>
    )
}

/** One section card with batch save-per-section. */
function SettingSection({ groupKey, settings }) {
    const [values, setValues] = useState(() => {
        const init = {}
        settings.forEach((s) => { init[s.key] = s.value })
        return init
    })
    const [saving, setSaving] = useState(false)
    const [saved, setSaved]   = useState(false)

    function handleChange(key, val) {
        setValues((prev) => ({ ...prev, [key]: val }))
        setSaved(false)
    }

    function handleSave() {
        setSaving(true)

        // Batch by chaining requests (one PUT per setting key).
        const keys = Object.keys(values)
        let chain = Promise.resolve()
        keys.forEach((key) => {
            chain = chain.then(
                () =>
                    new Promise((resolve) => {
                        router.put(
                            route('pengaturan.update', key),
                            { value: values[key] },
                            {
                                preserveState: true,
                                preserveScroll: true,
                                onFinish: resolve,
                            },
                        )
                    }),
            )
        })
        chain.then(() => {
            setSaving(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        })
    }

    const groupLabel = groupKey
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())

    return (
        <div style={cardStyle}>
            <SectionTitle
                title={groupLabel}
                hint={`${settings.length} pengaturan`}
                actions={
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            ...btnPrimary,
                            background: saved ? 'var(--green-600)' : 'var(--green-700)',
                            opacity: saving ? 0.7 : 1,
                            transition: 'background 200ms',
                        }}
                    >
                        {saved ? (
                            <>
                                <Check size={14} />
                                Tersimpan
                            </>
                        ) : saving ? (
                            'Menyimpan…'
                        ) : (
                            <>
                                <Save size={14} />
                                Simpan
                            </>
                        )}
                    </button>
                }
            />
            <div>
                {settings.map((s) => (
                    <SettingField
                        key={s.key}
                        setting={s}
                        value={values[s.key]}
                        onChange={(val) => handleChange(s.key, val)}
                    />
                ))}
            </div>
        </div>
    )
}

export default function PengaturanIndex({ settings = [] }) {
    const grouped = useMemo(() => {
        const map = {}
        settings.forEach((s) => {
            const g = s.group ?? 'umum'
            if (!map[g]) map[g] = []
            map[g].push(s)
        })
        return map
    }, [settings])

    const groups = Object.keys(grouped)

    return (
        <AppLayout title="Pengaturan Sistem">
            <PageHeader
                title="Pengaturan Sistem"
                description="Konfigurasi operasional aplikasi GRC. Setiap section disimpan secara terpisah."
                breadcrumbs={[
                    { label: 'Beranda', href: route('dashboard') },
                    { label: 'Pengaturan' },
                ]}
            />

            <div style={{ padding: '20px 32px' }}>
                {groups.length === 0 ? (
                    <div
                        style={{
                            ...cardStyle,
                            textAlign: 'center',
                            padding: 48,
                        }}
                    >
                        <div
                            style={{
                                width: 56,
                                height: 56,
                                margin: '0 auto 14px',
                                borderRadius: 56,
                                background: 'var(--ink-100)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--ink-500)',
                            }}
                        >
                            <SettingsIcon size={24} />
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--ink-600)' }}>
                            Belum ada pengaturan yang terdaftar.
                        </div>
                    </div>
                ) : (
                    groups.map((g) => (
                        <SettingSection
                            key={g}
                            groupKey={g}
                            settings={grouped[g]}
                        />
                    ))
                )}
            </div>
        </AppLayout>
    )
}
