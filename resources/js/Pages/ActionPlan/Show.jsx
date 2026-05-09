import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { ArrowRight, Calendar, Save } from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import PageHeader from '@/Components/PageHeader'
import Badge from '@/Components/Badge'
import Tag from '@/Components/Tag'
import SectionTitle from '@/Components/SectionTitle'
import HBar from '@/Components/HBar'
import Avatar from '@/Components/Avatar'
import RightRail from '@/Components/RightRail'
import DetailRow from '@/Components/DetailRow'

const cardBase = {
    background: '#fff',
    borderRadius: 'var(--radius-lg, 12px)',
    border: '1px solid var(--ink-200)',
}

const btnPrimary = {
    background: 'var(--green-700)',
    color: '#fff',
    padding: '8px 18px',
    height: 36,
    borderRadius: 8,
    border: '1px solid var(--green-700)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13.5,
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

function formatDateTime(d) {
    if (!d) return '—'
    return new Date(d).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function progressColor(pct) {
    const n = Number(pct) || 0
    if (n >= 100) return '#187c5b'
    if (n >= 50)  return '#c98114'
    return '#b8392a'
}

export default function RencanaAksiShow({ plan, sumber, timeline = [] }) {
    const [progress, setProgress] = useState(Number(plan.progress_pct) || 0)
    const [catatan, setCatatan]   = useState(plan.catatan ?? '')
    const [saving, setSaving]     = useState(false)

    function handleUpdate(e) {
        e.preventDefault()
        setSaving(true)
        router.put(
            route('action-plans.update', plan.id),
            { progress_pct: progress, catatan },
            { onFinish: () => setSaving(false), preserveScroll: true },
        )
    }

    const isOverdue = plan.deadline && new Date(plan.deadline) < new Date() && plan.status !== 'completed'

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
                        marginBottom: 14,
                    }}
                >
                    <div style={{ minWidth: 0 }}>
                        <div
                            style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: 'var(--ink-600)',
                                textTransform: 'uppercase',
                                letterSpacing: 0.4,
                                marginBottom: 6,
                            }}
                        >
                            Progress saat ini
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <span
                                className="mono"
                                style={{
                                    fontSize: 36,
                                    fontWeight: 600,
                                    color: progressColor(plan.progress_pct),
                                    lineHeight: 1,
                                }}
                            >
                                {Number(plan.progress_pct) || 0}%
                            </span>
                            <Badge status={plan.status} />
                        </div>
                    </div>

                    {plan.deadline && (
                        <div style={{ textAlign: 'right' }}>
                            <div
                                style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: 'var(--ink-600)',
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.4,
                                    marginBottom: 4,
                                }}
                            >
                                Deadline
                            </div>
                            <div
                                className="mono"
                                style={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: isOverdue ? '#b8392a' : 'var(--ink-900)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                }}
                            >
                                <Calendar size={14} /> {formatDate(plan.deadline)}
                            </div>
                            {isOverdue && (
                                <div style={{ marginTop: 6 }}>
                                    <Badge label="Overdue" tone="danger" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <HBar
                    value={Number(plan.progress_pct) || 0}
                    max={100}
                    color={progressColor(plan.progress_pct)}
                    height={10}
                />
            </div>

            {/* Description */}
            {plan.deskripsi && (
                <div style={{ ...cardBase, padding: 20 }}>
                    <SectionTitle title="Deskripsi" />
                    <div style={{ fontSize: 13.5, color: 'var(--ink-700)', whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>
                        {plan.deskripsi}
                    </div>
                </div>
            )}

            {/* Update Progress Form */}
            <div style={{ ...cardBase, padding: 20 }}>
                <SectionTitle title="Perbarui Progress" hint="Geser slider lalu tambahkan catatan singkat" />
                <form onSubmit={handleUpdate}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                                <label
                                    style={{
                                        fontSize: 12.5,
                                        fontWeight: 600,
                                        color: 'var(--ink-800)',
                                    }}
                                >
                                    Progress
                                </label>
                                <span className="mono" style={{ fontSize: 16, fontWeight: 700, color: progressColor(progress) }}>
                                    {progress}%
                                </span>
                            </div>
                            <HBar value={progress} max={100} color={progressColor(progress)} height={8} />
                            <input
                                type="range"
                                min={0}
                                max={100}
                                step={5}
                                value={progress}
                                onChange={(e) => setProgress(Number(e.target.value))}
                                style={{
                                    width: '100%',
                                    marginTop: 10,
                                    accentColor: 'var(--green-700)',
                                    cursor: 'pointer',
                                }}
                            />
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: 10.5,
                                    color: 'var(--ink-500)',
                                    fontFamily: 'var(--font-mono)',
                                    marginTop: 4,
                                }}
                            >
                                <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                            </div>
                        </div>

                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: 12.5,
                                    fontWeight: 600,
                                    color: 'var(--ink-800)',
                                    marginBottom: 6,
                                }}
                            >
                                Catatan Update
                            </label>
                            <textarea
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                                placeholder="Tuliskan kemajuan, kendala, atau tindakan berikutnya…"
                                style={{
                                    width: '100%',
                                    minHeight: 100,
                                    padding: '10px 12px',
                                    border: '1px solid var(--ink-300)',
                                    borderRadius: 8,
                                    fontSize: 13,
                                    background: '#fff',
                                    outline: 'none',
                                    resize: 'vertical',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                type="submit"
                                disabled={saving}
                                style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}
                            >
                                <Save size={14} /> {saving ? 'Menyimpan…' : 'Simpan Update'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Timeline */}
            {Array.isArray(timeline) && timeline.length > 0 && (
                <div style={{ ...cardBase, padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ink-200)' }}>
                        <SectionTitle
                            title="Riwayat Perubahan"
                            hint={`${timeline.length} entri progress`}
                            style={{ marginBottom: 0 }}
                        />
                    </div>
                    {timeline.map((t, i) => (
                        <div
                            key={t.id ?? i}
                            style={{
                                padding: '14px 20px',
                                borderBottom: i < timeline.length - 1 ? '1px solid var(--ink-100)' : 'none',
                                display: 'flex',
                                gap: 12,
                                alignItems: 'flex-start',
                            }}
                        >
                            {t.user?.name && <Avatar name={t.user.name} size={28} />}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        gap: 8,
                                        flexWrap: 'wrap',
                                        marginBottom: 4,
                                    }}
                                >
                                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-900)' }}>
                                        {t.user?.name ?? 'Sistem'}
                                    </span>
                                    <span className="mono" style={{ fontSize: 11.5, fontWeight: 700, color: progressColor(t.progress_pct) }}>
                                        {Number(t.progress_pct) || 0}%
                                    </span>
                                    <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>
                                        · {formatDateTime(t.created_at ?? t.tanggal)}
                                    </span>
                                </div>
                                {t.catatan && (
                                    <div style={{ fontSize: 12.5, color: 'var(--ink-700)', whiteSpace: 'pre-wrap' }}>
                                        {t.catatan}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    )

    /* ─────────── rail ─────────── */
    const rail = (
        <>
            <div style={{ ...cardBase, padding: 20 }}>
                <SectionTitle title="Detail Rencana Aksi" />
                <DetailRow label="Judul" value={plan.judul ?? '—'} />
                <DetailRow label="Status" value={<Badge status={plan.status} />} />
                <DetailRow
                    label="Sumber"
                    value={plan.sumber_type === 'risk'
                        ? <Tag tone="blue">Risiko</Tag>
                        : plan.sumber_type === 'finding'
                            ? <Tag tone="amber">Finding</Tag>
                            : '—'}
                />
                <DetailRow
                    label="PIC"
                    value={plan.pic?.name
                        ? (
                            <>
                                <Avatar name={plan.pic.name} size={18} />
                                <span>{plan.pic.name}</span>
                            </>
                        )
                        : '—'}
                />
                <DetailRow
                    label="Deadline"
                    value={
                        <span
                            className="mono"
                            style={{
                                color: isOverdue ? '#b8392a' : 'var(--ink-900)',
                                fontWeight: 700,
                            }}
                        >
                            {formatDate(plan.deadline)}
                        </span>
                    }
                />
                <DetailRow
                    label="Last Update"
                    value={<span className="mono">{formatDateTime(plan.updated_at)}</span>}
                    divider={false}
                />
            </div>

            {sumber && (
                <div style={{ ...cardBase, padding: 20 }}>
                    <SectionTitle
                        title={plan.sumber_type === 'risk' ? 'Risiko Terkait' : 'Finding Terkait'}
                    />
                    {plan.sumber_type === 'risk' ? (
                        <Link
                            href={route('risk.show', sumber.id)}
                            style={{ display: 'block', padding: '6px 0', textDecoration: 'none' }}
                        >
                            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', fontWeight: 600 }}>
                                {sumber.kode_risiko ?? `RSK-${sumber.id}`}
                            </div>
                            <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 2, color: 'var(--ink-900)' }}>
                                {sumber.nama_risiko ?? sumber.judul}
                            </div>
                            {sumber.kategori && (
                                <div style={{ marginTop: 6 }}>
                                    <Tag>{sumber.kategori.charAt(0).toUpperCase() + sumber.kategori.slice(1)}</Tag>
                                </div>
                            )}
                            <div style={{ fontSize: 11.5, color: 'var(--green-700)', fontWeight: 600, marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                Buka risiko <ArrowRight size={12} />
                            </div>
                        </Link>
                    ) : (
                        <div style={{ padding: '6px 0' }}>
                            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-500)', fontWeight: 600 }}>
                                {sumber.kode ?? `FND-${sumber.id}`}
                            </div>
                            <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 2, color: 'var(--ink-900)' }}>
                                {sumber.judul ?? sumber.nama ?? `Finding #${sumber.id}`}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    )

    return (
        <AppLayout title={`Rencana Aksi — ${plan.judul}`}>
            <PageHeader
                title={plan.judul}
                description={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {plan.sumber_type === 'risk'
                            ? <Tag tone="blue">Risiko</Tag>
                            : plan.sumber_type === 'finding'
                                ? <Tag tone="amber">Finding</Tag>
                                : null}
                        {plan.pic?.name && (
                            <>
                                <span style={{ color: 'var(--ink-300)' }}>·</span>
                                <span style={{ color: 'var(--ink-600)' }}>PIC: {plan.pic.name}</span>
                            </>
                        )}
                    </span>
                }
                breadcrumbs={[
                    { label: 'Beranda',      href: route('dashboard') },
                    { label: 'Rencana Aksi', href: route('action-plans.index') },
                    { label: plan.judul },
                ]}
                actions={
                    <Link href={route('action-plans.index')} style={btnSecondary}>← Kembali</Link>
                }
            />

            <div style={{ padding: '20px 32px' }}>
                <RightRail main={main} rail={rail} />
            </div>
        </AppLayout>
    )
}
