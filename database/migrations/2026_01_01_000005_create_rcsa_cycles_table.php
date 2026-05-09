<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('rcsa_cycles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('unit_id');
            $table->string('period', 10);
            $table->date('period_date');
            $table->json('business_processes');
            $table->string('process_owner_name');
            $table->string('process_owner_email');
            $table->smallInteger('risk_count')->unsigned()->default(0);
            $table->smallInteger('control_count')->unsigned()->default(0);
            $table->decimal('effectiveness_score', 3, 2)->nullable();
            $table->enum('status', ['pemantauan','pelaporan','pelaksanaan','selesai'])->default('pelaksanaan');
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('assessor_id')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index(['unit_id','status']);
        });
    }
    public function down(): void { Schema::dropIfExists('rcsa_cycles'); }
};
