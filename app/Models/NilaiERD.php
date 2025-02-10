<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NilaiERD extends Model
{
    use HasFactory;

    protected $table = 'nilai_erd'; // Nama tabel yang digunakan

    // Kolom yang dapat diisi
    protected $fillable = ['user_id', 'materi_id', 'catatan', 'nilai'];

    // Relasi dengan model 'User'
    public function user()
    {
        return $this->belongsTo(User::class); // Misalnya, 'user_id' adalah foreign key
    }

    // Relasi dengan model 'Materi'
    public function materi()
    {
        return $this->belongsTo(Materi::class); // Misalnya, 'materi_id' adalah foreign key
    }
}
