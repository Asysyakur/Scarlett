<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupUser extends Model
{
    use HasFactory;
    
    protected $table = 'group_user'; // Nama tabel yang digunakan

    // Kolom yang dapat diisi
    protected $fillable = ['group_id', 'user_id', 'is_leader'];

    // Relasi dengan model 'Group'
    public function groups()
    {
        return $this->belongsTo(Groups::class); // Misalnya, 'group_id' adalah foreign key
    }

    // Relasi dengan model 'User'
    public function user()
    {
        return $this->belongsTo(User::class); // Misalnya, 'user_id' adalah foreign key
    }

    // Relasi dengan model 'NilaiERDGroup'
    public function nilaiERDGroup()
    {
        return $this->hasMany(NilaiERDGroup::class);
    }

    // Relasi dengan model 'NilaiERD'
    public function nilaiERD()
    {
        return $this->hasMany(NilaiERD::class);
    }
}
