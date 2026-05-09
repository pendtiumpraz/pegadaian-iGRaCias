<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AuditorPerformance extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'role',
        'assignment_count',
        'on_time_pct',
        'quality_score',
        'findings_count',
        'cpe_hours',
        'period',
    ];

    protected function casts(): array
    {
        return [
            'quality_score' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
