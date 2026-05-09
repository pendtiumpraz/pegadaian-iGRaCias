<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kri extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'kri_code',
        'name',
        'category',
        'current_value',
        'unit',
        'threshold',
        'direction',
        'trend_data',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'trend_data'    => 'array',
            'current_value' => 'decimal:4',
            'threshold'     => 'decimal:4',
        ];
    }

    public function riskRegisters()
    {
        return $this->hasMany(RiskRegister::class, 'kri_id');
    }
}
