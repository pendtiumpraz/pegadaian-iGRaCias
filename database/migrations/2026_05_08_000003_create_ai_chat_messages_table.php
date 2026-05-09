<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ai_chat_messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('thread_id');
            $table->enum('role', ['user', 'assistant', 'system']);
            $table->text('content');
            $table->json('metadata_json')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->index(['thread_id', 'created_at']);
            $table->foreign('thread_id')
                ->references('id')->on('ai_chat_threads')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_chat_messages');
    }
};
