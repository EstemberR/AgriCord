<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DistributionHistory extends Model
{
    protected $table = 'distribution_history';

    protected $fillable = [
        'distribution_id',
        'action',
        'user_id',
        'details',
    ];

    public function distribution(): BelongsTo
    {
        return $this->belongsTo(Distribution::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
