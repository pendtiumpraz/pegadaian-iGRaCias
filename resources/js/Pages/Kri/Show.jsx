import { Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { Edit2, ArrowRight } from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import Badge from '@/Components/Badge'
import Tag from '@/Components/Tag'
import SectionTitle from '@/Components/SectionTitle'
import Sparkline from '@/Components/Sparkline'
import RightRail from '@/Components/RightRail'
import DetailRow from '@/Components/DetailRow'

const STATUS_LABEL = {
    green: 'Aman',
    amber: 'Pemantauan',
    red:   'Terlampaui',
}

const STATUS_TONE = {
    green: 'success',
    amber: 'warning',
    red:   'danger',
}

const STATUS_COLOR = {
    green: '#187c5b',
    amber: '#c98114',
    red:   '#b8392a',
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

function formatDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatPeriodCell(periode, idx, total) {
    return `T-${total - idx - 1}`
}

export default function KriShow({ kri, risk, history = [] }) {
    const status = (kri.status_kri || '').toLowerCase()
    const sparkColor = STATUS_COLOR[status] || '#187c5b'

    /* Build trend data — prefer kri.trend, then history */
    let trend = []
    if (Array.isArray(kri.trend) && kri.trend.length > 1) {
        trend = kri.trend.map(Number).filter((n) => !Number.isNaN(n))
    } else if (Array.isArray(history) && history.length > 1) {
        trend = history.map((h) => Number(h.nilai)).filter((n) => !Number.isNaN(n))
    }

    const recentValues = (Array.isArray(history) ? history : []).slice(0, 6)

    /* ─────────── main ─────────── */
    const main = (
        <>
            {/* Header card */}
            <div style={{ ...cardBase, padding: 20 }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 16,
                        flexWrap: 'wrap',
                    }}
                >
                    <div style={{ minWidth: 0 }}>
                        <div
                            style={{
                                fontSize: 11.5,
                                fontWeight: 700,
                                color: 'var(--ink-600)',
                                textTransform: 'uppercase',
                                letterSpacing: 0.4,
                            }}
                        >
                            Nilai Aktual
                        </div>
                        <div
                            className="mono"
                            style={{
                                fontSize: 36,
                                fontWeight: 600,
                                color: sparkColor,
                                marginTop: 6,
                                lineHeight: 1.05,
                            }}
                        >
                            {kri.nilai_aktual ?? '—'}{' '}
                            <span style={{ fontSize: 18, color: 'var(--ink-500)', fontWeight: 500 }}>
                                {kri.satuan ?? ''}
                            </span>
                        </div>
                        <div style={{ marginTop: 8 }}>
                            {status && (
                                <Badge
                                    label={STATUS_LABEL[status] ?? status}
                                    tone={STATUS_TONE[status]}
                                />
                            )}
                            {kri.periode && (
                                <span style={{ marginLeft: 10, fontSize: 12.5, color: 'var(--ink-600)', textTransform: 'capitalize' }}>
                                    Periode: {kri.periode}
                                </span>
                            )}
                        </div>
                    </div>

                    {trend.length > 1 && (
                        <div style={{ flexShrink: 0 }}>
                            <div
                                style={{
                                    fontSize: 11.5,
                                    fontWeight: 700,
                                    color: 'var(--ink-600)',
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.4,
                                    marginBottom: 6,
                                    textAlign: 'right',
                                }}
                            >
                                Tren {trend.length} periode
                            </div>
                            <Sparkline data={trend} width={220} height={80} color={sparkColor} strokeWidth={2.2} />
                        </div>
                    )}
                </div>
            </div>

            {/* Linked Risk */}
            {risk && (
                <div style={{ ...cardBase, padding: 20 }}>
                    <SectionTitle title="Risiko Terkait" hint="KRI memantau risiko di bawah ini" />
                    <Link
                        href={route('risk.show', risk.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 12,
                            padding: '12px 14px',
                            borderRadius: 8,
                            border: '1px solid var(--ink-200)',
                            background: 'var(--ink-50)',
                            textDecoration: 'none',
                        }}
                    >
                        <div style={{ minWidth: 0 }}>
                            <div className="mono" style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-700)' }}>
                                {risk.kode_risiko}
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-900)', marginTop: 2 }}>
                                {risk.nama_risiko}
                            </div>
                            <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 2 }}>
                                {risk.kategori && (
                                    <Tag style={{ marginRight: 6 }}>
                                        {risk.kategori.charAt(0).toUpperCase() + risk.kategori.slice(1)}
                                    </Tag>
                                )}
                                {risk.unit_pemilik}
                            </div>
                        </div>
                        <ArrowRight size={16} style={{ color: 'var(--green-700)' }} />
                    </Link>
                </div>
            )}

            {/* Threshold table */}
            <div style={{ ...cardBase, padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ink-200)' }}>
                    <SectionTitle
                        title="Threshold KRI"
                        hint="Batas nilai aktual untuk masing-masing zona status"
                        style={{ marginBottom: 0 }}
                    />
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr style={{ background: 'var(--ink-50)' }}>
                            <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11.5, fontWeight: 700, color: 'var(--ink-600)', textTransform: 'uppercase', letterSpacing: 0.4, borderBottom: '1px solid var(--ink-200)' }}>Zona</th>
                            <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11.5, fontWeight: 700, color: 'var(--ink-600)', textTransform: 'uppercase', letterSpacing: 0.4, borderBottom: '1px solid var(--ink-200)' }}>Operator</th>
                            <th style={{ textAlign: 'right', padding: '10px 16px', fontSize: 11.5, fontWeight: 700, color: 'var(--ink-600)', textTransform: 'uppercase', letterSpacing: 0.4, borderBottom: '1px solid var(--ink-200)' }}>Nilai</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { key: 'green', label: 'Aman',         op: '≤', value: kri.threshold_green },
                            { key: 'amber', label: 'Pemantauan',   op: '≤', value: kri.threshold_amber },
                            { key: 'red',   label: 'Terlampaui',   op: '>', value: kri.threshold_red ?? kri.threshold_amber },
                        ].map((row, i) => (
                            <tr key={row.key} style={{ borderBottom: i < 2 ? '1px solid var(--ink-100)' : 'none' }}>
                                <td style={{ padding: '12px 16px' }}>
                                    <Badge
                                        label={row.label}
                                        tone={STATUS_TONE[row.key]}
                                    />
                                </td>
                                <td className="mono" style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: STATUS_COLOR[row.key] }}>
                                    {row.op}
                                </td>
                                <td className="mono" style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13.5, fontWeight: 700, color: 'var(--ink-900)' }}>
                                    {row.value ?? '—'} <span style={{ color: 'var(--ink-500)', fontWeight: 500 }}>{kri.satuan}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Recent Values */}
            {recentValues.length > 0 && (
                <div style={{ ...cardBase, padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ink-200)' }}>
                        <SectionTitle
                            title="Pembaruan Terbaru"
                            hint={`${recentValues.length} pengukuran terakhir`}
                            style={{ marginBottom: 0 }}
                        />
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: 'var(--ink-50)' }}>
                                <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11.5, fontWeight: 700, color: 'var(--ink-600)', textTransform: 'uppercase', letterSpacing: 0.4, borderBottom: '1px solid var(--ink-200)' }}>Periode</th>
                                <th style={{ textAlign: 'right', padding: '10px 16px', fontSize: 11.5, fontWeight: 700, color: 'var(--ink-600)', textTransform: 'uppercase', letterSpacing: 0.4, borderBottom: '1px solid var(--ink-200)' }}>Nilai</th>
                                <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11.5, fontWeight: 700, color: 'var(--ink-600)', textTransform: 'uppercase', letterSpacing: 0.4, borderBottom: '1px solid var(--ink-200)' }}>Status</th>
                                <th style={{ textAlign: 'right', padding: '10px 16px', fontSize: 11.5, fontWeight: 700, color: 'var(--ink-600)', textTransform: 'uppercase', letterSpacing: 0.4, borderBottom: '1px solid var(--ink-200)' }}>Tgl</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentValues.map((h, idx) => {
                                const s = (h.status_kri || '').toLowerCase()
                                return (
                                    <tr key={h.id ?? idx} style={{ borderBottom: idx < recentValues.length - 1 ? '1px solid var(--ink-100)' : 'none' }}>
                                        <td className="mono" style={{ padding: '12px 16px', fontSize: 12 }}>
                                            {h.periode ?? formatPeriodCell(h.periode, idx, recentValues.length)}
                                        </td>
                                        <td className="mono" style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: STATUS_COLOR[s] || 'var(--ink-900)' }}>
                                            {h.nilai ?? '—'}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            {s ? <Badge label={STATUS_LABEL[s] ?? s} tone={STATUS_TONE[s]} /> : '—'}
                                        </td>
                                        <td className="mono" style={{ padding: '12px 16px', textAlign: 'right', fontSize: 11.5, color: 'var(--ink-600)' }}>
                                            {formatDate(h.tanggal ?? h.created_at)}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )

    /* ─────────── rail ─────────── */
    const rail = (
        <>
            <div style={{ ...cardBase, padding: 20 }}>
                <SectionTitle title="Detail KRI" />
                <DetailRow label="Nama" value={kri.nama_kri ?? '—'} />
                <DetailRow label="Satuan" value={<span className="mono">{kri.satuan ?? '—'}</span>} />
                <DetailRow
                    label="Periode"
                    value={kri.periode ? <span style={{ textTransform: 'capitalize' }}>{kri.periode}</span> : '—'}
                />
                <DetailRow
                    label="Nilai Aktual"
                    value={<span className="mono">{kri.nilai_aktual ?? '—'}</span>}
                />
                <DetailRow
                    label="Threshold Green"
                    value={<span className="mono" style={{ color: '#0f4a37' }}>≤ {kri.threshold_green ?? '—'}</span>}
                />
                <DetailRow
                    label="Threshold Amber"
                    value={<span className="mono" style={{ color: '#7a4f0a' }}>≤ {kri.threshold_amber ?? '—'}</span>}
                />
                <DetailRow
                    label="Threshold Red"
                    value={<span className="mono" style={{ color: '#8b261b' }}>&gt; {kri.threshold_red ?? kri.threshold_amber ?? '—'}</span>}
                />
                <DetailRow label="PIC" value={kri.pic?.name ?? '—'} />
                <DetailRow
                    label="Last Update"
                    value={<span className="mono">{formatDate(kri.last_update ?? kri.updated_at)}</span>}
                    divider={false}
                />
            </div>

            {risk && (
                <div style={{ ...cardBase, padding: 20 }}>
                    <SectionTitle title="Risiko Terkait" />
                    <Link
                        href={route('risk.show', risk.id)}
                        style={{
                            display: 'block',
                            padding: '8px 0',
                            textDecoration: 'none',
                        }}
                    >
                        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', fontWeight: 600 }}>
                            {risk.kode_risiko}
                        </div>
                        <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 2, color: 'var(--ink-900)' }}>
                            {risk.nama_risiko}
                        </div>
                        {risk.status && (
                            <div style={{ marginTop: 6 }}>
                                <Badge status={risk.status} />
                            </div>
                        )}
                    </Link>
                </div>
            )}
        </>
    )

    return (
        <AppLayout title={`KRI — ${kri.nama_kri}`}>
            <PageHeader
                title={kri.nama_kri}
                description={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {kri.satuan && <Tag tone="mono">{kri.satuan}</Tag>}
                        {kri.periode && (
                            <>
                                <span style={{ color: 'var(--ink-300)' }}>·</span>
                                <span style={{ textTransform: 'capitalize', color: 'var(--ink-600)' }}>{kri.periode}</span>
                            </>
                        )}
                        {risk?.kode_risiko && (
                            <>
                                <span style={{ color: 'var(--ink-300)' }}>·</span>
                                <span className="mono" style={{ fontWeight: 600, color: 'var(--ink-700)' }}>
                                    {risk.kode_risiko}
                                </span>
                            </>
                        )}
                    </span>
                }
                breadcrumbs={[
                    { label: 'Beranda',             href: route('dashboard') },
                    { label: 'Key Risk Indicator',  href: route('kri.index') },
                    { label: kri.nama_kri },
                ]}
                actions={
                    <>
                        <Link href={route('kri.index')} style={btnSecondary}>← Kembali</Link>
                        <Link href={route('kri.edit', kri.id)} style={btnPrimary}>
                            <Edit2 size={14} /> Edit
                        </Link>
                    </>
                }
            />

            <div style={{ padding: '20px 32px' }}>
                {kri.deskripsi && (
                    <div style={{ ...cardBase, padding: 20, marginBottom: 14 }}>
                        <SectionTitle title="Deskripsi" />
                        <div style={{ fontSize: 13.5, color: 'var(--ink-700)', whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>
                            {kri.deskripsi}
                        </div>
                    </div>
                )}

                <RightRail main={main} rail={rail} />
            </div>
        </AppLayout>
    )
}
