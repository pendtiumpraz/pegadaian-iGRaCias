<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ingest_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('filename', 255);
            $table->string('file_path', 500);
            $table->unsignedBigInteger('file_size_bytes')->default(0);
            $table->string('mime_type', 120)->nullable();
            $table->enum('status', [
                'uploaded', 'extracting', 'review',
                'approved', 'rejected', 'failed',
            ])->default('uploaded');
            $table->json('extracted_json')->nullable();
            $table->decimal('confidence_score', 5, 2)->default(0);
            $table->enum('target_entity_type', ['policy', 'regulation', 'contract', 'sop'])
                ->default('policy');
            $table->unsignedBigInteger('target_entity_id')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->timestamp('processed_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index(['user_id', 'status']);
            $table->index(['target_entity_type', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ingest_jobs');
    }
};
