<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('loss_recoveries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('loss_event_id');
            $table->date('recovery_date');
            $table->text('source');
            $table->bigInteger('amount');
            $table->enum('status', ['diterima','proses','estimasi'])->default('estimasi');
            $table->softDeletes();
            $table->timestamps();
            $table->index(['loss_event_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('loss_recoveries'); }
};
