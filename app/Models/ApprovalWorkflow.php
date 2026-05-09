<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ApprovalWorkflow extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'workflow_code',
        'policy_id',
        'current_step',
        'total_steps',
        'current_approver',
        'status',
    ];

    protected function casts(): array
    {
        return [];
    }

    public function policy()
    {
        return $this->belongsTo(Policy::class, 'policy_id');
    }
}
