<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('regulation_obligations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('regulation_id');
            $table->string('article', 100);
            $table->text('description');
            $table->unsignedBigInteger('pic_id')->nullable();
            $table->enum('status', ['patuh','gap'])->default('gap');
            $table->softDeletes();
            $table->timestamps();
            $table->index(['regulation_id','status']);
        });
    }
    public function down(): void { Schema::dropIfExists('regulation_obligations'); }
};
