<?php

namespace Database\Seeders;

use App\Models\OrganizationalUnit;
use Illuminate\Database\Seeder;

class OrganizationalUnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            ['name' => 'Kantor Pusat', 'type' => 'kantor_pusat', 'region' => 'DKI Jakarta', 'is_active' => true],
            ['name' => 'Kanwil DKI & Banten', 'type' => 'kanwil', 'region' => 'DKI Jakarta', 'is_active' => true],
            ['name' => 'Kanwil Jawa Barat', 'type' => 'kanwil', 'region' => 'Jawa Barat', 'is_active' => true],
            ['name' => 'Kanwil Jawa Tengah', 'type' => 'kanwil', 'region' => 'Jawa Tengah', 'is_active' => true],
            ['name' => 'Kanwil Jawa Timur', 'type' => 'kanwil', 'region' => 'Jawa Timur', 'is_active' => true],
        ];

        foreach ($units as $unit) {
            OrganizationalUnit::updateOrCreate(['name' => $unit['name']], $unit);
        }
    }
}
