<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('approval_workflows', function (Blueprint $table) {
            $table->id();
            $table->string('workflow_code', 20)->unique();
            $table->unsignedBigInteger('policy_id');
            $table->tinyInteger('current_step')->unsigned()->default(1);
            $table->tinyInteger('total_steps')->unsigned();
            $table->string('current_approver')->nullable();
            $table->enum('status', ['pending','approved','rejected'])->default('pending');
            $table->softDeletes();
            $table->timestamps();
            $table->index(['policy_id','status']);
        });
    }
    public function down(): void { Schema::dropIfExists('approval_workflows'); }
};
