<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('working_papers', function (Blueprint $table) {
            $table->id();
            $table->string('kka_code', 20)->unique();
            $table->unsignedBigInteger('audit_plan_id');
            $table->string('title', 500);
            $table->unsignedBigInteger('reviewer_id')->nullable();
            $table->enum('status', ['selesai','pelaksanaan'])->default('pelaksanaan');
            $table->softDeletes();
            $table->timestamps();
            $table->index(['audit_plan_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('working_papers'); }
};
