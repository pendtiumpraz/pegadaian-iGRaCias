<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('incident_timelines', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('incident_id');
            $table->string('actor')->nullable();
            $table->text('action');
            $table->string('icon_type', 50)->default('bell');
            $table->softDeletes();
            $table->timestamps();
            $table->index(['incident_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('incident_timelines'); }
};
