<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dashboard extends Model
{
    use HasFactory;

    protected $table = 'dashboard_datas'; 

    protected $fillable = [
        'link_presensi',
        'capaian_pembelajaran',
        'tujuan_pembelajaran',
        'identitas_pembelajaran',
    ];
}
