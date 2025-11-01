<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('farmers', function (Blueprint $table) {
            $table->id();
            // Personal Information
            $table->string('full_name');
            $table->date('date_of_birth');
            $table->string('gender');
            $table->string('civil_status');
            $table->string('contact_number');
            $table->string('email')->nullable();
            $table->string('address_purok');
            $table->string('address_barangay');
            $table->string('address_municipality');
            $table->string('address_province');
            $table->string('nationality');

            // Identification
            $table->string('voters_id_number')->nullable();
            $table->string('voters_certification_number')->nullable();
            $table->string('passport_photo_path')->nullable();

            // Farm Information
            $table->string('farm_name');
            $table->string('farm_location');
            $table->enum('land_ownership_type', ['owner', 'tenant']);
            $table->unsignedInteger('farming_experience_months')->default(0);
            $table->unsignedInteger('farming_experience_years')->default(0);

            // Additional Information
            $table->string('emergency_contact_person')->nullable();
            $table->string('emergency_contact_number')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('farmers');
    }
};


