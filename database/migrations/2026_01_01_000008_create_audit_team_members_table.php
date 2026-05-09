<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('audit_team_members', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('audit_plan_id');
            $table->unsignedBigInteger('user_id');
            $table->enum('role', ['lead_auditor','auditor'])->default('auditor');
            $table->softDeletes();
            $table->timestamps();
            $table->unique(['audit_plan_id','user_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('audit_team_members'); }
};
