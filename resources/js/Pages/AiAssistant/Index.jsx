import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import {
    MessageSquare,
    Send,
    Plus,
    Search,
    Sparkles,
    Trash2,
    Copy,
    ThumbsUp,
    ThumbsDown,
    Paperclip,
    MoreVertical,
    Database,
    Receipt,
    Quote,
    User as UserIcon,
} from 'lucide-react'
import AppLayout from '@/Layouts/AppLayout'
import Avatar from '@/Components/Avatar'
import Tag from '@/Components/Tag'
import Toggle from '@/Components/Toggle'
import SectionTitle from '@/Components/SectionTitle'

/* ───────────────────────── helpers ───────────────────────── */

function relTime(iso) {
    if (!iso) return ''
    const d = new Date(iso)
    const diff = (Date.now() - d.getTime()) / 1000
    if (diff < 60) return 'baru saja'
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`
    if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} hari lalu`
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
}

const SUGGESTIONS = [
    'Buat ringkasan policy POJK 6/2017',
    'Identifikasi gap compliance Q4 dari risk register',
    'Generate laporan audit findings 30 hari terakhir',
    'Bandingkan SOP gratifikasi internal vs UU 31/1999',
]

const DATA_SOURCES = [
    { key: 'risk',       label: 'Risk Register',  defaultOn: true },
    { key: 'audits',     label: 'Audit Findings', defaultOn: true },
    { key: 'policies',   label: 'Policies',       defaultOn: true },
    { key: 'regulations',label: 'Regulations',    defaultOn: true },
    { key: 'incidents',  label: 'Incidents',      defaultOn: false },
]

const MODEL_OPTIONS = ['gpt-4', 'gpt-4o', 'claude-3-opus', 'claude-3-haiku']

/* ───────────────────────── markdown-lite ───────────────────────── */

function renderRichText(text) {
    // Very light markdown — split by ** for bold, preserve newlines.
    return text
        .split(/\n/)
        .map((line, li) => (
            <span key={li} style={{ display: 'block' }}>
                {line.split('**').map((part, j) =>
                    j % 2 === 1 ? (
                        <strong key={j}>{part}</strong>
                    ) : (
                        <span key={j}>{part}</span>
                    ),
                )}
            </span>
        ))
}

/* ───────────────────────── thread list ───────────────────────── */

function ThreadList({ threads, activeId, onNewChat, query, setQuery }) {
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return threads
        return threads.filter(
            (t) =>
                t.title.toLowerCase().includes(q) ||
                (t.preview || '').toLowerCase().includes(q),
        )
    }, [threads, query])

    return (
        <aside
            style={{
                width: 280,
                background: '#fff',
                borderRight: '1px solid var(--ink-200)',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                minHeight: 0,
            }}
        >
            {/* New chat */}
            <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid var(--ink-100)' }}>
                <button
                    type="button"
                    onClick={onNewChat}
                    style={{
                        width: '100%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        justifyContent: 'center',
                        padding: '9px 12px',
                        background: 'var(--green-700)',
                        color: '#fff',
                        border: '1px solid var(--green-700)',
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: 'pointer',
                    }}
                >
                    <Plus size={14} /> New Chat
                </button>
                <div
                    style={{
                        position: 'relative',
                        marginTop: 10,
                    }}
                >
                    <Search
                        size={13}
                        style={{
                            position: 'absolute',
                            left: 10,
                            top: 9,
                            color: 'var(--ink-500)',
                        }}
                    />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Cari percakapan…"
                        style={{
                            width: '100%',
                            padding: '7px 10px 7px 30px',
                            borderRadius: 8,
                            border: '1px solid var(--ink-200)',
                            fontSize: 12.5,
                            outline: 'none',
                            background: 'var(--ink-50)',
                        }}
                    />
                </div>
            </div>

            {/* Thread items */}
            <div style={{ flex: 1, overflow: 'auto', padding: '6px 0' }}>
                {filtered.length === 0 && (
                    <div
                        style={{
                            padding: '32px 18px',
                            textAlign: 'center',
                            fontSize: 12,
                            color: 'var(--ink-500)',
                        }}
                    >
                        {threads.length === 0
                            ? 'Belum ada percakapan. Mulai dengan New Chat.'
                            : 'Tidak ada hasil untuk pencarian itu.'}
                    </div>
                )}
                {filtered.map((t) => {
                    const isActive = String(t.id) === String(activeId)
                    return (
                        <Link
                            key={t.id}
                            href={route('ai-assistant.index', { thread: t.id })}
                            preserveState={false}
                            style={{
                                display: 'flex',
                                gap: 10,
                                padding: '10px 14px',
                                borderLeft: isActive
                                    ? '4px solid var(--green-700)'
                                    : '4px solid transparent',
                                background: isActive ? 'var(--green-50)' : 'transparent',
                                textDecoration: 'none',
                                color: 'inherit',
                                transition: 'background 120ms',
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive)
                                    e.currentTarget.style.background = 'var(--ink-50)'
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive)
                                    e.currentTarget.style.background = 'transparent'
                            }}
                        >
                            <Avatar name={t.title} size={28} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: 6,
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 12.5,
                                            fontWeight: isActive ? 700 : 600,
                                            color: isActive
                                                ? 'var(--green-800)'
                                                : 'var(--ink-900)',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {t.title}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 10.5,
                                            color: 'var(--ink-500)',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {relTime(t.updated_at)}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        fontSize: 11.5,
                                        color: 'var(--ink-500)',
                                        marginTop: 2,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {t.preview || '—'}
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* Footer — model selector */}
            <div
                style={{
                    padding: '10px 14px',
                    borderTop: '1px solid var(--ink-100)',
                    background: 'var(--ink-50)',
                }}
            >
                <div
                    style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        color: 'var(--ink-500)',
                        marginBottom: 4,
                    }}
                >
                    Model
                </div>
                <select
                    defaultValue="gpt-4"
                    style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: '1px solid var(--ink-200)',
                        background: '#fff',
                        fontSize: 12.5,
                        outline: 'none',
                    }}
                >
                    {MODEL_OPTIONS.map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>
            </div>
        </aside>
    )
}

/* ───────────────────────── chat panel ───────────────────────── */

function MessageBubble({ msg, onCopy }) {
    const isUser = msg.role === 'user'
    return (
        <div
            style={{
                display: 'flex',
                gap: 12,
                marginBottom: 18,
                flexDirection: isUser ? 'row-reverse' : 'row',
            }}
        >
            <div
                style={{
                    width: 34,
                    height: 34,
                    borderRadius: 34,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isUser ? 'var(--ink-200)' : 'var(--green-700)',
                    color: isUser ? 'var(--ink-700)' : '#fff',
                }}
            >
                {isUser ? <UserIcon size={16} /> : <Sparkles size={16} />}
            </div>
            <div
                style={{
                    maxWidth: '78%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                }}
            >
                <div
                    style={{
                        background: isUser ? 'var(--green-100)' : '#fff',
                        color: 'var(--ink-900)',
                        padding: '12px 16px',
                        borderRadius: 12,
                        fontSize: 13.5,
                        lineHeight: 1.6,
                        boxShadow: isUser ? 'none' : 'var(--shadow-sm)',
                        border: isUser
                            ? '1px solid var(--green-300)'
                            : '1px solid var(--ink-200)',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {renderRichText(msg.content)}
                </div>
                {!isUser && (
                    <div
                        style={{
                            display: 'flex',
                            gap: 6,
                            marginTop: 6,
                            fontSize: 11,
                            color: 'var(--ink-500)',
                        }}
                    >
                        <button
                            type="button"
                            title="Copy"
                            onClick={() => onCopy && onCopy(msg.content)}
                            style={miniBtn}
                        >
                            <Copy size={12} />
                        </button>
                        <button type="button" title="Helpful" style={miniBtn}>
                            <ThumbsUp size={12} />
                        </button>
                        <button type="button" title="Not helpful" style={miniBtn}>
                            <ThumbsDown size={12} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

const miniBtn = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 8px',
    borderRadius: 6,
    border: '1px solid var(--ink-200)',
    background: '#fff',
    color: 'var(--ink-600)',
    fontSize: 11,
    cursor: 'pointer',
}

function ChatPanel({ thread, onSend, onNewChat, onDelete }) {
    const [draft, setDraft] = useState('')
    const [sending, setSending] = useState(false)
    const endRef = useRef(null)
    const taRef = useRef(null)

    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [thread?.messages?.length])

    const submit = (text) => {
        const t = (text ?? draft).trim()
        if (!t || sending) return
        setSending(true)
        onSend(t, () => {
            setDraft('')
            setSending(false)
            if (taRef.current) taRef.current.style.height = 'auto'
        })
    }

    const onKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit()
        }
    }

    const onTextChange = (e) => {
        setDraft(e.target.value)
        const ta = taRef.current
        if (ta) {
            ta.style.height = 'auto'
            ta.style.height = Math.min(ta.scrollHeight, 200) + 'px'
        }
    }

    if (!thread) {
        return (
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'var(--ink-50)',
                }}
            >
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px 24px',
                    }}
                >
                    <div style={{ maxWidth: 520, textAlign: 'center' }}>
                        <div
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: 64,
                                background: 'var(--green-50)',
                                color: 'var(--green-700)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 14,
                            }}
                        >
                            <Sparkles size={28} />
                        </div>
                        <h2
                            className="display"
                            style={{
                                fontSize: 24,
                                margin: 0,
                                color: 'var(--ink-900)',
                            }}
                        >
                            i-GRaCias AI
                        </h2>
                        <p
                            style={{
                                fontSize: 13.5,
                                color: 'var(--ink-600)',
                                marginTop: 6,
                                lineHeight: 1.6,
                            }}
                        >
                            Asisten cerdas untuk navigasi kebijakan, analisis risiko,
                            dan eksplorasi regulasi. Mulai percakapan baru atau pilih
                            sesi sebelumnya dari panel kiri.
                        </p>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 10,
                                marginTop: 22,
                                textAlign: 'left',
                            }}
                        >
                            {SUGGESTIONS.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => onNewChat(s)}
                                    style={{
                                        padding: '12px 14px',
                                        background: '#fff',
                                        border: '1px solid var(--ink-200)',
                                        borderRadius: 10,
                                        textAlign: 'left',
                                        fontSize: 12.5,
                                        color: 'var(--ink-800)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            color: 'var(--green-700)',
                                            marginBottom: 4,
                                        }}
                                    >
                                        <Sparkles size={14} />
                                        <span
                                            style={{
                                                fontSize: 10.5,
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                letterSpacing: 0.4,
                                            }}
                                        >
                                            Coba ini
                                        </span>
                                    </div>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--ink-50)',
                minWidth: 0,
            }}
        >
            {/* Top bar */}
            <div
                style={{
                    background: '#fff',
                    borderBottom: '1px solid var(--ink-200)',
                    padding: '12px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                }}
            >
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: 'var(--ink-900)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {thread.title}
                    </div>
                    <div
                        style={{
                            fontSize: 11,
                            color: 'var(--ink-500)',
                            marginTop: 2,
                            display: 'flex',
                            gap: 8,
                            alignItems: 'center',
                        }}
                    >
                        <Tag tone="green" size="xs">
                            {thread.model || 'gpt-4'}
                        </Tag>
                        <span>{thread.messages?.length ?? 0} pesan</span>
                    </div>
                </div>
                <button
                    type="button"
                    style={{ ...miniBtn, padding: '6px 10px' }}
                    title="Lainnya"
                >
                    <MoreVertical size={13} />
                </button>
                <button
                    type="button"
                    onClick={() => {
                        if (
                            window.confirm(
                                'Hapus percakapan ini? Riwayat tidak dapat dipulihkan.',
                            )
                        )
                            onDelete()
                    }}
                    style={{
                        ...miniBtn,
                        padding: '6px 10px',
                        color: '#8b261b',
                        borderColor: '#f0c9c1',
                        background: '#fbe4df',
                    }}
                    title="Hapus"
                >
                    <Trash2 size={13} /> Hapus
                </button>
            </div>

            {/* messages */}
            <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
                <div style={{ maxWidth: 820, margin: '0 auto' }}>
                    {(thread.messages ?? []).map((m) => (
                        <MessageBubble
                            key={m.id}
                            msg={m}
                            onCopy={(t) =>
                                navigator.clipboard?.writeText(t).catch(() => {})
                            }
                        />
                    ))}
                    {sending && (
                        <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                            <div
                                style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 34,
                                    background: 'var(--green-700)',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Sparkles size={16} />
                            </div>
                            <div
                                style={{
                                    background: '#fff',
                                    border: '1px solid var(--ink-200)',
                                    padding: '14px 16px',
                                    borderRadius: 12,
                                    fontSize: 13,
                                    color: 'var(--ink-600)',
                                }}
                            >
                                <span style={{ display: 'inline-flex', gap: 4 }}>
                                    {[0, 0.2, 0.4].map((d) => (
                                        <span
                                            key={d}
                                            style={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: 6,
                                                background: 'var(--green-500)',
                                                animation: `aiTypePulse 1.4s ease-in-out infinite ${d}s`,
                                            }}
                                        />
                                    ))}
                                </span>
                                <style>{`@keyframes aiTypePulse{0%,100%{opacity:0.3}50%{opacity:1}}`}</style>
                            </div>
                        </div>
                    )}
                    <div ref={endRef} />
                </div>
            </div>

            {/* composer */}
            <div style={{ padding: '12px 32px 18px', background: 'var(--ink-50)' }}>
                <div style={{ maxWidth: 820, margin: '0 auto' }}>
                    {/* suggestion chips above input (only when empty draft) */}
                    {!draft && (
                        <div
                            style={{
                                display: 'flex',
                                gap: 6,
                                flexWrap: 'wrap',
                                marginBottom: 10,
                            }}
                        >
                            {SUGGESTIONS.slice(0, 3).map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => submit(s)}
                                    style={{
                                        padding: '5px 10px',
                                        borderRadius: 99,
                                        background: '#fff',
                                        border: '1px solid var(--ink-200)',
                                        fontSize: 11.5,
                                        color: 'var(--ink-700)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    <div
                        style={{
                            background: '#fff',
                            border: '1px solid var(--ink-300)',
                            borderRadius: 14,
                            padding: '10px 12px',
                            boxShadow: 'var(--shadow)',
                        }}
                    >
                        <textarea
                            ref={taRef}
                            value={draft}
                            onChange={onTextChange}
                            onKeyDown={onKeyDown}
                            placeholder="Tanyakan apa saja tentang risk, audit, kepatuhan, atau kebijakan…"
                            style={{
                                width: '100%',
                                border: 'none',
                                outline: 'none',
                                resize: 'none',
                                fontSize: 13.5,
                                lineHeight: 1.5,
                                minHeight: 44,
                                fontFamily: 'inherit',
                                padding: '4px 4px 0',
                            }}
                        />
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 6,
                            }}
                        >
                            <button
                                type="button"
                                title="Lampirkan dokumen"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    padding: '6px 8px',
                                    borderRadius: 8,
                                    color: 'var(--ink-500)',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                <Paperclip size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => submit()}
                                disabled={sending || !draft.trim()}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '8px 16px',
                                    borderRadius: 10,
                                    background: 'var(--green-700)',
                                    color: '#fff',
                                    border: '1px solid var(--green-700)',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor:
                                        sending || !draft.trim()
                                            ? 'not-allowed'
                                            : 'pointer',
                                    opacity: sending || !draft.trim() ? 0.5 : 1,
                                }}
                            >
                                Kirim <Send size={13} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ───────────────────────── right rail ───────────────────────── */

function ContextRail({ stats }) {
    const [sources, setSources] = useState(
        Object.fromEntries(DATA_SOURCES.map((s) => [s.key, s.defaultOn])),
    )

    return (
        <aside
            style={{
                width: 320,
                background: '#fff',
                borderLeft: '1px solid var(--ink-200)',
                flexShrink: 0,
                overflow: 'auto',
                padding: '16px 16px 22px',
            }}
        >
            <div
                style={{
                    background: 'var(--paper)',
                    border: '1px solid var(--ink-200)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 14,
                    marginBottom: 12,
                }}
            >
                <SectionTitle
                    title="Sumber Data"
                    hint="Pilih dataset yang dirujuk asisten"
                    level={4}
                    display={false}
                />
                {DATA_SOURCES.map((s) => (
                    <div
                        key={s.key}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 0',
                            borderBottom: '1px solid var(--ink-100)',
                        }}
                    >
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                fontSize: 12.5,
                                color: 'var(--ink-800)',
                                fontWeight: 500,
                            }}
                        >
                            <Database size={13} style={{ color: 'var(--green-700)' }} />
                            {s.label}
                        </div>
                        <Toggle
                            checked={!!sources[s.key]}
                            onChange={(v) =>
                                setSources((prev) => ({ ...prev, [s.key]: v }))
                            }
                            size="sm"
                        />
                    </div>
                ))}
            </div>

            <div
                style={{
                    background: 'var(--paper)',
                    border: '1px solid var(--ink-200)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 14,
                    marginBottom: 12,
                }}
            >
                <SectionTitle
                    title="Conversation Stats"
                    level={4}
                    display={false}
                />
                <Row label="Total Threads" value={stats?.thread_count ?? 0} mono />
                <Row label="Total Messages" value={stats?.message_count ?? 0} mono />
                <Row label="Tokens Used" value={(stats?.tokens_used ?? 0).toLocaleString()} mono />
                <Row
                    label="Estimated Cost"
                    value={`$${(stats?.cost_usd ?? 0).toFixed(3)}`}
                    mono
                />
            </div>

            <div
                style={{
                    background: 'var(--paper)',
                    border: '1px solid var(--ink-200)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 14,
                }}
            >
                <SectionTitle title="Citations" level={4} display={false} />
                {[
                    { id: 'KU-014/RM/2025', label: 'Manajemen Risiko Operasional' },
                    { id: 'POJK 11/03/2024', label: 'Profil Risiko Terintegrasi' },
                    { id: 'AUD-2026-008', label: 'Audit Cabang Q1 — temuan #3' },
                ].map((c) => (
                    <div
                        key={c.id}
                        style={{
                            display: 'flex',
                            gap: 8,
                            padding: '8px 0',
                            borderBottom: '1px solid var(--ink-100)',
                        }}
                    >
                        <Quote size={13} style={{ color: 'var(--gold-500)', marginTop: 3 }} />
                        <div>
                            <div
                                className="mono"
                                style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: 'var(--ink-700)',
                                }}
                            >
                                {c.id}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--ink-700)', marginTop: 1 }}>
                                {c.label}
                            </div>
                        </div>
                    </div>
                ))}
                <div
                    style={{
                        marginTop: 8,
                        fontSize: 11,
                        color: 'var(--ink-500)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                    }}
                >
                    <Receipt size={11} /> Verifikasi setiap rujukan dengan dokumen sumber.
                </div>
            </div>
        </aside>
    )
}

function Row({ label, value, mono = false }) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                padding: '6px 0',
                borderBottom: '1px solid var(--ink-100)',
                fontSize: 12.5,
            }}
        >
            <span style={{ color: 'var(--ink-600)' }}>{label}</span>
            <span
                className={mono ? 'mono' : ''}
                style={{ fontWeight: 700, color: 'var(--ink-900)' }}
            >
                {value}
            </span>
        </div>
    )
}

/* ───────────────────────── page ───────────────────────── */

export default function AiAssistantIndex() {
    const { threads = [], activeThread = null, stats = {} } = usePage().props
    const [query, setQuery] = useState('')
    const [showRail, setShowRail] = useState(true)

    const handleNewChat = (seed) => {
        const initial = (seed && typeof seed === 'string' && seed) ||
            window.prompt('Tulis pesan pembuka untuk percakapan baru:')
        if (!initial || !initial.trim()) return
        router.post(route('ai-assistant.store'), { message: initial }, { preserveScroll: false })
    }

    const handleSend = (text, done) => {
        if (!activeThread) {
            router.post(route('ai-assistant.store'), { message: text }, {
                preserveScroll: true,
                onFinish: () => done && done(),
            })
            return
        }
        router.post(
            route('ai-assistant.send', { thread: activeThread.id }),
            { message: text },
            {
                preserveScroll: true,
                onFinish: () => done && done(),
            },
        )
    }

    const handleDelete = () => {
        if (!activeThread) return
        router.delete(route('ai-assistant.destroy', { thread: activeThread.id }))
    }

    return (
        <AppLayout
            title="AI Assistant"
            breadcrumb={['Beranda', 'AI Assistant']}
            contentPadding="none"
        >
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    minHeight: 'calc(100vh - 60px)',
                    height: 'calc(100vh - 60px)',
                    background: 'var(--ink-50)',
                }}
            >
                <ThreadList
                    threads={threads}
                    activeId={activeThread?.id}
                    onNewChat={() => handleNewChat()}
                    query={query}
                    setQuery={setQuery}
                />
                <ChatPanel
                    thread={activeThread}
                    onSend={handleSend}
                    onNewChat={(seed) => handleNewChat(seed)}
                    onDelete={handleDelete}
                />
                {showRail && <ContextRail stats={stats} />}
                <button
                    type="button"
                    onClick={() => setShowRail((v) => !v)}
                    title={showRail ? 'Sembunyikan panel' : 'Tampilkan panel'}
                    style={{
                        position: 'fixed',
                        right: showRail ? 332 : 12,
                        bottom: 14,
                        padding: '8px 12px',
                        borderRadius: 99,
                        border: '1px solid var(--ink-200)',
                        background: '#fff',
                        boxShadow: 'var(--shadow)',
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--ink-700)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                    }}
                >
                    <MessageSquare size={12} /> {showRail ? 'Sembunyikan' : 'Konteks'}
                </button>
            </div>
        </AppLayout>
    )
}
