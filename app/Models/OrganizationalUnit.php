<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrganizationalUnit extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'type',
        'region',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function users()
    {
        return $this->hasMany(User::class, 'unit_id');
    }

    public function riskRegisters()
    {
        return $this->hasMany(RiskRegister::class, 'unit_id');
    }

    public function rcsaCycles()
    {
        return $this->hasMany(RcsaCycle::class, 'unit_id');
    }

    public function fraudAlerts()
    {
        return $this->hasMany(FraudAlert::class, 'unit_id');
    }

    public function auditPlans()
    {
        return $this->hasMany(AuditPlan::class, 'unit_id');
    }

    public function auditFindings()
    {
        return $this->hasMany(AuditFinding::class, 'unit_id');
    }

    public function incidents()
    {
        return $this->hasMany(Incident::class, 'unit_id');
    }

    public function lossEvents()
    {
        return $this->hasMany(LossEvent::class, 'unit_id');
    }
}
