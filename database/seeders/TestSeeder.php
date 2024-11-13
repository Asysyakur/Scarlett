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
        Test::create(['name' => 'Sample Test 1', 'description' => 'This is a sample test description.', 'link' => 'https://forms.gle/xSPiSo1uh7sK8t4YA']);
        Test::create(['name' => 'Sample Test 2', 'description' => 'Another example of a test.', 'link' => 'https://forms.gle/xSPiSo1uh7sK8t4YA']);
    }
}
