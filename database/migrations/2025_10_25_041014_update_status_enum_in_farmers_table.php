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
        // Drop the old status column
        Schema::table('farmers', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        // Add the new status column with updated enum values
        Schema::table('farmers', function (Blueprint $table) {
            $table->enum('status', ['Active', 'Inactive', 'Pending Verification'])
                  ->default('Pending Verification')
                  ->after('emergency_contact_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the new status column
        Schema::table('farmers', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        // Restore the old status column
        Schema::table('farmers', function (Blueprint $table) {
            $table->enum('status', ['Active', 'Inactive'])
                  ->default('Active')
                  ->after('emergency_contact_number');
        });
    }
};
