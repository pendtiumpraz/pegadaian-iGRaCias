<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Incident extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'incident_code',
        'title',
        'channel',
        'unit_id',
        'anonymous',
        'reporter_name',
        'reporter_email_nip',
        'occurrence_date',
        'description',
        'severity',
        'status',
        'investigator_id',
        'closed_at',
    ];

    protected function casts(): array
    {
        return [
            'anonymous'       => 'boolean',
            'occurrence_date' => 'date',
            'closed_at'       => 'datetime',
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

    public function timelines()
    {
        return $this->hasMany(IncidentTimeline::class, 'incident_id');
    }

    public function recommendations()
    {
        return $this->hasMany(IncidentRecommendation::class, 'incident_id');
    }

    public function attachments()
    {
        return $this->hasMany(IncidentAttachment::class, 'incident_id');
    }

    public function actionPlans()
    {
        return $this->morphMany(ActionPlan::class, 'actionable');
    }
}
