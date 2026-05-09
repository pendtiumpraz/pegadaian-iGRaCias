<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class IngestJob extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'filename',
        'file_path',
        'file_size_bytes',
        'mime_type',
        'status',
        'extracted_json',
        'confidence_score',
        'target_entity_type',
        'target_entity_id',
        'user_id',
        'processed_at',
    ];

    protected function casts(): array
    {
        return [
            'extracted_json'   => 'array',
            'confidence_score' => 'decimal:2',
            'processed_at'     => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
