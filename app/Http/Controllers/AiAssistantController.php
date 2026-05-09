<?php

namespace App\Http\Controllers;

use App\Models\AiChatMessage;
use App\Models\AiChatThread;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AiAssistantController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $threads = AiChatThread::query()
            ->where('user_id', $userId)
            ->with('latestMessage')
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn ($t) => [
                'id'           => $t->id,
                'title'        => $t->title,
                'model'        => $t->model,
                'updated_at'   => $t->updated_at?->toIso8601String(),
                'preview'      => $t->latestMessage?->content
                    ? Str::limit(strip_tags($t->latestMessage->content), 80)
                    : '',
                'last_role'    => $t->latestMessage?->role,
            ]);

        $activeId = $request->integer('thread') ?: null;
        $activeThread = null;
        if ($activeId) {
            $activeThread = AiChatThread::query()
                ->where('user_id', $userId)
                ->where('id', $activeId)
                ->with('messages')
                ->first();

            if ($activeThread) {
                $activeThread = [
                    'id'        => $activeThread->id,
                    'title'     => $activeThread->title,
                    'model'     => $activeThread->model,
                    'messages'  => $activeThread->messages->map(fn ($m) => [
                        'id'         => $m->id,
                        'role'       => $m->role,
                        'content'    => $m->content,
                        'metadata'   => $m->metadata_json,
                        'created_at' => $m->created_at?->toIso8601String(),
                    ])->values()->all(),
                ];
            }
        }

        $stats = [
            'thread_count'  => $threads->count(),
            'message_count' => AiChatMessage::query()
                ->whereIn('thread_id', $threads->pluck('id'))
                ->count(),
            'tokens_used'   => $threads->count() * 1280,
            'cost_usd'      => round($threads->count() * 0.018, 3),
        ];

        return Inertia::render('AiAssistant/Index', [
            'threads'       => $threads,
            'activeThread'  => $activeThread,
            'stats'         => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'message' => 'required|string|max:5000',
            'model'   => 'nullable|string|max:100',
        ]);

        $thread = AiChatThread::create([
            'user_id' => $request->user()->id,
            'title'   => Str::limit($data['message'], 60, '…'),
            'model'   => $data['model'] ?? 'gpt-4',
        ]);

        $now = Carbon::now();

        AiChatMessage::create([
            'thread_id'  => $thread->id,
            'role'       => 'user',
            'content'    => $data['message'],
            'created_at' => $now,
        ]);

        AiChatMessage::create([
            'thread_id'     => $thread->id,
            'role'          => 'assistant',
            'content'       => $this->mockAssistantReply($data['message']),
            'metadata_json' => ['mock' => true, 'model' => $thread->model],
            'created_at'    => $now->copy()->addSecond(),
        ]);

        $thread->touch();

        return redirect()
            ->route('ai-assistant.index', ['thread' => $thread->id])
            ->with('success', 'Sesi baru dimulai.');
    }

    public function sendMessage(Request $request, AiChatThread $thread)
    {
        abort_unless($thread->user_id === $request->user()->id, 403);

        $data = $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        $now = Carbon::now();

        AiChatMessage::create([
            'thread_id'  => $thread->id,
            'role'       => 'user',
            'content'    => $data['message'],
            'created_at' => $now,
        ]);

        AiChatMessage::create([
            'thread_id'     => $thread->id,
            'role'          => 'assistant',
            'content'       => $this->mockAssistantReply($data['message']),
            'metadata_json' => ['mock' => true, 'model' => $thread->model],
            'created_at'    => $now->copy()->addSecond(),
        ]);

        $thread->touch();

        return redirect()->route('ai-assistant.index', ['thread' => $thread->id]);
    }

    public function destroy(Request $request, AiChatThread $thread)
    {
        abort_unless($thread->user_id === $request->user()->id, 403);
        $thread->delete();

        return redirect()
            ->route('ai-assistant.index')
            ->with('success', 'Sesi percakapan dihapus.');
    }

    /**
     * Template-based mock response — picks a canned answer
     * by detecting domain keywords in the prompt.
     */
    private function mockAssistantReply(string $prompt): string
    {
        $p = mb_strtolower($prompt);

        if (Str::contains($p, ['risk', 'risiko', 'rcsa', 'kri'])) {
            return "Berdasarkan **Risk Register** terkini, terdapat 42 risiko aktif yang dipantau, dengan 8 risiko bertingkat *Tinggi* (mayoritas pada kategori Operasional dan Siber).\n\n"
                . "Saran tindak lanjut:\n"
                . "1. Prioritaskan review kontrol pada KU-014/RM/2025 untuk risiko operasional cabang.\n"
                . "2. Eskalasi residual *Ekstrem* ke Komite Manajemen Risiko sesuai POJK 11/03/2024.\n"
                . "3. Update KRI threshold untuk kategori Likuiditas — tren 30 hari menunjukkan kenaikan 12%.\n\n"
                . "Verifikasi data sumber pada modul Manajemen Risiko sebelum keputusan kritis.";
        }

        if (Str::contains($p, ['audit', 'temuan', 'finding'])) {
            return "Ringkasan **Manajemen Audit** berjalan:\n\n"
                . "- 8 audit aktif (5 *pelaksanaan*, 3 *pelaporan*).\n"
                . "- 22 temuan terbuka, 6 di antaranya *severity tinggi* dengan deadline ≤ 14 hari.\n"
                . "- Auditor utama: Kartika Dewi (lead 4 audit, performance score 91).\n\n"
                . "Untuk *checklist audit operasional cabang*, modul Audit menyediakan template berbasis KU-014/RM/2025 dan SE OJK 12/2026. Klik *Buat Audit Baru* → pilih tipe *Reguler* → checklist akan ter-generate otomatis.";
        }

        if (Str::contains($p, ['policy', 'kebijakan', 'pojk', 'pbi', 'regulasi', 'compliance', 'kepatuhan'])) {
            return "Status **Kepatuhan & Kebijakan** per hari ini:\n\n"
                . "- 142 dokumen kebijakan internal aktif.\n"
                . "- 5 regulasi eksternal *akan berlaku* dalam 90 hari (POJK 14/03/2026, PBI 8/2026, SE OJK 12/2026 sebagai prioritas).\n"
                . "- Gap kepatuhan terbesar: pasal 7 ayat (2) POJK 11/03/2024 — pelaporan profil risiko terintegrasi triwulanan.\n\n"
                . "Rekomendasi: gunakan modul Regulatory Tracking untuk men-generate action plan, dan tugaskan PIC pada modul Kepatuhan dalam 1×24 jam.";
        }

        if (Str::contains($p, ['incident', 'insiden', 'whistleblow', 'wbs', 'fraud'])) {
            return "Catatan **Manajemen Insiden** 30 hari terakhir:\n\n"
                . "- 8 insiden terbuka — 1 *krisis*, 2 *tinggi*, 5 *sedang*.\n"
                . "- WBS anonim: 3 laporan baru, semua dalam tahap verifikasi.\n"
                . "- Loss event terkait: Rp 247 jt, sudah masuk perhitungan Basel.\n\n"
                . "SLA mengacu KU-014/RM/2025: krisis ≤ 1 jam, tinggi ≤ 4 jam. Untuk lapor anonim baru gunakan menu Manajemen Insiden → *Lapor Anonim*.";
        }

        return "Saya menerima pertanyaan Anda: \"" . Str::limit($prompt, 140) . "\".\n\n"
            . "Sebagai catatan, ini adalah respons *template* (mock) — koneksi ke layanan AI eksternal belum diaktifkan oleh administrator. Anda dapat:\n\n"
            . "- Mencari kebijakan internal di modul **Kebijakan & Prosedur**.\n"
            . "- Menelaah regulasi eksternal di modul **Regulasi**.\n"
            . "- Melihat ringkasan risiko di **Manajemen Risiko**.\n\n"
            . "Selalu verifikasi jawaban kritis dengan dokumen sumber.";
    }
}
