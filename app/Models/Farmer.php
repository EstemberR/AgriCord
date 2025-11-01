<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Farmer extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'date_of_birth',
        'gender',
        'civil_status',
        'contact_number',
        'email',
        'address_purok',
        'address_barangay',
        'address_municipality',
        'address_province',
        'nationality',
        'voters_id_number',
        'voters_certification_number',
        'passport_photo_path',
        'farm_name',
        'farm_location',
        'farm_size',
        'land_ownership_type',
        'farming_experience_months',
        'farming_experience_years',
        'emergency_contact_person',
        'emergency_contact_number',
        'status',
    ];
}


