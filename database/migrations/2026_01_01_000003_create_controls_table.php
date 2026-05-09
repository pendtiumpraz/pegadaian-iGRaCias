<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('controls', function (Blueprint $table) {
            $table->id();
            $table->string('control_code', 20)->unique();
            $table->unsignedBigInteger('risk_id');
            $table->text('description');
            $table->enum('type', ['preventive','detective']);
            $table->enum('frequency', ['harian','real_time','setiap_login','semesteran','per_launch']);
            $table->boolean('automated')->default(false);
            $table->decimal('effectiveness', 3, 2)->nullable();
            $table->date('test_date')->nullable();
            $table->string('evidence_url', 500)->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index(['risk_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('controls'); }
};
