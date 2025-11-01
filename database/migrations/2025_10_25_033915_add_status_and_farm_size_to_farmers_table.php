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
        Schema::table('farmers', function (Blueprint $table) {
            $table->enum('status', ['Active', 'Inactive'])->default('Active')->after('emergency_contact_number');
            $table->decimal('farm_size', 10, 2)->nullable()->after('farm_location')->comment('Farm size in hectares');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('farmers', function (Blueprint $table) {
            $table->dropColumn(['status', 'farm_size']);
        });
    }
};
