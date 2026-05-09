<?php

namespace App\Http\Controllers;

use App\Models\IngestJob;
use App\Models\Policy;
use App\Models\Regulation;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class IngestController extends Controller
{
    public function index(Request $request)
    {
        $jobs = IngestJob::query()
            ->latest()
            ->with('user:id,name,email')
            ->paginate(20)
            ->withQueryString();

        $today = Carbon::today();
        $stats = [
            'today_count'      => IngestJob::query()
                ->whereDate('created_at', $today)
                ->count(),
            'in_review'        => IngestJob::query()
                ->where('status', 'review')
                ->count(),
            'approved_ytd'     => IngestJob::query()
                ->where('status', 'approved')
                ->whereYear('processed_at', $today->year)
                ->count(),
            'avg_confidence'   => round((float) IngestJob::query()
                ->where('confidence_score', '>', 0)
                ->avg('confidence_score'), 1),
        ];

        return Inertia::render('Ingest/Index', [
            'jobs'  => $jobs,
            'stats' => $stats,
        ]);
    }

    public function create()
    {
        return Inertia::render('Ingest/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'file'               => 'required|file|max:20480|mimes:pdf,doc,docx',
            'target_entity_type' => 'required|in:policy,regulation,contract,sop',
        ]);

        $file = $request->file('file');
        $path = $file->store('ingest', 'local');

        $job = IngestJob::create([
            'filename'           => $file->getClientOriginalName(),
            'file_path'          => $path,
            'file_size_bytes'    => $file->getSize(),
            'mime_type'          => $file->getMimeType(),
            'status'             => 'review',
            'target_entity_type' => $data['target_entity_type'],
            'user_id'            => $request->user()->id,
            'extracted_json'     => $this->mockExtraction(
                $file->getClientOriginalName(),
                $data['target_entity_type']
            ),
            'confidence_score'   => $this->mockConfidence($file->getClientOriginalName()),
            'processed_at'       => Carbon::now(),
        ]);

        return redirect()
            ->route('ingest.show', $job)
            ->with('success', 'Dokumen berhasil di-upload — silakan review hasil ekstraksi.');
    }

    public function show(IngestJob $job)
    {
        $job->load('user:id,name,email');

        return Inertia::render('Ingest/Show', [
            'job' => [
                'id'                 => $job->id,
                'filename'           => $job->filename,
                'file_size_bytes'    => $job->file_size_bytes,
                'mime_type'          => $job->mime_type,
                'status'             => $job->status,
                'extracted'          => $job->extracted_json,
                'confidence_score'   => (float) $job->confidence_score,
                'target_entity_type' => $job->target_entity_type,
                'target_entity_id'   => $job->target_entity_id,
                'processed_at'       => $job->processed_at?->toIso8601String(),
                'created_at'         => $job->created_at?->toIso8601String(),
                'user'               => $job->user
                    ? ['id' => $job->user->id, 'name' => $job->user->name, 'email' => $job->user->email]
                    : null,
            ],
        ]);
    }

    public function approve(Request $request, IngestJob $job)
    {
        $payload = $request->validate([
            'extracted' => 'nullable|array',
        ]);

        $extracted = $payload['extracted'] ?? $job->extracted_json ?? [];

        $entityId = null;

        if ($job->target_entity_type === 'policy') {
            $code = $extracted['number'] ?? 'KU-' . str_pad((string) random_int(1, 999), 3, '0', STR_PAD_LEFT) . '/INGEST/' . date('Y');
            $policy = Policy::create([
                'policy_code'       => Str::limit($code, 50, ''),
                'name'              => $extracted['title'] ?? $job->filename,
                'type'              => $extracted['category_db'] ?? 'pedoman',
                'owner_div'         => $extracted['owner'] ?? 'Belum ditentukan',
                'version'           => $extracted['version'] ?? 'v1.0',
                'effective_date'    => $extracted['effective_date'] ?? null,
                'next_review_date'  => $extracted['expiry_date'] ?? null,
                'status'            => 'draft',
                'page_count'        => $extracted['page_count'] ?? null,
                'file_path'         => $job->file_path,
            ]);
            $entityId = $policy->id;
        } elseif ($job->target_entity_type === 'regulation') {
            $code = $extracted['number'] ?? 'REG-' . str_pad((string) random_int(1, 999), 3, '0', STR_PAD_LEFT) . '/' . date('Y');
            $reg = Regulation::create([
                'reg_code'       => Str::limit($code, 50, ''),
                'name'           => $extracted['title'] ?? $job->filename,
                'issuer'         => $extracted['issuer'] ?? 'OJK',
                'effective_date' => $extracted['effective_date'] ?? null,
                'owner_div'      => $extracted['owner'] ?? 'Manajemen Risiko',
                'gap_count'      => 0,
                'status'         => 'akan_berlaku',
                'page_count'     => $extracted['page_count'] ?? null,
            ]);
            $entityId = $reg->id;
        }

        $job->update([
            'status'           => 'approved',
            'extracted_json'   => $extracted,
            'target_entity_id' => $entityId,
            'processed_at'     => Carbon::now(),
        ]);

        return redirect()
            ->route('ingest.index')
            ->with('success', 'Ingestion disetujui dan record telah dibuat.');
    }

    public function reject(IngestJob $job)
    {
        $job->update([
            'status'       => 'rejected',
            'processed_at' => Carbon::now(),
        ]);

        return redirect()
            ->route('ingest.index')
            ->with('success', 'Ingestion ditolak.');
    }

    /**
     * Generate mock extracted fields from filename keywords.
     */
    private function mockExtraction(string $filename, string $type): array
    {
        $base = strtolower($filename);
        $stem = pathinfo($filename, PATHINFO_FILENAME);

        if ($type === 'regulation') {
            return [
                'title'           => 'Penerapan Manajemen Risiko Iklim bagi Bank Umum',
                'number'          => Str::contains($base, 'pojk') ? 'POJK 14/03/2026' : 'PBI 8/2026',
                'category'        => 'Regulasi Eksternal',
                'category_db'     => 'pojk',
                'issuer'          => Str::contains($base, 'pbi') ? 'BI' : 'OJK',
                'effective_date'  => '2026-07-01',
                'expiry_date'     => null,
                'owner'           => 'Manajemen Risiko',
                'summary'         => 'Regulasi mewajibkan bank umum mengintegrasikan risiko iklim ke dalam manajemen risiko keseluruhan, mencakup tata kelola, identifikasi, dan pelaporan triwulanan.',
                'page_count'      => 24,
                'version'         => 'v1.0',
                'field_confidence'=> [
                    'title'          => 0.94,
                    'number'         => 0.99,
                    'category'       => 0.91,
                    'effective_date' => 0.92,
                    'owner'          => 0.78,
                    'summary'        => 0.86,
                ],
            ];
        }

        // policy / contract / sop default
        return [
            'title'           => 'Kebijakan Manajemen ' . Str::title(str_replace(['-', '_'], ' ', $stem)),
            'number'          => Str::contains($base, 'ku') ? 'KU-031/RM/2026' : 'PD-072/CR/2026',
            'category'        => 'Kebijakan Umum',
            'category_db'     => Str::contains($base, 'ku') ? 'kebijakan_umum' : 'pedoman',
            'issuer'          => 'Internal',
            'effective_date'  => '2026-05-01',
            'expiry_date'     => '2028-05-01',
            'owner'           => 'Manajemen Risiko',
            'summary'         => 'Dokumen menjelaskan kerangka kebijakan, tata kelola, kontrol kunci, serta peran dan tanggung jawab unit kerja terkait penerapan manajemen risiko sehari-hari.',
            'page_count'      => 18,
            'version'         => 'v1.0',
            'field_confidence'=> [
                'title'          => 0.93,
                'number'         => 0.96,
                'category'       => 0.88,
                'effective_date' => 0.91,
                'owner'          => 0.82,
                'summary'        => 0.84,
            ],
        ];
    }

    private function mockConfidence(string $filename): float
    {
        // pseudo-deterministic confidence between 78 and 96
        $hash = abs(crc32($filename)) % 19;
        return round(78 + $hash, 1);
    }
}
