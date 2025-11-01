<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryTransaction extends Model
{
    protected $fillable = [
        'inventory_id',
        'transaction_type',
        'quantity',
        'balance_after',
        'reason',
        'distribution_id',
        'reference_number',
        'unit_cost',
        'total_cost',
        'user_id',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'balance_after' => 'decimal:2',
        'unit_cost' => 'decimal:2',
        'total_cost' => 'decimal:2',
    ];

    public function inventory(): BelongsTo
    {
        return $this->belongsTo(Inventory::class);
    }

    public function distribution(): BelongsTo
    {
        return $this->belongsTo(Distribution::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
