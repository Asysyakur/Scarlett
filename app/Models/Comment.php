<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $table = 'comment'; // Nama tabel yang digunakan

    // Kolom yang dapat diisi
    protected $fillable = ['user_id', 'erd_user_id', 'comment'];

    // Relasi dengan model 'User'
    public function user()
    {
        return $this->belongsTo(User::class); // Misalnya, 'user_id' adalah foreign key
    }

    // Relasi dengan model 'ERDUser'
    public function erdUser()
    {
        return $this->belongsTo(ERDUsers::class); // Misalnya, 'erd_user_id' adalah foreign key
    }
}
