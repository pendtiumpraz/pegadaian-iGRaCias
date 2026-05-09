<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('kris', function (Blueprint $table) {
            $table->id();
            $table->string('kri_code', 20)->unique();
            $table->string('name');
            $table->string('category', 100);
            $table->decimal('current_value', 12, 4);
            $table->string('unit', 30)->nullable();
            $table->decimal('threshold', 12, 4);
            $table->enum('direction', ['lower','higher']);
            $table->json('trend_data')->nullable();
            $table->enum('status', ['tinggi','pemantauan','rendah'])->default('rendah');
            $table->softDeletes();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('kris'); }
};
