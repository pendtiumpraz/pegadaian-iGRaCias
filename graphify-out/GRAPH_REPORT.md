# Graph Report - .  (2026-06-05)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1138 nodes · 1368 edges · 145 communities (124 shown, 21 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c1fe8f31`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_GRC Platform Core|GRC Platform Core]]
- [[_COMMUNITY_PHP Dependencies|PHP Dependencies]]
- [[_COMMUNITY_Risk Register Management|Risk Register Management]]
- [[_COMMUNITY_Audit Finding UI|Audit Finding UI]]
- [[_COMMUNITY_Authentication|Authentication]]
- [[_COMMUNITY_Audit Plan CRUD|Audit Plan CRUD]]
- [[_COMMUNITY_Policy & Ingestion|Policy & Ingestion]]
- [[_COMMUNITY_Audit Admin UI|Audit Admin UI]]
- [[_COMMUNITY_User & Team Models|User & Team Models]]
- [[_COMMUNITY_System Settings|System Settings]]
- [[_COMMUNITY_Frontend Dependencies|Frontend Dependencies]]
- [[_COMMUNITY_Fraud Management UI|Fraud Management UI]]
- [[_COMMUNITY_Risk CreateEdit UI|Risk Create/Edit UI]]
- [[_COMMUNITY_Control Form UI|Control Form UI]]
- [[_COMMUNITY_Regulation Controller|Regulation Controller]]
- [[_COMMUNITY_KRI CreateEdit UI|KRI Create/Edit UI]]
- [[_COMMUNITY_Certification UI|Certification UI]]
- [[_COMMUNITY_Certification & Ingestion Models|Certification & Ingestion Models]]
- [[_COMMUNITY_Policy Edit UI|Policy Edit UI]]
- [[_COMMUNITY_Audit Log & Controls|Audit Log & Controls]]
- [[_COMMUNITY_Incident Show UI|Incident Show UI]]
- [[_COMMUNITY_Policy Create UI|Policy Create UI]]
- [[_COMMUNITY_Budget Create UI|Budget Create UI]]
- [[_COMMUNITY_Budget Edit UI|Budget Edit UI]]
- [[_COMMUNITY_Budget Listing UI|Budget Listing UI]]
- [[_COMMUNITY_Action Plan & KRI Models|Action Plan & KRI Models]]
- [[_COMMUNITY_AI Assistant UI|AI Assistant UI]]
- [[_COMMUNITY_Audit Finding CRUD|Audit Finding CRUD]]
- [[_COMMUNITY_Audit Show UI|Audit Show UI]]
- [[_COMMUNITY_App Layout & Navigation|App Layout & Navigation]]
- [[_COMMUNITY_Regulation Listing UI|Regulation Listing UI]]
- [[_COMMUNITY_KRI Listing UI|KRI Listing UI]]
- [[_COMMUNITY_Audit Plan Model|Audit Plan Model]]
- [[_COMMUNITY_Regulation Create UI|Regulation Create UI]]
- [[_COMMUNITY_Regulation Edit UI|Regulation Edit UI]]
- [[_COMMUNITY_AI Chat Controller|AI Chat Controller]]
- [[_COMMUNITY_Control Listing UI|Control Listing UI]]
- [[_COMMUNITY_Ingestion Show UI|Ingestion Show UI]]
- [[_COMMUNITY_Loss Event Show UI|Loss Event Show UI]]
- [[_COMMUNITY_Settings UI|Settings UI]]
- [[_COMMUNITY_Control CRUD|Control CRUD]]
- [[_COMMUNITY_KRI Show UI|KRI Show UI]]
- [[_COMMUNITY_Regulation Show UI|Regulation Show UI]]
- [[_COMMUNITY_Action Plan Listing UI|Action Plan Listing UI]]
- [[_COMMUNITY_PHPUnit Tests|PHPUnit Tests]]
- [[_COMMUNITY_Incident Model|Incident Model]]
- [[_COMMUNITY_Policy Show UI|Policy Show UI]]
- [[_COMMUNITY_Action Plan Show UI|Action Plan Show UI]]
- [[_COMMUNITY_Ingestion Listing UI|Ingestion Listing UI]]
- [[_COMMUNITY_Approval Workflow Model|Approval Workflow Model]]
- [[_COMMUNITY_Risk Register Model|Risk Register Model]]
- [[_COMMUNITY_Risk Show UI|Risk Show UI]]
- [[_COMMUNITY_AML Compliance UI|AML Compliance UI]]
- [[_COMMUNITY_Compliance Index UI|Compliance Index UI]]
- [[_COMMUNITY_Avatar Components|Avatar Components]]
- [[_COMMUNITY_Heatmap Component|Heatmap Component]]
- [[_COMMUNITY_Tag & Toolbar Components|Tag & Toolbar Components]]
- [[_COMMUNITY_User Factory|User Factory]]
- [[_COMMUNITY_Loss Event Model|Loss Event Model]]
- [[_COMMUNITY_AI Ingestion Session|AI Ingestion Session]]
- [[_COMMUNITY_Badge Component|Badge Component]]
- [[_COMMUNITY_Notification Model|Notification Model]]
- [[_COMMUNITY_Ingestion Create UI|Ingestion Create UI]]
- [[_COMMUNITY_Fraud Alert Model|Fraud Alert Model]]
- [[_COMMUNITY_Portal Token Auth|Portal Token Auth]]
- [[_COMMUNITY_Compliance Culture UI|Compliance Culture UI]]
- [[_COMMUNITY_Compliance QA UI|Compliance QA UI]]
- [[_COMMUNITY_AI Chat Thread Model|AI Chat Thread Model]]
- [[_COMMUNITY_App Service Provider|App Service Provider]]
- [[_COMMUNITY_AI Card Component|AI Card Component]]
- [[_COMMUNITY_Toggle Component|Toggle Component]]
- [[_COMMUNITY_Robots.txt|Robots.txt]]

## God Nodes (most connected - your core abstractions)
1. `User` - 22 edges
2. `RiskRegister` - 21 edges
3. `Controller` - 18 edges
4. `iGRaCias Platform` - 15 edges
5. `AuditPlan` - 12 edges
6. `Incident` - 12 edges
7. `PolicyController` - 12 edges
8. `Policy` - 12 edges
9. `AuditFinding` - 11 edges
10. `Incident` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Tech Stack (Laravel/Inertia/React)` --semantically_similar_to--> `Laravel 12 + Inertia + React Stack`  [INFERRED] [semantically similar]
  README.md → docs/TECH_RECOMMENDATIONS.md
- `5x5 Risk Heatmap Logic` --shares_data_with--> `RiskRegister`  [EXTRACTED]
  docs/BACKEND_PLAN.md → app/Http/Controllers/RiskRegisterController.php
- `controls table` --references--> `RiskRegister`  [EXTRACTED]
  docs/DATABASE_SCHEMA.md → app/Http/Controllers/RiskRegisterController.php
- `RiskRegister` --references--> `kris table`  [EXTRACTED]
  app/Http/Controllers/RiskRegisterController.php → docs/DATABASE_SCHEMA.md
- `iGRaCias Platform` --semantically_similar_to--> `GRC Integrated System`  [INFERRED] [semantically similar]
  README.md → docs/ARCHITECTURE.md

## Import Cycles
- None detected.

## Communities (145 total, 21 thin omitted)

### Community 0 - "GRC Platform Core"
Cohesion: 0.05
Nodes (48): GRC Integrated System, KPI/KRI/KCI Metrics, M1 Risk Management, M2 Audit Management, M3 Compliance Management, M4 Incident Management, M5 Policy Management, M6 Loss Event (+40 more)

### Community 1 - "PHP Dependencies"
Cohesion: 0.05
Nodes (41): pestphp/pest-plugin, php-http/discovery, config, allow-plugins, optimize-autoloader, preferred-install, sort-packages, description (+33 more)

### Community 2 - "Risk Register Management"
Cohesion: 0.09
Nodes (22): Request, Request, Loss Escalation Service, 5x5 Risk Heatmap Logic, Eloquent Models, action_plans table, audit_findings table, audit_plans table (+14 more)

### Community 3 - "Audit Finding UI"
Cohesion: 0.06
Nodes (28): btnSecondary, btnSmall, btnSmallDanger, cardBase, SEVERITY_OPTIONS, STATUS_OPTIONS, btnDanger, btnPrimary (+20 more)

### Community 4 - "Authentication"
Cohesion: 0.10
Nodes (9): ActionPlan, Request, Request, Request, Request, LoginController, Controller, KriController (+1 more)

### Community 5 - "Audit Plan CRUD"
Cohesion: 0.10
Nodes (4): Request, Request, AuditPlan, Incident

### Community 6 - "Policy & Ingestion"
Cohesion: 0.14
Nodes (6): Request, Request, IngestController, PolicyController, IngestJob, Policy

### Community 7 - "Audit Admin UI"
Cohesion: 0.08
Nodes (16): ANGGARAN_ITEMS, btnDanger, btnPrimary, btnSecondary, btnSmall, cardBase, filterSelect, FOLLOWUP_MONTHS (+8 more)

### Community 9 - "System Settings"
Cohesion: 0.11
Nodes (9): Request, autoload, psr-4, App\\, Database\\Factories\\, Tests\\, SystemSetting, Seeder (+1 more)

### Community 10 - "Frontend Dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @inertiajs/react, lucide-react, react, react-dom, ziggy-js, devDependencies, axios (+12 more)

### Community 11 - "Fraud Management UI"
Cohesion: 0.10
Nodes (13): btnDanger, btnPrimary, btnSecondary, btnSmall, cardBase, FRAUD_ROWS, KATEGORI_COLOR, KATEGORI_OPTIONS (+5 more)

### Community 12 - "Risk Create/Edit UI"
Cohesion: 0.11
Nodes (14): btnPrimary, btnSecondary, cardBase, btnPrimary, btnSecondary, cardBase, chipStyle(), errorStyle (+6 more)

### Community 13 - "Control Form UI"
Cohesion: 0.11
Nodes (12): errorStyle, FREQUENCY_OPTIONS, inputStyle, labelStyle, monoInputStyle, TYPE_OPTIONS, btnPrimary, btnSecondary (+4 more)

### Community 14 - "Regulation Controller"
Cohesion: 0.21
Nodes (4): Request, Request, Middleware, Regulation

### Community 15 - "KRI Create/Edit UI"
Cohesion: 0.12
Nodes (10): btnPrimary, btnSecondary, cardBase, btnPrimary, btnSecondary, cardBase, errorStyle, inputStyle (+2 more)

### Community 16 - "Certification UI"
Cohesion: 0.12
Nodes (12): AI_CHIPS, btnDanger, btnPrimary, btnSecondary, btnSmall, cardStyle, CERT_HISTORY, CERTS (+4 more)

### Community 17 - "Certification & Ingestion Models"
Cohesion: 0.14
Nodes (3): Certification, IngestJob, SoftDeletes

### Community 18 - "Policy Edit UI"
Cohesion: 0.12
Nodes (12): AI_CHIPS, btnPrimary, btnSecondary, btnSmall, cardStyle, DIVISI_OPTIONS, errorStyle, inputStyle (+4 more)

### Community 19 - "Audit Log & Controls"
Cohesion: 0.16
Nodes (4): HasFactory, Control, Regulation, SpiBudget

### Community 20 - "Incident Show UI"
Cohesion: 0.15
Nodes (13): btnPrimary, btnSecondary, cardHeader, cardPadless, cardStyle, formatDateMono(), formatIDR(), INCIDENT_STEPS (+5 more)

### Community 21 - "Policy Create UI"
Cohesion: 0.13
Nodes (11): AI_CHIPS, btnPrimary, btnSecondary, cardStyle, DIVISI_OPTIONS, errorStyle, inputStyle, KATEGORI_OPTIONS (+3 more)

### Community 22 - "Budget Create UI"
Cohesion: 0.14
Nodes (11): AI_CHIPS, btnPrimary, btnSecondary, cardStyle, CURRENCY_OPTIONS, errorStyle, inputMonoStyle, inputStyle (+3 more)

### Community 23 - "Budget Edit UI"
Cohesion: 0.14
Nodes (11): AI_CHIPS, btnPrimary, btnSecondary, cardStyle, CURRENCY_OPTIONS, errorStyle, inputMonoStyle, inputStyle (+3 more)

### Community 24 - "Budget Listing UI"
Cohesion: 0.15
Nodes (11): BASEL_KATEGORI_LABEL, btnDanger, btnPrimary, btnSecondary, btnSmall, cardStyle, filterSelect, formatIDRShort() (+3 more)

### Community 25 - "Action Plan & KRI Models"
Cohesion: 0.18
Nodes (4): Model, ActionPlan, Kri, RcsaCycle

### Community 26 - "AI Assistant UI"
Cohesion: 0.17
Nodes (6): DATA_SOURCES, MessageBubble(), miniBtn, MODEL_OPTIONS, renderRichText(), SUGGESTIONS

### Community 27 - "Audit Finding CRUD"
Cohesion: 0.24
Nodes (3): Request, AuditFinding, AuditFinding

### Community 28 - "Audit Show UI"
Cohesion: 0.17
Nodes (11): AUDIT_STEPS, AuditShow(), btnPrimary, btnSecondary, btnSmall, cardHeader, cardPadless, cardStyle (+3 more)

### Community 29 - "App Layout & Navigation"
Cohesion: 0.17
Nodes (4): isRouteActive(), PRIMARY_NAV, SidebarLink(), TOOLS_NAV

### Community 30 - "Regulation Listing UI"
Cohesion: 0.15
Nodes (10): btnDanger, btnPrimary, btnSecondary, btnSmall, cardStyle, JENIS_LABEL, JENIS_OPTIONS, JENIS_TONE (+2 more)

### Community 31 - "KRI Listing UI"
Cohesion: 0.17
Nodes (9): btnDanger, btnPrimary, btnSecondary, btnSmall, cardBase, PERIODE_OPTIONS, STATUS_BADGE_LABEL, STATUS_BREACH_COLOR (+1 more)

### Community 33 - "Regulation Create UI"
Cohesion: 0.17
Nodes (9): btnPrimary, btnSecondary, cardStyle, errorStyle, inputStyle, JENIS_OPTIONS, labelStyle, monoInputStyle (+1 more)

### Community 34 - "Regulation Edit UI"
Cohesion: 0.17
Nodes (9): btnPrimary, btnSecondary, cardStyle, errorStyle, inputStyle, JENIS_OPTIONS, labelStyle, monoInputStyle (+1 more)

### Community 36 - "Control Listing UI"
Cohesion: 0.18
Nodes (7): btnDanger, btnPrimary, btnSecondary, btnSmall, cardBase, SAMPLE_ROWS, TYPE_OPTIONS

### Community 37 - "Ingestion Show UI"
Cohesion: 0.22
Nodes (10): btnDanger, btnPrimary, btnSecondary, confColor(), Field(), formatBytes(), IngestShow(), inputBase (+2 more)

### Community 38 - "Loss Event Show UI"
Cohesion: 0.22
Nodes (9): BASEL_KATEGORI_LABEL, btnPrimary, btnSecondary, cardHeader, cardPadless, cardStyle, formatDateMono(), formatIDR() (+1 more)

### Community 39 - "Settings UI"
Cohesion: 0.20
Nodes (8): asBoolean(), btnPrimary, cardStyle, hintStyle, inputStyle, labelStyle, monoInputStyle, SettingField()

### Community 40 - "Control CRUD"
Cohesion: 0.36
Nodes (3): Request, Control, ControlController

### Community 41 - "KRI Show UI"
Cohesion: 0.22
Nodes (8): btnPrimary, btnSecondary, cardBase, formatDate(), KriShow(), STATUS_COLOR, STATUS_LABEL, STATUS_TONE

### Community 42 - "Regulation Show UI"
Cohesion: 0.22
Nodes (8): btnPrimary, btnSecondary, cardStyle, cardStyleNoPad, formatDateMono(), JENIS_LABEL, JENIS_TONE, RegulasiShow()

### Community 43 - "Action Plan Listing UI"
Cohesion: 0.22
Nodes (5): btnPrimary, btnSmall, cardBase, STATUS_OPTIONS, SUMBER_OPTIONS

### Community 44 - "PHPUnit Tests"
Cohesion: 0.28
Nodes (4): BaseTestCase, ExampleTest, TestCase, ExampleTest

### Community 46 - "Policy Show UI"
Cohesion: 0.25
Nodes (7): btnPrimary, btnSecondary, btnSmall, cardStyle, cardStyleNoPad, formatDateMono(), KebijakanShow()

### Community 47 - "Action Plan Show UI"
Cohesion: 0.36
Nodes (7): btnPrimary, btnSecondary, cardBase, formatDate(), formatDateTime(), progressColor(), RencanaAksiShow()

### Community 48 - "Ingestion Listing UI"
Cohesion: 0.25
Nodes (4): btnPrimary, btnSmall, STATUS_TONE, TYPE_LABEL

### Community 51 - "Risk Show UI"
Cohesion: 0.33
Nodes (5): btnPrimary, btnSecondary, cardBase, formatDate(), RisikoShow()

### Community 52 - "AML Compliance UI"
Cohesion: 0.33
Nodes (3): btnSmall, cardStyle, TABS

### Community 53 - "Compliance Index UI"
Cohesion: 0.33
Nodes (4): btnPrimary, btnSecondary, cardStyle, TABS

### Community 54 - "Avatar Components"
Cohesion: 0.40
Nodes (3): Avatar(), hashColor(), PALETTE

### Community 58 - "User Factory"
Cohesion: 0.47
Nodes (3): UserFactory, Factory, static

### Community 63 - "Ingestion Create UI"
Cohesion: 0.40
Nodes (3): btnPrimary, btnSecondary, TYPES

## Knowledge Gaps
- **375 isolated node(s):** `$schema`, `name`, `type`, `description`, `keywords` (+370 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `RiskRegister` connect `Risk Register Management` to `Control CRUD`, `Action Plan & KRI Models`, `Authentication`, `Regulation Controller`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `Controller` connect `Authentication` to `Risk Register Management`, `AI Chat Controller`, `Audit Plan CRUD`, `Policy & Ingestion`, `Control CRUD`, `System Settings`, `Regulation Controller`, `Audit Finding CRUD`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `Eloquent Models` connect `Risk Register Management` to `GRC Platform Core`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `$schema`, `name`, `type` to the rest of the system?**
  _375 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `GRC Platform Core` be split into smaller, more focused modules?**
  _Cohesion score 0.0549645390070922 - nodes in this community are weakly interconnected._
- **Should `PHP Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Should `Risk Register Management` be split into smaller, more focused modules?**
  _Cohesion score 0.09041835357624832 - nodes in this community are weakly interconnected._