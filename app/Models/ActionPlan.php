<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ActionPlan extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'owner_id',
        'deadline',
        'progress',
        'status',
        'actionable_type',
        'actionable_id',
    ];

    protected function casts(): array
    {
        return [
            'deadline' => 'date',
        ];
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function actionable()
    {
        return $this->morphTo();
    }
}
