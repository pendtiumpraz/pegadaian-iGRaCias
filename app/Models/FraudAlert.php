<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FraudAlert extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'alert_code',
        'title',
        'unit_id',
        'confidence',
        'severity',
        'detected_at',
        'status',
        'model_version',
        'is_confirmed_fraud',
        'notes',
        'investigator_id',
    ];

    protected function casts(): array
    {
        return [
            'detected_at'       => 'datetime',
            'is_confirmed_fraud'=> 'boolean',
        ];
    }

    public function unit()
    {
        return $this->belongsTo(OrganizationalUnit::class, 'unit_id');
    }

    public function investigator()
    {
        return $this->belongsTo(User::class, 'investigator_id');
    }
}
