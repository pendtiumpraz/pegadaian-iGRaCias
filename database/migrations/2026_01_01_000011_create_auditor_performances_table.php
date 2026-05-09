<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('auditor_performances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->enum('role', ['senior_auditor','auditor','junior_auditor']);
            $table->smallInteger('assignment_count')->unsigned()->default(0);
            $table->tinyInteger('on_time_pct')->unsigned()->default(0);
            $table->decimal('quality_score', 3, 2)->nullable();
            $table->smallInteger('findings_count')->unsigned()->default(0);
            $table->smallInteger('cpe_hours')->unsigned()->default(0);
            $table->string('period', 10);
            $table->softDeletes();
            $table->timestamps();
            $table->index(['user_id','period']);
        });
    }
    public function down(): void { Schema::dropIfExists('auditor_performances'); }
};
