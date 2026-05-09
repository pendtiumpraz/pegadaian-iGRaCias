import { Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { ChevronLeft, Download, Edit } from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import SectionTitle from '@/Components/SectionTitle'
import RightRail from '@/Components/RightRail'
import DetailRow from '@/Components/DetailRow'
import Badge from '@/Components/Badge'
import Tag from '@/Components/Tag'
import Avatar from '@/Components/Avatar'

const BASEL_KATEGORI_LABEL = {
    internal_fraud:      'Internal Fraud',
    external_fraud:      'External Fraud',
    employment:          'Employment Practices',
    clients_products:    'Clients/Products',
    physical_damage:     'Damage Physical Assets',
    business_disruption: 'Business Disruption',
    execution_delivery:  'Execution/Delivery',
    operasional:         'Operasional',
    fraud:               'Fraud',
    hukum:               'Hukum',
    teknologi:           'Teknologi',
    eksternal:           'Eksternal',
}

function formatDate(v) {
    if (!v) return '—'
    return new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatDateMono(v) {
    if (!v) return '—'
    return new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatIDR(v) {
    if (v == null || v === '') return '—'
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(v))
}

const cardStyle = {
    background: '#fff',
    border: '1px solid var(--ink-200)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 24px',
}

const cardPadless = {
    background: '#fff',
    border: '1px solid var(--ink-200)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
}

const cardHeader = {
    padding: '14px 20px',
    borderBottom: '1px solid var(--ink-200)',
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--ink-900)',
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

export default function LossShow({ loss, recoveries = [], actionPlans = [] }) {
    const gross = Number(loss.jumlah_kerugian) || 0
    const recovered = Number(loss.recovered_amount) || 0
    const net = Math.max(0, gross - recovered)

    return (
        <AppLayout title={`Loss — ${loss.nomor_loss}`} contentPadding="none">
            <PageHeader
                title={`${loss.nomor_loss} — ${loss.judul}`}
                description={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {loss.kategori && <Tag>{BASEL_KATEGORI_LABEL[loss.kategori] ?? loss.kategori}</Tag>}
                        <Badge status={loss.status} />
                        {loss.tanggal_kejadian && (
                            <span style={{ color: 'var(--ink-500)' }}>
                                Kejadian <span className="mono">{formatDateMono(loss.tanggal_kejadian)}</span>
                            </span>
                        )}
                    </span>
                }
                breadcrumbs={[
                    { label: 'Beranda',     href: route('dashboard') },
                    { label: 'Loss Events', href: route('loss.index') },
                    { label: loss.nomor_loss },
                ]}
                actions={
                    <>
                        <Link href={route('loss.index')} style={btnSecondary}>
                            <ChevronLeft size={14} /> Kembali
                        </Link>
                        <button type="button" style={btnSecondary}>
                            <Download size={14} /> Form Basel
                        </button>
                        <Link href={route('loss.edit', loss.id)} style={btnPrimary}>
                            <Edit size={14} /> Edit
                        </Link>
                    </>
                }
            />

            <div style={{ padding: '20px 32px' }}>
                <RightRail
                    main={
                        <>
                            {/* Gross / Recovery / Net 3-tile */}
                            <div style={cardStyle}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                                    <div style={{
                                        padding: '16px 18px',
                                        background: 'var(--red-100)',
                                        borderRadius: 10,
                                    }}>
                                        <div style={{
                                            fontSize: 11,
                                            fontWeight: 700,
                                            color: '#8b261b',
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.4,
                                        }}>Gross Loss</div>
                                        <div className="mono" style={{
                                            fontSize: 22,
                                            fontWeight: 600,
                                            marginTop: 6,
                                            color: '#8b261b',
                                            wordBreak: 'break-word',
                                        }}>{formatIDR(gross)}</div>
                                    </div>
                                    <div style={{
                                        padding: '16px 18px',
                                        background: 'var(--green-50)',
                                        borderRadius: 10,
                                        border: '1px solid var(--green-100)',
                                    }}>
                                        <div style={{
                                            fontSize: 11,
                                            fontWeight: 700,
                                            color: 'var(--green-800)',
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.4,
                                        }}>Recovery</div>
                                        <div className="mono" style={{
                                            fontSize: 22,
                                            fontWeight: 600,
                                            marginTop: 6,
                                            color: 'var(--green-800)',
                                            wordBreak: 'break-word',
                                        }}>{formatIDR(recovered)}</div>
                                    </div>
                                    <div style={{
                                        padding: '16px 18px',
                                        background: 'var(--ink-50)',
                                        borderRadius: 10,
                                    }}>
                                        <div style={{
                                            fontSize: 11,
                                            fontWeight: 700,
                                            color: 'var(--ink-700)',
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.4,
                                        }}>Net Loss</div>
                                        <div className="mono" style={{
                                            fontSize: 22,
                                            fontWeight: 600,
                                            marginTop: 6,
                                            color: 'var(--ink-900)',
                                            wordBreak: 'break-word',
                                        }}>{formatIDR(net)}</div>
                                        <div style={{ fontSize: 11, color: 'var(--ink-600)', marginTop: 2 }}>setelah recovery</div>
                                    </div>
                                </div>
                            </div>

                            {/* Kronologi */}
                            <div style={cardStyle}>
                                <SectionTitle title="Kronologi" />
                                <div style={{
                                    fontSize: 13.5,
                                    color: 'var(--ink-700)',
                                    lineHeight: 1.7,
                                    whiteSpace: 'pre-wrap',
                                }}>
                                    {loss.kronologi || loss.deskripsi || (
                                        <span style={{ color: 'var(--ink-500)', fontStyle: 'italic' }}>
                                            Belum ada kronologi tercatat untuk loss event ini.
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Root Cause Analysis */}
                            {loss.root_cause && (
                                <div style={cardStyle}>
                                    <SectionTitle title="Root Cause Analysis" />
                                    <div style={{
                                        padding: '14px 18px',
                                        background: 'var(--ink-50)',
                                        borderLeft: '4px solid var(--green-700)',
                                        borderRadius: '0 8px 8px 0',
                                        fontSize: 13.5,
                                        lineHeight: 1.65,
                                        color: 'var(--ink-800)',
                                        whiteSpace: 'pre-wrap',
                                    }}>
                                        {loss.root_cause}
                                    </div>
                                </div>
                            )}

                            {/* Recovery Tracker */}
                            <div style={cardPadless}>
                                <div style={cardHeader}>Recovery Tracker</div>
                                {recoveries.length === 0 ? (
                                    <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--ink-500)', fontSize: 13 }}>
                                        Belum ada catatan recovery.
                                    </div>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                        <thead>
                                            <tr style={{ background: 'var(--ink-50)' }}>
                                                {['Tanggal', 'Sumber Recovery', 'Jumlah', 'Status'].map((h, i) => (
                                                    <th key={h} style={{
                                                        textAlign: i === 2 ? 'right' : 'left',
                                                        padding: '10px 16px',
                                                        fontSize: 11.5,
                                                        fontWeight: 700,
                                                        color: 'var(--ink-600)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: 0.4,
                                                        borderBottom: '1px solid var(--ink-200)',
                                                    }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recoveries.map((r, i) => (
                                                <tr key={r.id ?? i} style={{ borderBottom: '1px solid var(--ink-100)' }}>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <span className="mono" style={{ fontSize: 12 }}>{formatDateMono(r.tanggal ?? r.date)}</span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>{r.sumber ?? r.source ?? '—'}</td>
                                                    <td className="mono" style={{
                                                        padding: '12px 16px',
                                                        textAlign: 'right',
                                                        fontWeight: 600,
                                                        color: 'var(--green-700)',
                                                    }}>
                                                        {formatIDR(r.amount ?? r.jumlah)}
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <Tag tone={r.status === 'Diterima' ? 'green' : r.status === 'Estimasi' ? 'neutral' : 'gold'}>
                                                            {r.status ?? 'Proses'}
                                                        </Tag>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </>
                    }
                    rail={
                        <>
                            {/* Detail Kejadian */}
                            <div style={cardStyle}>
                                <SectionTitle title="Detail Kejadian" />
                                <DetailRow
                                    label="Kategori"
                                    value={loss.kategori ? <Tag>{BASEL_KATEGORI_LABEL[loss.kategori] ?? loss.kategori}</Tag> : '—'}
                                />
                                <DetailRow
                                    label="Tanggal Kejadian"
                                    value={<span className="mono">{formatDateMono(loss.tanggal_kejadian)}</span>}
                                />
                                <DetailRow
                                    label="Status"
                                    value={<Badge status={loss.status} />}
                                />
                                <DetailRow
                                    label="Mata Uang"
                                    value={<span className="mono">{loss.mata_uang ?? 'IDR'}</span>}
                                />
                                <DetailRow
                                    label="PIC"
                                    value={loss.pic?.name
                                        ? <>
                                            <Avatar name={loss.pic.name} size={20} />
                                            <span>{loss.pic.name}</span>
                                        </>
                                        : '—'
                                    }
                                />
                                <DetailRow
                                    label="Dampak Operasional"
                                    value={loss.dampak_operasional ?? '—'}
                                    divider={false}
                                />
                            </div>

                            {/* Action Plan */}
                            <div style={cardStyle}>
                                <SectionTitle title="Action Plan" hint={`${actionPlans.length} rencana`} />
                                {actionPlans.length === 0 ? (
                                    <div style={{ fontSize: 12.5, color: 'var(--ink-500)', padding: '8px 0' }}>
                                        Belum ada action plan ter-link.
                                    </div>
                                ) : (
                                    actionPlans.map((a, i) => {
                                        const inner = (
                                            <>
                                                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-900)' }}>
                                                    {a.judul ?? a.title ?? a.text}
                                                </div>
                                                {a.status && (
                                                    <div style={{ marginTop: 6 }}>
                                                        <Badge status={a.status} />
                                                    </div>
                                                )}
                                            </>
                                        )
                                        const wrapStyle = {
                                            display: 'block',
                                            padding: '10px 0',
                                            borderBottom: i < actionPlans.length - 1 ? '1px solid var(--ink-100)' : 'none',
                                            textDecoration: 'none',
                                        }
                                        // Action-plans group has no `show` route — only render link if controller supplies a `url`.
                                        return a.url ? (
                                            <Link key={a.id ?? i} href={a.url} style={wrapStyle}>{inner}</Link>
                                        ) : (
                                            <div key={a.id ?? i} style={wrapStyle}>{inner}</div>
                                        )
                                    })
                                )}
                            </div>
                        </>
                    }
                />
            </div>
        </AppLayout>
    )
}
