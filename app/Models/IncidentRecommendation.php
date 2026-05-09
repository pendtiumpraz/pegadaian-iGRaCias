<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class IncidentRecommendation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'incident_id',
        'title',
        'owner_div',
        'deadline',
    ];

    protected function casts(): array
    {
        return [
            'deadline' => 'date',
        ];
    }

    public function incident()
    {
        return $this->belongsTo(Incident::class, 'incident_id');
    }
}
