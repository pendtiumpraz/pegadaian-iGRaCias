import { useState, useEffect, useMemo } from 'react'
import { usePage, Link, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import {
    LayoutDashboard,
    AlertTriangle,
    TrendingUp,
    Shield,
    ShieldCheck,
    ClipboardCheck,
    SearchX,
    Zap,
    Banknote,
    BookOpen,
    ListChecks,
    Scale,
    Settings,
    LogOut,
    Search,
    Bell,
    Building2,
    ChevronDown,
    ChevronRight,
    X,
    CheckCircle,
    AlertCircle,
    Info,
    MessageSquare,
    FileScan,
} from 'lucide-react'
import Tag from '@/Components/Tag'

// ─────────────────────────────────────────────────────────────
// Brand mark — geometric "iG" monogram in emerald gradient.
// Mirrors the BrandMark in src/shell.jsx.
// ─────────────────────────────────────────────────────────────
function BrandMark({ size = 36 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
            <path
                d="M20 2 L34 7 V20 C34 28.5 28 34.5 20 38 C12 34.5 6 28.5 6 20 V7 Z"
                fill="url(#igracias-brand-grad)"
            />
            <defs>
                <linearGradient id="igracias-brand-grad" x1="0" y1="0" x2="40" y2="40">
                    <stop offset="0" stopColor="#1f9c72" />
                    <stop offset="1" stopColor="#0a3023" />
                </linearGradient>
            </defs>
            <circle cx="14" cy="15" r="2" fill="#fff" />
            <path d="M14 19 V28" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
            <path
                d="M28 17 A5 5 0 1 0 28 24 V21 H25"
                stroke="#fff"
                strokeWidth="2.4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

// ─────────────────────────────────────────────────────────────
// Sidebar navigation — grouped into "Modul Utama" + "Tools".
// Matches the structure in src/shell.jsx.
// ─────────────────────────────────────────────────────────────
const PRIMARY_NAV = [
    { label: 'Beranda',                href: '/',           icon: LayoutDashboard, routeName: 'dashboard',     countKey: null },
    { label: 'Manajemen Risiko',       href: '/risiko',      icon: AlertTriangle,   routeName: 'risk.*',        countKey: 'risks' },
    { label: 'Key Risk Indicator',     href: '/kri',         icon: TrendingUp,      routeName: 'kri.*',         countKey: null },
    { label: 'Kontrol & Mitigasi',     href: '/kontrol',     icon: Shield,          routeName: 'controls.*',    countKey: null },
    { label: 'Manajemen Audit',        href: '/audit',       icon: ClipboardCheck,  routeName: 'audit.*',       countKey: 'audits' },
    { label: 'Temuan Audit',           href: '/temuan',      icon: SearchX,         routeName: 'findings.*',    countKey: null },
    { label: 'Manajemen Insiden',      href: '/insiden',     icon: Zap,             routeName: 'incidents.*',   countKey: 'incidents' },
    { label: 'Loss Event',             href: '/loss',        icon: Banknote,        routeName: 'loss.*',        countKey: null },
    { label: 'Rencana Aksi',           href: '/rencana-aksi',icon: ListChecks,      routeName: 'action-plans.*', countKey: null },
    { label: 'Kebijakan & Prosedur',   href: '/kebijakan',   icon: BookOpen,        routeName: 'policies.*',    countKey: 'policies' },
    { label: 'Regulasi',               href: '/regulasi',    icon: Scale,           routeName: 'regulations.*', countKey: 'regulations' },
    { label: 'Kepatuhan',              href: '/kepatuhan',   icon: ShieldCheck,     routeName: 'compliance.*',  countKey: null },
]

const TOOLS_NAV = [
    { label: 'AI Assistant', href: '/ai-assistant', icon: MessageSquare, routeName: 'ai-assistant.*', badge: 'NEW' },
    { label: 'AI Ingestion', href: '/ingest',       icon: FileScan,      routeName: 'ingest.*',       badge: 'BETA' },
    { label: 'Pengaturan',   href: '/pengaturan',   icon: Settings,      routeName: 'settings.*' },
]

function isRouteActive(routeName, href) {
    try {
        return route().current(routeName)
    } catch {
        if (typeof window === 'undefined') return false
        if (href === '/') return window.location.pathname === '/'
        return window.location.pathname.startsWith(href)
    }
}

function SidebarLink({ item }) {
    const Icon = item.icon
    const active = isRouteActive(item.routeName, item.href)
    const count = item.count
    const badge = item.badge

    return (
        <Link
            href={item.href}
            style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                marginBottom: 1,
                color: active ? '#fff' : '#a8c9b6',
                background: active ? 'rgba(31,156,114,0.18)' : 'transparent',
                fontSize: 13.5,
                fontWeight: active ? 600 : 500,
                transition: 'all 120ms',
            }}
            onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
            }}
            onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = 'transparent'
            }}
        >
            {active && (
                <span
                    style={{
                        position: 'absolute',
                        left: -12,
                        top: 8,
                        bottom: 8,
                        width: 3,
                        background: 'var(--green-400)',
                        borderRadius: '0 3px 3px 0',
                    }}
                />
            )}
            <Icon size={17} strokeWidth={active ? 2 : 1.7} />
            <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
            {badge && (
                <Tag tone="gold" size="xs">
                    {badge}
                </Tag>
            )}
            {count != null && count !== '' && (
                <span
                    className="nav-count mono"
                    style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 99,
                        background: active
                            ? 'rgba(255,255,255,0.16)'
                            : 'rgba(255,255,255,0.06)',
                        color: active ? '#fff' : '#7fb59a',
                        minWidth: 18,
                        textAlign: 'center',
                        lineHeight: 1.4,
                    }}
                >
                    {count}
                </span>
            )}
        </Link>
    )
}

function Sidebar({ user, navCounts = {} }) {
    const counts = navCounts || {}
    const primary = PRIMARY_NAV.map((item) =>
        item.countKey && counts[item.countKey] != null
            ? { ...item, count: counts[item.countKey] }
            : item,
    )

    return (
        <aside
            style={{
                width: 'var(--sidebar-w)',
                background: 'var(--green-900)',
                color: '#cfe5d6',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                borderRight: '1px solid #07221a',
                position: 'sticky',
                top: 0,
                height: '100vh',
            }}
        >
            {/* Brand */}
            <div style={{ padding: '18px 20px 16px', display: 'flex', alignItems: 'center', gap: 11 }}>
                <BrandMark size={36} />
                <div style={{ minWidth: 0 }}>
                    <div
                        className="display"
                        style={{
                            color: '#fff',
                            fontSize: 18,
                            fontWeight: 600,
                            letterSpacing: -0.2,
                            lineHeight: 1.1,
                        }}
                    >
                        i-GRaCias
                    </div>
                    <div
                        style={{
                            fontSize: 10.5,
                            color: '#7fb59a',
                            fontWeight: 500,
                            letterSpacing: 0.3,
                            textTransform: 'uppercase',
                            marginTop: 2,
                        }}
                    >
                        Integrated GRC
                    </div>
                </div>
            </div>

            {/* Nav */}
            <div style={{ padding: '4px 12px', flex: 1, overflow: 'auto' }}>
                <div
                    style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#5a8a72',
                        letterSpacing: 0.6,
                        textTransform: 'uppercase',
                        padding: '12px 12px 6px',
                    }}
                >
                    Modul Utama
                </div>
                {primary.map((item) => (
                    <SidebarLink key={item.routeName} item={item} />
                ))}

                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '14px 12px' }} />

                <div
                    style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#5a8a72',
                        letterSpacing: 0.6,
                        textTransform: 'uppercase',
                        padding: '4px 12px 6px',
                    }}
                >
                    Tools
                </div>
                {TOOLS_NAV.map((item) => (
                    <SidebarLink key={item.routeName} item={item} />
                ))}
            </div>

            {/* Footer / version */}
            <div
                style={{
                    padding: '12px 20px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    fontSize: 11,
                    color: '#5a8a72',
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <span>v2026.05.07</span>
                <span className="mono">{user?.email?.split('@')[0] ?? 'guest'}</span>
            </div>
        </aside>
    )
}

// ─────────────────────────────────────────────────────────────
// Avatar — initials disc, palette by name length (matches ref).
// ─────────────────────────────────────────────────────────────
function Avatar({ name, size = 32 }) {
    const initials = (name || '?')
        .split(' ')
        .map((s) => s[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    const palette = ['#187c5b', '#0f4a37', '#2e5a8a', '#b8862c', '#7a4f0a', '#1c3d5e']
    const color = palette[(name || '').length % palette.length]
    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: size,
                background: color,
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: size * 0.4,
                fontWeight: 700,
                flexShrink: 0,
            }}
        >
            {initials}
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// Topbar — breadcrumb, command-palette trigger, notifications,
// user menu. Mirrors the layout in src/shell.jsx.
// ─────────────────────────────────────────────────────────────
function Topbar({ user, breadcrumb }) {
    const [showSearch, setShowSearch] = useState(false)
    const [showNotif, setShowNotif] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)

    const crumbs = breadcrumb && breadcrumb.length > 0
        ? breadcrumb
        : ['Beranda']

    return (
        <header
            style={{
                height: 60,
                background: '#fff',
                borderBottom: '1px solid var(--ink-200)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
                position: 'sticky',
                top: 0,
                zIndex: 10,
            }}
        >
            {/* Breadcrumb */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    color: 'var(--ink-600)',
                }}
            >
                <Building2 size={15} style={{ color: 'var(--green-700)' }} />
                <span style={{ fontWeight: 600, color: 'var(--ink-800)' }}>PT. Pegadaian</span>
                {crumbs.map((c, i) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: 'var(--ink-300)' }}>/</span>
                        <span
                            style={{
                                color: i === crumbs.length - 1 ? 'var(--ink-800)' : 'var(--ink-600)',
                                fontWeight: i === crumbs.length - 1 ? 600 : 400,
                            }}
                        >
                            {c}
                        </span>
                    </span>
                ))}
            </div>

            {/* Search trigger */}
            <div style={{ position: 'relative', marginRight: 14 }}>
                <button
                    type="button"
                    onClick={() => setShowSearch(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '7px 12px',
                        background: 'var(--ink-50)',
                        border: '1px solid var(--ink-200)',
                        borderRadius: 8,
                        width: 300,
                        color: 'var(--ink-500)',
                        fontSize: 13,
                    }}
                >
                    <Search size={15} />
                    <span style={{ flex: 1, textAlign: 'left' }}>Cari risiko, audit, kebijakan…</span>
                    <span
                        className="mono"
                        style={{
                            fontSize: 10.5,
                            padding: '1px 5px',
                            background: '#fff',
                            border: '1px solid var(--ink-200)',
                            borderRadius: 4,
                        }}
                    >
                        Ctrl K
                    </span>
                </button>
                {showSearch && <CommandPalette onClose={() => setShowSearch(false)} />}
            </div>

            {/* Notifications */}
            <div style={{ position: 'relative', marginRight: 6 }}>
                <button
                    type="button"
                    onClick={() => setShowNotif((v) => !v)}
                    style={{
                        padding: 8,
                        borderRadius: 8,
                        color: 'var(--ink-700)',
                        position: 'relative',
                        background: 'transparent',
                        border: 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--ink-100)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                    <Bell size={18} />
                </button>
                {showNotif && <NotifPanel onClose={() => setShowNotif(false)} />}
            </div>

            {/* User menu */}
            <div style={{ position: 'relative' }}>
                <button
                    type="button"
                    onClick={() => setShowUserMenu((v) => !v)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '4px 10px 4px 4px',
                        borderRadius: 99,
                        background: 'var(--ink-50)',
                        border: '1px solid var(--ink-200)',
                    }}
                >
                    <Avatar name={user?.name ?? 'Guest'} size={32} />
                    <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-900)' }}>
                            {user?.name ?? 'Tamu'}
                        </div>
                        <div style={{ fontSize: 10.5, color: 'var(--ink-600)' }}>
                            {user?.email ?? '—'}
                        </div>
                    </div>
                    <ChevronDown size={14} style={{ color: 'var(--ink-500)' }} />
                </button>
                {showUserMenu && (
                    <>
                        <div
                            onClick={() => setShowUserMenu(false)}
                            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: 'calc(100% + 8px)',
                                width: 240,
                                background: '#fff',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--ink-200)',
                                boxShadow: 'var(--shadow-lg)',
                                zIndex: 50,
                                overflow: 'hidden',
                            }}
                        >
                            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--ink-200)' }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-900)' }}>
                                    {user?.name ?? 'Tamu'}
                                </div>
                                <div style={{ fontSize: 11.5, color: 'var(--ink-600)', marginTop: 2 }}>
                                    {user?.email ?? '—'}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowUserMenu(false)
                                    router.post(route('logout'))
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    width: '100%',
                                    padding: '10px 14px',
                                    color: 'var(--ink-700)',
                                    fontSize: 13,
                                    background: 'transparent',
                                    border: 'none',
                                    textAlign: 'left',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--ink-50)')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                                <LogOut size={15} /> Keluar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </header>
    )
}

// ─────────────────────────────────────────────────────────────
// Notification panel — collapsed list, mock entries until
// backend wires real notifications.
// ─────────────────────────────────────────────────────────────
function NotifPanel({ onClose }) {
    const items = [
        {
            id: 1,
            title: 'Risiko Operasional baru memerlukan review',
            sub: 'Divisi Treasury · 12 menit lalu',
            unread: true,
        },
        {
            id: 2,
            title: 'Action plan AKS-2026-014 mendekati deadline',
            sub: 'Owner: Maya Indira · 1 jam lalu',
            unread: true,
        },
        {
            id: 3,
            title: 'Audit AUD-2026-022 telah ditutup',
            sub: 'Auditor: Kartika Dewi · 4 jam lalu',
            unread: false,
        },
    ]
    return (
        <>
            <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
            <div
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: 380,
                    background: '#fff',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--ink-200)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 50,
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        padding: '14px 16px',
                        borderBottom: '1px solid var(--ink-200)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ fontSize: 14, fontWeight: 700 }}>Notifikasi</div>
                    <button
                        type="button"
                        style={{
                            fontSize: 12,
                            color: 'var(--green-700)',
                            fontWeight: 600,
                            background: 'transparent',
                            border: 'none',
                        }}
                    >
                        Tandai semua dibaca
                    </button>
                </div>
                <div style={{ maxHeight: 420, overflow: 'auto' }}>
                    {items.map((n) => (
                        <div
                            key={n.id}
                            style={{
                                padding: '12px 16px',
                                borderBottom: '1px solid var(--ink-100)',
                                display: 'flex',
                                gap: 12,
                                background: n.unread ? 'var(--green-50)' : '#fff',
                            }}
                        >
                            <div
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 32,
                                    background: 'var(--green-100)',
                                    color: 'var(--green-800)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                <Bell size={15} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    style={{
                                        fontSize: 13,
                                        fontWeight: n.unread ? 600 : 500,
                                        color: 'var(--ink-900)',
                                        lineHeight: 1.35,
                                    }}
                                >
                                    {n.title}
                                </div>
                                <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 3 }}>
                                    {n.sub}
                                </div>
                            </div>
                            {n.unread && (
                                <div
                                    style={{
                                        width: 7,
                                        height: 7,
                                        borderRadius: 7,
                                        background: 'var(--green-600)',
                                        marginTop: 6,
                                        flexShrink: 0,
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

// ─────────────────────────────────────────────────────────────
// Command palette — minimal search shell. Real wiring can be
// added later; this preserves keyboard UX from the reference.
// ─────────────────────────────────────────────────────────────
function CommandPalette({ onClose }) {
    const [q, setQ] = useState('')
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose])

    return (
        <>
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(10,22,20,0.4)',
                    zIndex: 60,
                    backdropFilter: 'blur(2px)',
                }}
            />
            <div
                style={{
                    position: 'fixed',
                    left: '50%',
                    top: 120,
                    transform: 'translateX(-50%)',
                    width: 640,
                    background: '#fff',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 70,
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '14px 18px',
                        borderBottom: '1px solid var(--ink-200)',
                    }}
                >
                    <Search size={18} style={{ color: 'var(--ink-500)' }} />
                    <input
                        autoFocus
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Cari risiko, audit, regulasi, kebijakan…"
                        style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            fontSize: 15,
                            background: 'transparent',
                        }}
                    />
                    <span
                        className="mono"
                        style={{
                            fontSize: 10.5,
                            padding: '2px 6px',
                            background: 'var(--ink-100)',
                            borderRadius: 4,
                            color: 'var(--ink-600)',
                        }}
                    >
                        ESC
                    </span>
                </div>
                <div
                    style={{
                        padding: 32,
                        textAlign: 'center',
                        color: 'var(--ink-500)',
                        fontSize: 13,
                    }}
                >
                    {q
                        ? `Pencarian "${q}" akan terhubung ke index global pada tahap berikutnya.`
                        : 'Mulai mengetik untuk mencari di seluruh modul GRC.'}
                </div>
            </div>
        </>
    )
}

// ─────────────────────────────────────────────────────────────
// Toast — flash messages from Inertia shared props
// ─────────────────────────────────────────────────────────────
function Toast({ flash }) {
    const [toasts, setToasts] = useState([])

    useEffect(() => {
        const next = []
        if (flash?.success) next.push({ id: 'success', type: 'success', message: flash.success })
        if (flash?.error)   next.push({ id: 'error',   type: 'error',   message: flash.error })
        if (flash?.warning) next.push({ id: 'warning', type: 'warning', message: flash.warning })
        if (next.length === 0) return

        setToasts(next)
        const timer = setTimeout(() => setToasts([]), 4000)
        return () => clearTimeout(timer)
    }, [flash])

    if (toasts.length === 0) return null

    const tone = {
        success: { bg: 'var(--green-100)', fg: 'var(--green-800)', bd: 'var(--green-300)', Icon: CheckCircle },
        error:   { bg: 'var(--red-100)',   fg: '#8b261b',          bd: '#f0c9c1',           Icon: AlertCircle },
        warning: { bg: 'var(--amber-100)', fg: '#7a4f0a',          bd: 'var(--gold-300)',   Icon: Info },
    }

    return (
        <div
            style={{
                position: 'fixed',
                top: 16,
                right: 16,
                zIndex: 200,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                minWidth: 280,
                maxWidth: 380,
            }}
        >
            {toasts.map((t) => {
                const T = tone[t.type]
                const Icon = T.Icon
                return (
                    <div
                        key={t.id}
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 10,
                            padding: '10px 14px',
                            borderRadius: 'var(--radius)',
                            border: `1px solid ${T.bd}`,
                            background: T.bg,
                            color: T.fg,
                            fontSize: 13,
                            boxShadow: 'var(--shadow)',
                        }}
                    >
                        <Icon size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span style={{ flex: 1 }}>{t.message}</span>
                        <button
                            type="button"
                            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: T.fg,
                                opacity: 0.6,
                                padding: 0,
                            }}
                            aria-label="Tutup"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )
            })}
        </div>
    )
}

// Helper export so layouts/pages can render breadcrumb arrows consistently.
export function Crumbs({ items }) {
    return (
        <div
            style={{
                fontSize: 12,
                color: 'var(--ink-500)',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                flexWrap: 'wrap',
            }}
        >
            {items.map((b, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {i > 0 && <ChevronRight size={12} />}
                    <span
                        style={{
                            color: i === items.length - 1 ? 'var(--ink-800)' : 'var(--ink-500)',
                            fontWeight: i === items.length - 1 ? 600 : 400,
                        }}
                    >
                        {b}
                    </span>
                </span>
            ))}
        </div>
    )
}

/**
 * AppLayout — main shell.
 *
 * Props:
 *   title         — string used in topbar breadcrumb fallback
 *   breadcrumb    — array of crumb labels for the topbar
 *   contentPadding — controls the default padding around children.
 *                    Default `'legacy'` (24px 32px) keeps older pages
 *                    that don't render their own outer wrapper looking
 *                    correct. Pages that render a full-bleed banner
 *                    (new PageHeader) should pass `false` or `'none'`
 *                    and supply their own spacing — matches reference
 *                    layout where dashboard/risk pages own their padding.
 */
export default function AppLayout({
    title,
    breadcrumb,
    contentPadding = 'legacy',
    children,
}) {
    const { auth, flash, navCounts } = usePage().props

    const crumbs = useMemo(() => {
        if (Array.isArray(breadcrumb)) return breadcrumb
        if (typeof title === 'string' && title.length > 0) return [title]
        return []
    }, [breadcrumb, title])

    const padding =
        contentPadding === false || contentPadding === 'none'
            ? 0
            : contentPadding === 'legacy'
            ? '24px 32px'
            : contentPadding

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ink-50)' }}>
            <Sidebar user={auth?.user} navCounts={navCounts} />
            <main
                style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Topbar user={auth?.user} breadcrumb={crumbs} />
                <div style={{ flex: 1, padding }}>{children}</div>
            </main>
            <Toast flash={flash} />
        </div>
    )
}
