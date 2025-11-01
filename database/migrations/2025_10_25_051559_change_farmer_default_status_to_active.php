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
        // Drop the status column
        Schema::table('farmers', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        // Add status column with Active as default
        Schema::table('farmers', function (Blueprint $table) {
            $table->enum('status', ['Active', 'Inactive', 'Pending Verification'])
                  ->default('Active')
                  ->after('emergency_contact_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the status column
        Schema::table('farmers', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        // Restore with Pending Verification as default
        Schema::table('farmers', function (Blueprint $table) {
            $table->enum('status', ['Active', 'Inactive', 'Pending Verification'])
                  ->default('Pending Verification')
                  ->after('emergency_contact_number');
        });
    }
};
