<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('distributions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farmer_id')->constrained('farmers')->onDelete('cascade');
            $table->date('distribution_date');
            $table->enum('item_type', ['fertilizer', 'seed']);
            $table->string('item_name'); // fertilizer_type or seed_type
            $table->string('crop_type')->nullable(); // for seeds only
            $table->string('variety')->nullable(); // for seeds only
            $table->decimal('quantity', 10, 2);
            $table->string('unit'); // kg, bags, packets
            $table->enum('status', ['completed', 'pending', 'cancelled'])->default('completed');
            $table->foreignId('distributed_by')->constrained('users')->onDelete('cascade');
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['farmer_id', 'distribution_date']);
            $table->index('item_type');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('distributions');
    }
};
