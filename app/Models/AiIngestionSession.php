<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AiIngestionSession extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'session_code',
        'actor_id',
        'schema_type',
        'target_table',
        'files_json',
        'extracted_records',
        'avg_confidence',
        'status',
        'ai_model',
    ];

    protected function casts(): array
    {
        return [
            'files_json'    => 'array',
            'avg_confidence'=> 'decimal:2',
        ];
    }

    public function actor()
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
