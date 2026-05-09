<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('audit_findings', function (Blueprint $table) {
            $table->id();
            $table->string('finding_code', 20)->unique();
            $table->unsignedBigInteger('audit_plan_id');
            $table->unsignedBigInteger('unit_id');
            $table->text('description');
            $table->enum('severity', ['tinggi','sedang','rendah']);
            $table->unsignedBigInteger('owner_id')->nullable();
            $table->date('deadline')->nullable();
            $table->enum('status', ['aktif','pelaksanaan','pemantauan'])->default('aktif');
            $table->text('recommendation')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index(['audit_plan_id','unit_id','severity','status']);
        });
    }
    public function down(): void { Schema::dropIfExists('audit_findings'); }
};
