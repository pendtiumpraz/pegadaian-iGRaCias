<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AuditPlan extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'audit_code',
        'title',
        'type',
        'period',
        'unit_id',
        'lead_auditor_id',
        'start_date',
        'end_date',
        'progress',
        'findings_count',
        'risk_level',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date'   => 'date',
        ];
    }

    public function unit()
    {
        return $this->belongsTo(OrganizationalUnit::class, 'unit_id');
    }

    public function leadAuditor()
    {
        return $this->belongsTo(User::class, 'lead_auditor_id');
    }

    public function teamMembers()
    {
        return $this->hasMany(AuditTeamMember::class, 'audit_plan_id');
    }

    public function findings()
    {
        return $this->hasMany(AuditFinding::class, 'audit_plan_id');
    }

    public function workingPapers()
    {
        return $this->hasMany(WorkingPaper::class, 'audit_plan_id');
    }
}
