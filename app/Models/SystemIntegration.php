<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SystemIntegration extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'status',
        'last_sync_at',
        'config_json',
    ];

    protected function casts(): array
    {
        return [
            'last_sync_at' => 'datetime',
            'config_json'  => 'array',
        ];
    }
}
