<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserNotificationSetting extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'email_digest',
        'push_notif',
        'sms_kritis',
        'approval_notif',
        'regulasi_baru',
        'reminder_rcsa_audit',
        'mention_komentar',
        'quiet_from',
        'quiet_to',
    ];

    protected function casts(): array
    {
        return [
            'email_digest'        => 'boolean',
            'push_notif'          => 'boolean',
            'sms_kritis'          => 'boolean',
            'approval_notif'      => 'boolean',
            'regulasi_baru'       => 'boolean',
            'reminder_rcsa_audit' => 'boolean',
            'mention_komentar'    => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
