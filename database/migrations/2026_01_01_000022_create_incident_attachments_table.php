<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('incident_attachments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('incident_id');
            $table->string('file_path', 500);
            $table->string('file_name');
            $table->unsignedInteger('file_size')->nullable();
            $table->unsignedBigInteger('uploaded_by')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index(['incident_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('incident_attachments'); }
};
