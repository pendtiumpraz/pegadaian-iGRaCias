import { Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import {
    Edit2,
    Download,
    Plus,
    FileText,
    Calendar,
    AlertTriangle,
} from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import Badge from '@/Components/Badge'
import Tag from '@/Components/Tag'
import SectionTitle from '@/Components/SectionTitle'
import Heatmap from '@/Components/Heatmap'
import HBar from '@/Components/HBar'
import Avatar from '@/Components/Avatar'
import RightRail from '@/Components/RightRail'
import DetailRow from '@/Components/DetailRow'
import DataTable from '@/Components/DataTable'

/* ─────────────── helpers ─────────────── */

function formatDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

const cardBase = {
    background: '#fff',
    borderRadius: 'var(--radius-lg, 12px)',
    border: '1px solid var(--ink-200)',
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

/* ─────────────── triple tile ─────────────── */

function ScoreTile({ tone, label, score, sub, dim }) {
    const palette = {
        ink:   { bg: 'var(--ink-50)',   fg: 'var(--ink-900)', subFg: 'var(--ink-600)', label: 'var(--ink-600)' },
        green: { bg: 'var(--green-50)', fg: 'var(--green-800)', subFg: 'var(--green-800)', label: 'var(--green-800)', border: 'var(--green-100)' },
        red:   { bg: '#fbe4df',         fg: '#8b261b',          subFg: '#8b261b',          label: '#8b261b' },
    }[tone] || {}

    return (
        <div
            style={{
                padding: '14px 16px',
                background: palette.bg,
                borderRadius: 10,
                border: palette.border ? `1px solid ${palette.border}` : '1px solid transparent',
                opacity: dim ? 0.7 : 1,
            }}
        >
            <div
                style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: palette.label,
                    textTransform: 'uppercase',
                    letterSpacing: 0.4,
                }}
            >
                {label}
            </div>
            <div
                className="mono"
                style={{
                    fontSize: 28,
                    fontWeight: 600,
                    marginTop: 4,
                    color: palette.fg,
                }}
            >
                {score ?? '—'}
            </div>
            {sub && (
                <div
                    style={{
                        fontSize: 11.5,
                        color: palette.subFg,
                        marginTop: 8,
                    }}
                >
                    {sub}
                </div>
            )}
        </div>
    )
}

/* ─────────────── page ─────────────── */

export default function RisikoShow({
    risk,
    controls       = [],
    action_plans   = [],
    related_audits = [],
    related_policies = [],
}) {
    const inherentL = Number(risk.inherent_likelihood) || 0
    const inherentI = Number(risk.inherent_impact)     || 0
    const residualL = Number(risk.residual_likelihood) || 0
    const residualI = Number(risk.residual_impact)     || 0

    const inherentScore = inherentL * inherentI
    const residualScore = residualL * residualI
    const appetite      = Number(risk.risk_appetite) || null
    const overAppetite  = appetite != null && residualScore > appetite

    /* heatmap with single residual cell highlighted */
    const heatCells = residualL && residualI
        ? { [residualL]: { [residualI]: 1 } }
        : {}

    const controlsCols = [
        {
            key: 'kode_kontrol',
            label: 'Kode',
            width: 130,
            render: (v) => (
                <span className="mono" style={{ fontSize: 11.5, fontWeight: 600 }}>
                    {v ?? '—'}
                </span>
            ),
        },
        {
            key: 'nama_kontrol',
            label: 'Kontrol',
            render: (_, r) => (
                <div style={{ fontWeight: 600 }}>{r.nama_kontrol ?? r.nama ?? '—'}</div>
            ),
        },
        {
            key: 'tipe',
            label: 'Tipe',
            width: 120,
            render: (v) => v ? <Tag>{v}</Tag> : '—',
        },
        {
            key: 'efektivitas',
            label: 'Efektivitas',
            width: 160,
            render: (_, r) => {
                const e = Number(r.efektivitas) || 0
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                            <HBar
                                value={e}
                                max={5}
                                color={e >= 4 ? '#187c5b' : e >= 3 ? '#c98114' : '#b8392a'}
                            />
                        </div>
                        <span className="mono" style={{ fontSize: 11.5, fontWeight: 600, minWidth: 26 }}>
                            {e ? e.toFixed(1) : '—'}
                        </span>
                    </div>
                )
            },
        },
        {
            key: 'owner',
            label: 'Owner',
            width: 160,
            render: (_, r) => r.owner?.name
                ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <Avatar name={r.owner.name} size={22} />
                        <span style={{ fontSize: 12.5 }}>{r.owner.name}</span>
                    </span>
                )
                : <span style={{ color: 'var(--ink-500)' }}>—</span>,
        },
    ]

    /* ─────────── main ─────────── */
    const main = (
        <>
            {/* Triple-tile assessment */}
            <div style={{ ...cardBase, padding: 20 }}>
                <SectionTitle title="Risk Assessment" hint="Penilaian likelihood × dampak" />
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: 14,
                    }}
                >
                    <ScoreTile
                        tone="ink"
                        label="Inherent Risk"
                        score={inherentScore || '—'}
                        sub={
                            <>
                                Likelihood: {inherentL || '—'}
                                <br />
                                Dampak: {inherentI || '—'}
                            </>
                        }
                    />
                    <ScoreTile
                        tone={overAppetite ? 'red' : 'green'}
                        label="Residual Risk"
                        score={residualScore || '—'}
                        sub={
                            <>
                                Likelihood: {residualL || '—'}
                                <br />
                                Dampak: {residualI || '—'}
                            </>
                        }
                    />
                    <ScoreTile
                        tone="ink"
                        label="Risk Appetite"
                        score={appetite != null ? `≤ ${appetite}` : '—'}
                        sub={
                            overAppetite ? (
                                <span style={{ color: '#8b261b', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                    <AlertTriangle size={12} /> Residual melebihi appetite
                                </span>
                            ) : (
                                appetite != null ? 'Within appetite' : 'Belum diatur'
                            )
                        }
                    />
                </div>
            </div>

            {/* Heatmap */}
            <div style={{ ...cardBase, padding: 20 }}>
                <SectionTitle title="Posisi pada Heatmap" hint="Posisi residual risk pada matriks 5×5" />
                <Heatmap cells={heatCells} currentCell={residualL && residualI ? `${residualL},${residualI}` : undefined} />
            </div>

            {/* Controls */}
            <div style={{ ...cardBase, padding: 0, overflow: 'hidden' }}>
                <div
                    style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid var(--ink-200)',
                    }}
                >
                    <SectionTitle
                        title="Pengendalian (Controls)"
                        hint={`${controls.length} control terkait`}
                        style={{ marginBottom: 0 }}
                    />
                </div>
                <DataTable
                    columns={controlsCols}
                    data={controls}
                    emptyMessage="Belum ada control yang terhubung dengan risiko ini."
                />
            </div>

            {/* Action Plans */}
            <div style={{ ...cardBase, padding: 0, overflow: 'hidden' }}>
                <div
                    style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid var(--ink-200)',
                    }}
                >
                    <SectionTitle
                        title="Action Plans"
                        hint={`${action_plans.length} aksi mitigasi`}
                        style={{ marginBottom: 0 }}
                    />
                </div>

                {action_plans.length === 0 ? (
                    <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--ink-500)', fontSize: 13 }}>
                        Belum ada rencana aksi.
                    </div>
                ) : action_plans.map((a) => {
                    const pct = Number(a.progress_pct) || 0
                    const barColor = pct < 30 ? '#b8392a' : pct < 70 ? '#c98114' : '#187c5b'
                    const deadline = a.deadline ?? a.target_date ?? a.due_date
                    return (
                        <div
                            key={a.id}
                            style={{
                                padding: '14px 20px',
                                borderBottom: '1px solid var(--ink-100)',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    gap: 12,
                                    marginBottom: 8,
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-900)' }}>
                                        {a.judul ?? a.title ?? '—'}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 11.5,
                                            color: 'var(--ink-500)',
                                            marginTop: 4,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        {a.pic?.name && (
                                            <>
                                                <Avatar name={a.pic.name} size={18} />
                                                <span>{a.pic.name}</span>
                                            </>
                                        )}
                                        {deadline && (
                                            <>
                                                <span>·</span>
                                                <Calendar size={11} />
                                                <span>Deadline {formatDate(deadline)}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <Badge status={a.status} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ flex: 1 }}>
                                    <HBar value={pct} max={100} color={barColor} />
                                </div>
                                <span className="mono" style={{ fontSize: 11.5, fontWeight: 600, minWidth: 40, textAlign: 'right' }}>
                                    {pct}%
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )

    /* ─────────── rail ─────────── */
    const rail = (
        <>
            <div style={{ ...cardBase, padding: 20 }}>
                <SectionTitle title="Detail Risiko" />
                <DetailRow
                    label="Kode"
                    value={<span className="mono">{risk.kode_risiko ?? '—'}</span>}
                />
                <DetailRow
                    label="Kategori"
                    value={risk.kategori
                        ? <Tag>{risk.kategori.charAt(0).toUpperCase() + risk.kategori.slice(1)}</Tag>
                        : '—'}
                />
                <DetailRow label="Unit Pemilik" value={risk.unit_pemilik ?? '—'} />
                <DetailRow
                    label="PIC"
                    value={risk.pic?.name
                        ? (
                            <>
                                <Avatar name={risk.pic.name} size={18} />
                                <span>{risk.pic.name}</span>
                            </>
                        )
                        : '—'}
                />
                <DetailRow label="Status" value={<Badge status={risk.status} />} />
                <DetailRow
                    label="Tgl Buat"
                    value={<span className="mono">{formatDate(risk.created_at)}</span>}
                />
                <DetailRow
                    label="Last Update"
                    value={<span className="mono">{formatDate(risk.updated_at)}</span>}
                    divider={false}
                />
            </div>

            {related_audits.length > 0 && (
                <div style={{ ...cardBase, padding: 20 }}>
                    <SectionTitle title="Audit Terkait" />
                    {related_audits.slice(0, 5).map((a) => (
                        <Link
                            key={a.id}
                            href={route('audit.show', a.id)}
                            style={{
                                display: 'block',
                                padding: '8px 0',
                                borderBottom: '1px solid var(--ink-100)',
                                textDecoration: 'none',
                            }}
                        >
                            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', fontWeight: 600 }}>
                                {a.kode_audit ?? `AUD-${a.id}`}
                            </div>
                            <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 2, color: 'var(--ink-900)' }}>
                                {a.judul ?? a.title}
                            </div>
                            {a.status && (
                                <div style={{ marginTop: 6 }}>
                                    <Badge status={a.status} />
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            )}

            {related_policies.length > 0 && (
                <div style={{ ...cardBase, padding: 20 }}>
                    <SectionTitle title="Kebijakan Acuan" />
                    {related_policies.slice(0, 5).map((p) => (
                        <Link
                            key={p.id}
                            href={route('policies.show', p.id)}
                            style={{
                                display: 'flex',
                                gap: 8,
                                padding: '8px 0',
                                borderBottom: '1px solid var(--ink-100)',
                                textDecoration: 'none',
                            }}
                        >
                            <FileText size={14} style={{ color: 'var(--green-700)', marginTop: 2, flexShrink: 0 }} />
                            <div style={{ minWidth: 0 }}>
                                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', fontWeight: 600 }}>
                                    {p.nomor_kebijakan ?? `POL-${p.id}`}
                                </div>
                                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-900)' }}>
                                    {p.judul ?? p.nama}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    )

    return (
        <AppLayout title={`Risiko — ${risk.kode_risiko}`}>
            <PageHeader
                title={risk.nama_risiko}
                description={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span className="mono" style={{ fontWeight: 600, color: 'var(--ink-700)' }}>
                            {risk.kode_risiko}
                        </span>
                        <span style={{ color: 'var(--ink-300)' }}>·</span>
                        {risk.kategori && <Tag>{risk.kategori.charAt(0).toUpperCase() + risk.kategori.slice(1)}</Tag>}
                        {risk.unit_pemilik && (
                            <>
                                <span style={{ color: 'var(--ink-300)' }}>·</span>
                                <span style={{ color: 'var(--ink-600)' }}>{risk.unit_pemilik}</span>
                            </>
                        )}
                        {risk.status && (
                            <>
                                <span style={{ color: 'var(--ink-300)' }}>·</span>
                                <Badge status={risk.status} />
                            </>
                        )}
                    </span>
                }
                breadcrumbs={[
                    { label: 'Beranda',          href: route('dashboard') },
                    { label: 'Manajemen Risiko', href: route('risk.index') },
                    { label: risk.kode_risiko },
                ]}
                actions={
                    <>
                        <button type="button" style={btnSecondary}>
                            <Download size={14} /> Ekspor
                        </button>
                        <Link href={route('risk.edit', risk.id)} style={btnSecondary}>
                            <Edit2 size={14} /> Edit
                        </Link>
                        <button type="button" style={btnPrimary}>
                            <Plus size={14} /> Buat Action Plan
                        </button>
                    </>
                }
            />

            <div style={{ padding: '20px 32px' }}>
                {risk.deskripsi && (
                    <div style={{ ...cardBase, padding: 20, marginBottom: 14 }}>
                        <SectionTitle title="Deskripsi Risiko" />
                        <div style={{ fontSize: 13.5, color: 'var(--ink-700)', whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>
                            {risk.deskripsi}
                        </div>
                    </div>
                )}

                <RightRail main={main} rail={rail} />
            </div>
        </AppLayout>
    )
}
