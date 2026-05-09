# Rekomendasi Tech Stack — i-GRaCiaS

**Stack: Laravel 12 + Inertia.js + React 18 + PostgreSQL 15**

Ini adalah 1 dari 4 app dalam platform compliance Pegadaian.
Keempat app (Portal, iDesk, i-GRaCiaS, AML/CFT) menggunakan **tech stack yang sama**.

**Karakter aplikasi**: multi-modul besar (6 modul), workflow-heavy, form-heavy, document-centric, internal users (~5.000), banyak dashboard.

---

## Tech Stack

### Backend: Laravel 12 + PHP 8.4
- **Auth**: SSO via Portal (OAuth2/Passport) + Sanctum untuk session lokal
- **RBAC**: Spatie Permission — role per modul: Risk Officer, Auditor, Compliance Officer, Admin
- **ORM**: Eloquent + Migration
- **Queue**: Laravel Queue + Redis (notification, report generation, AI jobs)
- **Tenancy**: Stancl/Tenancy (multi-database, BYODB)
- **Audit**: Spatie Activity Log (immutable, WORM — syarat regulator, 10 tahun)
- **Workflow**: Spatie Model States (state machine untuk RCSA, audit plan, WBS)
- **Reporting**: DomPDF + Maatwebsite Excel
- **HTTP Client**: Built-in untuk AI API + cross-app communication

### Frontend: React 18 + Inertia.js + TypeScript
- **UI**: Ant Design atau Shadcn UI (enterprise dashboard)
- **Styling**: Tailwind CSS + CSS variables (whitelabel)
- **Table**: TanStack Table (risk register, audit finding, incident list)
- **Charts**: Recharts / ApexCharts (risk heatmap, KPI/KRI/KCI dashboard)
- **Forms**: React Hook Form + Zod (multi-step RCSA, audit working paper)

### Database: PostgreSQL 15
- JSONB untuk data GRC yang bervariasi (risk criteria, control config)
- Full-text search untuk pencarian kebijakan & regulasi
- Per-tenant database (Stancl/Tenancy) — BYODB ready

### Infrastructure
- **Cache/Queue**: Redis
- **Storage**: S3-compatible (evidence docs, audit papers) — BYOS ready
- **Search**: PostgreSQL full-text (cukup untuk 5.000 users)
- **AI**: HTTP → OpenAI/Gemini/Claude API

---

## Kenapa Tetap Laravel (bukan Filament+Vue / Next.js+tRPC / Django)?

| Kriteria | Laravel + Inertia + React ✅ | Filament + Vue (old rec) | Next.js + tRPC | Django + HTMX |
|---|---|---|---|---|
| **Konsistensi** | ✅ Sama dengan 3 app lain | ⚠️ Vue beda dari app lain | ❌ Beda stack total | ❌ Beda stack total |
| **React ecosystem** | ✅ Full access | ❌ Vue-based | ✅ Full access | ❌ Minimal |
| **Talent sharing** | ✅ 1 tim, 4 app | ⚠️ Vue dev ≠ React dev | ❌ Perlu Node dev | ❌ Perlu Python dev |
| **SaaS/Tenancy** | ✅ Stancl/Tenancy | ✅ Stancl/Tenancy | ⚠️ Manual | ⚠️ django-tenants |
| **CRUD speed** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ (Filament) | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Dashboard** | ⭐⭐⭐⭐⭐ (React charts) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

**Alasan utama**: Konsistensi 4 app > kecepatan CRUD satu app.
Tim yang sama develop 4 app = satu stack, satu skill set, satu deployment pipeline.

---

## Shared Composer Packages

```
pegadaian/auth-client      → SSO token validation ke Portal
pegadaian/tenant-core      → Stancl/Tenancy base config, BYODB resolver
pegadaian/ai-service       → AI API wrapper
pegadaian/branding         → Whitelabel theming
pegadaian/audit-trail      → Activity logging standard
```

---

## REST API (Parallel)

```
/api/v1/risks              → Risk register CRUD
/api/v1/rcsa               → RCSA cycle management
/api/v1/audits             → Audit plan & findings
/api/v1/incidents          → WBS, gratifikasi, CoI
/api/v1/regulations        → Regulatory inventory
/api/v1/losses             → Loss event registry
/api/v1/dashboard          → KPI/KRI/KCI aggregation
```

Consumed by: whitelabel clients, mobile (future), AML/CFT app (compliance signals).
