<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('regulations', function (Blueprint $table) {
            $table->id();
            $table->string('reg_code', 50)->unique();
            $table->text('name');
            $table->enum('issuer', ['ojk','bi','pemerintah','kemenkeu']);
            $table->date('effective_date');
            $table->string('owner_div')->nullable();
            $table->tinyInteger('gap_count')->unsigned()->default(0);
            $table->enum('status', ['patuh','gap_analisis','implementasi','akan_berlaku'])->default('gap_analisis');
            $table->smallInteger('page_count')->unsigned()->nullable();
            $table->string('max_penalty')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index(['issuer','status']);
        });
    }
    public function down(): void { Schema::dropIfExists('regulations'); }
};
