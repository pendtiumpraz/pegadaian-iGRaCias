<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AuditFinding extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'finding_code',
        'audit_plan_id',
        'unit_id',
        'description',
        'severity',
        'owner_id',
        'deadline',
        'status',
        'recommendation',
        'closed_at',
    ];

    protected function casts(): array
    {
        return [
            'deadline'  => 'date',
            'closed_at' => 'datetime',
        ];
    }

    public function auditPlan()
    {
        return $this->belongsTo(AuditPlan::class, 'audit_plan_id');
    }

    public function unit()
    {
        return $this->belongsTo(OrganizationalUnit::class, 'unit_id');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function actionPlans()
    {
        return $this->morphMany(ActionPlan::class, 'actionable');
    }
}
