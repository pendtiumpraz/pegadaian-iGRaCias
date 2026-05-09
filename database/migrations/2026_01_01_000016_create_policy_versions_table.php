<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('policy_versions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('policy_id');
            $table->string('version', 10);
            $table->date('effective_date');
            $table->text('change_summary')->nullable();
            $table->unsignedBigInteger('author_id')->nullable();
            $table->enum('status', ['aktif','arsip'])->default('aktif');
            $table->string('file_path', 500)->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index(['policy_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('policy_versions'); }
};
