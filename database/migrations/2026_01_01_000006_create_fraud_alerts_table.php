<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('fraud_alerts', function (Blueprint $table) {
            $table->id();
            $table->string('alert_code', 20)->unique();
            $table->text('title');
            $table->unsignedBigInteger('unit_id');
            $table->tinyInteger('confidence')->unsigned();
            $table->enum('severity', ['tinggi','sedang','rendah']);
            $table->timestamp('detected_at');
            $table->enum('status', ['investigasi','verifikasi','disetujui'])->default('investigasi');
            $table->string('model_version', 20)->nullable();
            $table->boolean('is_confirmed_fraud')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('investigator_id')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index(['unit_id','severity','status']);
        });
    }
    public function down(): void { Schema::dropIfExists('fraud_alerts'); }
};
