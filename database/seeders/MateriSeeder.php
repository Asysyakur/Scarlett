<?php

namespace Database\Seeders;

use App\Models\Materi;
use Illuminate\Database\Seeder;

class MateriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Materi::create(['title' => 'material 1', 'description' => 'This is a sample test description.', 'content' => 'content 1', 'image' => 'image 1', 'video' => 'video 1', 'file' => 'file 1']);
        Materi::create(['title' => 'material 2', 'description' => 'This is a sample test description.', 'content' => 'content 1', 'image' => 'image 1', 'video' => 'video 1', 'file' => 'file 1']);
    }
}
