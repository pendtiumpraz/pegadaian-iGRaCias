<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Regulation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'reg_code',
        'name',
        'issuer',
        'effective_date',
        'owner_div',
        'gap_count',
        'status',
        'page_count',
        'max_penalty',
    ];

    protected function casts(): array
    {
        return [
            'effective_date' => 'date',
        ];
    }

    public function obligations()
    {
        return $this->hasMany(RegulationObligation::class, 'regulation_id');
    }
}
