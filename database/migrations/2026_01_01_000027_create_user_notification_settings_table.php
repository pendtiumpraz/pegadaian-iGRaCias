<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('user_notification_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique();
            $table->boolean('email_digest')->default(true);
            $table->boolean('push_notif')->default(true);
            $table->boolean('sms_kritis')->default(false);
            $table->boolean('approval_notif')->default(true);
            $table->boolean('regulasi_baru')->default(true);
            $table->boolean('reminder_rcsa_audit')->default(true);
            $table->boolean('mention_komentar')->default(true);
            $table->time('quiet_from')->nullable();
            $table->time('quiet_to')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('user_notification_settings'); }
};
