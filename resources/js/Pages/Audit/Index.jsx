import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import {
    ClipboardCheck,
    AlertCircle,
    Activity,
    Layers,
    Plus,
    Calendar,
    Eye,
    ArrowRight,
    Wallet,
    Package,
} from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import StatCard from '@/Components/StatCard'
import Badge from '@/Components/Badge'
import DataTable from '@/Components/DataTable'
import Toolbar from '@/Components/Toolbar'
import Tag from '@/Components/Tag'
import Avatar from '@/Components/Avatar'
import HBar from '@/Components/HBar'
import SectionTitle from '@/Components/SectionTitle'
import Donut from '@/Components/Donut'

const STATUS_OPTIONS = [
    { value: '',            label: 'Semua Status' },
    { value: 'draft',       label: 'Draft' },
    { value: 'planned',     label: 'Planned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed',   label: 'Completed' },
    { value: 'cancelled',   label: 'Cancelled' },
]

const STATUS_PROGRESS = {
    draft:        10,
    planned:      25,
    in_progress:  60,
    completed:    100,
    cancelled:    0,
}

const TABS = [
    { id: 'penugasan',  label: 'Penugasan' },
    { id: 'temuan',     label: 'Temuan' },
    { id: 'tindak',     label: 'Tindak Lanjut' },
    { id: 'performa',   label: 'Performa Auditor' },
    { id: 'admin',      label: 'Administrasi SPI' },
]

const RISK_LEVEL_LABEL = {
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi',
    critical: 'Tinggi',
}

function formatDateMono(v) {
    if (!v) return '—'
    return new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const btnPrimary = {
    background: 'var(--green-700)',
    color: '#fff',
    padding: '8px 14px',
    borderRadius: 8,
    border: 'none',
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
    color: 'var(--ink-700)',
    padding: '8px 14px',
    borderRadius: 8,
    border: '1px solid var(--ink-200)',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: 13,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
}

const btnSmall = {
    background: 'var(--ink-50)',
    color: 'var(--ink-700)',
    padding: '4px 8px',
    borderRadius: 6,
    border: '1px solid var(--ink-200)',
    cursor: 'pointer',
    fontSize: 11.5,
    fontWeight: 500,
    textDecoration: 'none',
}

const btnDanger = {
    background: 'transparent',
    color: '#b8392a',
    padding: '4px 8px',
    borderRadius: 6,
    border: '1px solid #f4cfc7',
    cursor: 'pointer',
    fontSize: 11.5,
    fontWeight: 500,
}

const filterSelect = {
    padding: '8px 12px',
    border: '1px solid var(--ink-200)',
    borderRadius: 8,
    background: '#fff',
    fontSize: 13,
    color: 'var(--ink-700)',
    outline: 'none',
}

/* ─────────────────────── Sub-tab samples ──────────────────────── */

const cardBase = {
    background: '#fff',
    border: '1px solid var(--ink-200)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
}

const TEMUAN_ROWS = [
    { id: 'FND-26-0142', t: 'API gateway belum menerapkan rate limiting per endpoint', aud: 'AUD-2026-029', unit: 'Divisi IT Operations',     sev: 'Tinggi', owner: 'Galih Wibowo',  d: '30 Jun 2026', s: 'Aktif' },
    { id: 'FND-26-0141', t: 'Bukti pelaksanaan EDD nasabah PEP tidak lengkap',         aud: 'AUD-2026-028', unit: 'KC Surabaya Tunjungan',    sev: 'Tinggi', owner: 'Sinta Permata', d: '15 Jun 2026', s: 'Pelaksanaan' },
    { id: 'FND-26-0140', t: 'SOP rotasi vault key belum diperbarui sejak 2023',         aud: 'AUD-2026-029', unit: 'Divisi IT Operations',     sev: 'Sedang', owner: 'Galih Wibowo',  d: '31 Jul 2026', s: 'Aktif' },
    { id: 'FND-26-0139', t: 'Selisih taksiran > toleransi pada 23 transaksi sample',    aud: 'AUD-2026-026', unit: 'KC Bandung Asia Afrika',   sev: 'Sedang', owner: 'Reza Anggara',  d: '31 Mei 2026', s: 'Pelaksanaan' },
    { id: 'FND-26-0138', t: 'Kontrak vendor outsourcing belum mencakup klausul UU PDP', aud: 'AUD-2026-022', unit: 'Divisi Procurement',       sev: 'Tinggi', owner: 'Maya Indira',   d: '30 Apr 2026', s: 'Pemantauan' },
    { id: 'FND-26-0137', t: 'Backup core banking belum diuji restore selama 6 bulan',   aud: 'AUD-2026-029', unit: 'Divisi IT Operations',     sev: 'Tinggi', owner: 'Galih Wibowo',  d: '31 Mei 2026', s: 'Pelaksanaan' },
    { id: 'FND-26-0136', t: 'Reviewer dual control tidak konsisten 12 transaksi',       aud: 'AUD-2026-024', unit: 'Kanwil II — Jakarta',      sev: 'Sedang', owner: 'Yoga Pratama',  d: '20 Mei 2026', s: 'Aktif' },
    { id: 'FND-26-0135', t: 'Daftar hadir pelatihan APU-PPT belum lengkap',             aud: 'AUD-2026-021', unit: 'Divisi Compliance',        sev: 'Rendah', owner: 'Maya Indira',   d: '15 Mei 2026', s: 'Pelaksanaan' },
]

function TemuanTab({ btnSmall }) {
    const cols = [
        { key: 'id',    label: 'Finding ID', width: 150, render: (_, r) => <span className="mono" style={{ fontSize: 11.5, fontWeight: 600 }}>{r.id}</span> },
        {
            key: 't', label: 'Temuan',
            render: (_, r) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{r.t}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 2 }}>
                        Audit: <span className="mono">{r.aud}</span> · {r.unit}
                    </div>
                </div>
            ),
        },
        { key: 'sev', label: 'Severity', width: 110, render: (_, r) => <Badge status={r.sev} /> },
        {
            key: 'owner', label: 'Owner', width: 180,
            render: (_, r) => (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name={r.owner} size={22} />
                    <span style={{ fontSize: 12.5 }}>{r.owner}</span>
                </span>
            ),
        },
        { key: 'd', label: 'Deadline', width: 120, render: (_, r) => <span className="mono" style={{ fontSize: 12 }}>{r.d}</span> },
        { key: 's', label: 'Status', width: 130, render: (_, r) => <Badge status={r.s} /> },
        {
            key: 'actions', label: 'Aksi', width: 100,
            render: () => (
                <Link href="/temuan" style={btnSmall}>
                    <Eye size={12} style={{ marginRight: 4 }} /> Buka
                </Link>
            ),
        },
    ]
    return (
        <>
            <SectionTitle
                title="Temuan & Rekomendasi Audit"
                hint="Daftar temuan terbuka lintas penugasan · klik untuk detail"
                actions={
                    <Link href="/temuan" style={{ ...btnSmall, padding: '6px 12px' }}>
                        Halaman Temuan <ArrowRight size={12} style={{ marginLeft: 4 }} />
                    </Link>
                }
            />
            <div style={cardBase}>
                <DataTable columns={cols} data={TEMUAN_ROWS} />
            </div>
        </>
    )
}

const FOLLOWUP_MONTHS = [
    { m: 'Jun', o: 18, c: 12 },
    { m: 'Jul', o: 22, c: 15 },
    { m: 'Agu', o: 19, c: 18 },
    { m: 'Sep', o: 25, c: 20 },
    { m: 'Okt', o: 21, c: 22 },
    { m: 'Nov', o: 17, c: 19 },
    { m: 'Des', o: 24, c: 18 },
    { m: 'Jan', o: 28, c: 21 },
    { m: 'Feb', o: 23, c: 25 },
    { m: 'Mar', o: 19, c: 22 },
    { m: 'Apr', o: 18, c: 14 },
    { m: 'Mei', o: 14, c: 16 },
]

const FOLLOWUP_ROWS = [
    { aud: 'AUD-2026-029', f: 'Rate limiting API gateway',          pic: 'Galih Wibowo',  deadline: '30 Jun 2026', overdue: false, prog: 62, s: 'Pelaksanaan' },
    { aud: 'AUD-2026-028', f: 'Lengkapi bukti EDD nasabah PEP',     pic: 'Sinta Permata', deadline: '15 Jun 2026', overdue: false, prog: 78, s: 'Pelaksanaan' },
    { aud: 'AUD-2026-022', f: 'Adendum kontrak vendor — UU PDP',    pic: 'Maya Indira',   deadline: '30 Apr 2026', overdue: true,  prog: 92, s: 'Pemantauan' },
    { aud: 'AUD-2026-029', f: 'Test restore backup core banking',   pic: 'Galih Wibowo',  deadline: '31 Mei 2026', overdue: false, prog: 48, s: 'Pelaksanaan' },
    { aud: 'AUD-2026-026', f: 'Review SOP toleransi taksiran',      pic: 'Reza Anggara',  deadline: '31 Mei 2026', overdue: false, prog: 32, s: 'Aktif' },
    { aud: 'AUD-2026-024', f: 'Standardisasi dual control review',  pic: 'Yoga Pratama',  deadline: '20 Mei 2026', overdue: false, prog: 24, s: 'Aktif' },
]

function FollowupBarChart() {
    const max = Math.max(...FOLLOWUP_MONTHS.flatMap((m) => [m.o, m.c]))
    const pad = 12
    const w = 460
    const h = 240
    const innerH = h - 36 - pad
    const slot = (w - pad * 2) / FOLLOWUP_MONTHS.length
    const barW = slot * 0.36
    return (
        <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
            {[0.25, 0.5, 0.75, 1].map((p, i) => (
                <line
                    key={i}
                    x1={pad} x2={w - pad}
                    y1={pad + innerH * (1 - p)} y2={pad + innerH * (1 - p)}
                    stroke="var(--ink-100)" strokeDasharray="3 4"
                />
            ))}
            {FOLLOWUP_MONTHS.map((m, i) => {
                const xCenter = pad + slot * i + slot / 2
                const oH = (m.o / max) * innerH
                const cH = (m.c / max) * innerH
                return (
                    <g key={m.m}>
                        <rect
                            x={xCenter - barW - 1}
                            y={pad + innerH - oH}
                            width={barW}
                            height={oH}
                            fill="#c98114"
                            rx={2}
                        />
                        <rect
                            x={xCenter + 1}
                            y={pad + innerH - cH}
                            width={barW}
                            height={cH}
                            fill="#187c5b"
                            rx={2}
                        />
                        <text x={xCenter} y={h - 18} textAnchor="middle" fontSize="10.5" fill="var(--ink-500)" fontWeight="600">{m.m}</text>
                    </g>
                )
            })}
        </svg>
    )
}

function FollowupTab() {
    const cols = [
        { key: 'aud',      label: 'Audit Ref',  width: 140, render: (_, r) => <span className="mono" style={{ fontSize: 11.5, fontWeight: 600 }}>{r.aud}</span> },
        { key: 'f',        label: 'Finding',    render: (_, r) => <span style={{ fontWeight: 600 }}>{r.f}</span> },
        {
            key: 'pic', label: 'PIC', width: 180,
            render: (_, r) => (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name={r.pic} size={22} />
                    <span style={{ fontSize: 12.5 }}>{r.pic}</span>
                </span>
            ),
        },
        {
            key: 'deadline', label: 'Deadline', width: 130,
            render: (_, r) => (
                <span className="mono" style={{ fontSize: 12, color: r.overdue ? '#b8392a' : 'var(--ink-800)', fontWeight: r.overdue ? 700 : 500 }}>
                    {r.deadline}{r.overdue ? ' ⚠' : ''}
                </span>
            ),
        },
        {
            key: 'prog', label: 'Progress', width: 180,
            render: (_, r) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                        <HBar value={r.prog} max={100} color={r.prog >= 70 ? 'var(--green-600)' : r.prog >= 40 ? 'var(--gold-500)' : '#b8392a'} />
                    </div>
                    <span className="mono" style={{ fontSize: 11.5, fontWeight: 600, minWidth: 32 }}>{r.prog}%</span>
                </div>
            ),
        },
        { key: 's', label: 'Status', width: 130, render: (_, r) => <Badge status={r.s} /> },
    ]
    return (
        <>
            <SectionTitle
                title="Tindak Lanjut Bulanan"
                hint="Trend pembukaan vs penyelesaian temuan 12 bulan terakhir"
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, marginBottom: 18 }}>
                <div style={{ ...cardBase, padding: 18 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Open vs Closed per Bulan</div>
                    <FollowupBarChart />
                    <div style={{ display: 'flex', gap: 16, fontSize: 12, paddingTop: 10, borderTop: '1px solid var(--ink-100)', marginTop: 6 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 10, height: 10, background: '#c98114', borderRadius: 2 }} /> Open (temuan baru)
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 10, height: 10, background: '#187c5b', borderRadius: 2 }} /> Closed
                        </span>
                    </div>
                </div>
                <div style={{ ...cardBase, padding: 18 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>KPI Tindak Lanjut</div>
                    {[
                        { l: 'Total Open',              v: '47',     hint: 'temuan masih aktif' },
                        { l: 'Total Closed YTD',        v: '152',    hint: 'sejak Jan 2026' },
                        { l: 'Avg Closure Time',        v: '42 hari', hint: 'target ≤ 60 hari' },
                        { l: 'Overdue %',               v: '6.4%',   hint: '3 dari 47 overdue' },
                    ].map((k) => (
                        <div key={k.l} style={{ padding: '10px 0', borderBottom: '1px solid var(--ink-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 12.5, color: 'var(--ink-700)', fontWeight: 600 }}>{k.l}</div>
                                <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>{k.hint}</div>
                            </div>
                            <div className="mono" style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink-900)' }}>{k.v}</div>
                        </div>
                    ))}
                </div>
            </div>

            <SectionTitle
                title="Recent Tindak Lanjut"
                hint="Action plan aktif dengan deadline terdekat"
                level={4}
                display={false}
            />
            <div style={cardBase}>
                <DataTable columns={cols} data={FOLLOWUP_ROWS} />
            </div>
        </>
    )
}

const PERFORMA_ROWS = [
    { name: 'Bayu Hartanto',    role: 'Senior',  active: 5, sla: 96, fnd: 24, avg: '38 hari', score: 92 },
    { name: 'Kartika Dewi',     role: 'Senior',  active: 6, sla: 92, fnd: 31, avg: '41 hari', score: 90 },
    { name: 'Anggun Kusuma',    role: 'Senior',  active: 4, sla: 89, fnd: 18, avg: '45 hari', score: 85 },
    { name: 'Rangga Saputro',   role: 'Senior',  active: 5, sla: 84, fnd: 22, avg: '48 hari', score: 82 },
    { name: 'Dimas Pranata',    role: 'Junior',  active: 3, sla: 78, fnd: 11, avg: '52 hari', score: 76 },
    { name: 'Sari Wulandari',   role: 'Senior',  active: 4, sla: 91, fnd: 20, avg: '40 hari', score: 88 },
    { name: 'Rizki Prabowo',    role: 'Junior',  active: 3, sla: 74, fnd: 9,  avg: '55 hari', score: 72 },
    { name: 'Hafidz Al-Faruq',  role: 'Lead',    active: 7, sla: 95, fnd: 28, avg: '36 hari', score: 94 },
    { name: 'Putri Handayani',  role: 'Senior',  active: 5, sla: 87, fnd: 19, avg: '44 hari', score: 84 },
    { name: 'Yoga Pratama',     role: 'Lead',    active: 6, sla: 93, fnd: 25, avg: '37 hari', score: 91 },
]

function PerformaTab({ btnSmall }) {
    const cols = [
        {
            key: 'name', label: 'Auditor',
            render: (_, r) => (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={r.name} size={28} />
                    <div>
                        <div style={{ fontWeight: 600 }}>{r.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--ink-500)' }}>{r.role} Auditor</div>
                    </div>
                </span>
            ),
        },
        {
            key: 'role', label: 'Posisi', width: 110,
            render: (_, r) => <Tag tone={r.role === 'Lead' ? 'green' : r.role === 'Senior' ? 'blue' : 'neutral'}>{r.role}</Tag>,
        },
        { key: 'active', label: 'Audit Aktif', width: 100, align: 'center', render: (_, r) => <span className="mono" style={{ fontWeight: 600 }}>{r.active}</span> },
        {
            key: 'sla', label: 'SLA Compliance', width: 200,
            render: (_, r) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                        <HBar value={r.sla} max={100} color={r.sla >= 90 ? 'var(--green-600)' : r.sla >= 80 ? 'var(--gold-500)' : '#b8392a'} />
                    </div>
                    <span className="mono" style={{ fontSize: 11.5, fontWeight: 600, minWidth: 32 }}>{r.sla}%</span>
                </div>
            ),
        },
        { key: 'fnd', label: 'Findings', width: 100, align: 'center', render: (_, r) => <span className="mono" style={{ fontWeight: 600 }}>{r.fnd}</span> },
        { key: 'avg', label: 'Avg Closure', width: 120, render: (_, r) => <span className="mono" style={{ fontSize: 12, color: 'var(--ink-700)' }}>{r.avg}</span> },
        {
            key: 'score', label: 'Score', width: 90, align: 'center',
            render: (_, r) => (
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Donut
                        size={48}
                        thickness={6}
                        segments={[{ value: r.score, color: r.score >= 90 ? '#187c5b' : r.score >= 80 ? '#c98114' : '#b8392a' }, { value: 100 - r.score, color: 'var(--ink-100)' }]}
                        centerValue={r.score}
                    />
                </span>
            ),
        },
        {
            key: 'actions', label: 'Aksi', width: 130,
            render: () => (
                <button type="button" style={btnSmall}>
                    <Eye size={12} style={{ marginRight: 4 }} /> Profil
                </button>
            ),
        },
    ]
    return (
        <>
            <SectionTitle
                title="SLA & KPI Auditor"
                hint="Performa auditor SPI · scorecard Q2 2026"
            />
            <div style={cardBase}>
                <DataTable columns={cols} data={PERFORMA_ROWS} />
            </div>
        </>
    )
}

const ANGGARAN_ITEMS = [
    { l: 'Personnel & Honorarium',     budget: 1850, actual: 1320, pct: 71 },
    { l: 'Perjalanan Dinas',           budget: 480,  actual: 320,  pct: 67 },
    { l: 'Pelatihan & Sertifikasi',    budget: 240,  actual: 185,  pct: 77 },
    { l: 'Tools & Lisensi Audit',      budget: 320,  actual: 248,  pct: 78 },
    { l: 'Office & Operasional',       budget: 180,  actual: 96,   pct: 53 },
]

const LOGISTIK_ITEMS = [
    { item: 'Laptop audit (terdaftar)',  status: 'Aktif',     qty: '18 / 20', value: '540.000.000', updated: '02 Mei 2026' },
    { item: 'Token signature digital',   status: 'Aktif',     qty: '12 / 12', value: '36.000.000',  updated: '01 Mei 2026' },
    { item: 'Akses CAATT Software',      status: 'Aktif',     qty: '8 / 10',  value: '120.000.000', updated: '28 Apr 2026' },
    { item: 'Mobile audit kit',          status: 'Pemantauan', qty: '6 / 8',  value: '48.000.000',  updated: '25 Apr 2026' },
    { item: 'Forensic toolkit hardware', status: 'Aktif',     qty: '2 / 2',   value: '180.000.000', updated: '20 Apr 2026' },
    { item: 'Pelatihan voucher CISA',    status: 'Aktif',     qty: '5 / 5',   value: '75.000.000',  updated: '15 Apr 2026' },
]

function AdminTab() {
    const fmtIDR = (v) => `Rp ${v.toLocaleString('id-ID')}`
    const cols = [
        { key: 'item',    label: 'Item',         render: (_, r) => <span style={{ fontWeight: 600 }}>{r.item}</span> },
        { key: 'status',  label: 'Status',       width: 120, render: (_, r) => <Badge status={r.status} /> },
        { key: 'qty',     label: 'Qty',          width: 100, render: (_, r) => <span className="mono" style={{ fontWeight: 600 }}>{r.qty}</span> },
        { key: 'value',   label: 'Nilai (IDR)',  width: 160, render: (_, r) => <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>Rp {r.value}</span> },
        { key: 'updated', label: 'Last Updated', width: 130, render: (_, r) => <span className="mono" style={{ fontSize: 12 }}>{r.updated}</span> },
    ]
    return (
        <>
            <SectionTitle
                title="Anggaran SPI 2026"
                hint="Realisasi vs RKA · YTD per kategori (juta rupiah)"
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 14, marginBottom: 18 }}>
                <div style={{ ...cardBase, padding: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <Wallet size={16} style={{ color: 'var(--green-700)' }} />
                        <div style={{ fontSize: 13, fontWeight: 700 }}>Anggaran per Kategori</div>
                    </div>
                    {ANGGARAN_ITEMS.map((b) => (
                        <div key={b.l} style={{ marginBottom: 14 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                                <span style={{ fontWeight: 600 }}>{b.l}</span>
                                <span className="mono" style={{ fontSize: 11.5 }}>
                                    <span style={{ fontWeight: 600 }}>{fmtIDR(b.actual)} jt</span>
                                    <span style={{ color: 'var(--ink-400)' }}> / {fmtIDR(b.budget)} jt</span>
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ flex: 1 }}>
                                    <HBar value={b.pct} max={100} color={b.pct >= 75 ? 'var(--gold-500)' : 'var(--green-600)'} />
                                </div>
                                <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-600)', minWidth: 32 }}>{b.pct}%</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ ...cardBase, padding: 0 }}>
                    <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--ink-200)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Package size={16} style={{ color: 'var(--green-700)' }} />
                        <div style={{ fontSize: 13, fontWeight: 700 }}>Logistik & Aset SPI</div>
                    </div>
                    <DataTable columns={cols} data={LOGISTIK_ITEMS} />
                </div>
            </div>
        </>
    )
}

export default function AuditIndex({ audits, filters = {}, summary = {} }) {
    const [tab, setTab]       = useState('penugasan')
    const [search, setSearch] = useState(filters.search ?? '')
    const [status, setStatus] = useState(filters.status ?? '')

    function applyFilter(nextSearch = search, nextStatus = status) {
        router.get(route('audit.index'),
            { search: nextSearch, status: nextStatus },
            { preserveState: true, replace: true })
    }

    function handleSearch(v) {
        setSearch(v)
    }

    function handleSearchEnter(e) {
        if (e.key === 'Enter') applyFilter()
    }

    function handleStatusChange(v) {
        setStatus(v)
        applyFilter(search, v)
    }

    function handleDelete(id) {
        if (!confirm('Hapus audit plan ini?')) return
        router.delete(route('audit.destroy', id))
    }

    const rows = audits?.data ?? []

    const columns = [
        {
            key: 'judul',
            label: 'Judul',
            render: (_, row) => (
                <div>
                    <div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{row.judul}</div>
                    {row.tujuan && (
                        <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 2 }}>
                            {String(row.tujuan).slice(0, 80)}
                            {String(row.tujuan).length > 80 ? '…' : ''}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'unit_audit',
            label: 'Unit',
            width: 160,
            render: (v) => v ?? '—',
        },
        {
            key: 'auditor',
            label: 'Lead Auditor',
            width: 180,
            render: (_, row) => (
                row.auditor?.name
                    ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <Avatar name={row.auditor.name} size={24} />
                            <span style={{ fontSize: 12.5 }}>{row.auditor.name}</span>
                        </div>
                    )
                    : '—'
            ),
        },
        {
            key: 'tanggal_mulai',
            label: 'Tanggal Mulai',
            width: 110,
            render: (v) => <span className="mono" style={{ fontSize: 12 }}>{formatDateMono(v)}</span>,
        },
        {
            key: 'progress',
            label: 'Progress',
            width: 160,
            render: (_, row) => {
                const pct = row.progress ?? STATUS_PROGRESS[row.status] ?? 0
                const color = pct === 100 ? 'var(--green-600)'
                            : pct >= 60   ? 'var(--green-500)'
                            : 'var(--gold-500)'
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                            <HBar value={pct} max={100} color={color} height={8} />
                        </div>
                        <span className="mono" style={{ fontSize: 11.5, fontWeight: 600, minWidth: 34 }}>{pct}%</span>
                    </div>
                )
            },
        },
        {
            key: 'findings_count',
            label: 'Findings',
            width: 90,
            align: 'center',
            render: (_, row) => {
                const n = row.findings_count ?? row.findings?.length ?? 0
                return <Tag tone={n > 0 ? 'gold' : 'neutral'}>{n}</Tag>
            },
        },
        {
            key: 'tingkat_risiko',
            label: 'Risk',
            width: 100,
            render: (_, row) => {
                const lvl = row.tingkat_risiko ?? row.risk ?? null
                if (!lvl) return <span style={{ color: 'var(--ink-400)' }}>—</span>
                return <Badge status={RISK_LEVEL_LABEL[String(lvl).toLowerCase()] ?? lvl} />
            },
        },
        {
            key: 'status',
            label: 'Status',
            width: 130,
            render: (v) => <Badge status={v} />,
        },
        {
            key: 'actions',
            label: 'Aksi',
            width: 160,
            render: (_, row) => (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Link href={route('audit.show', row.id)} style={btnSmall}>Lihat</Link>
                    <Link href={route('audit.edit', row.id)} style={btnSmall}>Edit</Link>
                    <button onClick={() => handleDelete(row.id)} style={btnDanger}>Hapus</button>
                </div>
            ),
        },
    ]

    return (
        <AppLayout title="Audit Internal" contentPadding="none">
            <PageHeader
                title="Audit Internal"
                description="Perencanaan, pelaksanaan, pelaporan audit berbasis risiko serta pengujian efektivitas pengendalian internal."
                breadcrumbs={[{ label: 'Beranda', href: route('dashboard') }, { label: 'Manajemen Audit' }]}
                actions={
                    <>
                        <button type="button" style={btnSecondary}>
                            <Calendar size={14} />
                            PKAT
                        </button>
                        <Link href={route('audit.create')} style={btnPrimary}>
                            <Plus size={14} />
                            Penugasan Baru
                        </Link>
                    </>
                }
                tabs={TABS}
                activeTab={tab}
                onTabChange={setTab}
            />

            <div style={{ padding: '20px 32px' }}>
                {tab === 'penugasan' && (
                    <>
                        {/* KPI Strip */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: 14,
                            marginBottom: 18,
                        }}>
                            <StatCard
                                label="Audit Aktif"
                                value={summary.in_progress ?? summary.active ?? 0}
                                sub="penugasan berjalan"
                                icon={Activity}
                                accent="var(--green-600)"
                            />
                            <StatCard
                                label="Temuan Terbuka"
                                value={summary.open_findings ?? 0}
                                sub={`dari ${summary.total_findings ?? 0} ytd`}
                                icon={AlertCircle}
                                accent="var(--gold-500)"
                            />
                            <StatCard
                                label="SLA Compliance"
                                value={summary.sla_compliance != null ? `${summary.sla_compliance}%` : '—'}
                                sub="penyelesaian sesuai PKAT"
                                icon={ClipboardCheck}
                                accent="var(--green-600)"
                            />
                            <StatCard
                                label="Coverage"
                                value={summary.coverage != null ? `${summary.coverage}%` : '—'}
                                sub="dari auditable units"
                                icon={Layers}
                                accent="#2e5a8a"
                            />
                        </div>

                        {/* Card with Toolbar + Table */}
                        <div style={{
                            background: '#fff',
                            border: '1px solid var(--ink-200)',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                        }}>
                            <Toolbar
                                searchPlaceholder="Cari penugasan, lead auditor…"
                                searchValue={search}
                                onSearch={handleSearch}
                                right={
                                    <>
                                        <select
                                            value={status}
                                            onChange={(e) => handleStatusChange(e.target.value)}
                                            style={filterSelect}
                                        >
                                            {STATUS_OPTIONS.map(o => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </select>
                                        <button onClick={() => applyFilter()} style={btnSecondary}>Filter</button>
                                    </>
                                }
                                count={rows.length}
                                countLabel="penugasan"
                            />
                            <div onKeyDown={handleSearchEnter}>
                                <DataTable columns={columns} data={rows} />
                            </div>
                        </div>

                        {/* Pagination */}
                        {audits?.links && (
                            <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
                                {audits.links.map((link, i) => (
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
                                        }}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {tab === 'temuan'   && <TemuanTab btnSmall={btnSmall} />}
                {tab === 'tindak'   && <FollowupTab />}
                {tab === 'performa' && <PerformaTab btnSmall={btnSmall} />}
                {tab === 'admin'    && <AdminTab />}
            </div>
        </AppLayout>
    )
}
