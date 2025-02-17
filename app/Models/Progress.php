<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Progress extends Model
{
    use HasFactory;
    
    protected $table = 'progress'; // Nama tabel yang digunakan

    // Kolom yang dapat diisi
    protected $fillable = ['user_id', 'progress'];

    // Relasi dengan model 'User'
    public function user()
    {
        return $this->belongsTo(User::class); // Misalnya, 'user_id' adalah foreign key
    }
}
