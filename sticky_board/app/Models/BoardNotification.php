<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BoardNotification extends Model
{
    protected $fillable = [
        'user_id',
        'board_id',
        'sticky_note_id',
        'message',
        'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }

    public function stickyNote(): BelongsTo
    {
        return $this->belongsTo(StickyNote::class);
    }
}
