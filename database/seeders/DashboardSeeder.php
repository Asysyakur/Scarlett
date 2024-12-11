<?php

namespace Database\Seeders;

use App\Models\Dashboard;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DashboardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Dashboard::create(['link_presensi' => 'https://forms.gle/VZKm6NT4CthUM1yY8', 'capaian_pembelajaran' => 'Capaian Pembelajaran (CP) menunjukkan tujuan
                                atau kompetensi yang harus dicapai.', 'tujuan_pembelajaran' => 'Tujuan Pembelajaran adalah untuk menetapkan
                                hasil yang ingin dicapai oleh siswa.', 'identitas_pembelajaran' => 'Identitas Pembelajaran mencakup tujuan, metode, dan
                            hasil yang ingin dicapai dalam suatu proses
                            pembelajaran.']);
    }
}
