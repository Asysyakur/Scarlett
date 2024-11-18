<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run()
  {
    User::create([
      'name' => 'Admin',
      'email' => 'admin@mail.com',
      'password' => Hash::make('password123'),  // Hashing the password
      'role_id' => 1, // Assuming '1' is the admin role
    ]);
  }
}
