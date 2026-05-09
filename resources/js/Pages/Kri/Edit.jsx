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

export default function KriEdit({ kri, risks = [], users = [] }) {
    const form = useForm({
        risk_id:         kri.risk_id         ?? '',
        nama_kri:        kri.nama_kri        ?? '',
        deskripsi:       kri.deskripsi       ?? '',
        satuan:          kri.satuan          ?? '',
        threshold_green: kri.threshold_green ?? '',
        threshold_amber: kri.threshold_amber ?? '',
        threshold_red:   kri.threshold_red   ?? '',
        nilai_aktual:    kri.nilai_aktual    ?? '',
        periode:         kri.periode         ?? 'monthly',
        pic_user_id:     kri.pic_user_id     ?? '',
    })

    function submit(e) {
        e.preventDefault()
        form.put(route('kri.update', kri.id))
    }

    return (
        <AppLayout title={`Edit KRI — ${kri.nama_kri}`}>
            <PageHeader
                title="Edit KRI"
                description={kri.nama_kri}
                breadcrumbs={[
                    { label: 'Beranda',            href: route('dashboard') },
                    { label: 'Key Risk Indicator', href: route('kri.index') },
                    { label: kri.nama_kri,         href: route('kri.show', kri.id) },
                    { label: 'Edit' },
                ]}
            />

            <div style={{ padding: '20px 32px' }}>
                <form onSubmit={submit}>
                    <KriForm form={form} risks={risks} users={users} cardBase={cardBase} />

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
                        <Link href={route('kri.show', kri.id)} style={btnSecondary}>Batal</Link>
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
