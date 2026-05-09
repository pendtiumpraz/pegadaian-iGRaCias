<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('incident_recommendations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('incident_id');
            $table->text('title');
            $table->string('owner_div')->nullable();
            $table->date('deadline')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index(['incident_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('incident_recommendations'); }
};
