<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('action_plans', function (Blueprint $table) {
            $table->id();
            $table->text('title');
            $table->unsignedBigInteger('owner_id')->nullable();
            $table->date('deadline')->nullable();
            $table->tinyInteger('progress')->unsigned()->default(0);
            $table->enum('status', ['pelaksanaan','aktif','selesai','perencanaan'])->default('perencanaan');
            $table->string('actionable_type', 100)->nullable();
            $table->unsignedBigInteger('actionable_id')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index(['actionable_type','actionable_id','status']);
        });
    }
    public function down(): void { Schema::dropIfExists('action_plans'); }
};
