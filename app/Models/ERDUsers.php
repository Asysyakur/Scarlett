<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ERDUsers extends Model
{
    use HasFactory;

    // The table associated with the model.
    protected $table = 'erd_users';

    // The attributes that are mass assignable.
    protected $fillable = [
        'materi_id',
        'table_id',
        'user_id',
        'attributes',
    ];

    // The attributes that should be cast to native types.
    protected $casts = [
        'attributes' => 'array', // Cast JSON column to array
    ];

    /**
     * Get the materi that owns the ERDUser.
     */
    public function materi()
    {
        return $this->belongsTo(Materi::class);
    }

    /**
     * Get the table that owns the ERDUser.
     */
    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    /**
     * Get the user that owns the ERDUser.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
