<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'portal_user_id',
        'name',
        'email',
        'password',
        'nip',
        'title',
        'unit_id',
        'phone',
        'language',
        'timezone',
        'theme',
        'density',
        'font_size',
        'avatar_url',
        'is_active',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'is_active'     => 'boolean',
            'last_login_at' => 'datetime',
            'language'      => 'string',
            'timezone'      => 'string',
            'theme'         => 'string',
            'density'       => 'string',
            'password'      => 'hashed',
        ];
    }

    public function unit()
    {
        return $this->belongsTo(OrganizationalUnit::class, 'unit_id');
    }

    public function actionPlans()
    {
        return $this->hasMany(ActionPlan::class, 'owner_id');
    }

    public function rcsaCycles()
    {
        return $this->hasMany(RcsaCycle::class, 'assessor_id');
    }

    public function fraudAlerts()
    {
        return $this->hasMany(FraudAlert::class, 'investigator_id');
    }

    public function auditTeamMembers()
    {
        return $this->hasMany(AuditTeamMember::class, 'user_id');
    }

    public function auditFindings()
    {
        return $this->hasMany(AuditFinding::class, 'owner_id');
    }

    public function workingPapers()
    {
        return $this->hasMany(WorkingPaper::class, 'reviewer_id');
    }

    public function auditorPerformances()
    {
        return $this->hasMany(AuditorPerformance::class, 'user_id');
    }

    public function regulationObligations()
    {
        return $this->hasMany(RegulationObligation::class, 'pic_id');
    }

    public function policyVersions()
    {
        return $this->hasMany(PolicyVersion::class, 'author_id');
    }

    public function incidents()
    {
        return $this->hasMany(Incident::class, 'investigator_id');
    }

    public function incidentAttachments()
    {
        return $this->hasMany(IncidentAttachment::class, 'uploaded_by');
    }

    public function aiIngestionSessions()
    {
        return $this->hasMany(AiIngestionSession::class, 'actor_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    public function notificationSetting()
    {
        return $this->hasOne(UserNotificationSetting::class, 'user_id');
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class, 'actor_id');
    }

    public function leadAuditPlans()
    {
        return $this->hasMany(AuditPlan::class, 'lead_auditor_id');
    }
}
