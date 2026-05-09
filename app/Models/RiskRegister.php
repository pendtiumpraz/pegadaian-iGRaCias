<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RiskRegister extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'risk_register';

    protected $fillable = [
        'risk_code',
        'title',
        'description',
        'unit_id',
        'category',
        'likelihood',
        'impact',
        'inherent_score',
        'inherent_level',
        'residual_score',
        'residual_level',
        'risk_appetite',
        'status',
        'owner',
        'kri_id',
        'reviewed_by',
        'next_review_date',
    ];

    protected function casts(): array
    {
        return [
            'next_review_date' => 'date',
        ];
    }

    public function unit()
    {
        return $this->belongsTo(OrganizationalUnit::class, 'unit_id');
    }

    public function kri()
    {
        return $this->belongsTo(Kri::class, 'kri_id');
    }

    public function controls()
    {
        return $this->hasMany(Control::class, 'risk_id');
    }

    public function lossEvents()
    {
        return $this->hasMany(LossEvent::class, 'risk_id');
    }

    public function actionPlans()
    {
        return $this->morphMany(ActionPlan::class, 'actionable');
    }
}
