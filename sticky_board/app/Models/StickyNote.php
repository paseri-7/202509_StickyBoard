<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StickyNote extends Model
{
    protected $fillable = [
        'board_id',
        'content',
        'color',
        'due_at',
        'notified_at',
        'x',
        'y',
        'width',
        'height',
    ];

    protected $casts = [
        'due_at' => 'datetime',
        'notified_at' => 'datetime',
    ];

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }
}
