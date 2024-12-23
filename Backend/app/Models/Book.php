<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'description',
        'genre',
        'posted_by',
        'lang',
        'page',
        'date',
        'picture',
        'file',
    ];

    public function posted_by()
    {
        return $this->belongsTo(User::class, 'posted_by');
    }
}
