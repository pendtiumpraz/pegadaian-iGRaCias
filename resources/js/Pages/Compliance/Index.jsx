import { router } from '@inertiajs/react'
import {
    ScrollText,
    ShieldCheck,
    AlertTriangle,
    Send,
    Upload,
    Plus,
} from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import StatCard from '@/Components/StatCard'
import Badge from '@/Components/Badge'
import DataTable from '@/Components/DataTable'
import Tag from '@/Components/Tag'
import SectionTitle from '@/Components/SectionTitle'

const TABS = [
    { id: 'regulatory', label: 'Regulatory' },
    { id: 'aml',        label: 'AML/CFT' },
    { id: 'qa',         label: 'QA' },
    { id: 'culture',    label: 'Culture' },
]

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

const btnSecondary = {
    background: '#fff',
    color: 'var(--ink-800)',
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid var(--ink-300)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
}

const cardStyle = {
    background: '#fff',
    border: '1px solid var(--ink-200)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
}

export default function ComplianceIndex({ summary = {}, regulations = [] }) {
    function handleTabChange(id) {
        if (id === 'regulatory') return
        router.get(`/kepatuhan/${id}`)
    }

    const cols = [
        { key: 'id', label: 'No. Regulasi', width: 160, render: (_, r) => <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{r.id}</span> },
        {
            key: 'name', label: 'Judul',
            render: (_, r) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 2 }}>Issuer: {r.issuer}</div>
                </div>
            ),
        },
        { key: 'issuer', label: 'Issuer', width: 110, render: (_, r) => <Tag tone={r.issuer === 'OJK' ? 'green' : r.issuer === 'BI' ? 'blue' : 'gold'}>{r.issuer}</Tag> },
        { key: 'eff', label: 'Efektif', width: 120, render: (_, r) => <span className="mono" style={{ fontSize: 12 }}>{r.eff}</span> },
        {
            key: 'gap', label: 'Gap', width: 90, align: 'center',
            render: (_, r) => (
                <span
                    className="mono"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 28,
                        height: 24,
                        padding: '0 8px',
                        borderRadius: 6,
                        background: r.gap === 0 ? '#d6f0e3' : r.gap <= 3 ? '#fbecd1' : '#fbe4df',
                        color: r.gap === 0 ? '#0f4a37' : r.gap <= 3 ? '#7a4f0a' : '#8b261b',
                        fontWeight: 700,
                    }}
                >
                    {r.gap}
                </span>
            ),
        },
        { key: 'status', label: 'Status', width: 140, render: (_, r) => <Badge status={r.status} /> },
    ]

    return (
        <AppLayout title="Manajemen Kepatuhan" contentPadding="none">
            <PageHeader
                title="Manajemen Kepatuhan"
                description="Memastikan kepatuhan terhadap regulasi internal dan eksternal melalui regulatory tracking, APU-PPT, QA, dan budaya kepatuhan."
                breadcrumbs={[
                    { label: 'Beranda', href: '/' },
                    { label: 'Manajemen Kepatuhan' },
                ]}
                actions={
                    <>
                        <button type="button" style={btnSecondary}>
                            <Upload size={14} /> Import Regulasi
                        </button>
                        <button type="button" style={btnPrimary}>
                            <Plus size={14} /> Regulasi Baru
                        </button>
                    </>
                }
                tabs={TABS}
                activeTab="regulatory"
                onTabChange={handleTabChange}
            />

            <div style={{ padding: '20px 32px' }}>
                {/* KPI strip */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
                    <StatCard label="Regulasi Termonitor" value={summary.tracked ?? '—'}    sub="OJK · BI · Pemerintah"  icon={ScrollText}    accent="var(--green-600)" />
                    <StatCard label="Tingkat Kepatuhan"   value={`${summary.compliance ?? 0}%`} trend="+1.8pp" trendDir="up" icon={ShieldCheck} accent="var(--green-600)" />
                    <StatCard label="Gap Aktif"           value={summary.gaps ?? 0}          sub="dari 9 regulasi"        icon={AlertTriangle} accent="var(--gold-500)" />
                    <StatCard label="Pelaporan Regulator" value={summary.reports ?? '—'}     sub="Q2 2026"                icon={Send}          accent="var(--blue-600)" />
                </div>

                <SectionTitle
                    title="Regulasi Termonitor"
                    hint="Status kepatuhan terhadap regulasi eksternal sektor jasa keuangan"
                />
                <div style={cardStyle}>
                    <DataTable columns={cols} data={regulations} />
                </div>
            </div>
        </AppLayout>
    )
}
