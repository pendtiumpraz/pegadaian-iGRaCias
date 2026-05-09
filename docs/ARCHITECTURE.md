# App 2 — i-GRaCiaS (Integrated GRC Information System)

## 1. Tujuan
Menjadi **pondasi ekosistem digital** penerapan **GRC terintegrasi** Pegadaian:
- Integrasi data & proses bisnis (keuangan, audit, risiko, legal) → **menghilangkan silo**
- Otomatisasi pengendalian internal → **mitigasi fraud**
- Monitoring risiko real-time → **pengambilan keputusan cepat**
- Memastikan **kepatuhan** terhadap ketentuan

## 2. Prinsip (dari PPT)
- **Principled Performance** — pencapaian dengan integritas & kontrol
- **Strategic Alignment** — selaras strategi
- **Risk Awareness** — tanggap risiko
- **Structure & Oversight** — tata kelola akuntabel
- **Culture & People** — budaya etis
- **Information & Technology** — data mendukung keputusan
- **Integration** — keterpaduan GRC
- **Continual Improvement**

## 3. Tiga Lini (Three Lines Model)
- **First Line** — Unit bisnis (outlet/divisi), identifikasi & kelola risiko
- **Second Line** — Manajemen Risiko & Kepatuhan, metodologi & kebijakan
- **Third Line** — SPI / Audit Internal, independen

## 4. Modul (6 Modul Inti)

### M1 — Risk Management
- RCSA, BIA, RTA, Risk Control Library
- Risk Profile (heatmap, likelihood × impact)
- Analytical Fraud Detection, Digital Risk
- Credit Risk, SMK3, sertifikasi risiko/legal/kepatuhan

### M2 — Audit Management
- Risk-based audit planning (SPI)
- Eksekusi & working paper digital
- Pelaporan hasil audit, monitoring KPI/SLA auditor

### M3 — Compliance Management
- APU-PPT & PPPSPM — *interface dengan AML/CFT app*
- QA Kepatuhan, Monev, Budaya Kepatuhan
- Regulatory Inventory, Mapping, Tracking
- Tata Kelola Terintegrasi

### M4 — Incident Management
- WBS (Whistleblowing System)
- Pelaporan Gratifikasi (APASI)
- Conflict of Interest (CoI)
- Helpdesk & Tiket, pelaporan bencana

### M5 — Policy & Procedure Management
- Penyusunan, persetujuan, review, distribusi kebijakan
- AI-assisted search — *interface dengan iDesk app*

### M6 — Loss Event Management
- Pencatatan kerugian fraud, bencana, tuntutan hukum (G-Law)

## 5. Arsitektur (Laravel 12 + Inertia + React)

```
┌──────────────────────────────────────────────────┐
│         WEB APP (Inertia + React)                 │
│  GRC Dashboard │ Risk │ Audit │ Compliance │ Admin│
└────────────────────┬─────────────────────────────┘
                     │ SSO Token (Portal)
                     ▼
┌──────────────────────────────────────────────────┐
│              LARAVEL APPLICATION                  │
│                                                   │
│  Modules:                                        │
│  ├── M1 Risk (RCSA, BIA, RTA, heatmap)          │
│  ├── M2 Audit (planning, working paper)          │
│  ├── M3 Compliance (regulatory, monitoring)      │
│  ├── M4 Incident (WBS, gratifikasi, CoI)         │
│  ├── M5 Policy (reference ke iDesk via API)      │
│  └── M6 Loss (fraud, bencana, G-Law)             │
│                                                   │
│  Routes: /web (Inertia) + /api/v1 (REST)         │
│  Workflow: Spatie Model States                   │
│  Stancl/Tenancy: multi-DB, BYODB                 │
└──────┬────────────────┬──────────────────────────┘
       │                │
┌──────▼──────┐  ┌──────▼──────┐
│ PostgreSQL  │  │   Redis     │
│ (per tenant)│  │ cache/queue │
└─────────────┘  └─────────────┘
```

**Integrations**: Portal SSO, AML/CFT (compliance signals API), iDesk (policy API), BeComply/RCS/APASI/SIMPEL/PERISAI (legacy migration), HRIS, ERP, BRI Group Hub

## 6. Data Model (ringkas)

### Risk (M1)
- `risk_register(id, unit_id, risk_code, description, likelihood, impact, score, owner, status)`
- `control(id, risk_id, type, effectiveness, test_date, evidence_url)`
- `rcsa_cycle(id, period, unit_id, assessor, status)`

### Audit (M2)
- `audit_plan(id, year, unit_id, risk_basis, auditor_id, start, end)`
- `audit_finding(id, plan_id, severity, recommendation, due_date, status, responsible)`

### Compliance (M3)
- `regulation(id, source, number, title, issued_at, effective_at, gap_status)`
- `compliance_obligation(id, regulation_id, due_type, unit_responsible, last_reported)`

### Incident (M4)
- `incident(id, type[WBS|GRATIFIKASI|COI|BENCANA], severity, reporter, status)`
- `gratifikasi_report(id, receiver, value, origin, decision)`

### Policy (M5)
- Reference ke iDesk app via internal API

### Loss (M6)
- `loss_event(id, category[FRAUD|BENCANA|HUKUM], amount, occurred_at, recovery)`
- `glaw_case(id, counterparty, stage, claim_amount, next_hearing)`

## 7. KPI / KRI / KCI
- **KPI** (Performance) — historis / prediktif
- **KRI** (Risk) — leading / lagging
- **KCI** (Compliance) — thd aturan tertentu

Setiap modul expose metric ke **Executive Dashboard**.

## 8. Non-Functional
| Aspek | Target |
|---|---|
| Concurrent users | 5.000 (internal) |
| Availability | 99.5% |
| Audit trail | Immutable, 10 tahun (Spatie Activity Log) |
| Backup | Daily + weekly offsite |
| Compliance | OJK, SEOJK 29/2022, PDP, ISO 37001/37301 |

## 9. Integrasi
- **Portal** — SSO, tenant config
- **AML/CFT app** — status APU-PPT per nasabah, KRI alert (internal API)
- **iDesk app** — source of truth kebijakan (internal API)
- **Legacy apps** (BeComply, RCS, APASI, SIMPEL, PERISAI) — migrasi bertahap
- **HRIS** — master employee untuk WBS, CoI
- **ERP (G-Law)** — loss event recovery
- **Core Pegadaian** — performance data
- **BRI Group** Integrated Compliance Hub
