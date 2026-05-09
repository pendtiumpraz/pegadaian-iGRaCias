import { router } from '@inertiajs/react'
import {
    Users,
    UserCheck,
    AlertTriangle,
    ShieldAlert,
    Eye,
} from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import StatCard from '@/Components/StatCard'
import Badge from '@/Components/Badge'
import DataTable from '@/Components/DataTable'
import Tag from '@/Components/Tag'
import SectionTitle from '@/Components/SectionTitle'
import Donut from '@/Components/Donut'
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

const btnSmall = {
    background: '#fff',
    color: 'var(--ink-700)',
    padding: '4px 10px',
    borderRadius: 6,
    border: '1px solid var(--ink-300)',
    cursor: 'pointer',
    fontSize: 11.5,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
}

function TrendChart({ data = [], width = 460, height = 200 }) {
    if (!data || data.length < 2) return null
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    const pad = 12
    const innerW = width - pad * 2
    const innerH = height - pad * 2 - 20
    const pts = data.map((v, i) => [
        pad + (i / (data.length - 1)) * innerW,
        pad + innerH - ((v - min) / range) * innerH,
    ])
    const path = pts
        .map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1))
        .join(' ')
    const area = `${path} L ${pad + innerW},${pad + innerH} L ${pad},${pad + innerH} Z`
    const months = ['Jun','Jul','Agu','Sep','Okt','Nov','Des','Jan','Feb','Mar','Apr','Mei']
    return (
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
            {[0.25, 0.5, 0.75, 1].map((p, i) => (
                <line
                    key={i}
                    x1={pad} x2={pad + innerW}
                    y1={pad + innerH * (1 - p)} y2={pad + innerH * (1 - p)}
                    stroke="var(--ink-100)" strokeDasharray="3 4"
                />
            ))}
            <path d={area} fill="#187c5b" opacity="0.10" />
            <path d={path} stroke="#187c5b" strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
            {pts.map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill="#187c5b" />
            ))}
            {months.slice(0, data.length).map((m, i) => (
                <text key={m} x={pts[i][0]} y={height - 4} textAnchor="middle" fontSize="10" fill="var(--ink-500)" fontWeight="600">{m}</text>
            ))}
        </svg>
    )
}

export default function ComplianceAml({ summary = {}, distribution = [], trend = [], reviews = [] }) {
    function handleTabChange(id) {
        if (id === 'aml') return
        router.get(id === 'regulatory' ? '/kepatuhan' : `/kepatuhan/${id}`)
    }

    const total = distribution.reduce((s, d) => s + (d.value || 0), 0) || 1

    const cols = [
        { key: 'nasabah', label: 'Nasabah ID', width: 160, render: (_, r) => <span className="mono" style={{ fontSize: 11.5, fontWeight: 600 }}>{r.nasabah}</span> },
        { key: 'tipe',    label: 'Tipe Trigger',  render: (_, r) => <Tag>{r.tipe}</Tag> },
        { key: 'risk',    label: 'Risk',          width: 110, render: (_, r) => <Badge status={r.risk} /> },
        {
            key: 'reviewer', label: 'Reviewer', width: 200,
            render: (_, r) => (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name={r.reviewer} size={22} />
                    <span style={{ fontSize: 12.5 }}>{r.reviewer}</span>
                </span>
            ),
        },
        { key: 'last',   label: 'Last Review', width: 130, render: (_, r) => <span className="mono" style={{ fontSize: 12 }}>{r.last}</span> },
        { key: 'status', label: 'Status',     width: 130, render: (_, r) => <Badge status={r.status} /> },
        {
            key: 'actions', label: 'Aksi', width: 100,
            render: () => (
                <button type="button" style={btnSmall}>
                    <Eye size={12} style={{ marginRight: 4 }} /> Lihat
                </button>
            ),
        },
    ]

    return (
        <AppLayout title="Kepatuhan AML/CFT" contentPadding="none">
            <PageHeader
                title="Kepatuhan AML / CFT"
                description="Customer Due Diligence, Enhanced Due Diligence, dan pelaporan PPATK sesuai POJK 12/2023."
                breadcrumbs={[
                    { label: 'Beranda', href: '/' },
                    { label: 'Manajemen Kepatuhan', href: '/kepatuhan' },
                    { label: 'AML/CFT' },
                ]}
                tabs={TABS}
                activeTab="aml"
                onTabChange={handleTabChange}
            />

            <div style={{ padding: '20px 32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
                    <StatCard label="Nasabah CDD"     value={summary.cdd ?? '—'}      sub="diproses bulan ini"      icon={Users}        accent="var(--green-600)" />
                    <StatCard label="EDD Aktif"       value={summary.edd ?? '—'}      sub="PEP · High-Risk Country" icon={UserCheck}    accent="var(--gold-500)" />
                    <StatCard label="Watchlist Hits"  value={summary.watchlist ?? 0}  sub="screening sanctions"     icon={ShieldAlert}  accent="#b8392a" />
                    <StatCard label="Risk Aggregate"  value={summary.risk_agg ?? '—'} sub="weighted score nasabah"  icon={AlertTriangle} accent="var(--blue-600)" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 14, marginBottom: 18 }}>
                    <div style={{ ...cardStyle, padding: 18 }}>
                        <SectionTitle
                            title="Distribusi Risk Rating Nasabah"
                            hint={`Total ${total.toLocaleString('id-ID')} nasabah aktif`}
                            level={4}
                            display={false}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                            <Donut
                                size={140}
                                thickness={20}
                                segments={distribution}
                                centerValue={total.toLocaleString('id-ID')}
                                centerLabel="Nasabah"
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                {distribution.map((d) => {
                                    const pct = ((d.value / total) * 100).toFixed(1)
                                    return (
                                        <div key={d.label} style={{ padding: '8px 0', borderBottom: '1px solid var(--ink-100)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                                <span style={{ width: 10, height: 10, borderRadius: 2, background: d.color }} />
                                                <span style={{ flex: 1, fontSize: 12.5, color: 'var(--ink-700)' }}>{d.label}</span>
                                                <span className="mono" style={{ fontWeight: 600, fontSize: 12.5 }}>{d.value.toLocaleString('id-ID')}</span>
                                            </div>
                                            <div style={{ fontSize: 11, color: 'var(--ink-500)', marginLeft: 18 }}>{pct}% dari total</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div style={{ ...cardStyle, padding: 18 }}>
                        <SectionTitle
                            title="AML Compliance Trend"
                            hint="Tingkat kepatuhan AML 12 bulan terakhir"
                            level={4}
                            display={false}
                        />
                        <TrendChart data={trend} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-600)', paddingTop: 8, borderTop: '1px solid var(--ink-100)' }}>
                            <span>Min: {Math.min(...trend).toFixed(1)}%</span>
                            <span style={{ fontWeight: 700, color: 'var(--green-700)' }}>Tren: <span className="mono">+2.9pp</span></span>
                            <span>Max: {Math.max(...trend).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                <SectionTitle
                    title="Recent CDD / EDD Reviews"
                    hint="Aktivitas review compliance officer 7 hari terakhir"
                />
                <div style={cardStyle}>
                    <DataTable columns={cols} data={reviews} />
                </div>
            </div>
        </AppLayout>
    )
}
