<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materi extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'content',
        'image',
        'video',
        'file',
        'dnd',
        'studikasus',
        'studikasusfile'
    ];

    public function attributes()
    {
        return $this->hasMany(Atribut::class);
    }

    public function tables()
    {
        return $this->hasMany(Table::class);
    }

    public function relations()
    {
        return $this->hasMany(Relasi::class);
    }
    
}
