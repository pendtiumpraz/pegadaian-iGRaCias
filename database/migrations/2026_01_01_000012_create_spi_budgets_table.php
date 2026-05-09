<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('spi_budgets', function (Blueprint $table) {
            $table->id();
            $table->year('year');
            $table->string('item');
            $table->bigInteger('target');
            $table->bigInteger('realization')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('spi_budgets'); }
};
