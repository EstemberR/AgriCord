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
        Schema::create('inventory_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_id')->constrained('inventory')->onDelete('cascade');
            $table->enum('transaction_type', ['in', 'out', 'adjustment']);
            $table->decimal('quantity', 10, 2);
            $table->decimal('balance_after', 10, 2);
            $table->string('reason')->nullable(); // restock, distribution, correction, wastage, etc.
            $table->foreignId('distribution_id')->nullable()->constrained('distributions')->onDelete('set null');
            $table->string('reference_number')->nullable(); // invoice/receipt number
            $table->decimal('unit_cost', 10, 2)->nullable();
            $table->decimal('total_cost', 12, 2)->nullable();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index('inventory_id');
            $table->index('transaction_type');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_transactions');
    }
};
