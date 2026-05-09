<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PolicyVersion extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'policy_id',
        'version',
        'effective_date',
        'change_summary',
        'author_id',
        'status',
        'file_path',
    ];

    protected function casts(): array
    {
        return [
            'effective_date' => 'date',
        ];
    }

    public function policy()
    {
        return $this->belongsTo(Policy::class, 'policy_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
