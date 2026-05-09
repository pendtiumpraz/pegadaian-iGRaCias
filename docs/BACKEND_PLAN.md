# iGRaCiaS GRC — Backend Implementation Plan

Stack: Laravel 12 + Inertia.js + React 18 + MySQL (dev) / PostgreSQL (prod)  
Port dev: `http://localhost:8002`  
Auth: SSO via Portal OAuth2

---

## 1. Composer Packages

```json
{
  "require": {
    "inertiajs/inertia-laravel": "^3.1",
    "spatie/laravel-permission": "^6.0",
    "spatie/laravel-activitylog": "^4.0",
    "spatie/laravel-data": "^4.0",
    "maatwebsite/excel": "^3.1",
    "barryvdh/laravel-dompdf": "^3.0",
    "guzzlehttp/guzzle": "^7.0"
  }
}
```

---

## 2. Eloquent Models

| Model | Traits | Key Relations |
|---|---|---|
| `OrganizationalUnit` | SoftDeletes | hasMany(RiskRegister), hasMany(AuditPlan), hasMany(Incident), hasMany(LossEvent), hasMany(RcsaCycle) |
| `User` | SoftDeletes, HasFactory | belongsTo(OrganizationalUnit), hasMany(ActionPlan), hasMany(AuditTeamMember) |
| `RiskRegister` | SoftDeletes, HasFactory, LogsActivity | belongsTo(OrganizationalUnit), hasMany(Control), hasMany(ActionPlan, 'actionable'), belongsTo(Kri) |
| `Control` | SoftDeletes | belongsTo(RiskRegister) |
| `ActionPlan` | SoftDeletes | belongsTo(User, 'owner_id'), morphTo('actionable') |
| `Kri` | SoftDeletes | hasOne(RiskRegister) |
| `RcsaCycle` | SoftDeletes | belongsTo(OrganizationalUnit), belongsTo(User, 'assessor_id') |
| `FraudAlert` | SoftDeletes | belongsTo(OrganizationalUnit), belongsTo(User, 'investigator_id') |
| `AuditPlan` | SoftDeletes, HasFactory, LogsActivity | belongsTo(OrganizationalUnit), belongsTo(User, 'lead_auditor_id'), hasMany(AuditFinding), hasMany(WorkingPaper), belongsToMany(User, 'audit_team_members') |
| `AuditTeamMember` | SoftDeletes | belongsTo(AuditPlan), belongsTo(User) |
| `AuditFinding` | SoftDeletes | belongsTo(AuditPlan), belongsTo(User, 'owner_id'), hasMany(ActionPlan, 'actionable') |
| `WorkingPaper` | SoftDeletes | belongsTo(AuditPlan) |
| `Regulation` | SoftDeletes, HasFactory | hasMany(RegulationObligation), hasMany(ActionPlan, 'actionable') |
| `RegulationObligation` | SoftDeletes | belongsTo(Regulation), belongsTo(User, 'pic_id') |
| `Policy` | SoftDeletes, HasFactory | hasMany(PolicyVersion), hasMany(ApprovalWorkflow) |
| `PolicyVersion` | SoftDeletes | belongsTo(Policy), belongsTo(User, 'author_id') |
| `ApprovalWorkflow` | SoftDeletes | belongsTo(Policy) |
| `Incident` | SoftDeletes, HasFactory, LogsActivity | belongsTo(OrganizationalUnit), belongsTo(User, 'investigator_id'), hasMany(IncidentTimeline), hasMany(IncidentRecommendation), hasMany(IncidentAttachment) |
| `IncidentTimeline` | SoftDeletes | belongsTo(Incident) |
| `IncidentRecommendation` | SoftDeletes | belongsTo(Incident) |
| `IncidentAttachment` | SoftDeletes | belongsTo(Incident) |
| `LossEvent` | SoftDeletes, HasFactory, LogsActivity | belongsTo(OrganizationalUnit), belongsTo(RiskRegister), hasMany(LossRecovery), hasMany(ActionPlan, 'actionable') |
| `LossRecovery` | SoftDeletes | belongsTo(LossEvent) |
| `AiIngestionSession` | SoftDeletes | belongsTo(User, 'actor_id') |
| `Notification` | SoftDeletes | belongsTo(User) |
| `AuditLog` | — (immutable) | belongsTo(User, 'actor_id') |
| `SystemSetting` | — | — |

---

## 3. Routes (`routes/web.php`)

```php
// Dashboard
GET /dashboard                                  → DashboardController@index

// === MODUL 1: MANAJEMEN RISIKO ===
GET    /risk                                    → RiskController@index
GET    /risk/trash                              → RiskController@trash
POST   /risk                                    → RiskController@store
GET    /risk/{risk}                             → RiskController@show
PUT    /risk/{risk}                             → RiskController@update
DELETE /risk/{risk}                             → RiskController@destroy
POST   /risk/{risk}/restore                     → RiskController@restore
DELETE /risk/{risk}/force                       → RiskController@forceDelete

// RCSA
GET    /risk/rcsa                               → RcsaController@index
POST   /risk/rcsa                               → RcsaController@store
GET    /risk/rcsa/{cycle}                       → RcsaController@show
PUT    /risk/rcsa/{cycle}                       → RcsaController@update
DELETE /risk/rcsa/{cycle}                       → RcsaController@destroy
GET    /risk/rcsa/trash                         → RcsaController@trash
POST   /risk/rcsa/{cycle}/restore               → RcsaController@restore
DELETE /risk/rcsa/{cycle}/force                 → RcsaController@forceDelete

// KRI
GET    /risk/kri                                → KriController@index
POST   /risk/kri                                → KriController@store
PUT    /risk/kri/{kri}                          → KriController@update
DELETE /risk/kri/{kri}                          → KriController@destroy

// Fraud Detection (AI)
GET    /risk/fraud-alerts                       → FraudAlertController@index
GET    /risk/fraud-alerts/trash                 → FraudAlertController@trash
PUT    /risk/fraud-alerts/{alert}/status        → FraudAlertController@updateStatus
POST   /risk/fraud-alerts/{alert}/restore       → FraudAlertController@restore
DELETE /risk/fraud-alerts/{alert}/force         → FraudAlertController@forceDelete

// Control Library
GET    /risk/controls                           → ControlController@index
POST   /risk/controls                           → ControlController@store
PUT    /risk/controls/{control}                 → ControlController@update
DELETE /risk/controls/{control}                 → ControlController@destroy

// Action Plans (polymorphic)
GET    /action-plans                            → ActionPlanController@index
POST   /action-plans                            → ActionPlanController@store
PUT    /action-plans/{plan}                     → ActionPlanController@update
DELETE /action-plans/{plan}                     → ActionPlanController@destroy
GET    /action-plans/trash                      → ActionPlanController@trash
POST   /action-plans/{plan}/restore             → ActionPlanController@restore
DELETE /action-plans/{plan}/force               → ActionPlanController@forceDelete

// === MODUL 2: MANAJEMEN AUDIT ===
GET    /audit                                   → AuditController@index
GET    /audit/trash                             → AuditController@trash
POST   /audit                                   → AuditController@store
GET    /audit/{audit}                           → AuditController@show
PUT    /audit/{audit}                           → AuditController@update
DELETE /audit/{audit}                           → AuditController@destroy
POST   /audit/{audit}/restore                   → AuditController@restore
DELETE /audit/{audit}/force                     → AuditController@forceDelete
POST   /audit/{audit}/advance                   → AuditController@advanceStage
POST   /audit/{audit}/team                      → AuditController@addTeamMember
DELETE /audit/{audit}/team/{user}               → AuditController@removeTeamMember
POST   /audit/{audit}/findings                  → AuditFindingController@store
PUT    /audit/{audit}/findings/{finding}        → AuditFindingController@update
DELETE /audit/{audit}/findings/{finding}        → AuditFindingController@destroy
GET    /audit/findings/trash                    → AuditFindingController@trash
POST   /audit/findings/{finding}/restore        → AuditFindingController@restore
DELETE /audit/findings/{finding}/force          → AuditFindingController@forceDelete
POST   /audit/{audit}/working-papers            → WorkingPaperController@store
PUT    /audit/{audit}/working-papers/{kka}      → WorkingPaperController@update
GET    /audit/performance                       → AuditorPerformanceController@index
GET    /audit/administration                    → AuditAdminController@index
PUT    /audit/administration/budget             → AuditAdminController@updateBudget

// === MODUL 3: MANAJEMEN KEPATUHAN ===
GET    /compliance                              → ComplianceController@index
// Regulatory Tracking
GET    /compliance/regulations                  → RegulationController@index
GET    /compliance/regulations/trash            → RegulationController@trash
POST   /compliance/regulations                  → RegulationController@store
GET    /compliance/regulations/{reg}            → RegulationController@show
PUT    /compliance/regulations/{reg}            → RegulationController@update
DELETE /compliance/regulations/{reg}            → RegulationController@destroy
POST   /compliance/regulations/{reg}/restore    → RegulationController@restore
DELETE /compliance/regulations/{reg}/force      → RegulationController@forceDelete
// APU-PPT
GET    /compliance/apu-ppt                      → ApuPptController@index
// Quality Assurance
GET    /compliance/qa                           → QaController@index
// Budaya Kepatuhan
GET    /compliance/culture                      → ComplianceCultureController@index

// === MODUL 4: MANAJEMEN INSIDEN ===
GET    /incident                                → IncidentController@index
GET    /incident/trash                          → IncidentController@trash
POST   /incident                                → IncidentController@store
GET    /incident/{incident}                     → IncidentController@show
PUT    /incident/{incident}                     → IncidentController@update
DELETE /incident/{incident}                     → IncidentController@destroy
POST   /incident/{incident}/restore             → IncidentController@restore
DELETE /incident/{incident}/force               → IncidentController@forceDelete
POST   /incident/{incident}/advance             → IncidentController@advanceStage
POST   /incident/{incident}/attachments         → IncidentController@uploadAttachment
DELETE /incident/{incident}/attachments/{att}   → IncidentController@removeAttachment

// === MODUL 5: KEBIJAKAN & PROSEDUR ===
GET    /policy                                  → PolicyController@index
GET    /policy/trash                            → PolicyController@trash
POST   /policy                                  → PolicyController@store
GET    /policy/{policy}                         → PolicyController@show
PUT    /policy/{policy}                         → PolicyController@update
DELETE /policy/{policy}                         → PolicyController@destroy
POST   /policy/{policy}/restore                 → PolicyController@restore
DELETE /policy/{policy}/force                   → PolicyController@forceDelete
POST   /policy/{policy}/versions                → PolicyController@addVersion
GET    /policy/certifications                   → CertificationController@index
POST   /policy/certifications                   → CertificationController@store
PUT    /policy/certifications/{cert}            → CertificationController@update

// === MODUL 6: LOSS EVENT ===
GET    /loss                                    → LossEventController@index
GET    /loss/trash                              → LossEventController@trash
POST   /loss                                    → LossEventController@store
GET    /loss/{loss}                             → LossEventController@show
PUT    /loss/{loss}                             → LossEventController@update
DELETE /loss/{loss}                             → LossEventController@destroy
POST   /loss/{loss}/restore                     → LossEventController@restore
DELETE /loss/{loss}/force                       → LossEventController@forceDelete
POST   /loss/{loss}/recoveries                  → LossEventController@addRecovery
PUT    /loss/{loss}/recoveries/{rec}            → LossEventController@updateRecovery
DELETE /loss/{loss}/recoveries/{rec}            → LossEventController@removeRecovery

// === AI TOOLS ===
GET    /ai-assistant                            → AiAssistantController@index
POST   /ai-assistant/chat                       → AiAssistantController@chat
GET    /ai-ingest                               → AiIngestController@index
POST   /ai-ingest/upload                        → AiIngestController@upload
POST   /ai-ingest/{session}/commit              → AiIngestController@commit
POST   /ai-ingest/{session}/reject              → AiIngestController@reject

// === SISTEM ===
GET    /settings                                → SettingController@index
POST   /settings/profile                        → SettingController@updateProfile
POST   /settings/notifications                  → SettingController@updateNotifications
POST   /settings/display                        → SettingController@updateDisplay
POST   /settings/security                       → SettingController@updateSecurity
GET    /notifications                           → NotificationController@index
POST   /notifications/{n}/read                  → NotificationController@markRead
GET    /audit-log                               → AuditLogController@index

// API
POST   /api/v1/auth/validate-token             → Api\TokenController@validate
GET    /api/v1/risks                            → Api\RiskApiController@index
GET    /api/v1/regulations                      → Api\RegulationApiController@index
```

---

## 4. Service Layer

| Service | Tanggung Jawab |
|---|---|
| `RiskService` | CRUD risiko, hitung inherent/residual score, link ke KRI |
| `RcaService` | Buat RCSA cycle, assign unit, track completion |
| `KriMonitorService` | Update current value, compute status, generate alert jika breach |
| `FraudDetectionService` | Pull AI anomaly results, create fraud_alerts |
| `AuditService` | CRUD audit plan, manage stages (Perencanaan→Selesai), assign tim |
| `AuditFindingService` | CRUD temuan, assign owner, track follow-up |
| `RegulationService` | CRUD regulasi, gap tracking, link ke action plan |
| `ComplianceService` | APU-PPT summary, QA scoring, culture index |
| `IncidentService` | CRUD insiden per channel, workflow stages, anonymization |
| `PolicyService` | CRUD kebijakan & prosedur, versioning, acknowledgment tracking |
| `LossEventService` | CRUD loss event, Basel II categorization, recovery tracking |
| `AiIngestionService` | Upload & parse dokumen, AI extraction, commit atau reject |
| `AiAssistantService` | Chat dengan AI tentang GRC (RAG dari risk/reg/policy data) |
| `NotificationService` | Create & deliver notifikasi per channel |
| `SlaService` | Monitor SLA insiden (Tinggi: 7 hari, Sedang: 21 hari, Rendah: 45 hari) |
| `LossEscalationService` | Auto-escalate: ≥ Rp 100jt → Komite, ≥ Rp 1 M → Direksi + OJK |

---

## 5. Inertia Pages (`resources/js/Pages/`)

```
Pages/
├── Dashboard.jsx                  # Executive dashboard: GRC Maturity, Risiko, Kepatuhan, Loss
├── Risk/
│   ├── Index.jsx                  # Tabs: Profile, RCSA, KRI, Fraud Detection, Control Library
│   ├── Show.jsx                   # Detail: heatmap, kontrol, action plan, linked audit/policy
│   └── Trash.jsx
├── Audit/
│   ├── Index.jsx                  # Tabs: Penugasan, Temuan, Tindak Lanjut, Performa, Administrasi
│   ├── Show.jsx                   # Detail: workflow stages, KKA, tim, findings
│   └── Trash.jsx
├── Compliance/
│   ├── Index.jsx                  # Tabs: Regulatory, APU-PPT, QA, Budaya Kepatuhan
│   ├── Show.jsx                   # Regulation detail: obligations, gap, action plan
│   └── Trash.jsx
├── Policy/
│   ├── Index.jsx                  # Tabs: Pustaka, Workflow Persetujuan, Sertifikasi
│   ├── Show.jsx                   # Detail: riwayat versi, distribusi, regulasi acuan
│   └── Trash.jsx
├── Incident/
│   ├── Index.jsx                  # Tabs: Semua, WBS, Gratifikasi, CoI, Helpdesk
│   ├── Show.jsx                   # Detail: workflow stages, timeline, rekomendasi
│   └── Trash.jsx
├── Loss/
│   ├── Index.jsx                  # Loss event list + KPIs
│   ├── Show.jsx                   # Detail: financial cards, recovery tracker, action plan
│   └── Trash.jsx
├── AiAssistant/
│   └── Index.jsx                  # Chat interface dengan AI
├── AiIngest/
│   └── Index.jsx                  # Upload + schema selection + extraction preview + commit
├── Notifications/
│   └── Index.jsx
└── Settings/
    └── Index.jsx                  # 5-section: Profile, Notifikasi, Tampilan, Keamanan, Organisasi
```

---

## 6. Risk Heatmap Logic

Heatmap 5×5 (Likelihood × Impact):

```javascript
// Cell score calculation
const getScore = (row, col) => row * col  // 1–25
const getTone = (score) => {
  if (score >= 15) return 'red'    // Tinggi
  if (score >= 9)  return 'amber'  // Sedang
  if (score >= 5)  return 'gold'   // Sedang-rendah
  return 'green'                    // Rendah
}
```

Backend: risks grouped by `(likelihood, impact)` pair → count per cell.

---

## 7. Three Lines Model Enforcement (RBAC)

| Role | Akses |
|---|---|
| `risk_officer` | Full access: Risk, RCSA, KRI, Fraud. Read: Audit, Compliance |
| `internal_auditor` | Full access: Audit. Read: Risk, Regulation. No: Loss, WBS |
| `compliance_officer` | Full access: Compliance, Incident, Policy. Read: Risk, Loss |
| `exec_director` | Read-only semua modul + export dashboard |
| `superadmin` | Full access semua termasuk settings dan hard delete |

Enforcement via Spatie Permission middleware per route group.

---

## 8. Soft Delete & Trash Pattern

Sama seperti apps lain — semua resource ada Trash view dengan restore + hard delete.  
`audit_logs` dan `audit_timelines` tidak bisa dihapus (immutable).

---

## 9. Loss Event Escalation Logic (Auto)

```php
class LossEscalationService {
    public function checkEscalation(LossEvent $loss): void {
        if ($loss->gross_loss >= 1_000_000_000) {
            // Escalate to Direksi + report ke OJK
            $this->notifyDireksi($loss);
            $this->flagForOjkReport($loss);
        } elseif ($loss->gross_loss >= 100_000_000) {
            // Escalate to Komite Manajemen Risiko
            $this->notifyKomiteMR($loss);
        }
    }
}
```

---

## 10. AI Ingestion Workflow

```
1. User upload file (PDF/Excel/Word)
2. System kirim ke AI API (OCR + extraction)
3. AI return structured JSON sesuai schema target (POLICIES/REGS/RISKS)
4. Preview ditampilkan ke user dengan confidence score per field
5. User review: edit fields yang salah
6. User "Commit" → data masuk ke tabel tujuan
7. User "Tolak" → session.status = 'ditolak', data tidak diimport
```

Status session: `review` (default) → `ter_commit` atau `ditolak`
