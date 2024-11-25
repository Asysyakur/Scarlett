<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Relasi extends Model
{
    use HasFactory;

    protected $table = 'erd_relations'; // Nama tabel yang digunakan

    // Kolom yang dapat diisi
    protected $fillable = ['materi_id', 'from', 'to', 'type'];

    // Relasi dengan model 'Materi'
    public function materi()
    {
        return $this->belongsTo(Materi::class); // Misalnya, 'materi_id' adalah foreign key
    }

    // Relasi dengan model 'Table' (dari 'from' yang berhubungan dengan 'Table')
    public function fromTable()
    {
        return $this->belongsTo(Table::class, 'from', 'id'); // Menghubungkan dengan tabel 'tables' menggunakan kolom 'from'
    }

    // Relasi dengan model 'Table' (dari 'to' yang berhubungan dengan 'Table')
    public function toTable()
    {
        return $this->belongsTo(Table::class, 'to', 'id'); // Menghubungkan dengan tabel 'tables' menggunakan kolom 'to'
    }
}
