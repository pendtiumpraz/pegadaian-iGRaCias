<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Certification extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'subtitle',
        'valid_from',
        'valid_until',
        'next_audit_date',
        'certifying_body',
    ];

    protected function casts(): array
    {
        return [
            'valid_from'      => 'date',
            'valid_until'     => 'date',
            'next_audit_date' => 'date',
        ];
    }
}
