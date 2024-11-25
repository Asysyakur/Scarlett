<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    use HasFactory;

    protected $table = 'erd_tables'; 
    // Kolom yang dapat diisi
    protected $fillable = ['materi_id', 'name', 'attributes'];

    // Mengonversi kolom 'attributes' ke dalam bentuk array
    protected $casts = [
        'attributes' => 'array',
    ];

    // Relasi dengan model 'Materi'
    public function materi()
    {
        return $this->belongsTo(Materi::class); // Misalnya, 'materi_id' adalah foreign key
    }

    // Relasi dengan model 'Relasi' (dari 'from' dan 'to' yang berhubungan dengan 'Table')
    public function relations()
    {
        return $this->hasMany(Relasi::class, 'from', 'id'); // Menghubungkan dengan tabel 'relations' menggunakan kolom 'from'
    }

    // Relasi sebaliknya, jika Anda ingin mengambil relasi yang memiliki 'to' yang mengarah ke tabel ini
    public function reverseRelations()
    {
        return $this->hasMany(Relasi::class, 'to', 'id'); // Menghubungkan dengan kolom 'to' yang mengarah ke tabel ini
    }
}
