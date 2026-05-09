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

export default function RisikoCreate({ users = [] }) {
    const form = useForm({
        kode_risiko:          '',
        nama_risiko:          '',
        deskripsi:            '',
        kategori:             'operasional',
        unit_pemilik:         '',
        inherent_likelihood:  '',
        inherent_impact:      '',
        residual_likelihood:  '',
        residual_impact:      '',
        risk_appetite:        '',
        status:               'identified',
        pic_user_id:          '',
    })

    function submit(e) {
        e.preventDefault()
        form.post(route('risk.store'))
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
        <AppLayout title="Tambah Risiko">
            <PageHeader
                title="Tambah Risiko"
                description="Daftarkan risiko baru ke dalam risk register."
                breadcrumbs={[
                    { label: 'Beranda',          href: route('dashboard') },
                    { label: 'Manajemen Risiko', href: route('risk.index') },
                    { label: 'Tambah' },
                ]}
            />

            <div style={{ padding: '20px 32px' }}>
                <div style={{ marginBottom: 18 }}>
                    <AIGradientBanner
                        compact
                        title="AI Assistant"
                        body="Gunakan template risiko untuk auto-fill berdasarkan kategori bisnis."
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
                        <Link href={route('risk.index')} style={btnSecondary}>Batal</Link>
                        <button
                            type="submit"
                            disabled={form.processing}
                            style={{ ...btnPrimary, opacity: form.processing ? 0.6 : 1 }}
                        >
                            {form.processing ? 'Menyimpan…' : 'Simpan Risiko'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    )
}
