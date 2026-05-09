<?php

namespace App\Http\Controllers;

use App\Models\ActionPlan;
use App\Models\AuditFinding;
use App\Models\Incident;
use App\Models\RiskRegister;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Index', [
            'total_risks'      => RiskRegister::where('status', 'aktif')->count(),
            'open_findings'    => AuditFinding::where('status', '!=', 'selesai')->count(),
            'open_incidents'   => Incident::where('status', '!=', 'selesai')->count(),
            'overdue_actions'  => ActionPlan::where('deadline', '<', now()->toDateString())
                                    ->where('status', '!=', 'selesai')
                                    ->count(),
        ]);
    }
}
