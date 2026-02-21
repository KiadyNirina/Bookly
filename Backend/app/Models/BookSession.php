<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'book_id',
        'current_page',
        'progress_percentage',
        'duration_seconds',
        'view_counted',
        'completed',
        'started_at',
        'last_activity_at',
    ];

    protected $casts = [
        'view_counted' => 'boolean',
        'completed' => 'boolean',
        'started_at' => 'datetime',
        'last_activity_at' => 'datetime',
    ];

    /**
     * Relation vers l'utilisateur
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation vers le livre
     */
    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}