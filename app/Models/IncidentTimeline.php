<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class IncidentTimeline extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'incident_id',
        'actor',
        'action',
        'icon_type',
    ];

    protected function casts(): array
    {
        return [];
    }

    public function incident()
    {
        return $this->belongsTo(Incident::class, 'incident_id');
    }
}
