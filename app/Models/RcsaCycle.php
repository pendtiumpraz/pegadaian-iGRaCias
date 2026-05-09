<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RcsaCycle extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'unit_id',
        'period',
        'period_date',
        'business_processes',
        'process_owner_name',
        'process_owner_email',
        'risk_count',
        'control_count',
        'effectiveness_score',
        'status',
        'notes',
        'assessor_id',
    ];

    protected function casts(): array
    {
        return [
            'business_processes' => 'array',
            'period_date'        => 'date',
            'effectiveness_score'=> 'decimal:2',
        ];
    }

    public function unit()
    {
        return $this->belongsTo(OrganizationalUnit::class, 'unit_id');
    }

    public function assessor()
    {
        return $this->belongsTo(User::class, 'assessor_id');
    }
}
