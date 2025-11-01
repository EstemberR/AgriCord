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
        Schema::create('farmer_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farmer_id')->nullable()->constrained('farmers')->onDelete('set null');
            $table->string('farmer_name');
            $table->string('farmer_code'); // F000001, etc.
            $table->enum('action_type', ['New Registration', 'Updated', 'Deleted', 'Status Changed']);
            $table->string('changed_by')->default('Admin User'); // Can be linked to users table later
            $table->text('details');
            $table->text('previous_value')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('farmer_history');
    }
};
