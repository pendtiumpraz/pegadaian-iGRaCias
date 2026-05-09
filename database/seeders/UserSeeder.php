<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $defaultPassword = Hash::make('Password123!');

        $users = [
            ['portal_user_id' => null, 'email' => 'risk.officer@igracias.pegadaian.co.id', 'name' => 'Risk Officer',       'nip' => '1001001', 'title' => 'Risk Officer',       'unit_id' => null, 'is_active' => true, 'password' => $defaultPassword],
            ['portal_user_id' => null, 'email' => 'auditor@igracias.pegadaian.co.id',      'name' => 'Auditor Internal',   'nip' => '1001002', 'title' => 'Auditor',            'unit_id' => null, 'is_active' => true, 'password' => $defaultPassword],
            ['portal_user_id' => null, 'email' => 'compliance@igracias.pegadaian.co.id',   'name' => 'Compliance Officer', 'nip' => '1001003', 'title' => 'Compliance Officer', 'unit_id' => null, 'is_active' => true, 'password' => $defaultPassword],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(['email' => $user['email']], $user);
        }
    }
}
