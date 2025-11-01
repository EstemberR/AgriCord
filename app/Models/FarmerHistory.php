<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FarmerHistory extends Model
{
    protected $table = 'farmer_history';

    protected $fillable = [
        'farmer_id',
        'farmer_name',
        'farmer_code',
        'action_type',
        'changed_by',
        'details',
        'previous_value',
    ];

    public function farmer()
    {
        return $this->belongsTo(Farmer::class);
    }
}
