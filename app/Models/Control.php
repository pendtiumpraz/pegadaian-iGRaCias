<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Control extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'control_code',
        'risk_id',
        'description',
        'type',
        'frequency',
        'automated',
        'effectiveness',
        'test_date',
        'evidence_url',
    ];

    protected function casts(): array
    {
        return [
            'automated'     => 'boolean',
            'effectiveness' => 'decimal:2',
            'test_date'     => 'date',
        ];
    }

    public function risk()
    {
        return $this->belongsTo(RiskRegister::class, 'risk_id');
    }
}
