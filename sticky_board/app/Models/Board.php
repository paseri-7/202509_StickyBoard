<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Board extends Model
{
    protected $fillable = [
        'title',
        'description',
        'updated_at',
    ];

    public function stickyNotes(): HasMany
    {
        return $this->hasMany(StickyNote::class);
    }

    public function areas(): HasMany
    {
        return $this->hasMany(BoardArea::class);
    }
}
