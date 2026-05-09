<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LossRecovery extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'loss_event_id',
        'recovery_date',
        'source',
        'amount',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'recovery_date' => 'date',
        ];
    }

    public function lossEvent()
    {
        return $this->belongsTo(LossEvent::class, 'loss_event_id');
    }
}
