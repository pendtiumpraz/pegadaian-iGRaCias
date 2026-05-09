import { useForm, Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import KriForm from './_KriForm'

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

export default function KriCreate({ risks = [], users = [] }) {
    const form = useForm({
        risk_id:         '',
        nama_kri:        '',
        deskripsi:       '',
        satuan:          '',
        threshold_green: '',
        threshold_amber: '',
        threshold_red:   '',
        nilai_aktual:    '',
        periode:         'monthly',
        pic_user_id:     '',
    })

    function submit(e) {
        e.preventDefault()
        form.post(route('kri.store'))
    }

    return (
        <AppLayout title="Tambah KRI">
            <PageHeader
                title="Tambah KRI"
                description="Daftarkan Key Risk Indicator baru untuk risiko terkait."
                breadcrumbs={[
                    { label: 'Beranda',            href: route('dashboard') },
                    { label: 'Key Risk Indicator', href: route('kri.index') },
                    { label: 'Tambah' },
                ]}
            />

            <div style={{ padding: '20px 32px' }}>
                <form onSubmit={submit}>
                    <KriForm form={form} risks={risks} users={users} cardBase={cardBase} />

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
                        <Link href={route('kri.index')} style={btnSecondary}>Batal</Link>
                        <button
                            type="submit"
                            disabled={form.processing}
                            style={{ ...btnPrimary, opacity: form.processing ? 0.6 : 1 }}
                        >
                            {form.processing ? 'Menyimpan…' : 'Simpan KRI'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    )
}
