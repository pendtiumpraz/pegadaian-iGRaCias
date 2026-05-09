import AppLayout from '@/Layouts/AppLayout'
import StatCard from '@/Components/StatCard'
import Badge, { Tag } from '@/Components/Badge'
import { Head, Link } from '@inertiajs/react'
import {
    AlertTriangle,
    SearchX,
    Zap,
    Clock,
    ArrowRight,
    ChevronRight,
    Activity,
    ClipboardCheck,
    Shield,
    BookOpen,
    Sparkles,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// 5×5 Risk Heatmap — likelihood (rows) × impact (cols)
// Mirrors the Heatmap primitive in src/primitives.jsx.
// ─────────────────────────────────────────────────────────────
function Heatmap({ data }) {
    const colorAt = (l, i) => {
        const score = l * i
        if (score >= 15) return '#b8392a'
        if (score >= 9)  return '#c98114'
        if (score >= 5)  return '#d6a23c'
        return '#187c5b'
    }
    const rows = [5, 4, 3, 2, 1]
    return (
        <div style={{ display: 'flex', gap: 8 }}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    fontSize: 10,
                    color: 'var(--ink-500)',
                    fontWeight: 600,
                    paddingTop: 2,
                    paddingBottom: 18,
                }}
            >
                <span>Hampir Pasti</span>
                <span>Sering</span>
                <span>Mungkin</span>
                <span>Jarang</span>
                <span>Hampir Tidak</span>
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4 }}>
                    {rows.map((l) =>
                        [1, 2, 3, 4, 5].map((i) => {
                            const cnt = (data[l] && data[l][i]) || 0
                            return (
                                <div
                                    key={`${l}-${i}`}
                                    style={{
                                        aspectRatio: '1.4 / 1',
                                        borderRadius: 6,
                                        border: '1px solid #fff',
                                        background: cnt > 0 ? colorAt(l, i) : '#f3f5f3',
                                        color: cnt > 0 ? '#fff' : 'var(--ink-400)',
                                        fontWeight: 700,
                                        fontSize: cnt > 0 ? 16 : 11,
                                        fontFamily: 'var(--font-mono)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {cnt > 0 ? cnt : ''}
                                </div>
                            )
                        })
                    )}
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5,1fr)',
                        gap: 4,
                        marginTop: 6,
                        fontSize: 10,
                        color: 'var(--ink-500)',
                        fontWeight: 600,
                        textAlign: 'center',
                    }}
                >
                    <span>Tidak Sig.</span>
                    <span>Minor</span>
                    <span>Moderat</span>
                    <span>Mayor</span>
                    <span>Katastropik</span>
                </div>
                <div
                    style={{
                        textAlign: 'center',
                        fontSize: 10.5,
                        color: 'var(--ink-500)',
                        fontWeight: 600,
                        marginTop: 2,
                        letterSpacing: 0.4,
                        textTransform: 'uppercase',
                    }}
                >
                    Dampak →
                </div>
            </div>
        </div>
    )
}

// Horizontal mini bar — used in widgets.
function HBar({ value, max, color = 'var(--green-600)', height = 6 }) {
    const pct = Math.min(100, Math.max(0, (value / max) * 100))
    return (
        <div
            style={{
                background: 'var(--ink-100)',
                borderRadius: 99,
                height,
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    width: `${pct}%`,
                    background: color,
                    height: '100%',
                    borderRadius: 99,
                    transition: 'width 300ms',
                }}
            />
        </div>
    )
}

function Card({ children, padding = 20, style }) {
    return (
        <div
            style={{
                background: '#fff',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--ink-200)',
                padding,
                ...style,
            }}
        >
            {children}
        </div>
    )
}

function SectionTitle({ children, hint, action }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBottom: 14,
            }}
        >
            <div>
                <div
                    style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'var(--ink-900)',
                        letterSpacing: 0.1,
                    }}
                >
                    {children}
                </div>
                {hint && (
                    <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>
                        {hint}
                    </div>
                )}
            </div>
            {action}
        </div>
    )
}

export default function DashboardIndex({
    total_risks = 0,
    open_findings = 0,
    open_incidents = 0,
    overdue_actions = 0,
    user_name,
    top_risks = [],
    recent_activity = [],
}) {
    const greetName =
        (typeof user_name === 'string' && user_name.split(' ')[0]) ||
        'Tim GRC'

    // Demo heatmap distribution; backend can override later.
    const heat = {
        5: { 1: 0, 2: 0, 3: 1, 4: 2, 5: 1 },
        4: { 1: 0, 2: 1, 3: 3, 4: 4, 5: 2 },
        3: { 1: 1, 2: 3, 3: 5, 4: 6, 5: 3 },
        2: { 1: 2, 2: 4, 3: 4, 4: 2, 5: 1 },
        1: { 1: 3, 2: 2, 3: 1, 4: 0, 5: 0 },
    }

    const fallbackRisks =
        top_risks && top_risks.length > 0
            ? top_risks
            : [
                  { id: 'RSK-OP-014', title: 'Kebocoran data PII pada API gateway', cat: 'Operasional', owner: 'Galih W.', score: 18, res: 'Tinggi' },
                  { id: 'RSK-CY-007', title: 'Phishing skala besar ke pegawai cabang', cat: 'Siber', owner: 'Hafidz A.', score: 15, res: 'Tinggi' },
                  { id: 'RSK-CR-022', title: 'Lonjakan NPF segmen mikro', cat: 'Kredit', owner: 'Reza A.', score: 12, res: 'Sedang' },
                  { id: 'RSK-OP-031', title: 'Selisih taksiran emas berulang', cat: 'Operasional', owner: 'Sinta P.', score: 10, res: 'Sedang' },
                  { id: 'RSK-CP-005', title: 'Keterlambatan adopsi POJK 22/2023', cat: 'Kepatuhan', owner: 'Citra W.', score: 9, res: 'Sedang' },
              ]

    const fallbackActivity =
        recent_activity && recent_activity.length > 0
            ? recent_activity
            : [
                  { who: 'Kartika Dewi', act: 'menutup audit', obj: 'AUD-2026-022 · Vendor TI', t: '12 menit lalu', icon: ClipboardCheck },
                  { who: 'Sistem (AI)',  act: 'mendeteksi anomali', obj: 'transaksi taksiran KC Surabaya', t: '48 menit lalu', icon: Sparkles },
                  { who: 'Anonim',       act: 'melaporkan WBS', obj: 'WBS-2026-0034', t: '2 jam lalu', icon: Zap },
                  { who: 'Citra W.',     act: 'meng-update gap', obj: 'POJK 22/2023', t: '4 jam lalu', icon: BookOpen },
                  { who: 'Anindya P.',   act: 'menyetujui RCSA', obj: 'Divisi IT Operations', t: '6 jam lalu', icon: AlertTriangle },
                  { who: 'Bayu H.',      act: 'membuat audit baru', obj: 'AUD-2026-031', t: 'kemarin', icon: ClipboardCheck },
              ]

    return (
        <AppLayout title="Beranda" breadcrumb={['Beranda']} contentPadding="none">
            <Head title="Beranda" />

            <div style={{ padding: '24px 32px 48px' }}>
                {/* Greeting */}
                <div style={{ marginBottom: 20 }}>
                    <div
                        className="display"
                        style={{
                            fontSize: 26,
                            color: 'var(--ink-900)',
                            lineHeight: 1.15,
                        }}
                    >
                        Selamat datang, {greetName}.
                    </div>
                    <div
                        style={{
                            fontSize: 13.5,
                            color: 'var(--ink-600)',
                            marginTop: 6,
                        }}
                    >
                        Ringkasan kondisi GRC korporat per{' '}
                        <span className="mono">{new Date().toLocaleString('id-ID')}</span> · sumber
                        data: modul terintegrasi
                    </div>
                </div>

                {/* KPI strip */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                        gap: 14,
                        marginBottom: 20,
                    }}
                >
                    <StatCard
                        label="Total Risiko"
                        value={total_risks}
                        sub="aktif & termonitor"
                        accent="var(--green-600)"
                        icon={AlertTriangle}
                    />
                    <StatCard
                        label="Temuan Terbuka"
                        value={open_findings}
                        sub="dari audit & assurance"
                        accent="var(--gold-500)"
                        icon={SearchX}
                    />
                    <StatCard
                        label="Insiden Terbuka"
                        value={open_incidents}
                        sub="WBS · Gratifikasi · Helpdesk"
                        accent="var(--blue-600)"
                        icon={Zap}
                    />
                    <StatCard
                        label="Aksi Jatuh Tempo"
                        value={overdue_actions}
                        sub="action plan past-due"
                        accent="#b8392a"
                        icon={Clock}
                    />
                </div>

                {/* Heatmap + KRI watchlist */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
                        gap: 14,
                        marginBottom: 20,
                    }}
                >
                    <Card>
                        <SectionTitle
                            hint="Distribusi risiko aktif berdasarkan likelihood × dampak"
                            action={
                                <Link
                                    href="/risiko"
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: 'var(--green-700)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 4,
                                    }}
                                >
                                    Buka Risk Profile <ArrowRight size={13} />
                                </Link>
                            }
                        >
                            Risk Heatmap Korporat
                        </SectionTitle>
                        <Heatmap data={heat} />
                        <div
                            style={{
                                display: 'flex',
                                gap: 14,
                                marginTop: 16,
                                paddingTop: 14,
                                borderTop: '1px solid var(--ink-200)',
                                fontSize: 11.5,
                                flexWrap: 'wrap',
                                color: 'var(--ink-700)',
                            }}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ width: 10, height: 10, background: '#b8392a', borderRadius: 2 }} />
                                Tinggi (≥15)
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ width: 10, height: 10, background: '#c98114', borderRadius: 2 }} />
                                Sedang (9–14)
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ width: 10, height: 10, background: '#d6a23c', borderRadius: 2 }} />
                                Rendah (5–8)
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ width: 10, height: 10, background: '#187c5b', borderRadius: 2 }} />
                                Minimal (&lt;5)
                            </span>
                        </div>
                    </Card>

                    <Card>
                        <SectionTitle hint="Indikator yang mendekati ambang aman">
                            Top KRI Mendekati Threshold
                        </SectionTitle>
                        {[
                            { name: 'NPF Gross', val: '2.84%', max: '3.0%', pct: 94 },
                            { name: 'System Uptime Core', val: '99.62%', max: '99.5% min', pct: 88 },
                            { name: 'Insiden Fraud / bln', val: '18', max: '15', pct: 120, over: true },
                            { name: 'Phishing Detected', val: '847', max: '1000', pct: 84 },
                        ].map((k) => (
                            <div key={k.name} style={{ marginBottom: 10 }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: 12,
                                        marginBottom: 4,
                                    }}
                                >
                                    <span style={{ color: 'var(--ink-700)', fontWeight: 600 }}>
                                        {k.name}
                                    </span>
                                    <span
                                        className="mono"
                                        style={{
                                            color: k.over ? '#b8392a' : 'var(--ink-700)',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {k.val}{' '}
                                        <span style={{ color: 'var(--ink-400)' }}>/ {k.max}</span>
                                    </span>
                                </div>
                                <HBar
                                    value={Math.min(k.pct, 100)}
                                    max={100}
                                    color={
                                        k.over
                                            ? '#b8392a'
                                            : k.pct > 85
                                            ? '#c98114'
                                            : 'var(--green-600)'
                                    }
                                />
                            </div>
                        ))}
                        <div
                            style={{
                                marginTop: 14,
                                paddingTop: 12,
                                borderTop: '1px solid var(--ink-200)',
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Link
                                href="/kri"
                                style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: 'var(--green-700)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                }}
                            >
                                Lihat semua KRI <ArrowRight size={13} />
                            </Link>
                        </div>
                    </Card>
                </div>

                {/* Top risks + recent activity */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
                        gap: 14,
                    }}
                >
                    <Card padding={0}>
                        <div
                            style={{
                                padding: '16px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid var(--ink-200)',
                            }}
                        >
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>
                                    Top Risiko Korporat
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>
                                    Berdasarkan residual risk score tertinggi
                                </div>
                            </div>
                            <Link
                                href="/risiko"
                                style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: 'var(--green-700)',
                                }}
                            >
                                Semua risiko →
                            </Link>
                        </div>
                        <div>
                            {fallbackRisks.slice(0, 5).map((r) => (
                                <div
                                    key={r.id}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'auto 1fr auto auto',
                                        gap: 14,
                                        alignItems: 'center',
                                        padding: '12px 20px',
                                        borderBottom: '1px solid var(--ink-100)',
                                    }}
                                >
                                    <div
                                        className="mono"
                                        style={{
                                            width: 38,
                                            height: 38,
                                            borderRadius: 8,
                                            background:
                                                r.score >= 15 ? '#fbe4df' : r.score >= 9 ? '#fbecd1' : '#d6f0e3',
                                            color:
                                                r.score >= 15 ? '#8b261b' : r.score >= 9 ? '#7a4f0a' : '#0f4a37',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 15,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {r.score}
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <div
                                            style={{
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: 'var(--ink-900)',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {r.title}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 11.5,
                                                color: 'var(--ink-500)',
                                                marginTop: 2,
                                                display: 'flex',
                                                gap: 6,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <span className="mono">{r.id}</span>
                                            <span>·</span>
                                            <span>{r.cat}</span>
                                            <span>·</span>
                                            <span>{r.owner}</span>
                                        </div>
                                    </div>
                                    <Badge status={r.res} />
                                    <ChevronRight size={16} style={{ color: 'var(--ink-400)' }} />
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card padding={0}>
                        <div
                            style={{
                                padding: '16px 20px',
                                borderBottom: '1px solid var(--ink-200)',
                            }}
                        >
                            <div style={{ fontSize: 13, fontWeight: 700 }}>Aktivitas Terkini</div>
                            <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>
                                Lintas modul GRC
                            </div>
                        </div>
                        <div style={{ padding: '8px 0' }}>
                            {fallbackActivity.map((a, i) => {
                                const Icon = a.icon || Activity
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            gap: 12,
                                            padding: '10px 20px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: 30,
                                                background: 'var(--green-50)',
                                                color: 'var(--green-700)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <Icon size={14} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 12.5, lineHeight: 1.4 }}>
                                                <span
                                                    style={{
                                                        fontWeight: 600,
                                                        color: 'var(--ink-900)',
                                                    }}
                                                >
                                                    {a.who}
                                                </span>
                                                <span style={{ color: 'var(--ink-600)' }}>
                                                    {' '}
                                                    {a.act}{' '}
                                                </span>
                                                <span
                                                    style={{
                                                        fontWeight: 600,
                                                        color: 'var(--ink-800)',
                                                    }}
                                                >
                                                    {a.obj}
                                                </span>
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 11,
                                                    color: 'var(--ink-500)',
                                                    marginTop: 2,
                                                }}
                                            >
                                                {a.t}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
