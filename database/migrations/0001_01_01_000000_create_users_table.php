<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('organizational_units', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['kantor_pusat','kanwil','kc']);
            $table->string('region', 100)->nullable();
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('portal_user_id')->unique();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('nip', 30)->nullable();
            $table->string('title')->nullable();
            $table->unsignedBigInteger('unit_id')->nullable();
            $table->string('phone', 30)->nullable();
            $table->enum('language', ['id','en'])->default('id');
            $table->enum('timezone', ['WIB','WITA','WIT'])->default('WIB');
            $table->enum('theme', ['light','redup','dark'])->default('light');
            $table->enum('density', ['nyaman','standar','padat'])->default('standar');
            $table->tinyInteger('font_size')->unsigned()->default(100);
            $table->string('avatar_url', 500)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_login_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }
    public function down(): void {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('users');
        Schema::dropIfExists('organizational_units');
    }
};
