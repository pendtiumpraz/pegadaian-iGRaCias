<?php

namespace App\Http\Middleware;

use App\Models\AuditPlan;
use App\Models\Incident;
use App\Models\Policy;
use App\Models\Regulation;
use App\Models\RiskRegister;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;
use Throwable;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id'             => $request->user()->id,
                    'portal_user_id' => $request->user()->portal_user_id,
                    'name'           => $request->user()->name,
                    'email'          => $request->user()->email,
                    'nip'            => $request->user()->nip,
                    'title'          => $request->user()->title,
                    'unit_id'        => $request->user()->unit_id,
                    'language'       => $request->user()->language,
                    'timezone'       => $request->user()->timezone,
                    'theme'          => $request->user()->theme,
                    'density'        => $request->user()->density,
                    'font_size'      => $request->user()->font_size,
                    'avatar_url'     => $request->user()->avatar_url,
                    'is_active'      => $request->user()->is_active,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
            ],
            'navCounts' => fn () => $this->navCounts(),
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }

    /**
     * Count unresolved entities for sidebar badges. Each lookup
     * is wrapped defensively so a missing table or schema drift
     * never breaks navigation rendering.
     */
    private function navCounts(): array
    {
        $safe = function (callable $fn): ?int {
            try {
                return (int) $fn();
            } catch (Throwable $e) {
                return null;
            }
        };

        return [
            'risks' => $safe(fn () => Schema::hasTable('risk_register')
                ? RiskRegister::query()->count()
                : 0),
            'audits' => $safe(fn () => Schema::hasTable('audit_plans')
                ? AuditPlan::query()->where('status', '!=', 'selesai')->count()
                : 0),
            'incidents' => $safe(fn () => Schema::hasTable('incidents')
                ? Incident::query()->where('status', '!=', 'selesai')->count()
                : 0),
            'policies' => $safe(fn () => Schema::hasTable('policies')
                ? Policy::query()->where('status', 'aktif')->count()
                : 0),
            'regulations' => $safe(fn () => Schema::hasTable('regulations')
                ? Regulation::query()->count()
                : 0),
        ];
    }
}
