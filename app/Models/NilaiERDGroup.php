<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NilaiERDGroup extends Model
{
    use HasFactory;

    protected $table = 'nilai_erd_group'; // Nama tabel yang digunakan

    // Kolom yang dapat diisi
    protected $fillable = ['group_id', 'catatan', 'nilai'];

    // Relasi dengan model 'Group'
    public function groups()
    {
        return $this->belongsTo(Groups::class); // Misalnya, 'group_id' adalah foreign key
    }
}
