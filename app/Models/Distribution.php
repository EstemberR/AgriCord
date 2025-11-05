<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Distribution extends Model
{
    protected $fillable = [
        'farmer_id',
        'distribution_date',
        'item_type',
        'item_name',
        'crop_type',
        'variety',
        'quantity',
        'unit',
        'status',
        'distributed_by',
        'notes',
    ];

    protected $casts = [
        'distribution_date' => 'date',
        'quantity' => 'decimal:2',
    ];

    public function farmer(): BelongsTo
    {
        return $this->belongsTo(Farmer::class);
    }

    public function distributor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'distributed_by');
    }

    public function history(): HasMany
    {
        return $this->hasMany(DistributionHistory::class);
    }

    public function inventoryTransactions(): HasMany
    {
        return $this->hasMany(InventoryTransaction::class);
    }
}
