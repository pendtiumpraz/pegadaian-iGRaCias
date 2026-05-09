<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('policies', function (Blueprint $table) {
            $table->id();
            $table->string('policy_code', 50)->unique();
            $table->text('name');
            $table->enum('type', ['kebijakan_umum','pedoman','juklak','juknis']);
            $table->string('owner_div');
            $table->string('version', 10)->default('v1.0');
            $table->date('effective_date')->nullable();
            $table->date('next_review_date')->nullable();
            $table->enum('status', ['aktif','review','draft','arsip'])->default('draft');
            $table->smallInteger('page_count')->unsigned()->nullable();
            $table->unsignedInteger('acknowledged_count')->default(0);
            $table->string('file_path', 500)->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index(['type','status','owner_div']);
        });
    }
    public function down(): void { Schema::dropIfExists('policies'); }
};
