<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'risk_appetite_max', 'value' => 20, 'type' => 'integer', 'group' => 'risk', 'description' => 'Skor risk appetite maksimum (skala 1-25)'],
            ['key' => 'rcsa_cycle_months', 'value' => 6, 'type' => 'integer', 'group' => 'risk', 'description' => 'Periode siklus RCSA (bulan)'],
            ['key' => 'audit_finding_sla_days', 'value' => 30, 'type' => 'integer', 'group' => 'audit', 'description' => 'SLA tindak lanjut temuan audit (hari)'],
            ['key' => 'incident_sla_hours', 'value' => 4, 'type' => 'integer', 'group' => 'incident', 'description' => 'SLA pelaporan insiden kritis (jam)'],
            ['key' => 'policy_review_months', 'value' => 12, 'type' => 'integer', 'group' => 'policy', 'description' => 'Frekuensi review kebijakan (bulan)'],
        ];

        foreach ($settings as $setting) {
            SystemSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
