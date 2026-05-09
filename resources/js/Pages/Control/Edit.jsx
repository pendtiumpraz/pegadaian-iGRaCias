import { useForm, Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import ControlForm from './_ControlForm'

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

export default function ControlEdit({ control, risks = [] }) {
    const form = useForm({
        control_code:  control.control_code  ?? '',
        risk_id:       control.risk_id       ?? '',
        description:   control.description   ?? '',
        type:          control.type          ?? '',
        frequency:     control.frequency     ?? '',
        automated:     !!control.automated,
        effectiveness: control.effectiveness ?? '',
        test_date:     control.test_date
            ? String(control.test_date).slice(0, 10)
            : '',
        evidence_url:  control.evidence_url  ?? '',
    })

    function submit(e) {
        e.preventDefault()
        form.put(route('controls.update', control.id))
    }

    return (
        <AppLayout title={`Edit Kontrol — ${control.control_code}`}>
            <PageHeader
                title="Edit Kontrol"
                description={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <span className="mono" style={{ fontWeight: 600, color: 'var(--ink-700)' }}>
                            {control.control_code}
                        </span>
                    </span>
                }
                breadcrumbs={[
                    { label: 'Beranda',            href: route('dashboard') },
                    { label: 'Kontrol & Mitigasi', href: route('controls.index') },
                    { label: control.control_code },
                    { label: 'Edit' },
                ]}
            />

            <div style={{ padding: '20px 32px' }}>
                <form onSubmit={submit}>
                    <ControlForm form={form} risks={risks} cardBase={cardBase} />

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
                        <Link href={route('controls.index')} style={btnSecondary}>Batal</Link>
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
