<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::dropIfExists('risk_register');
        Schema::create('risk_register', function (Blueprint $table) {
            $table->id();
            $table->string('risk_code', 20)->unique();
            $table->string('title', 500);
            $table->text('description')->nullable();
            $table->unsignedBigInteger('unit_id');
            $table->enum('category', ['kredit','pasar','operasional','siber','kepatuhan','hukum','strategis','reputasi','likuiditas']);
            $table->tinyInteger('likelihood')->unsigned();
            $table->tinyInteger('impact')->unsigned();
            $table->tinyInteger('inherent_score')->unsigned();
            $table->enum('inherent_level', ['rendah','sedang','tinggi']);
            $table->tinyInteger('residual_score')->unsigned();
            $table->enum('residual_level', ['rendah','sedang','tinggi']);
            $table->tinyInteger('risk_appetite')->unsigned()->nullable();
            $table->enum('status', ['aktif','pemantauan','termitigasi'])->default('aktif');
            $table->string('owner')->nullable();
            $table->unsignedBigInteger('kri_id')->nullable();
            $table->string('reviewed_by')->nullable();
            $table->date('next_review_date')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index(['unit_id','category','inherent_score','residual_score','status'], 'idx_risk_main');
        });
    }
    public function down(): void { Schema::dropIfExists('risk_register'); }
};
