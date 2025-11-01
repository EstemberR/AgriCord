<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inventory extends Model
{
    protected $table = 'inventory';

    protected $fillable = [
        'item_type',
        'item_name',
        'current_stock',
        'unit',
        'minimum_threshold',
        'maximum_capacity',
        'last_restock_date',
        'unit_cost',
        'total_value',
        'status',
        'supplier',
        'notes',
    ];

    protected $casts = [
        'current_stock' => 'decimal:2',
        'minimum_threshold' => 'decimal:2',
        'maximum_capacity' => 'decimal:2',
        'unit_cost' => 'decimal:2',
        'total_value' => 'decimal:2',
        'last_restock_date' => 'date',
    ];

    public function transactions(): HasMany
    {
        return $this->hasMany(InventoryTransaction::class);
    }

    // Automatically update status based on stock levels
    public function updateStatus(): void
    {
        if ($this->current_stock == 0) {
            $this->status = 'out_of_stock';
        } elseif ($this->current_stock < $this->minimum_threshold) {
            $this->status = 'low_stock';
        } else {
            $this->status = 'normal';
        }
        $this->save();
    }
}
