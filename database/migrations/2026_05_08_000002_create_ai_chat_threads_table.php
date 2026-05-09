<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ai_chat_threads', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('title', 255);
            $table->string('model', 100)->default('gpt-4');
            $table->softDeletes();
            $table->timestamps();
            $table->index(['user_id', 'deleted_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_chat_threads');
    }
};
