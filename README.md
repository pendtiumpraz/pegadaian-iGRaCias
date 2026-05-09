# iGRaCias — Integrated GRC Information System

**iGRaCias** adalah platform terintegrasi untuk **Governance, Risk, and Compliance** PT Pegadaian. Mengintegrasikan modul Risiko, Audit Internal, Insiden & Whistleblowing, Loss Event, Kebijakan & Prosedur, Regulasi, hingga Quality Assurance dan AI-assisted analysis dalam satu workspace.

Visual identity: emerald hex `#1f9c72` + warm ink scale + **Fraunces serif** untuk display typography.

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Laravel 12, PHP 8.2+ |
| Frontend | Inertia.js v3, React 18 |
| Build | Vite 7, Tailwind CSS v4 |
| Database | MySQL 8 |
| Typography | Inter (UI), **Fraunces** (display titles), JetBrains Mono (numerics) |
| Auth | Local + Portal SSO (OAuth2) |
| Routing helper | Ziggy v2 |

Design tokens dari reference resmi i-GRaCias handoff: HEX-based green palette `--green-50..900`, gold accent `--gold-100..600`, warm ink scale `--ink-50..900`, paper background.

---

## Modul Utama

### Manajemen Risiko
1. **Manajemen Risiko** — Risk Register dengan tabs (Risk Profile / RCSA Q1-Q4 / KRI / Fraud / Library):
   - **Risk Profile**: 5×5 Heatmap, Komposisi per Kategori HBar, Toolbar dengan filter chips, DataTable dengan RiskScoreChip (HEX color-coded inherent vs residual)
   - **RCSA**: Per-unit assessment dengan process owner Avatar, effectiveness HBar, period chips Q1-Q4
   - **Fraud**: AI Anomaly Alerts dengan AIGradientBanner + confidence HBar
   - **Risk Library**: Control catalog (Preventif/Deteksi/Korektif) dengan effectiveness tracking
2. **Key Risk Indicator (KRI)** — 8 indikator real-time dengan Sparkline 7-period trend, threshold breach color (green/amber/red), traffic light visual.
3. **Kontrol & Mitigasi** — Control catalog dengan effectiveness slider 0-100, frequency tracking, automated toggle.
4. **Rencana Aksi** — Action Plan tracker dengan progress HBar (red <30 / amber <70 / green ≥70), deadline overdue red highlight, Avatar PIC, sumber Tag (risk/finding).

### Audit Internal
5. **Manajemen Audit** — AuditPlan dengan tabs (Penugasan / Temuan / Tindak Lanjut / Performa Auditor / Administrasi SPI):
   - **Penugasan**: AuditPlan list dengan Lead Auditor Avatar, Progress HBar, Findings count
   - **Audit Detail**: 5-step Stepper (Perencanaan → Lapangan → Pengujian → Pelaporan → Tindak Lanjut), KKA Table, AvatarStack tim audit
   - **Tindak Lanjut**: monthly bar chart Open vs Closed
   - **Performa Auditor**: scorecard dengan SLA HBar + Donut score
   - **Administrasi SPI**: Anggaran HBar + Logistik Aset
6. **Temuan Audit** — AuditFinding tracker dengan severity Badge, Status Badge, target_date overdue red. Detail page punya Update form + Tutup Temuan action + RCA callout (border-left primary).

### Insiden & Loss
7. **Manajemen Insiden** — Channel tabs (Semua / WBS / Gratifikasi / CoI / Helpdesk). Anonymous reporter support. Detail page dengan 5-step Status Stepper (Diterima → Triase → Investigasi → Tindakan → Selesai), Kronologi narrative, Timeline Aktivitas, Tindak Lanjut numbered list.
8. **Loss Event** — KPI strip dengan rose accent untuk Total Loss YTD (mono red `#b8392a`), Distribusi per Basel Kategori, Top 5 Unit Kerja, Recovery Tracker. Detail page punya 3-tile Gross/Recovery/Net + RCA callout.

### Kebijakan & Compliance
9. **Kebijakan & Prosedur** — Policy Lifecycle dengan tabs (Pustaka / Workflow Persetujuan / Sertifikasi):
   - **Pustaka**: full-size **AIGradientBanner** signature feature (linear-gradient green-900→700 + gold sparkles + suggestion chips)
   - **Workflow**: inline MiniStepper di table cell showing 5-step approval position
   - **Sertifikasi**: ISO 37001 (Anti-Bribery) + ISO 37301 (Compliance Management) cards dengan coverage Donut
10. **Regulasi** — Regulation registry dengan jenis Tag (UU=blue, PP=violet, POJK=green, SEBI=amber). Compliance Gap chip (0%=green, ≤15%=amber, >15%=red). Detail page punya 3-tile Compliance Status + Pasal-Pasal Relevan + Action Plan.
11. **Kepatuhan** — 4 sub-modul dengan tabs (Regulatory / AML / QA / Culture):
    - **Regulatory**: 8 regulasi dengan KPI strip
    - **AML**: 4 KPI + Risk Donut Distribution + Compliance Trend SVG
    - **QA**: Quality Assurance scoring per process tested
    - **Culture**: Indeks Budaya Kepatuhan per Kanwil dengan mini Donut + Sparkline trend

### AI Tools (NEW/BETA)
12. **AI Assistant** _(NEW)_ — Full-page 3-column chat: thread sidebar (280px) + chat (fluid) + context panel (320px). User/assistant message bubbles dengan thumbs up/down + copy actions, suggestion chips, model selector, source data toggles (Risk Register / Audit Findings / Policies / Regulations / Incidents). Mock template-based responses keyed off keywords.
13. **AI Document Ingestion** _(BETA)_ — Upload → Extract → Review → Approve flow:
    - Drag-drop upload area dengan target entity selector (Policy/Regulation/Contract/SOP)
    - Mock extraction generates `extracted_json` based on filename keywords
    - Review page dengan editable extracted fields + per-field confidence HBar mini-indicators
    - Approve actually creates real `Policy` / `Regulation` record from edited JSON

### Sistem
14. **Pengaturan** — Section-per-group settings dengan save batching.

---

## Sidebar Count Badges

`HandleInertiaRequests::share()` mengirim `navCounts` dengan live counter:
```
risks       → RiskRegister::count()
audits      → AuditPlan WHERE status != 'completed'
incidents   → Incident WHERE status != 'closed'
policies    → Policy WHERE status = 'active'
regulations → Regulation::count()
```

Badge ditampilkan di sidebar SidebarLink dengan mono styling. Plus `NEW` (gold) dan `BETA` (gold) badge untuk AI Tools.

---

## Authentication

Hybrid: lokal email/password + Portal SSO (OAuth2 authorization_code).

### Default Users (setelah `db:seed`)

| Email | Password | Title | NIP |
|-------|----------|-------|-----|
| `risk.officer@igracias.pegadaian.co.id` | `Password123!` | Risk Officer | 1001001 |
| `auditor@igracias.pegadaian.co.id` | `Password123!` | Auditor Internal | 1001002 |
| `compliance@igracias.pegadaian.co.id` | `Password123!` | Compliance Officer | 1001003 |

---

## Setup

### Prerequisites
- PHP 8.2+, MySQL 8, Node 20+
- Database manual: `igracias_grc_dev`
- Portal app berjalan di `http://localhost:8000` (untuk SSO)

### Install

```bash
git clone https://github.com/pendtiumpraz/pegadaian-iGRaCias.git
cd pegadaian-iGRaCias

composer install --ignore-platform-req=ext-sodium
cp .env.example .env
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force

npm install --legacy-peer-deps
npm run build

php artisan serve --port=8002
```

Set Portal SSO di `.env`:
```
PORTAL_URL=http://localhost:8000
PORTAL_CLIENT_ID=<dari portal>
PORTAL_CLIENT_SECRET=<dari portal>
PORTAL_REDIRECT_URI=http://localhost:8002/auth/portal/callback
```

### Development
```bash
npm run dev          # Vite hot reload
http://localhost:8002/login
```

---

## Domain Model — Tabel Utama

| Tabel | Deskripsi |
|-------|-----------|
| `risk_register` | Risiko korporat dengan inherent + residual L×I, kategori, unit_pemilik, PIC |
| `kri` | Key Risk Indicator dengan threshold green/amber/red + nilai_aktual |
| `controls` | Risk control catalog dengan tipe + effectiveness |
| `action_plans` | Mitigasi plan dengan progress_pct, deadline, sumber (risk/finding) |
| `audit_plans` | Audit penugasan dengan ruang lingkup + tim |
| `audit_findings` | Temuan dengan tingkat_risiko, root_cause, rekomendasi |
| `incidents` | Insiden dengan kategori (operasional/it/sdm/eksternal/wbs/gratifikasi) |
| `loss_events` | Loss dengan Basel kategori + recovery_amount |
| `policies` | Kebijakan dengan versi, tanggal_berlaku, AI Score |
| `regulations` | Regulasi dengan jenis (UU/PP/POJK/SEBI) + compliance_gap |
| `ai_chat_threads` | AI Assistant chat threads |
| `ai_chat_messages` | Messages per thread (user/assistant/system) |
| `ingest_jobs` | AI Document Ingestion jobs dengan extracted_json + confidence |

---

## Reference Design Identity

iGRaCias menggunakan reference design resmi:
- Brand: **emerald/forest green** (`#1f9c72` primary, `#0a3023` darkest, `#eaf6ee` lightest)
- Display font: **Fraunces** serif (semua h1, h2 utama)
- Body: Inter sans
- Numerics: JetBrains Mono
- Shadows tinted with green: `0 8px 32px rgba(10,48,35,.10)`
- Custom BrandMark SVG monogram (forest emerald)

Built dari reference primitives.jsx + dashboard.jsx + risk.jsx + audit.jsx + policy.jsx + incident.jsx + loss.jsx + tools.jsx + ingest.jsx.

---

## Architecture Notes

- **Folder render path**: controller render `Inertia::render('Risk/Index')` → `Pages/Risk/Index.jsx`. Folder Inggris, route prefix Indonesia (`/risiko`, `/insiden`, `/kebijakan`, `/regulasi`, `/rencana-aksi`)
- **MySQL index 64-char limit**: explicit short index names di tabel risk_register
- **Inertia shared**: `auth.user` (id, name, nip, title, unit_id, language, theme), `flash`, `ziggy`, `navCounts`
- **AIGradientBanner** signature: dipakai di Kebijakan/Index (full), Show (compact), Create (compact)
- **Risk score colors** menggunakan reference HEX: `#d6f0e3` green-100, `#fbecd1` amber-100, `#fbe4df` red-100; teks `#0f4a37` green-700, `#7a4f0a` amber-700, `#8b261b` red-700

---

## Related Apps

Bagian dari **Pegadean Compliance Platform**:
- [pegadean-portal](https://github.com/pendtiumpraz/pegadean-portal) — SSO Server + Tenant Admin (port 8000)
- [pegadaian-aml-cft](https://github.com/pendtiumpraz/pegadaian-aml-cft) — APU/PPT AML/CFT (port 8001)
- [pegadean-iDesk](https://github.com/pendtiumpraz/pegadean-iDesk) — Compliance Workspace untuk policy lifecycle (port 8003)

---

## License

Proprietary — PT Pegadaian (Persero). Internal use only.
