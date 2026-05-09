<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('ai_ingestion_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_code', 20)->unique();
            $table->unsignedBigInteger('actor_id');
            $table->enum('schema_type', ['policy','regulation','risk']);
            $table->string('target_table', 100);
            $table->json('files_json')->nullable();
            $table->unsignedInteger('extracted_records')->default(0);
            $table->decimal('avg_confidence', 5, 2)->nullable();
            $table->enum('status', ['ter_commit','review','ditolak'])->default('review');
            $table->string('ai_model', 100)->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index(['actor_id','status']);
        });
    }
    public function down(): void { Schema::dropIfExists('ai_ingestion_sessions'); }
};
