import { router } from '@inertiajs/react'
import {
    Gauge,
    AlertCircle,
    CheckCircle2,
    ListChecks,
} from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import StatCard from '@/Components/StatCard'
import DataTable from '@/Components/DataTable'
import HBar from '@/Components/HBar'
import SectionTitle from '@/Components/SectionTitle'
import Avatar from '@/Components/Avatar'

const TABS = [
    { id: 'regulatory', label: 'Regulatory' },
    { id: 'aml',        label: 'AML/CFT' },
    { id: 'qa',         label: 'QA' },
    { id: 'culture',    label: 'Culture' },
]

const cardStyle = {
    background: '#fff',
    border: '1px solid var(--ink-200)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
}

export default function ComplianceQa({ summary = {}, rows = [] }) {
    function handleTabChange(id) {
        if (id === 'qa') return
        router.get(id === 'regulatory' ? '/kepatuhan' : `/kepatuhan/${id}`)
    }

    const cols = [
        { key: 'proc',   label: 'Process Tested', render: (_, r) => <span style={{ fontWeight: 600 }}>{r.proc}</span> },
        { key: 'sample', label: 'Sample Size',   width: 110, align: 'center', render: (_, r) => <span className="mono" style={{ fontWeight: 600 }}>{r.sample}</span> },
        { key: 'errors', label: 'Errors Found',  width: 120, align: 'center', render: (_, r) => (
            <span className="mono" style={{ fontWeight: 600, color: r.errors > 7 ? '#b8392a' : r.errors > 3 ? '#7a4f0a' : '#0f4a37' }}>{r.errors}</span>
        ) },
        {
            key: 'score', label: 'Score', width: 200,
            render: (_, r) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                        <HBar value={r.score} max={100} color={r.score >= 90 ? 'var(--green-600)' : r.score >= 75 ? 'var(--gold-500)' : '#b8392a'} />
                    </div>
                    <span className="mono" style={{ fontSize: 11.5, fontWeight: 600, minWidth: 32 }}>{r.score}%</span>
                </div>
            ),
        },
        {
            key: 'auditor', label: 'Auditor', width: 200,
            render: (_, r) => (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name={r.auditor} size={22} />
                    <span style={{ fontSize: 12.5 }}>{r.auditor}</span>
                </span>
            ),
        },
        { key: 'date', label: 'Date', width: 130, render: (_, r) => <span className="mono" style={{ fontSize: 12 }}>{r.date}</span> },
    ]

    return (
        <AppLayout title="Quality Assurance Kepatuhan" contentPadding="none">
            <PageHeader
                title="Quality Assurance Kepatuhan"
                description="Sampling QA penerapan kontrol kepatuhan lintas proses bisnis dan unit kerja."
                breadcrumbs={[
                    { label: 'Beranda', href: '/' },
                    { label: 'Manajemen Kepatuhan', href: '/kepatuhan' },
                    { label: 'Quality Assurance' },
                ]}
                tabs={TABS}
                activeTab="qa"
                onTabChange={handleTabChange}
            />

            <div style={{ padding: '20px 32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
                    <StatCard label="Avg Score"       value={`${summary.avg_score ?? '—'}%`} sub="rata-rata Q2 2026" icon={Gauge}        accent="var(--green-600)" />
                    <StatCard label="Process Sampled" value={summary.sampled ?? 0}           sub="proses bisnis"      icon={ListChecks}   accent="var(--blue-600)" />
                    <StatCard label="Errors Found"    value={summary.errors ?? 0}            sub="across all samples" icon={AlertCircle}  accent="var(--gold-500)" />
                    <StatCard label="Pass Rate"       value={summary.pass_rate ?? '—'}       sub="score ≥ 80"          icon={CheckCircle2} accent="var(--green-600)" />
                </div>

                <SectionTitle
                    title="Quality Assurance Compliance Scoring"
                    hint={`Hasil sampling ${rows.length} proses bisnis · model risk-based sampling`}
                />

                <div style={cardStyle}>
                    <DataTable columns={cols} data={rows} />
                </div>
            </div>
        </AppLayout>
    )
}
