<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Atribut extends Model
{
    use HasFactory;

    protected $table = 'erd_atributs'; // Nama tabel yang digunakan

    // Kolom yang dapat diisi
    protected $fillable = ['materi_id', 'label'];

    // Relasi dengan model 'Materi'
    public function materi()
    {
        return $this->belongsTo(Materi::class); // Misalnya, 'materi_id' adalah foreign key
    }
    
}
