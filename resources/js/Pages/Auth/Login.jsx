import { useState } from 'react'
import { Head, useForm } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { Eye, EyeOff, LogIn } from 'lucide-react'

// Brand mark — emerald shield monogram (matches AppLayout BrandMark).
function BrandMark({ size = 56 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
            <path
                d="M20 2 L34 7 V20 C34 28.5 28 34.5 20 38 C12 34.5 6 28.5 6 20 V7 Z"
                fill="url(#login-brand-grad)"
            />
            <defs>
                <linearGradient id="login-brand-grad" x1="0" y1="0" x2="40" y2="40">
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

export default function Login({ portal_sso_url, errors = {} }) {
    const [showPassword, setShowPassword] = useState(false)
    const form = useForm({
        email: '',
        password: '',
        remember: false,
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        form.post(route('login.post'))
    }

    const inputBase = {
        width: '100%',
        padding: '10px 12px',
        borderRadius: 8,
        border: '1px solid var(--ink-300)',
        background: '#fff',
        color: 'var(--ink-900)',
        fontSize: 13.5,
        outline: 'none',
        transition: 'border-color 120ms, box-shadow 120ms',
    }

    const labelStyle = {
        display: 'block',
        fontSize: 12.5,
        fontWeight: 600,
        color: 'var(--ink-800)',
        marginBottom: 6,
    }

    const errorStyle = {
        color: '#b8392a',
        fontSize: 11.5,
        marginTop: 5,
    }

    return (
        <>
            <Head title="Masuk" />
            <div
                style={{
                    minHeight: '100vh',
                    background: 'var(--ink-50)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '32px 16px',
                }}
            >
                {/* Brand header */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: 24,
                    }}
                >
                    <BrandMark size={56} />
                    <h1
                        className="display"
                        style={{
                            margin: '14px 0 4px',
                            fontSize: 32,
                            color: 'var(--ink-900)',
                            lineHeight: 1.1,
                        }}
                    >
                        i-GRaCias
                    </h1>
                    <div
                        style={{
                            fontSize: 13,
                            color: 'var(--ink-600)',
                            letterSpacing: 0.2,
                        }}
                    >
                        Integrated GRC Information System
                    </div>
                </div>

                {/* Card */}
                <div
                    className="card"
                    style={{
                        background: 'var(--paper)',
                        border: '1px solid var(--ink-200)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow)',
                        padding: '28px 28px 24px',
                        width: '100%',
                        maxWidth: 400,
                    }}
                >
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)' }}>
                            Masuk ke akun Anda
                        </div>
                        <div
                            style={{
                                fontSize: 12.5,
                                color: 'var(--ink-600)',
                                marginTop: 4,
                            }}
                        >
                            Gunakan kredensial korporat Anda untuk mengakses platform.
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
                    >
                        <div>
                            <label htmlFor="email" style={labelStyle}>
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--green-600)'
                                    e.currentTarget.style.boxShadow =
                                        '0 0 0 3px rgba(31,156,114,0.15)'
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--ink-300)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                                style={inputBase}
                                placeholder="nama@pegadaian.co.id"
                            />
                            {errors.email && <p style={errorStyle}>{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" style={labelStyle}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={form.data.password}
                                    onChange={(e) => form.setData('password', e.target.value)}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--green-600)'
                                        e.currentTarget.style.boxShadow =
                                            '0 0 0 3px rgba(31,156,114,0.15)'
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--ink-300)'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                    style={{ ...inputBase, paddingRight: 40 }}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-label={
                                        showPassword
                                            ? 'Sembunyikan password'
                                            : 'Tampilkan password'
                                    }
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: 8,
                                        transform: 'translateY(-50%)',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--ink-500)',
                                        padding: 4,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p style={errorStyle}>{errors.password}</p>}
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: 12.5,
                            }}
                        >
                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    color: 'var(--ink-700)',
                                    cursor: 'pointer',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={form.data.remember}
                                    onChange={(e) =>
                                        form.setData('remember', e.target.checked)
                                    }
                                    style={{ accentColor: 'var(--green-600)' }}
                                />
                                Ingat saya
                            </label>
                            <a
                                href="#"
                                style={{
                                    color: 'var(--green-700)',
                                    fontWeight: 600,
                                }}
                            >
                                Lupa password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={form.processing}
                            style={{
                                background: 'var(--green-700)',
                                color: '#fff',
                                padding: '11px 16px',
                                borderRadius: 8,
                                border: '1px solid var(--green-700)',
                                cursor: form.processing ? 'not-allowed' : 'pointer',
                                fontWeight: 600,
                                fontSize: 13.5,
                                width: '100%',
                                opacity: form.processing ? 0.7 : 1,
                                transition: 'background 120ms',
                            }}
                            onMouseEnter={(e) => {
                                if (!form.processing)
                                    e.currentTarget.style.background = 'var(--green-800)'
                            }}
                            onMouseLeave={(e) => {
                                if (!form.processing)
                                    e.currentTarget.style.background = 'var(--green-700)'
                            }}
                        >
                            {form.processing ? 'Memproses…' : 'Masuk'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            margin: '20px 0',
                        }}
                    >
                        <div style={{ flex: 1, height: 1, background: 'var(--ink-200)' }} />
                        <span style={{ fontSize: 11.5, color: 'var(--ink-500)' }}>atau</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--ink-200)' }} />
                    </div>

                    {/* Portal SSO */}
                    <a
                        href={portal_sso_url}
                        style={{
                            background: '#fff',
                            color: 'var(--ink-800)',
                            padding: '11px 16px',
                            borderRadius: 8,
                            border: '1px solid var(--ink-300)',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: 13.5,
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--ink-50)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                    >
                        <LogIn size={16} />
                        Login via Portal SSO
                    </a>
                </div>

                <p
                    style={{
                        marginTop: 24,
                        fontSize: 11.5,
                        color: 'var(--ink-500)',
                        textAlign: 'center',
                    }}
                >
                    &copy; 2026 PT. Pegadaian. Semua hak dilindungi.
                </p>
            </div>
        </>
    )
}
