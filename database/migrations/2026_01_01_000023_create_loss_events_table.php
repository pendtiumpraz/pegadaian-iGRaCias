<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('loss_events', function (Blueprint $table) {
            $table->id();
            $table->string('loss_code', 20)->unique();
            $table->enum('category', ['internal_fraud','external_fraud','employment_practices','clients_products','damage_physical_assets','business_disruption','execution_delivery']);
            $table->text('description');
            $table->unsignedBigInteger('unit_id');
            $table->date('occurred_at');
            $table->date('discovered_at');
            $table->bigInteger('gross_loss');
            $table->bigInteger('recovery_amount')->default(0);
            $table->enum('status', ['recovery','litigasi','klaim_asuransi','tutup'])->default('recovery');
            $table->unsignedBigInteger('risk_id')->nullable();
            $table->text('root_cause')->nullable();
            $table->string('reported_to')->nullable();
            $table->string('basel_code', 50)->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index(['category','status','unit_id','occurred_at']);
        });
    }
    public function down(): void { Schema::dropIfExists('loss_events'); }
};
