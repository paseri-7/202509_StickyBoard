<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BoardArea extends Model
{
    protected $fillable = [
        'board_id',
        'title',
        'x',
        'y',
        'width',
        'height',
    ];

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }
}
