import { useMemo, useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import {
    AlertTriangle,
    ShieldAlert,
    CheckCircle2,
    ThumbsUp,
    Plus,
    Download,
    TrendingUp,
    Sparkles,
    AlertOctagon,
    Eye,
} from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import StatCard from '@/Components/StatCard'
import Badge from '@/Components/Badge'
import DataTable from '@/Components/DataTable'
import Tag from '@/Components/Tag'
import Toolbar from '@/Components/Toolbar'
import SectionTitle from '@/Components/SectionTitle'
import Heatmap from '@/Components/Heatmap'
import HBar from '@/Components/HBar'
import Avatar from '@/Components/Avatar'
import AIGradientBanner from '@/Components/AIGradientBanner'

/* ─────────────────────────── Helpers ─────────────────────────── */

function riskScoreChipStyle(score) {
    const n = Number(score) || 0
    if (n >= 16) return { bg: '#fbe4df', fg: '#8b261b' }   // red
    if (n >= 7)  return { bg: '#fbecd1', fg: '#7a4f0a' }   // amber
    if (n >= 1)  return { bg: '#d6f0e3', fg: '#0f4a37' }   // green
    return { bg: 'var(--ink-100)', fg: 'var(--ink-600)' }
}

function RiskScoreChip({ score }) {
    const t = riskScoreChipStyle(score)
    return (
        <span
            className="mono"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 30,
                height: 30,
                borderRadius: 6,
                background: t.bg,
                color: t.fg,
                fontWeight: 700,
                fontSize: 13,
            }}
        >
            {score ?? '—'}
        </span>
    )
}

const KATEGORI_OPTIONS = [
    { value: '', label: 'Semua' },
    { value: 'operasional', label: 'Operasional' },
    { value: 'finansial',   label: 'Finansial' },
    { value: 'kepatuhan',   label: 'Kepatuhan' },
    { value: 'reputasi',    label: 'Reputasi' },
    { value: 'strategis',   label: 'Strategis' },
]

const STATUS_OPTIONS = [
    { value: '',           label: 'Semua Status' },
    { value: 'identified', label: 'Teridentifikasi' },
    { value: 'assessed',   label: 'Dinilai' },
    { value: 'mitigated',  label: 'Termitigasi' },
    { value: 'accepted',   label: 'Diterima' },
    { value: 'closed',     label: 'Selesai' },
]

const KATEGORI_COLOR = {
    operasional: '#187c5b',
    finansial:   '#13654b',
    kepatuhan:   '#c98114',
    reputasi:    '#b8392a',
    strategis:   '#1c3d5e',
}

const btnPrimary = {
    background: 'var(--green-700)',
    color: '#fff',
    padding: '7px 14px',
    height: 34,
    borderRadius: 8,
    border: '1px solid var(--green-700)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
}

const btnSecondary = {
    background: '#fff',
    color: 'var(--ink-800)',
    padding: '7px 14px',
    height: 34,
    borderRadius: 8,
    border: '1px solid var(--ink-300)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
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
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
}

const btnDanger = {
    background: '#fff',
    color: '#8b261b',
    padding: '4px 10px',
    borderRadius: 6,
    border: '1px solid #f0c9c1',
    cursor: 'pointer',
    fontSize: 11.5,
    fontWeight: 600,
}

const cardBase = {
    background: '#fff',
    borderRadius: 'var(--radius-lg, 12px)',
    border: '1px solid var(--ink-200)',
}

/* ─────────────────────── Sub-tab samples ──────────────────────── */

const RCSA_QUARTERS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026']

const RCSA_ROWS = [
    { unit: 'Divisi Bisnis Mikro',           owner: 'Reza Anggara',     risks: 14, eff: 78, lastUpd: '03 Mei 2026', status: 'Approved' },
    { unit: 'Divisi Operasional Cabang',     owner: 'Sinta Permata',    risks: 22, eff: 71, lastUpd: '02 Mei 2026', status: 'Approved' },
    { unit: 'Divisi IT Operations',          owner: 'Galih Wibowo',     risks: 18, eff: 84, lastUpd: '04 Mei 2026', status: 'Approved' },
    { unit: 'Divisi Treasury',               owner: 'Nadia Rahman',     risks: 9,  eff: 79, lastUpd: '01 Mei 2026', status: 'In Review' },
    { unit: 'Divisi Cybersecurity',          owner: 'Hafidz Al-Faruq',  risks: 11, eff: 87, lastUpd: '04 Mei 2026', status: 'Approved' },
    { unit: 'Divisi Customer Care',          owner: 'Maya Indira',      risks: 8,  eff: 64, lastUpd: '29 Apr 2026', status: 'In Review' },
    { unit: 'Kanwil II — Jakarta & Banten',  owner: 'Yoga Pratama',     risks: 16, eff: 72, lastUpd: '28 Apr 2026', status: 'Pending' },
    { unit: 'Kanwil V — Jawa Timur',         owner: 'Putri Handayani',  risks: 19, eff: 68, lastUpd: '27 Apr 2026', status: 'Pending' },
    { unit: 'Kanwil III — Jawa Barat',       owner: 'Bayu Hartanto',    risks: 17, eff: 73, lastUpd: '02 Mei 2026', status: 'In Review' },
    { unit: 'Divisi Procurement',            owner: 'Anggun Kusuma',    risks: 10, eff: 70, lastUpd: '30 Apr 2026', status: 'Approved' },
    { unit: 'Divisi Legal & Sekper',         owner: 'Kartika Dewi',     risks: 7,  eff: 82, lastUpd: '01 Mei 2026', status: 'Approved' },
    { unit: 'Divisi Risk Management',        owner: 'Dimas Pranata',    risks: 13, eff: 88, lastUpd: '05 Mei 2026', status: 'Approved' },
]

function RCSAEffBadge({ status }) {
    return <Badge status={status === 'Approved' ? 'Selesai' : status === 'In Review' ? 'Pemantauan' : 'Perencanaan'} label={status} />
}

function RcsaTab() {
    const [period, setPeriod] = useState('Q4 2026')
    const cols = [
        { key: 'unit',  label: 'Unit Kerja', render: (_, r) => <span style={{ fontWeight: 600 }}>{r.unit}</span> },
        {
            key: 'owner',
            label: 'Process Owner',
            width: 200,
            render: (_, r) => (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name={r.owner} size={24} />
                    <span style={{ fontSize: 12.5 }}>{r.owner}</span>
                </span>
            ),
        },
        {
            key: 'risks',
            label: 'Risk Count',
            width: 110,
            align: 'center',
            render: (_, r) => <Tag tone="mono">{r.risks}</Tag>,
        },
        {
            key: 'eff',
            label: 'Effectiveness',
            width: 200,
            render: (_, r) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                        <HBar value={r.eff} max={100} color={r.eff >= 80 ? 'var(--green-600)' : r.eff >= 70 ? 'var(--gold-500)' : '#b8392a'} />
                    </div>
                    <span className="mono" style={{ fontSize: 11.5, fontWeight: 600, minWidth: 32 }}>{r.eff}%</span>
                </div>
            ),
        },
        {
            key: 'lastUpd',
            label: 'Last Update',
            width: 130,
            render: (_, r) => <span className="mono" style={{ fontSize: 12 }}>{r.lastUpd}</span>,
        },
        {
            key: 'status',
            label: 'Status',
            width: 130,
            render: (_, r) => <RCSAEffBadge status={r.status} />,
        },
        {
            key: 'actions',
            label: 'Aksi',
            width: 90,
            render: () => (
                <button type="button" style={btnSmall}>
                    <Eye size={12} style={{ marginRight: 4 }} /> Lihat
                </button>
            ),
        },
    ]

    return (
        <>
            <SectionTitle
                title={`Risk & Control Self-Assessment ${period}`}
                hint="Status penilaian RCSA per unit kerja · 12 unit dari 56 dipilih"
            />

            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                {RCSA_QUARTERS.map((q) => {
                    const active = q === period
                    return (
                        <button
                            key={q}
                            type="button"
                            onClick={() => setPeriod(q)}
                            style={{
                                padding: '6px 14px',
                                borderRadius: 99,
                                fontSize: 12.5,
                                fontWeight: 600,
                                border: '1px solid',
                                borderColor: active ? 'var(--green-600)' : 'var(--ink-200)',
                                background: active ? 'var(--green-50)' : '#fff',
                                color: active ? 'var(--green-800)' : 'var(--ink-700)',
                                cursor: 'pointer',
                            }}
                        >
                            {q}
                        </button>
                    )
                })}
            </div>

            <div style={{ ...cardBase, padding: 0, overflow: 'hidden' }}>
                <DataTable columns={cols} data={RCSA_ROWS} />
            </div>
        </>
    )
}

function KriPlaceholderTab() {
    return (
        <div style={{
            ...cardBase,
            padding: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
        }}>
            <div style={{
                width: 56, height: 56, borderRadius: 12,
                background: 'var(--green-50)', color: 'var(--green-700)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
            }}>
                <TrendingUp size={26} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div className="display" style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink-900)' }}>
                    Modul KRI tersedia di halaman dedicated
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink-600)', marginTop: 6, maxWidth: 560 }}>
                    Key Risk Indicator memiliki dashboard real-time, threshold management, dan tren historis.
                    Buka halaman KRI untuk mengakses fitur lengkap.
                </div>
            </div>
            <Link href="/kri" style={btnPrimary}>
                <TrendingUp size={14} /> Buka KRI
            </Link>
        </div>
    )
}

const FRAUD_ROWS = [
    { id: 'ANM-26043', tipe: 'Selisih Taksiran',      conf: 92, score: 'Tinggi',  reportedAt: '08:14 WIB',  status: 'Investigasi' },
    { id: 'ANM-26042', tipe: 'Anomali Login',         conf: 78, score: 'Sedang',  reportedAt: '07:42 WIB',  status: 'Verifikasi' },
    { id: 'ANM-26041', tipe: 'Pencairan Berulang',    conf: 85, score: 'Tinggi',  reportedAt: '06:18 WIB',  status: 'Investigasi' },
    { id: 'ANM-26040', tipe: 'Top-up Limit',          conf: 64, score: 'Sedang',  reportedAt: 'kemarin',    status: 'Verifikasi' },
    { id: 'ANM-26039', tipe: 'Cabut Blokir',          conf: 88, score: 'Tinggi',  reportedAt: 'kemarin',    status: 'Disetujui' },
    { id: 'ANM-26038', tipe: 'Pola LTKT',             conf: 71, score: 'Sedang',  reportedAt: '2 hari',     status: 'Investigasi' },
    { id: 'ANM-26037', tipe: 'Lelang Cepat',          conf: 81, score: 'Tinggi',  reportedAt: '2 hari',     status: 'Investigasi' },
    { id: 'ANM-26036', tipe: 'Selisih Penyimpanan',   conf: 58, score: 'Rendah',  reportedAt: '3 hari',     status: 'Verifikasi' },
    { id: 'ANM-26035', tipe: 'Akses Diluar Jam',      conf: 73, score: 'Sedang',  reportedAt: '3 hari',     status: 'Disetujui' },
    { id: 'ANM-26034', tipe: 'Override Approval',     conf: 90, score: 'Tinggi',  reportedAt: '4 hari',     status: 'Investigasi' },
]

function FraudTab() {
    const cols = [
        { key: 'id', label: 'Alert ID', width: 140, render: (_, r) => <span className="mono" style={{ fontSize: 11.5, fontWeight: 600 }}>{r.id}</span> },
        { key: 'tipe', label: 'Tipe Anomali', render: (_, r) => <Tag>{r.tipe}</Tag> },
        {
            key: 'conf',
            label: 'Confidence',
            width: 200,
            render: (_, r) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                        <HBar value={r.conf} max={100} color={r.conf > 80 ? '#b8392a' : r.conf > 60 ? 'var(--gold-500)' : 'var(--green-600)'} />
                    </div>
                    <span className="mono" style={{ fontSize: 11.5, fontWeight: 600, minWidth: 32 }}>{r.conf}%</span>
                </div>
            ),
        },
        { key: 'score', label: 'Risk Score', width: 110, render: (_, r) => <Tag tone={r.score === 'Tinggi' ? 'red' : r.score === 'Sedang' ? 'gold' : 'green'}>{r.score}</Tag> },
        { key: 'reportedAt', label: 'Reported', width: 120, render: (_, r) => <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-600)' }}>{r.reportedAt}</span> },
        { key: 'status', label: 'Status', width: 130, render: (_, r) => <Badge status={r.status} /> },
        { key: 'actions', label: 'Aksi', width: 90, render: () => <button type="button" style={btnSmall}><Eye size={12} style={{ marginRight: 4 }} /> Lihat</button> },
    ]
    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <AIGradientBanner
                    compact
                    eyebrow="AI Anomaly Engine"
                    title="Deteksi pola transaksi mencurigakan secara real-time"
                    body="Model isolation forest + rule-based menganalisis transaksi 24/7. Confidence score di atas 80% diprioritaskan untuk investigasi."
                />
            </div>

            <SectionTitle
                title="AI Anomaly Detection — Fraud Risk"
                hint="Alert AI engine 24 jam terakhir · model v2.4"
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
                <StatCard label="Anomalies"        value="47"     sub="oleh AI Engine"        icon={Sparkles}    accent="#b8392a" />
                <StatCard label="Investigated"     value="22"     sub="dari 47 alert"          icon={AlertOctagon} accent="var(--gold-500)" />
                <StatCard label="Confirmed Fraud"  value="3"      sub="loss dicegah Rp 2,1 M" icon={ShieldAlert} accent="#b8392a" />
                <StatCard label="False Positive"   value="9.2%"   sub="model v2.4"             icon={CheckCircle2} accent="var(--green-600)" />
            </div>

            <div style={{ ...cardBase, padding: 0, overflow: 'hidden' }}>
                <DataTable columns={cols} data={FRAUD_ROWS} />
            </div>
        </>
    )
}

const LIBRARY_TYPES = [
    { value: '',          label: 'Semua' },
    { value: 'Preventif', label: 'Preventif' },
    { value: 'Deteksi',   label: 'Deteksi' },
    { value: 'Korektif',  label: 'Korektif' },
]

const LIBRARY_ROWS = [
    { id: 'CTRL-OP-022', name: 'Approval matrix bertingkat di sistem core',     type: 'Preventif', cats: ['Operasional'],            eff: 90, owner: 'Reza Anggara',    last: '04 Mei 2026' },
    { id: 'CTRL-OP-014', name: 'Rekonsiliasi kas harian dengan dual control',    type: 'Deteksi',   cats: ['Operasional'],            eff: 84, owner: 'Sinta Permata',   last: '02 Mei 2026' },
    { id: 'CTRL-CY-008', name: 'Multi-factor authentication wajib',              type: 'Preventif', cats: ['Siber','Operasional'],    eff: 92, owner: 'Galih Wibowo',    last: '03 Mei 2026' },
    { id: 'CTRL-CP-031', name: 'Auto-flag transaksi LTKT/LTKM ke PPATK',         type: 'Deteksi',   cats: ['Kepatuhan'],              eff: 88, owner: 'Maya Indira',     last: '01 Mei 2026' },
    { id: 'CTRL-CR-019', name: 'Re-appraisal agunan setiap 6 bulan',             type: 'Deteksi',   cats: ['Finansial'],              eff: 78, owner: 'Nadia Rahman',    last: '28 Apr 2026' },
    { id: 'CTRL-LG-007', name: 'Privacy Impact Assessment untuk produk baru',    type: 'Preventif', cats: ['Hukum','Kepatuhan'],      eff: 80, owner: 'Kartika Dewi',    last: '30 Apr 2026' },
    { id: 'CTRL-OP-058', name: 'CCTV monitoring real-time pada area sensitif',   type: 'Deteksi',   cats: ['Operasional'],            eff: 86, owner: 'Yoga Pratama',    last: '02 Mei 2026' },
    { id: 'CTRL-OP-045', name: 'Mandatory leave bagi pejabat operasional',       type: 'Preventif', cats: ['Operasional'],            eff: 75, owner: 'Putri Handayani', last: '27 Apr 2026' },
    { id: 'CTRL-OP-031', name: 'Auto-flag transaksi melebihi pattern normal',    type: 'Deteksi',   cats: ['Operasional'],            eff: 81, owner: 'Hafidz Al-Faruq', last: '01 Mei 2026' },
    { id: 'CTRL-CY-014', name: 'Vulnerability scanning bulanan endpoint',        type: 'Deteksi',   cats: ['Siber'],                  eff: 79, owner: 'Galih Wibowo',    last: '04 Mei 2026' },
    { id: 'CTRL-CY-021', name: 'Tokenisasi data PII pada API gateway',           type: 'Preventif', cats: ['Siber','Hukum'],          eff: 87, owner: 'Galih Wibowo',    last: '03 Mei 2026' },
    { id: 'CTRL-OP-067', name: 'Audit trail otorisasi pencairan',                type: 'Deteksi',   cats: ['Operasional'],            eff: 83, owner: 'Bayu Hartanto',   last: '29 Apr 2026' },
    { id: 'CTRL-RP-003', name: 'Crisis communication playbook',                  type: 'Korektif',  cats: ['Reputasi'],               eff: 70, owner: 'Anggun Kusuma',   last: '20 Apr 2026' },
    { id: 'CTRL-CR-027', name: 'Re-rating debitur otomatis berbasis perilaku',   type: 'Deteksi',   cats: ['Finansial'],              eff: 82, owner: 'Nadia Rahman',    last: '02 Mei 2026' },
    { id: 'CTRL-CP-018', name: 'Whistleblowing channel terenkripsi end-to-end',  type: 'Preventif', cats: ['Kepatuhan','Hukum'],      eff: 85, owner: 'Maya Indira',     last: '30 Apr 2026' },
]

function LibraryTab() {
    const [search, setSearch] = useState('')
    const [type, setType]     = useState('')

    const filtered = LIBRARY_ROWS.filter((r) => {
        if (type && r.type !== type) return false
        if (search) {
            const q = search.toLowerCase()
            return (r.id + ' ' + r.name + ' ' + r.cats.join(' ')).toLowerCase().includes(q)
        }
        return true
    })

    const cols = [
        { key: 'id',   label: 'Kode',           width: 140, render: (_, r) => <span className="mono" style={{ fontSize: 11.5, fontWeight: 600 }}>{r.id}</span> },
        { key: 'name', label: 'Nama Kontrol',   render: (_, r) => <span style={{ fontWeight: 600 }}>{r.name}</span> },
        { key: 'type', label: 'Tipe',           width: 110, render: (_, r) => <Tag tone={r.type === 'Preventif' ? 'green' : r.type === 'Deteksi' ? 'gold' : 'amber'}>{r.type}</Tag> },
        {
            key: 'cats', label: 'Risk Categories', width: 220,
            render: (_, r) => (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {r.cats.map((c) => <Tag key={c} size="xs">{c}</Tag>)}
                </div>
            ),
        },
        {
            key: 'eff', label: 'Effectiveness', width: 180,
            render: (_, r) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                        <HBar value={r.eff} max={100} color={r.eff >= 85 ? 'var(--green-600)' : r.eff >= 75 ? 'var(--gold-500)' : '#b8392a'} />
                    </div>
                    <span className="mono" style={{ fontSize: 11.5, fontWeight: 600, minWidth: 32 }}>{r.eff}%</span>
                </div>
            ),
        },
        {
            key: 'owner', label: 'Owner', width: 180,
            render: (_, r) => (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name={r.owner} size={22} />
                    <span style={{ fontSize: 12.5 }}>{r.owner}</span>
                </span>
            ),
        },
        { key: 'last', label: 'Last Reviewed', width: 130, render: (_, r) => <span className="mono" style={{ fontSize: 12 }}>{r.last}</span> },
        { key: 'actions', label: 'Aksi', width: 90, render: () => <button type="button" style={btnSmall}><Eye size={12} style={{ marginRight: 4 }} /> Lihat</button> },
    ]

    const filterChips = LIBRARY_TYPES.map((t) => ({
        label:   t.label,
        value:   t.value,
        active:  type === t.value,
        onClick: () => setType(t.value),
    }))

    return (
        <>
            <SectionTitle
                title="Risk Control Library"
                hint="Katalog kontrol terstandar lintas kategori risiko"
            />

            <div style={{ ...cardBase, padding: 0, overflow: 'hidden' }}>
                <Toolbar
                    searchPlaceholder="Cari kode kontrol, nama, atau kategori…"
                    searchValue={search}
                    onSearch={setSearch}
                    filters={filterChips}
                    count={filtered.length}
                    countLabel="kontrol"
                />
                <DataTable columns={cols} data={filtered} />
            </div>
        </>
    )
}

/* ─────────────────────────── Page ─────────────────────────── */

export default function RisikoIndex({ risks, filters = {}, summary = {}, risks_by_cell }) {
    const [tab, setTab]             = useState('profile')
    const [search, setSearch]       = useState(filters.search   ?? '')
    const [kategori, setKategori]   = useState(filters.kategori ?? '')
    const [status, setStatus]       = useState(filters.status   ?? '')

    const data = risks?.data ?? []

    /* live-debounced search */
    function applyFilter(next = {}) {
        router.get(
            route('risk.index'),
            {
                search:   next.search   ?? search,
                kategori: next.kategori ?? kategori,
                status:   next.status   ?? status,
            },
            { preserveState: true, replace: true },
        )
    }

    function handleDelete(id) {
        if (!confirm('Yakin hapus risiko ini?')) return
        router.delete(route('risk.destroy', id))
    }

    /* Heatmap cells (residual L × I). Prefer prop, else compute. */
    const heatCells = useMemo(() => {
        if (risks_by_cell && typeof risks_by_cell === 'object') return risks_by_cell
        const acc = {}
        for (const r of data) {
            const l = Number(r.residual_likelihood) || 0
            const i = Number(r.residual_impact)     || 0
            if (!l || !i) continue
            acc[l] = acc[l] || {}
            acc[l][i] = (acc[l][i] || 0) + 1
        }
        return acc
    }, [data, risks_by_cell])

    /* Composition by kategori */
    const composition = useMemo(() => {
        const counts = {}
        for (const r of data) {
            const k = (r.kategori || '').toLowerCase()
            if (!k) continue
            counts[k] = (counts[k] || 0) + 1
        }
        const entries = Object.entries(counts).map(([k, v]) => ({
            key:   k,
            label: k.charAt(0).toUpperCase() + k.slice(1),
            value: v,
            color: KATEGORI_COLOR[k] ?? '#7a8884',
        }))
        entries.sort((a, b) => b.value - a.value)
        const max = entries.length ? Math.max(...entries.map((e) => e.value)) : 1
        return { entries, max, total: entries.reduce((s, e) => s + e.value, 0) || 1 }
    }, [data])

    /* Filter chips for kategori */
    const kategoriChips = KATEGORI_OPTIONS.map((k) => ({
        label:   k.label,
        value:   k.value,
        active:  (kategori || '') === k.value,
        onClick: () => {
            setKategori(k.value)
            applyFilter({ kategori: k.value })
        },
    }))

    const columns = [
        {
            key: 'kode_risiko',
            label: 'Kode',
            width: 130,
            render: (v) => (
                <span className="mono" style={{ fontSize: 11.5, fontWeight: 600 }}>
                    {v ?? '—'}
                </span>
            ),
        },
        {
            key: 'nama_risiko',
            label: 'Nama Risiko',
            render: (_, row) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{row.nama_risiko}</div>
                    {row.unit_pemilik && (
                        <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 2 }}>
                            {row.unit_pemilik}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'kategori',
            label: 'Kategori',
            width: 140,
            render: (v) => v ? <Tag>{v.charAt(0).toUpperCase() + v.slice(1)}</Tag> : '—',
        },
        {
            key: 'inherent_score',
            label: 'Inherent',
            width: 90,
            align: 'center',
            render: (v) => <RiskScoreChip score={v} />,
        },
        {
            key: 'residual_score',
            label: 'Residual',
            width: 90,
            align: 'center',
            render: (v) => <RiskScoreChip score={v} />,
        },
        {
            key: 'status',
            label: 'Status',
            width: 130,
            render: (v) => <Badge status={v} />,
        },
        {
            key: 'pic_user_id',
            label: 'PIC',
            width: 160,
            render: (_, row) => row.pic?.name
                ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <Avatar name={row.pic.name} size={22} />
                        <span style={{ fontSize: 12.5 }}>{row.pic.name}</span>
                    </span>
                )
                : <span style={{ color: 'var(--ink-500)' }}>—</span>,
        },
        {
            key: 'actions',
            label: 'Aksi',
            width: 200,
            render: (_, row) => (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Link href={route('risk.show', row.id)} style={btnSmall}>Lihat</Link>
                    <Link href={route('risk.edit', row.id)} style={btnSmall}>Edit</Link>
                    <button onClick={() => handleDelete(row.id)} style={btnDanger}>Hapus</button>
                </div>
            ),
        },
    ]

    return (
        <AppLayout title="Manajemen Risiko">
            <PageHeader
                title="Manajemen Risiko"
                description="Identifikasi, analisis, monitoring, dan mitigasi risiko korporat secara terintegrasi."
                breadcrumbs={[
                    { label: 'Beranda', href: route('dashboard') },
                    { label: 'Manajemen Risiko' },
                ]}
                actions={
                    <>
                        <button type="button" style={btnSecondary}>
                            <Download size={14} /> Ekspor
                        </button>
                        <Link href={route('risk.create')} style={btnPrimary}>
                            <Plus size={14} /> Tambah Risiko
                        </Link>
                    </>
                }
                tabs={[
                    { id: 'profile', label: 'Risk Profile', count: data.length },
                    { id: 'rcsa',    label: 'RCSA' },
                    { id: 'kri',     label: 'KRI' },
                    { id: 'fraud',   label: 'Fraud' },
                    { id: 'library', label: 'Library' },
                ]}
                activeTab={tab}
                onTabChange={setTab}
            />

            <div style={{ padding: '20px 32px' }}>
                {tab === 'profile' && (
                <>
                {/* KPI strip */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 14,
                        marginBottom: 18,
                    }}
                >
                    <StatCard label="Total Risiko"   value={summary.total      ?? data.length} icon={AlertTriangle} accent="var(--green-600)" />
                    <StatCard label="Risiko Tinggi"  value={summary.high_count ?? '—'}        icon={ShieldAlert}   accent="#b8392a" />
                    <StatCard label="Termitigasi"    value={summary.mitigated  ?? '—'}        icon={CheckCircle2}  accent="var(--green-600)" />
                    <StatCard label="Diterima"       value={summary.accepted   ?? '—'}        icon={ThumbsUp}      accent="var(--blue-600)" />
                </div>

                {/* Heatmap + Komposisi per Kategori */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 14,
                        marginBottom: 18,
                    }}
                >
                    <div style={{ ...cardBase, padding: 20 }}>
                        <SectionTitle
                            title="Risk Heatmap"
                            hint="Distribusi residual risk · klik sel untuk filter"
                        />
                        <Heatmap cells={heatCells} />
                    </div>

                    <div style={{ ...cardBase, padding: 20 }}>
                        <SectionTitle
                            title="Komposisi per Kategori"
                            hint={`Distribusi ${composition.total} risiko aktif`}
                        />
                        {composition.entries.length === 0 ? (
                            <div style={{ fontSize: 12.5, color: 'var(--ink-500)', padding: '24px 0' }}>
                                Belum ada data kategori.
                            </div>
                        ) : composition.entries.map((d) => {
                            const pct = Math.round((d.value / composition.total) * 100)
                            return (
                                <div key={d.key} style={{ marginBottom: 12 }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: 12.5,
                                            marginBottom: 4,
                                        }}
                                    >
                                        <span style={{ color: 'var(--ink-700)', fontWeight: 600 }}>
                                            {d.label}
                                        </span>
                                        <span className="mono" style={{ fontWeight: 600 }}>
                                            {d.value} <span style={{ color: 'var(--ink-500)', fontWeight: 500 }}>· {pct}%</span>
                                        </span>
                                    </div>
                                    <HBar value={d.value} max={composition.max} color={d.color} />
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Toolbar + Table */}
                <div style={{ ...cardBase, padding: 0, overflow: 'hidden' }}>
                    <Toolbar
                        searchPlaceholder="Cari kode, nama risiko, atau unit…"
                        searchValue={search}
                        onSearch={(v) => {
                            setSearch(v)
                        }}
                        filters={kategoriChips}
                        right={
                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value)
                                    applyFilter({ status: e.target.value })
                                }}
                                style={{
                                    padding: '7px 28px 7px 10px',
                                    border: '1px solid var(--ink-300)',
                                    borderRadius: 8,
                                    background: '#fff',
                                    fontSize: 12.5,
                                    cursor: 'pointer',
                                }}
                            >
                                {STATUS_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        }
                        count={data.length}
                        countLabel="risiko"
                    />
                    <DataTable columns={columns} data={data} />
                </div>

                {/* Pagination */}
                {risks?.links && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
                        {risks.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                style={{
                                    padding: '6px 10px',
                                    borderRadius: 6,
                                    fontSize: 12.5,
                                    border: '1px solid var(--ink-200)',
                                    background: link.active ? 'var(--green-700)' : '#fff',
                                    color: link.active ? '#fff' : 'var(--ink-700)',
                                    pointerEvents: link.url ? 'auto' : 'none',
                                    opacity: link.url ? 1 : 0.4,
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
                </>
                )}

                {tab === 'rcsa'    && <RcsaTab />}
                {tab === 'kri'     && <KriPlaceholderTab />}
                {tab === 'fraud'   && <FraudTab />}
                {tab === 'library' && <LibraryTab />}
            </div>
        </AppLayout>
    )
}
