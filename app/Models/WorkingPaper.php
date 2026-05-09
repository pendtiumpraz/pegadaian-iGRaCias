<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkingPaper extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'kka_code',
        'audit_plan_id',
        'title',
        'reviewer_id',
        'status',
    ];

    protected function casts(): array
    {
        return [];
    }

    public function auditPlan()
    {
        return $this->belongsTo(AuditPlan::class, 'audit_plan_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
