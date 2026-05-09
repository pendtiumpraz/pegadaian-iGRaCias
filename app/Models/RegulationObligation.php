<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RegulationObligation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'regulation_id',
        'article',
        'description',
        'pic_id',
        'status',
    ];

    protected function casts(): array
    {
        return [];
    }

    public function regulation()
    {
        return $this->belongsTo(Regulation::class, 'regulation_id');
    }

    public function pic()
    {
        return $this->belongsTo(User::class, 'pic_id');
    }
}
