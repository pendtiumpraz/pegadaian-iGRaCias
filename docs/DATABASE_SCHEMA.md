# iGRaCiaS GRC — Database Schema

Stack: MySQL (dev) / PostgreSQL (prod)  
Three Lines Model: Business Units (1st) → Risk & Compliance (2nd) → SPI/Audit (3rd)  
Semua tabel ada `deleted_at` (SoftDeletes) kecuali audit_logs.

---

## 1. `organizational_units` — Unit Kerja / Kantor

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
name            VARCHAR(255) NOT NULL               -- "Kanwil II — Jakarta & Banten"
type            ENUM('kantor_pusat','kanwil','kc') NOT NULL
region          VARCHAR(100) NULL
is_active       BOOLEAN DEFAULT TRUE
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```
Data awal: 16 unit (7 Kanwil + 4 KC sampel + 4 KP direktur + 1 KP umum)

---

## 2. `users` — Pengguna

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
portal_user_id  BIGINT UNSIGNED NOT NULL UNIQUE
name            VARCHAR(255) NOT NULL
email           VARCHAR(255) NOT NULL UNIQUE
nip             VARCHAR(30) NULL
title           VARCHAR(255) NULL                   -- "Risk Officer"
unit_id         BIGINT UNSIGNED NULL FK organizational_units
phone           VARCHAR(30) NULL
language        ENUM('id','en') DEFAULT 'id'
timezone        ENUM('WIB','WITA','WIT') DEFAULT 'WIB'
theme           ENUM('light','redup','dark') DEFAULT 'light'
density         ENUM('nyaman','standar','padat') DEFAULT 'standar'
font_size       TINYINT UNSIGNED DEFAULT 100        -- 80–120
avatar_url      VARCHAR(500) NULL
is_active       BOOLEAN DEFAULT TRUE
last_login_at   TIMESTAMP NULL
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```
Roles (Spatie): `risk_officer`, `internal_auditor`, `compliance_officer`, `exec_director`, `superadmin`

---

## 3. `risk_register` — Daftar Risiko

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
risk_code       VARCHAR(20) UNIQUE NOT NULL         -- RSK-2026-NNNN
title           VARCHAR(500) NOT NULL
description     TEXT NULL
unit_id         BIGINT UNSIGNED NOT NULL FK organizational_units
category        ENUM('kredit','pasar','operasional','siber','kepatuhan','hukum','strategis','reputasi','likuiditas') NOT NULL
likelihood      TINYINT UNSIGNED NOT NULL           -- 1–5
impact          TINYINT UNSIGNED NOT NULL           -- 1–5
inherent_score  TINYINT UNSIGNED NOT NULL           -- likelihood × impact (1–25)
inherent_level  ENUM('rendah','sedang','tinggi') NOT NULL
residual_score  TINYINT UNSIGNED NOT NULL
residual_level  ENUM('rendah','sedang','tinggi') NOT NULL
risk_appetite   TINYINT UNSIGNED NULL               -- threshold (e.g. 12)
status          ENUM('aktif','pemantauan','termitigasi') DEFAULT 'aktif'
owner           VARCHAR(255) NULL                   -- nama PIC atau divisi
kri_id          BIGINT UNSIGNED NULL FK kris
reviewed_by     VARCHAR(255) NULL                   -- "Komite Manajemen Risiko"
next_review_date DATE NULL
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```
Indexes: `risk_code`, `unit_id`, `category`, `inherent_score`, `residual_score`, `status`

---

## 4. `controls` — Control Activities (Risk Control Library)

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
control_code    VARCHAR(20) UNIQUE NOT NULL         -- CTRL-XX-NNN
risk_id         BIGINT UNSIGNED NOT NULL FK risk_register
description     TEXT NOT NULL
type            ENUM('preventive','detective') NOT NULL
frequency       ENUM('harian','real_time','setiap_login','semesteran','per_launch') NOT NULL
automated       BOOLEAN DEFAULT FALSE
effectiveness   DECIMAL(3,2) NULL                   -- 1.00–5.00
test_date       DATE NULL
evidence_url    VARCHAR(500) NULL
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 5. `action_plans` — Rencana Mitigasi

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
title           TEXT NOT NULL
owner_id        BIGINT UNSIGNED NULL FK users
deadline        DATE NULL
progress        TINYINT UNSIGNED DEFAULT 0          -- 0–100
status          ENUM('pelaksanaan','aktif','selesai','perencanaan') DEFAULT 'perencanaan'
-- Polymorphic relation ke risk, regulation, loss_event, audit_finding
actionable_type VARCHAR(100) NULL                   -- "risk_register", "regulation", dll.
actionable_id   BIGINT UNSIGNED NULL
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 6. `kris` — Key Risk Indicators

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
kri_code        VARCHAR(20) UNIQUE NOT NULL         -- KRI-CR-001
name            VARCHAR(255) NOT NULL
category        VARCHAR(100) NOT NULL               -- Kredit, Pasar, dll.
current_value   DECIMAL(12,4) NOT NULL
unit            VARCHAR(30) NULL                    -- %, kasus, /bln
threshold       DECIMAL(12,4) NOT NULL
direction       ENUM('lower','higher') NOT NULL     -- lower = bad if above threshold
trend_data      JSON NULL                           -- array 7 values
status          ENUM('tinggi','pemantauan','rendah') DEFAULT 'rendah'  -- computed
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 7. `rcsa_cycles` — Siklus RCSA per Unit

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
unit_id         BIGINT UNSIGNED NOT NULL FK organizational_units
period          VARCHAR(10) NOT NULL                -- "Q2 2026"
period_date     DATE NOT NULL
business_processes JSON NOT NULL                    -- array of process names
process_owner_name  VARCHAR(255) NOT NULL
process_owner_email VARCHAR(255) NOT NULL
risk_count      SMALLINT UNSIGNED DEFAULT 0
control_count   SMALLINT UNSIGNED DEFAULT 0
effectiveness_score DECIMAL(3,2) NULL              -- 1.00–5.00
status          ENUM('pemantauan','pelaporan','pelaksanaan','selesai') DEFAULT 'pelaksanaan'
notes           TEXT NULL
assessor_id     BIGINT UNSIGNED NULL FK users
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 8. `fraud_alerts` — AI Anomaly Detection Alerts

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
alert_code      VARCHAR(20) UNIQUE NOT NULL         -- ANM-NNNNN
title           TEXT NOT NULL
unit_id         BIGINT UNSIGNED NOT NULL FK organizational_units
confidence      TINYINT UNSIGNED NOT NULL           -- 0–100
severity        ENUM('tinggi','sedang','rendah') NOT NULL
detected_at     TIMESTAMP NOT NULL
status          ENUM('investigasi','verifikasi','disetujui') DEFAULT 'investigasi'
model_version   VARCHAR(20) NULL                    -- "v2.4"
is_confirmed_fraud BOOLEAN NULL
notes           TEXT NULL
investigator_id BIGINT UNSIGNED NULL FK users
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 9. `audit_plans` — Penugasan Audit

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
audit_code      VARCHAR(20) UNIQUE NOT NULL         -- AUD-YYYY-NNN
title           VARCHAR(500) NOT NULL
type            ENUM('reguler','tematik','khusus','tindak_lanjut') NOT NULL
period          VARCHAR(10) NOT NULL                -- "Q1 2026"
unit_id         BIGINT UNSIGNED NOT NULL FK organizational_units
lead_auditor_id BIGINT UNSIGNED NOT NULL FK users
start_date      DATE NOT NULL
end_date        DATE NOT NULL
progress        TINYINT UNSIGNED DEFAULT 0          -- 0–100
findings_count  TINYINT UNSIGNED DEFAULT 0          -- cached
risk_level      ENUM('tinggi','sedang','rendah') NOT NULL
status          ENUM('perencanaan','pelaksanaan','pelaporan','selesai') DEFAULT 'perencanaan'
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```
Indexes: `audit_code`, `unit_id`, `status`, `period`

---

## 10. `audit_team_members` — Tim Audit (pivot)

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
audit_plan_id   BIGINT UNSIGNED NOT NULL FK audit_plans
user_id         BIGINT UNSIGNED NOT NULL FK users
role            ENUM('lead_auditor','auditor') DEFAULT 'auditor'
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```
Unique: `(audit_plan_id, user_id)`

---

## 11. `audit_findings` — Temuan Audit

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
finding_code    VARCHAR(20) UNIQUE NOT NULL         -- FND-YY-NNNN
audit_plan_id   BIGINT UNSIGNED NOT NULL FK audit_plans
unit_id         BIGINT UNSIGNED NOT NULL FK organizational_units
description     TEXT NOT NULL
severity        ENUM('tinggi','sedang','rendah') NOT NULL
owner_id        BIGINT UNSIGNED NULL FK users
deadline        DATE NULL
status          ENUM('aktif','pelaksanaan','pemantauan') DEFAULT 'aktif'
recommendation  TEXT NULL
closed_at       TIMESTAMP NULL
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```
Indexes: `finding_code`, `audit_plan_id`, `unit_id`, `severity`, `status`

---

## 12. `working_papers` — Kertas Kerja Audit (KKA)

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
kka_code        VARCHAR(20) UNIQUE NOT NULL         -- KKA-NNN
audit_plan_id   BIGINT UNSIGNED NOT NULL FK audit_plans
title           VARCHAR(500) NOT NULL
reviewer_id     BIGINT UNSIGNED NULL FK users
status          ENUM('selesai','pelaksanaan') DEFAULT 'pelaksanaan'
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 13. `auditor_performances` — Performa Auditor (cached/computed)

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
user_id         BIGINT UNSIGNED NOT NULL FK users
role            ENUM('senior_auditor','auditor','junior_auditor') NOT NULL
assignment_count SMALLINT UNSIGNED DEFAULT 0
on_time_pct     TINYINT UNSIGNED DEFAULT 0          -- 0–100
quality_score   DECIMAL(3,2) NULL                   -- 1.00–5.00
findings_count  SMALLINT UNSIGNED DEFAULT 0
cpe_hours       SMALLINT UNSIGNED DEFAULT 0
period          VARCHAR(10) NOT NULL                -- "2026"
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 14. `spi_budgets` — Anggaran SPI

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
year            YEAR NOT NULL
item            VARCHAR(255) NOT NULL               -- "Honor Auditor Eksternal"
target          BIGINT NOT NULL                     -- IDR
realization     BIGINT DEFAULT 0
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 15. `regulations` — Regulasi Eksternal

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
reg_code        VARCHAR(50) UNIQUE NOT NULL         -- "POJK 12/2021"
name            TEXT NOT NULL
issuer          ENUM('ojk','bi','pemerintah','kemenkeu') NOT NULL
effective_date  DATE NOT NULL
owner_div       VARCHAR(255) NULL
gap_count       TINYINT UNSIGNED DEFAULT 0          -- cached open gap count
status          ENUM('patuh','gap_analisis','implementasi','akan_berlaku') DEFAULT 'gap_analisis'
page_count      SMALLINT UNSIGNED NULL
max_penalty     VARCHAR(255) NULL                   -- "Rp 500 juta / pencabutan izin"
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 16. `regulation_obligations` — Kewajiban per Pasal

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
regulation_id   BIGINT UNSIGNED NOT NULL FK regulations
article         VARCHAR(100) NOT NULL               -- "Pasal 3"
description     TEXT NOT NULL
pic_id          BIGINT UNSIGNED NULL FK users
status          ENUM('patuh','gap') DEFAULT 'gap'
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 17. `policies` — Kebijakan & Prosedur Internal

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
policy_code     VARCHAR(50) UNIQUE NOT NULL         -- "KU-001/KP/2025"
name            TEXT NOT NULL
type            ENUM('kebijakan_umum','pedoman','juklak','juknis') NOT NULL
owner_div       VARCHAR(255) NOT NULL
version         VARCHAR(10) DEFAULT 'v1.0'
effective_date  DATE NULL
next_review_date DATE NULL
status          ENUM('aktif','review','draft','arsip') DEFAULT 'draft'
page_count      SMALLINT UNSIGNED NULL
acknowledged_count INT UNSIGNED DEFAULT 0
file_path       VARCHAR(500) NULL
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```
Indexes: `policy_code`, `type`, `status`, `owner_div`

---

## 18. `policy_versions` — Riwayat Versi Kebijakan

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
policy_id       BIGINT UNSIGNED NOT NULL FK policies
version         VARCHAR(10) NOT NULL                -- "v1.0", "v2.0"
effective_date  DATE NOT NULL
change_summary  TEXT NULL
author_id       BIGINT UNSIGNED NULL FK users
status          ENUM('aktif','arsip') DEFAULT 'aktif'
file_path       VARCHAR(500) NULL
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 19. `approval_workflows` — Workflow Persetujuan Kebijakan

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
workflow_code   VARCHAR(20) UNIQUE NOT NULL         -- WF-2026-NNN
policy_id       BIGINT UNSIGNED NOT NULL FK policies
current_step    TINYINT UNSIGNED DEFAULT 1
total_steps     TINYINT UNSIGNED NOT NULL
current_approver VARCHAR(255) NULL
status          ENUM('pending','approved','rejected') DEFAULT 'pending'
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 20. `certifications` — Sertifikasi Organisasi (ISO, dll.)

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
name            VARCHAR(100) NOT NULL               -- "ISO 37001:2016"
subtitle        TEXT NULL
valid_from      DATE NULL
valid_until     DATE NULL
next_audit_date DATE NULL
certifying_body VARCHAR(255) NULL                   -- "Bureau Veritas"
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 21. `incidents` — Manajemen Insiden (WBS, Gratifikasi, CoI, Helpdesk)

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
incident_code   VARCHAR(25) UNIQUE NOT NULL         -- WBS-2026-NNNN, GRT-YYYY-NNNN, dll.
title           VARCHAR(500) NOT NULL
channel         ENUM('wbs','gratifikasi','coi','helpdesk') NOT NULL
unit_id         BIGINT UNSIGNED NOT NULL FK organizational_units
anonymous       BOOLEAN DEFAULT FALSE
reporter_name   VARCHAR(255) NULL                   -- null jika anon
reporter_email_nip VARCHAR(255) NULL
occurrence_date DATE NOT NULL
description     TEXT NOT NULL
severity        ENUM('krisis','tinggi','sedang','rendah') NOT NULL
status          ENUM('investigasi','verifikasi','disetujui','selesai') DEFAULT 'investigasi'
investigator_id BIGINT UNSIGNED NULL FK users
closed_at       TIMESTAMP NULL
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```
Indexes: `incident_code`, `channel`, `severity`, `status`, `unit_id`

---

## 22. `incident_timelines` — Riwayat Kejadian Insiden

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
incident_id     BIGINT UNSIGNED NOT NULL FK incidents
actor           VARCHAR(255) NULL                   -- nama atau "Sistem"
action          TEXT NOT NULL
icon_type       VARCHAR(50) DEFAULT 'bell'
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 23. `incident_recommendations` — Tindak Lanjut Insiden

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
incident_id     BIGINT UNSIGNED NOT NULL FK incidents
title           TEXT NOT NULL
owner_div       VARCHAR(255) NULL
deadline        DATE NULL
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 24. `incident_attachments` — Lampiran Bukti Insiden

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
incident_id     BIGINT UNSIGNED NOT NULL FK incidents
file_path       VARCHAR(500) NOT NULL
file_name       VARCHAR(255) NOT NULL
file_size       INT UNSIGNED NULL
uploaded_by     BIGINT UNSIGNED NULL FK users
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 25. `loss_events` — Loss Event (Basel II)

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
loss_code       VARCHAR(20) UNIQUE NOT NULL         -- LE-YYYY-NNNN
category        ENUM(
                  'internal_fraud','external_fraud','employment_practices',
                  'clients_products','damage_physical_assets',
                  'business_disruption','execution_delivery'
                ) NOT NULL
description     TEXT NOT NULL
unit_id         BIGINT UNSIGNED NOT NULL FK organizational_units
occurred_at     DATE NOT NULL
discovered_at   DATE NOT NULL
gross_loss      BIGINT NOT NULL                     -- IDR
recovery_amount BIGINT DEFAULT 0
net_loss        BIGINT GENERATED ALWAYS AS (gross_loss - recovery_amount) STORED
status          ENUM('recovery','litigasi','klaim_asuransi','tutup') DEFAULT 'recovery'
risk_id         BIGINT UNSIGNED NULL FK risk_register
root_cause      TEXT NULL
reported_to     VARCHAR(255) NULL                   -- "Komite MR · 1×24 jam"
basel_code      VARCHAR(50) NULL                    -- "EL-2 Internal Fraud"
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```
Note: MySQL 5.7+ supports generated columns; Laravel dapat set computed di model jika tidak.  
Indexes: `loss_code`, `category`, `status`, `unit_id`, `occurred_at`

---

## 26. `loss_recoveries` — Riwayat Recovery Loss

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
loss_event_id   BIGINT UNSIGNED NOT NULL FK loss_events
recovery_date   DATE NOT NULL
source          TEXT NOT NULL                       -- "Asuransi Jasindo"
amount          BIGINT NOT NULL
status          ENUM('diterima','proses','estimasi') DEFAULT 'estimasi'
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 27. `ai_ingestion_sessions` — Sesi AI Ingestion

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
session_code    VARCHAR(20) UNIQUE NOT NULL         -- ING-YYYY-NNNN
actor_id        BIGINT UNSIGNED NOT NULL FK users
schema_type     ENUM('policy','regulation','risk') NOT NULL
target_table    VARCHAR(100) NOT NULL               -- "POLICIES", "REGS", "RISKS"
files_json      JSON NULL                           -- daftar file yang diupload
extracted_records INT UNSIGNED DEFAULT 0
avg_confidence  DECIMAL(5,2) NULL                  -- 0.00–100.00
status          ENUM('ter_commit','review','ditolak') DEFAULT 'review'
ai_model        VARCHAR(100) NULL
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 28. `notifications`

```sql
id              CHAR(36) PRIMARY KEY
user_id         BIGINT UNSIGNED NOT NULL FK users
type            ENUM('risk','audit','compliance','incident','policy','system') NOT NULL
title           VARCHAR(500) NOT NULL
sub             VARCHAR(500) NULL
is_read         BOOLEAN DEFAULT FALSE
read_at         TIMESTAMP NULL
action_url      VARCHAR(500) NULL
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 29. `user_notification_settings` — Preferensi Notifikasi

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
user_id         BIGINT UNSIGNED NOT NULL FK users
email_digest    BOOLEAN DEFAULT TRUE
push_notif      BOOLEAN DEFAULT TRUE
sms_kritis      BOOLEAN DEFAULT FALSE
approval_notif  BOOLEAN DEFAULT TRUE
regulasi_baru   BOOLEAN DEFAULT TRUE
reminder_rcsa_audit BOOLEAN DEFAULT TRUE
mention_komentar BOOLEAN DEFAULT TRUE
quiet_from      TIME NULL                           -- "22:00"
quiet_to        TIME NULL                           -- "07:00"
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```
Unique: `user_id`

---

## 30. `system_integrations` — Integrasi Sistem

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
name            VARCHAR(100) UNIQUE NOT NULL        -- "Active Directory", dll.
description     TEXT NULL
status          ENUM('connected','limited','available') DEFAULT 'available'
last_sync_at    TIMESTAMP NULL
config_json     JSON NULL
deleted_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 31. `audit_logs` (immutable)

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
actor_id        BIGINT UNSIGNED NULL FK users
actor_type      ENUM('user','system') DEFAULT 'user'
action          VARCHAR(500) NOT NULL
entity_type     VARCHAR(100) NULL
entity_id       VARCHAR(100) NULL
metadata_json   JSON NULL
ip_address      VARCHAR(45) NULL
created_at      TIMESTAMP
```

---

## 32. `system_settings`

```sql
id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
key             VARCHAR(255) UNIQUE NOT NULL
value           TEXT NULL
type            ENUM('string','boolean','integer','json') DEFAULT 'string'
group           VARCHAR(100) NULL
description     TEXT NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## Diagram Relasi (Ringkas)

```
organizational_units ──< risk_register (many)
organizational_units ──< audit_plans (many)
organizational_units ──< incidents (many)
organizational_units ──< loss_events (many)
organizational_units ──< rcsa_cycles (many)

risk_register ──< controls (many)
risk_register ──< action_plans (polymorphic)
risk_register >── kris (1 KRI per risiko)
risk_register >── loss_events (optional link)
risk_register >── fraud_alerts (implied)

audit_plans ──< audit_team_members (pivot → users)
audit_plans ──< audit_findings (many)
audit_plans ──< working_papers (many)
audit_findings ──< action_plans (polymorphic)

regulations ──< regulation_obligations (many)
regulations ──< action_plans (polymorphic, via gap)

policies ──< policy_versions (many)
policies ──< approval_workflows (many)

incidents ──< incident_timelines (many)
incidents ──< incident_recommendations (many)
incidents ──< incident_attachments (many)

loss_events ──< loss_recoveries (many)
loss_events ──< action_plans (polymorphic)

ai_ingestion_sessions >── users (actor)
```

---

## Soft Delete & Trash Policy

| Table | Soft Delete | Trash | Restore | Hard Delete |
|---|---|---|---|---|
| risk_register | ✓ | ✓ | ✓ | ✓ |
| controls | ✓ | ✓ | ✓ | ✓ |
| action_plans | ✓ | ✓ | ✓ | ✓ |
| kris | ✓ | ✓ | ✓ | ✓ |
| rcsa_cycles | ✓ | ✓ | ✓ | ✓ |
| fraud_alerts | ✓ | ✓ | ✓ | ✓ |
| audit_plans | ✓ | ✓ | ✓ | ✓ |
| audit_findings | ✓ | ✓ | ✓ | ✓ |
| working_papers | ✓ | ✓ | ✓ | ✓ |
| regulations | ✓ | ✓ | ✓ | ✓ |
| policies | ✓ | ✓ | ✓ | ✓ |
| incidents | ✓ | ✓ | ✓ | ✓ |
| loss_events | ✓ | ✓ | ✓ | ✓ |
| users | ✓ | ✓ | ✓ | ✓ (super admin) |
| audit_logs | ✗ | ✗ | ✗ | ✗ (immutable) |
