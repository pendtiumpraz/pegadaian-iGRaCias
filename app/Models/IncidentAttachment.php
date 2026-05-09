<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class IncidentAttachment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'incident_id',
        'file_path',
        'file_name',
        'file_size',
        'uploaded_by',
    ];

    protected function casts(): array
    {
        return [];
    }

    public function incident()
    {
        return $this->belongsTo(Incident::class, 'incident_id');
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
