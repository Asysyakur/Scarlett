<?php

namespace Database\Seeders;

use App\Models\Test;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Test::create(['name' => 'Pretest', 'description' => 'Mengukur Kemampuan Awalmu', 'link' => 'https://forms.gle/xSPiSo1uh7sK8t4YA']);
        Test::create(['name' => 'PostTest', 'description' => 'Mengukur Pengetahuanmu Setelah Pembelajaran', 'link' => 'https://forms.gle/xSPiSo1uh7sK8t4YA']);
    }
}
