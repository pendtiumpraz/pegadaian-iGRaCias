<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Policy extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'policy_code',
        'name',
        'type',
        'owner_div',
        'version',
        'effective_date',
        'next_review_date',
        'status',
        'page_count',
        'acknowledged_count',
        'file_path',
    ];

    protected function casts(): array
    {
        return [
            'effective_date'   => 'date',
            'next_review_date' => 'date',
        ];
    }

    public function versions()
    {
        return $this->hasMany(PolicyVersion::class, 'policy_id');
    }

    public function approvalWorkflows()
    {
        return $this->hasMany(ApprovalWorkflow::class, 'policy_id');
    }

    public function actionPlans()
    {
        return $this->morphMany(ActionPlan::class, 'actionable');
    }
}
