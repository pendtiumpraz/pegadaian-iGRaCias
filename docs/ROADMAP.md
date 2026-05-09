# Roadmap — i-GRaCiaS

**Durasi total: 14 bulan**
**Stack: Laravel 12 + Inertia.js + React 18 + PostgreSQL 15**
**Strategi**: Modular rollout — ship satu modul per kuartal, value langsung terasa.

Urutan modul berdasarkan: (1) Dependensi, (2) Pain point tertinggi, (3) Regulatory deadline.

---

## Fase 0 — Preparation (Bulan 0–1)
- Stakeholder workshop: Divisi Kepatuhan, Manajemen Risiko, SPI, HC, Legal
- Gap analysis terhadap legacy apps: BeComply, RCS, APASI, SIMPEL, PERISAI
- Setup Laravel 12 + Inertia.js + React + Stancl/Tenancy
- SSO integration dengan Portal (OAuth2)
- Tim: 1 PM, 2 BA, 6-8 dev, 2 QA, 1 UX

## Fase 1 — Foundation + M5 Policy Stub (Bulan 1–3)
**Goal: platform hidup, auth, audit trail, 1 modul quick-win**
- Core platform: SSO (Portal), RBAC (Spatie Permission), audit trail (Spatie Activity Log)
- Notification system (email + in-app)
- M5 Policy & Procedure stub — reference ke iDesk via internal API
- Design system (Ant Design/Shadcn UI + Tailwind)
- Master data: organisasi, unit kerja, employee (sync HRIS)
- REST API `/api/v1/` parallel
- **Deliverable**: Skeleton hidup, SSO jalan, M5 ter-link ke iDesk

## Fase 2 — M1 Risk Management (Bulan 3–5)
**Goal: Pusat risk register digital**
- RCSA workflow (planning → assessment → review → closing) — Spatie Model States
- BIA & RTA
- Risk Control Library, Risk Profile dashboard (heatmap — Recharts)
- Digital Risk (Third Party, PDP basic)
- Import risk existing dari Excel/legacy
- **Deliverable**: Tim MR & unit kerja hentikan Excel risk register

## Fase 3 — M4 Incident Mgmt (Bulan 5–7)
**Goal: Replace APASI + digitalisasi WBS & CoI**
- WBS — pelaporan anonim, tracking, investigation workflow
- Gratifikasi (ex-APASI) — form intake, decision flow (KPK)
- Conflict of Interest — annual declaration employee (integrasi HRIS)
- Helpdesk & Tiket
- **Deliverable**: APASI di-decommission, 100% employee isi CoI annual

## Fase 4 — M3 Compliance Management (Bulan 6–8)
**Goal: Regulatory inventory & kewajiban pelaporan**
- Regulatory Inventory (OJK, BI, PPATK, internal)
- Mapping regulasi → unit responsible
- Tracking pemenuhan & gap (auto notifikasi jatuh tempo)
- Replace SIMPEL
- Monev Kepatuhan workflow
- **Deliverable**: Dashboard kepatuhan real-time, SIMPEL decommissioned

## Fase 5 — M6 Loss Event + M3 Part 2 (Bulan 8–10)
**Goal: G-Law digital, fraud loss tracking**
- Loss event registry (fraud, bencana, hukum)
- G-Law case tracker (tuntutan hukum, hearing schedule)
- QA Kepatuhan + Budaya Kepatuhan scorecard
- Penilaian Maturitas Kepatuhan, GRC, Tata Kelola
- **Deliverable**: G-Law live, maturitas assessment digital

## Fase 6 — M2 Audit Management (Bulan 9–11)
**Goal: Digital working paper SPI**
- Risk-based audit planning (pull dari M1)
- Digital working paper + evidence vault (S3/MinIO — BYOS ready)
- Finding & remediation tracker
- KPI/SLA Auditor
- **Deliverable**: SPI paperless

## Fase 7 — Analytics & Executive Layer (Bulan 11–13)
**Goal: Integrated GRC view untuk Direksi/Dekom**
- Executive dashboard (KPI + KRI + KCI) — Recharts/ApexCharts
- Analytical Fraud Detection (AI-assisted via API)
- Assessment GCG, Maturitas GRC, CGPI
- Laporan KTKT otomatis
- **Deliverable**: Single-pane-of-glass GRC

## Fase 8 — Legacy Migration & SaaS (Bulan 12–14)
- Replace BeComply, RCS, PERISAI (feature parity achieved)
- Integrasi BRI Group Compliance Hub
- BYODB/BYOS implementation
- Whitelabel branding, custom domain
- Data migration final, legacy shutdown
- **Deliverable**: Semua legacy GRC sunset, SaaS ready

---

## Milestone KPI
| Bulan | KPI |
|---|---|
| 3 | Platform live, M5 linked |
| 5 | RCSA digital, 20+ unit onboarded |
| 7 | 100% employee CoI, APASI decommissioned |
| 8 | SIMPEL decommissioned |
| 10 | Loss event & G-Law live |
| 11 | SPI paperless |
| 13 | Executive GRC dashboard |
| 14 | All legacy sunset, SaaS ready |

## Risiko & Mitigasi
| Risiko | Mitigasi |
|---|---|
| Dependencies IT Architecture | API-first, containerized |
| Data Quality dari legacy | Data governance + validation pipeline |
| High Cost | Modular rollout = pay-as-you-go value |
| More Time/Resources | Quick win APASI/WBS dulu → build trust |
