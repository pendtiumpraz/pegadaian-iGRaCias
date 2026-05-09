import { router } from '@inertiajs/react'
import {
    HeartHandshake,
    BookOpen,
    GraduationCap,
    Megaphone,
} from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import StatCard from '@/Components/StatCard'
import DataTable from '@/Components/DataTable'
import HBar from '@/Components/HBar'
import SectionTitle from '@/Components/SectionTitle'
import Donut from '@/Components/Donut'
import Sparkline from '@/Components/Sparkline'

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

export default function ComplianceCulture({ summary = {}, rows = [] }) {
    function handleTabChange(id) {
        if (id === 'culture') return
        router.get(id === 'regulatory' ? '/kepatuhan' : `/kepatuhan/${id}`)
    }

    const cols = [
        { key: 'kanwil', label: 'Kanwil', render: (_, r) => <span style={{ fontWeight: 600 }}>{r.kanwil}</span> },
        {
            key: 'survey', label: 'Survey Score', width: 110, align: 'center',
            render: (_, r) => (
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Donut
                        size={44}
                        thickness={6}
                        segments={[
                            { value: r.survey,        color: r.survey >= 85 ? '#187c5b' : r.survey >= 80 ? '#c98114' : '#b8392a' },
                            { value: 100 - r.survey,  color: 'var(--ink-100)' },
                        ]}
                        centerValue={r.survey}
                    />
                </span>
            ),
        },
        {
            key: 'training', label: 'Training Compliance', width: 220,
            render: (_, r) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                        <HBar value={r.training} max={100} color={r.training >= 90 ? 'var(--green-600)' : r.training >= 85 ? 'var(--gold-500)' : '#b8392a'} />
                    </div>
                    <span className="mono" style={{ fontSize: 11.5, fontWeight: 600, minWidth: 32 }}>{r.training}%</span>
                </div>
            ),
        },
        {
            key: 'incidents', label: 'Incident Reports', width: 140, align: 'center',
            render: (_, r) => (
                <span className="mono" style={{ fontWeight: 600, color: r.incidents > 5 ? '#b8392a' : r.incidents > 3 ? '#7a4f0a' : '#0f4a37' }}>
                    {r.incidents}
                </span>
            ),
        },
        {
            key: 'composite', label: 'Index Composite', width: 140, align: 'center',
            render: (_, r) => (
                <span
                    className="mono"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px 12px',
                        borderRadius: 6,
                        background: r.composite >= 4.2 ? '#d6f0e3' : r.composite >= 4.0 ? '#fbecd1' : '#fbe4df',
                        color: r.composite >= 4.2 ? '#0f4a37' : r.composite >= 4.0 ? '#7a4f0a' : '#8b261b',
                        fontWeight: 700,
                        fontSize: 13,
                    }}
                >
                    {r.composite.toFixed(2)}
                </span>
            ),
        },
        {
            key: 'trend', label: 'Tren 7 Periode', width: 130,
            render: (_, r) => (
                <Sparkline data={r.trend} width={120} height={32} color="#187c5b" />
            ),
        },
    ]

    return (
        <AppLayout title="Budaya Kepatuhan" contentPadding="none">
            <PageHeader
                title="Budaya Kepatuhan"
                description="Pengukuran indeks budaya kepatuhan, sosialisasi, dan e-learning per kantor wilayah."
                breadcrumbs={[
                    { label: 'Beranda', href: '/' },
                    { label: 'Manajemen Kepatuhan', href: '/kepatuhan' },
                    { label: 'Budaya' },
                ]}
                tabs={TABS}
                activeTab="culture"
                onTabChange={handleTabChange}
            />

            <div style={{ padding: '20px 32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
                    <StatCard label="Indeks Budaya"        value={summary.index ?? '—'}        sub="dari 5.00 · survei 2026" trend="+0.18" trendDir="up" icon={HeartHandshake} accent="var(--green-600)" />
                    <StatCard label="Pakta Integritas"     value={summary.pakta ?? '—'}        sub="14.231 / 14.461 pegawai" icon={BookOpen}     accent="var(--green-600)" />
                    <StatCard label="E-Learning Kepatuhan" value={summary.elearning ?? '—'}    sub="penyelesaian wajib 2026" icon={GraduationCap} accent="var(--blue-600)" />
                    <StatCard label="Sosialisasi"          value={`${summary.sosialisasi ?? 0} sesi`} sub="11 Kanwil + KP"     icon={Megaphone}    accent="var(--gold-500)" />
                </div>

                <SectionTitle
                    title="Indeks Budaya Kepatuhan per Kanwil"
                    hint="Skor budaya kepatuhan per kantor wilayah · komposit survei + training + insiden"
                />

                <div style={cardStyle}>
                    <DataTable columns={cols} data={rows} />
                </div>
            </div>
        </AppLayout>
    )
}
