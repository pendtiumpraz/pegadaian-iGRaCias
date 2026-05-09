<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();
            $table->string('incident_code', 25)->unique();
            $table->string('title', 500);
            $table->enum('channel', ['wbs','gratifikasi','coi','helpdesk']);
            $table->unsignedBigInteger('unit_id');
            $table->boolean('anonymous')->default(false);
            $table->string('reporter_name')->nullable();
            $table->string('reporter_email_nip')->nullable();
            $table->date('occurrence_date');
            $table->text('description');
            $table->enum('severity', ['krisis','tinggi','sedang','rendah']);
            $table->enum('status', ['investigasi','verifikasi','disetujui','selesai'])->default('investigasi');
            $table->unsignedBigInteger('investigator_id')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index(['channel','severity','status','unit_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('incidents'); }
};
