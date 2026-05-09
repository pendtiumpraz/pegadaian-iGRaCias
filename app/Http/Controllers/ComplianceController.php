<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * ComplianceController — Manajemen Kepatuhan landing & sub-tabs.
 *
 * Sample data only (no DB tables yet) — wiring real data sources is
 * deferred to a later iteration. The four routes simply render their
 * Inertia view with a small payload of seed data so the frontend
 * tabs render meaningfully.
 */
class ComplianceController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Compliance/Index', [
            'summary' => [
                'tracked'    => 47,
                'compliance' => 94.2,
                'gaps'       => 20,
                'reports'    => '14 / 16',
            ],
            'regulations' => [
                ['id' => 'POJK 6/2017',       'name' => 'Penerapan Manajemen Risiko bagi LJK',          'issuer' => 'OJK',          'eff' => '2017-04-13', 'gap' => 0, 'status' => 'Patuh'],
                ['id' => 'POJK 12/2023',      'name' => 'Penerapan Program APU PPT Sektor Jasa Keu.',   'issuer' => 'OJK',          'eff' => '2023-08-22', 'gap' => 2, 'status' => 'Patuh'],
                ['id' => 'PBI 23/6/PBI/2021', 'name' => 'Penyedia Jasa Pembayaran',                      'issuer' => 'BI',           'eff' => '2021-07-01', 'gap' => 0, 'status' => 'Patuh'],
                ['id' => 'UU 27/2022',        'name' => 'Pelindungan Data Pribadi',                      'issuer' => 'Pemerintah',   'eff' => '2024-10-17', 'gap' => 5, 'status' => 'Implementasi'],
                ['id' => 'POJK 11/2022',      'name' => 'Penyelenggaraan Teknologi Informasi',          'issuer' => 'OJK',          'eff' => '2022-07-13', 'gap' => 3, 'status' => 'Pemantauan'],
                ['id' => 'POJK 17/2023',      'name' => 'Tata Kelola Penyelenggaraan Layanan Bersama',  'issuer' => 'OJK',          'eff' => '2023-09-12', 'gap' => 1, 'status' => 'Patuh'],
                ['id' => 'POJK 4/2025',       'name' => 'Bisnis Emas LJK Bukan Bank',                    'issuer' => 'OJK',          'eff' => '2025-02-04', 'gap' => 2, 'status' => 'Implementasi'],
                ['id' => 'PMK 70/2017',       'name' => 'Pemenuhan AEoI Lembaga Keuangan',               'issuer' => 'Pemerintah',   'eff' => '2017-05-29', 'gap' => 0, 'status' => 'Patuh'],
            ],
        ]);
    }

    public function aml(Request $request)
    {
        return Inertia::render('Compliance/Aml', [
            'summary' => [
                'cdd'        => '14.842',
                'edd'        => 287,
                'watchlist'  => 18,
                'risk_agg'   => 'Sedang',
            ],
            'distribution' => [
                ['label' => 'Low Risk',         'value' => 11820, 'color' => '#187c5b'],
                ['label' => 'Medium Risk',      'value' => 2735,  'color' => '#c98114'],
                ['label' => 'High Risk (EDD)',  'value' => 287,   'color' => '#b8392a'],
            ],
            'trend' => [92.4, 93.1, 93.6, 94.0, 93.8, 94.2, 94.6, 94.5, 94.2, 94.8, 95.1, 95.3],
            'reviews' => [
                ['nasabah' => 'NSB-IDX-78421', 'tipe' => 'PEP',                  'risk' => 'Tinggi', 'reviewer' => 'Maya Indira',   'last' => '02 Mei 2026', 'status' => 'Aktif'],
                ['nasabah' => 'NSB-IDX-78398', 'tipe' => 'High-Risk Country',    'risk' => 'Tinggi', 'reviewer' => 'Sinta Permata', 'last' => '01 Mei 2026', 'status' => 'Investigasi'],
                ['nasabah' => 'NSB-IDX-78352', 'tipe' => 'PEP Family',           'risk' => 'Sedang', 'reviewer' => 'Maya Indira',   'last' => '30 Apr 2026', 'status' => 'Selesai'],
                ['nasabah' => 'NSB-IDX-78310', 'tipe' => 'Profession High-Risk', 'risk' => 'Sedang', 'reviewer' => 'Anggun Kusuma', 'last' => '29 Apr 2026', 'status' => 'Verifikasi'],
                ['nasabah' => 'NSB-IDX-78287', 'tipe' => 'Adverse Media',        'risk' => 'Tinggi', 'reviewer' => 'Sinta Permata', 'last' => '28 Apr 2026', 'status' => 'Aktif'],
                ['nasabah' => 'NSB-IDX-78219', 'tipe' => 'PEP',                  'risk' => 'Tinggi', 'reviewer' => 'Maya Indira',   'last' => '27 Apr 2026', 'status' => 'Selesai'],
                ['nasabah' => 'NSB-IDX-78145', 'tipe' => 'Sanctions Hit',        'risk' => 'Tinggi', 'reviewer' => 'Hafidz Al-Faruq','last' => '26 Apr 2026', 'status' => 'Investigasi'],
                ['nasabah' => 'NSB-IDX-78092', 'tipe' => 'High-Risk Country',    'risk' => 'Sedang', 'reviewer' => 'Anggun Kusuma', 'last' => '25 Apr 2026', 'status' => 'Selesai'],
            ],
        ]);
    }

    public function qa(Request $request)
    {
        return Inertia::render('Compliance/Qa', [
            'summary' => [
                'avg_score'  => 87.4,
                'sampled'    => 24,
                'errors'     => 38,
                'pass_rate'  => '88%',
            ],
            'rows' => [
                ['proc' => 'Onboarding Nasabah Emas',           'sample' => 50, 'errors' => 2,  'score' => 96, 'auditor' => 'Bayu Hartanto',   'date' => '02 Mei 2026'],
                ['proc' => 'Pencairan Pembiayaan Multiguna',    'sample' => 50, 'errors' => 11, 'score' => 78, 'auditor' => 'Anggun Kusuma',   'date' => '02 Mei 2026'],
                ['proc' => 'KYC Ulang Nasabah High-Value',      'sample' => 45, 'errors' => 5,  'score' => 88, 'auditor' => 'Bayu Hartanto',   'date' => '30 Apr 2026'],
                ['proc' => 'Pelaporan LTKT ke PPATK',            'sample' => 40, 'errors' => 3,  'score' => 92, 'auditor' => 'Kartika Dewi',    'date' => '28 Apr 2026'],
                ['proc' => 'Penanganan Keluhan Nasabah',         'sample' => 30, 'errors' => 7,  'score' => 84, 'auditor' => 'Dimas Pranata',   'date' => '27 Apr 2026'],
                ['proc' => 'Pengelolaan Vendor TI',              'sample' => 25, 'errors' => 8,  'score' => 71, 'auditor' => 'Hafidz Al-Faruq', 'date' => '26 Apr 2026'],
                ['proc' => 'Akses Sistem Core Banking',          'sample' => 35, 'errors' => 4,  'score' => 89, 'auditor' => 'Galih Wibowo',    'date' => '25 Apr 2026'],
                ['proc' => 'Penyelenggaraan Pelatihan APU-PPT',  'sample' => 20, 'errors' => 6,  'score' => 79, 'auditor' => 'Maya Indira',     'date' => '23 Apr 2026'],
                ['proc' => 'Rekonsiliasi Saldo Custodian',       'sample' => 28, 'errors' => 2,  'score' => 93, 'auditor' => 'Nadia Rahman',    'date' => '22 Apr 2026'],
                ['proc' => 'Kepatuhan Kontrak Outsourcing',      'sample' => 22, 'errors' => 9,  'score' => 73, 'auditor' => 'Kartika Dewi',    'date' => '21 Apr 2026'],
                ['proc' => 'Pengelolaan Privacy / UU PDP',       'sample' => 18, 'errors' => 5,  'score' => 81, 'auditor' => 'Sari Wulandari',  'date' => '20 Apr 2026'],
                ['proc' => 'Pelaksanaan Whistleblowing',         'sample' => 15, 'errors' => 1,  'score' => 95, 'auditor' => 'Maya Indira',     'date' => '18 Apr 2026'],
            ],
        ]);
    }

    public function culture(Request $request)
    {
        return Inertia::render('Compliance/Culture', [
            'summary' => [
                'index'          => 4.21,
                'pakta'          => '98.4%',
                'elearning'      => '87%',
                'sosialisasi'    => 42,
            ],
            'rows' => [
                ['kanwil' => 'Kanwil I — Sumatera',                   'survey' => 86, 'training' => 91, 'incidents' => 3, 'composite' => 4.32, 'trend' => [4.10, 4.18, 4.21, 4.25, 4.28, 4.30, 4.32]],
                ['kanwil' => 'Kanwil II — Jakarta & Banten',          'survey' => 88, 'training' => 94, 'incidents' => 2, 'composite' => 4.41, 'trend' => [4.18, 4.22, 4.28, 4.32, 4.36, 4.39, 4.41]],
                ['kanwil' => 'Kanwil III — Jawa Barat',               'survey' => 84, 'training' => 88, 'incidents' => 5, 'composite' => 4.18, 'trend' => [4.05, 4.08, 4.10, 4.14, 4.16, 4.17, 4.18]],
                ['kanwil' => 'Kanwil IV — Jawa Tengah & DIY',         'survey' => 85, 'training' => 90, 'incidents' => 4, 'composite' => 4.27, 'trend' => [4.12, 4.15, 4.18, 4.22, 4.24, 4.26, 4.27]],
                ['kanwil' => 'Kanwil V — Jawa Timur, Bali, NTB, NTT', 'survey' => 79, 'training' => 82, 'incidents' => 7, 'composite' => 3.94, 'trend' => [3.82, 3.85, 3.88, 3.90, 3.92, 3.93, 3.94]],
                ['kanwil' => 'Kanwil VI — Kalimantan',                'survey' => 82, 'training' => 86, 'incidents' => 4, 'composite' => 4.08, 'trend' => [3.95, 3.98, 4.02, 4.04, 4.06, 4.07, 4.08]],
                ['kanwil' => 'Kanwil VII — Sulawesi & Maluku',        'survey' => 84, 'training' => 89, 'incidents' => 3, 'composite' => 4.22, 'trend' => [4.10, 4.13, 4.16, 4.18, 4.20, 4.21, 4.22]],
                ['kanwil' => 'Kanwil VIII — Papua & Maluku Utara',    'survey' => 81, 'training' => 84, 'incidents' => 5, 'composite' => 4.04, 'trend' => [3.92, 3.96, 3.98, 4.00, 4.02, 4.03, 4.04]],
            ],
        ]);
    }
}
