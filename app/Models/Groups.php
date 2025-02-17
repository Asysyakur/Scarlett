<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Groups extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'drawio_link'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'group_user', 'group_id', 'user_id');
    }

    public function nilaiERDGroup()
    {
        return $this->hasMany(NilaiERDGroup::class);
    }

    public function groupUser()
    {
        return $this->hasMany(GroupUser::class);
    }
}
