<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function groups()
    {
        return $this->belongsToMany(Groups::class, 'group_user', 'user_id', 'group_id');
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function isAdmin()
    {
        return $this->role_id === 1; // Replace 'role' with the actual attribute or logic you use to define an admin
    }

    public function progress()
    {
        return $this->hasOne(UserProgress::class);
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    public function nilaiERD()
    {
        return $this->hasMany(NilaiERD::class);
    }

    public function groupUser()
    {
        return $this->hasMany(GroupUser::class);
    }

    public function progressUser()
    {
        return $this->hasOne(Progress::class);
    }

    public function erdUsers()
    {
        return $this->hasMany(ERDUsers::class);
    }

    public function comment()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
