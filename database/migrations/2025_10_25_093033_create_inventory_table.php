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
        Schema::create('inventory', function (Blueprint $table) {
            $table->id();
            $table->enum('item_type', ['fertilizer', 'seed']);
            $table->string('item_name')->unique();
            $table->decimal('current_stock', 10, 2)->default(0);
            $table->string('unit'); // kg, bags, packets
            $table->decimal('minimum_threshold', 10, 2);
            $table->decimal('maximum_capacity', 10, 2)->nullable();
            $table->date('last_restock_date')->nullable();
            $table->decimal('unit_cost', 10, 2)->default(0);
            $table->decimal('total_value', 12, 2)->default(0);
            $table->enum('status', ['normal', 'low_stock', 'out_of_stock'])->default('normal');
            $table->string('supplier')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index('item_type');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory');
    }
};
