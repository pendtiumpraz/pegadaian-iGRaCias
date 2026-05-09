import { useForm, Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import AIGradientBanner from '@/Components/AIGradientBanner'
import RisikoForm from './_RisikoForm'

const cardBase = {
    background: '#fff',
    borderRadius: 'var(--radius-lg, 12px)',
    border: '1px solid var(--ink-200)',
}

const btnPrimary = {
    background: 'var(--green-700)',
    color: '#fff',
    padding: '8px 18px',
    height: 36,
    borderRadius: 8,
    border: '1px solid var(--green-700)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13.5,
}

const btnSecondary = {
    background: '#fff',
    color: 'var(--ink-800)',
    padding: '8px 18px',
    height: 36,
    borderRadius: 8,
    border: '1px solid var(--ink-300)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13.5,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
}

export default function RisikoEdit({ risk, users = [] }) {
    const form = useForm({
        kode_risiko:         risk.kode_risiko         ?? '',
        nama_risiko:         risk.nama_risiko         ?? '',
        deskripsi:           risk.deskripsi           ?? '',
        kategori:            risk.kategori            ?? 'operasional',
        unit_pemilik:        risk.unit_pemilik        ?? '',
        inherent_likelihood: risk.inherent_likelihood ?? '',
        inherent_impact:     risk.inherent_impact     ?? '',
        residual_likelihood: risk.residual_likelihood ?? '',
        residual_impact:     risk.residual_impact     ?? '',
        risk_appetite:       risk.risk_appetite       ?? '',
        status:              risk.status              ?? 'identified',
        pic_user_id:         risk.pic_user_id         ?? '',
    })

    function submit(e) {
        e.preventDefault()
        form.put(route('risk.update', risk.id))
    }

    function applyTemplate(label) {
        const k = label.toLowerCase()
        if (k.includes('operasional')) form.setData('kategori', 'operasional')
        else if (k.includes('finansial')) form.setData('kategori', 'finansial')
        else if (k.includes('kepatuhan')) form.setData('kategori', 'kepatuhan')
        else if (k.includes('reputasi')) form.setData('kategori', 'reputasi')
        else if (k.includes('strategis')) form.setData('kategori', 'strategis')
    }

    return (
        <AppLayout title={`Edit Risiko — ${risk.kode_risiko}`}>
            <PageHeader
                title="Edit Risiko"
                description={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <span className="mono" style={{ fontWeight: 600, color: 'var(--ink-700)' }}>
                            {risk.kode_risiko}
                        </span>
                        <span style={{ color: 'var(--ink-300)' }}>·</span>
                        <span style={{ color: 'var(--ink-600)' }}>{risk.nama_risiko}</span>
                    </span>
                }
                breadcrumbs={[
                    { label: 'Beranda',          href: route('dashboard') },
                    { label: 'Manajemen Risiko', href: route('risk.index') },
                    { label: risk.kode_risiko,   href: route('risk.show', risk.id) },
                    { label: 'Edit' },
                ]}
            />

            <div style={{ padding: '20px 32px' }}>
                <div style={{ marginBottom: 18 }}>
                    <AIGradientBanner
                        compact
                        title="AI Assistant"
                        body="Sesuaikan kategori dengan template untuk konsistensi taksonomi."
                        chips={[
                            'Risiko Operasional',
                            'Risiko Finansial',
                            'Risiko Kepatuhan',
                            'Risiko Reputasi',
                            'Risiko Strategis',
                        ]}
                        onChipClick={applyTemplate}
                    />
                </div>

                <form onSubmit={submit}>
                    <RisikoForm
                        form={form}
                        users={users}
                        cardBase={cardBase}
                    />

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
                        <Link href={route('risk.show', risk.id)} style={btnSecondary}>Batal</Link>
                        <button
                            type="submit"
                            disabled={form.processing}
                            style={{ ...btnPrimary, opacity: form.processing ? 0.6 : 1 }}
                        >
                            {form.processing ? 'Menyimpan…' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    )
}
