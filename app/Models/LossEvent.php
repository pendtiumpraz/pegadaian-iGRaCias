<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LossEvent extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'loss_code',
        'category',
        'description',
        'unit_id',
        'occurred_at',
        'discovered_at',
        'gross_loss',
        'recovery_amount',
        'status',
        'risk_id',
        'root_cause',
        'reported_to',
        'basel_code',
    ];

    protected function casts(): array
    {
        return [
            'occurred_at'   => 'date',
            'discovered_at' => 'date',
        ];
    }

    public function unit()
    {
        return $this->belongsTo(OrganizationalUnit::class, 'unit_id');
    }

    public function risk()
    {
        return $this->belongsTo(RiskRegister::class, 'risk_id');
    }

    public function recoveries()
    {
        return $this->hasMany(LossRecovery::class, 'loss_event_id');
    }

    public function actionPlans()
    {
        return $this->morphMany(ActionPlan::class, 'actionable');
    }
}
