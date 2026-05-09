<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('audit_plans', function (Blueprint $table) {
            $table->id();
            $table->string('audit_code', 20)->unique();
            $table->string('title', 500);
            $table->enum('type', ['reguler','tematik','khusus','tindak_lanjut']);
            $table->string('period', 10);
            $table->unsignedBigInteger('unit_id');
            $table->unsignedBigInteger('lead_auditor_id');
            $table->date('start_date');
            $table->date('end_date');
            $table->tinyInteger('progress')->unsigned()->default(0);
            $table->tinyInteger('findings_count')->unsigned()->default(0);
            $table->enum('risk_level', ['tinggi','sedang','rendah']);
            $table->enum('status', ['perencanaan','pelaksanaan','pelaporan','selesai'])->default('perencanaan');
            $table->softDeletes();
            $table->timestamps();
            $table->index(['unit_id','status','period']);
        });
    }
    public function down(): void { Schema::dropIfExists('audit_plans'); }
};
