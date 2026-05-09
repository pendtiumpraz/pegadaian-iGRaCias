<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RiskRegisterController;
use App\Http\Controllers\KriController;
use App\Http\Controllers\ControlController;
use App\Http\Controllers\ActionPlanController;
use App\Http\Controllers\AuditPlanController;
use App\Http\Controllers\AuditFindingController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\LossEventController;
use App\Http\Controllers\PolicyController;
use App\Http\Controllers\RegulationController;
use App\Http\Controllers\ComplianceController;
use App\Http\Controllers\SystemSettingController;
use App\Http\Controllers\AiAssistantController;
use App\Http\Controllers\IngestController;
use App\Http\Controllers\Auth\LoginController;

Route::get('/login',  [LoginController::class, 'showLogin'])->name('login');
Route::post('/login', [LoginController::class, 'login'])->name('login.post');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout')->middleware('auth');

// Portal SSO callback flow
Route::get('/auth/portal/redirect', [LoginController::class, 'portalRedirect'])->name('auth.portal.redirect');
Route::get('/auth/portal/callback', [LoginController::class, 'portalCallback'])->name('auth.portal.callback');

Route::middleware('auth')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Risk Module
    Route::prefix('risiko')->name('risk.')->group(function () {
        Route::get('/',                      [RiskRegisterController::class, 'index'])->name('index');
        Route::get('/create',                [RiskRegisterController::class, 'create'])->name('create');
        Route::post('/',                     [RiskRegisterController::class, 'store'])->name('store');
        Route::get('/{risk}',                [RiskRegisterController::class, 'show'])->name('show');
        Route::get('/{risk}/edit',           [RiskRegisterController::class, 'edit'])->name('edit');
        Route::put('/{risk}',                [RiskRegisterController::class, 'update'])->name('update');
        Route::delete('/{risk}',             [RiskRegisterController::class, 'destroy'])->name('destroy');
        Route::get('/trash',                 [RiskRegisterController::class, 'trash'])->name('trash');
        Route::post('/{id}/restore',         [RiskRegisterController::class, 'restore'])->name('restore');
        Route::delete('/{id}/force',         [RiskRegisterController::class, 'forceDelete'])->name('force-delete');
    });

    // KRI
    Route::prefix('kri')->name('kri.')->group(function () {
        Route::get('/',              [KriController::class, 'index'])->name('index');
        Route::get('/create',        [KriController::class, 'create'])->name('create');
        Route::post('/',             [KriController::class, 'store'])->name('store');
        Route::get('/{kri}/edit',    [KriController::class, 'edit'])->name('edit');
        Route::put('/{kri}',         [KriController::class, 'update'])->name('update');
        Route::delete('/{kri}',      [KriController::class, 'destroy'])->name('destroy');
    });

    // Controls
    Route::prefix('kontrol')->name('controls.')->group(function () {
        Route::get('/',                [ControlController::class, 'index'])->name('index');
        Route::get('/create',          [ControlController::class, 'create'])->name('create');
        Route::post('/',               [ControlController::class, 'store'])->name('store');
        Route::get('/{control}/edit',  [ControlController::class, 'edit'])->name('edit');
        Route::put('/{control}',       [ControlController::class, 'update'])->name('update');
        Route::delete('/{control}',    [ControlController::class, 'destroy'])->name('destroy');
    });

    // Action Plans
    Route::prefix('rencana-aksi')->name('action-plans.')->group(function () {
        Route::get('/',              [ActionPlanController::class, 'index'])->name('index');
        Route::post('/',             [ActionPlanController::class, 'store'])->name('store');
        Route::put('/{plan}',        [ActionPlanController::class, 'update'])->name('update');
        Route::delete('/{plan}',     [ActionPlanController::class, 'destroy'])->name('destroy');
    });

    // Audit Module
    Route::prefix('audit')->name('audit.')->group(function () {
        Route::get('/',                   [AuditPlanController::class, 'index'])->name('index');
        Route::get('/create',             [AuditPlanController::class, 'create'])->name('create');
        Route::post('/',                  [AuditPlanController::class, 'store'])->name('store');
        Route::get('/{plan}',             [AuditPlanController::class, 'show'])->name('show');
        Route::get('/{plan}/edit',        [AuditPlanController::class, 'edit'])->name('edit');
        Route::put('/{plan}',             [AuditPlanController::class, 'update'])->name('update');
        Route::delete('/{plan}',          [AuditPlanController::class, 'destroy'])->name('destroy');
        Route::get('/trash',              [AuditPlanController::class, 'trash'])->name('trash');
        Route::post('/{id}/restore',      [AuditPlanController::class, 'restore'])->name('restore');
        Route::delete('/{id}/force',      [AuditPlanController::class, 'forceDelete'])->name('force-delete');
    });

    Route::prefix('temuan')->name('findings.')->group(function () {
        Route::get('/',                    [AuditFindingController::class, 'index'])->name('index');
        Route::get('/{finding}',           [AuditFindingController::class, 'show'])->name('show');
        Route::put('/{finding}',           [AuditFindingController::class, 'update'])->name('update');
        Route::put('/{finding}/close',     [AuditFindingController::class, 'close'])->name('close');
    });

    // Incident Module
    Route::prefix('insiden')->name('incidents.')->group(function () {
        Route::get('/',                  [IncidentController::class, 'index'])->name('index');
        Route::get('/create',            [IncidentController::class, 'create'])->name('create');
        Route::post('/',                 [IncidentController::class, 'store'])->name('store');
        Route::get('/{incident}',        [IncidentController::class, 'show'])->name('show');
        Route::get('/{incident}/edit',   [IncidentController::class, 'edit'])->name('edit');
        Route::put('/{incident}',        [IncidentController::class, 'update'])->name('update');
        Route::delete('/{incident}',     [IncidentController::class, 'destroy'])->name('destroy');
        Route::get('/trash',             [IncidentController::class, 'trash'])->name('trash');
        Route::post('/{id}/restore',     [IncidentController::class, 'restore'])->name('restore');
        Route::delete('/{id}/force',     [IncidentController::class, 'forceDelete'])->name('force-delete');
    });

    // Loss Events
    Route::prefix('loss')->name('loss.')->group(function () {
        Route::get('/',                [LossEventController::class, 'index'])->name('index');
        Route::get('/create',          [LossEventController::class, 'create'])->name('create');
        Route::post('/',               [LossEventController::class, 'store'])->name('store');
        Route::get('/{loss}',          [LossEventController::class, 'show'])->name('show');
        Route::put('/{loss}',          [LossEventController::class, 'update'])->name('update');
        Route::delete('/{loss}',       [LossEventController::class, 'destroy'])->name('destroy');
    });

    // Policy Module
    Route::prefix('kebijakan')->name('policies.')->group(function () {
        Route::get('/',                  [PolicyController::class, 'index'])->name('index');
        Route::get('/create',            [PolicyController::class, 'create'])->name('create');
        Route::post('/',                 [PolicyController::class, 'store'])->name('store');
        Route::get('/{policy}',          [PolicyController::class, 'show'])->name('show');
        Route::get('/{policy}/edit',     [PolicyController::class, 'edit'])->name('edit');
        Route::put('/{policy}',          [PolicyController::class, 'update'])->name('update');
        Route::delete('/{policy}',       [PolicyController::class, 'destroy'])->name('destroy');
        Route::get('/trash',             [PolicyController::class, 'trash'])->name('trash');
        Route::post('/{id}/restore',     [PolicyController::class, 'restore'])->name('restore');
        Route::delete('/{id}/force',     [PolicyController::class, 'forceDelete'])->name('force-delete');
    });

    // Regulations
    Route::prefix('regulasi')->name('regulations.')->group(function () {
        Route::get('/',                    [RegulationController::class, 'index'])->name('index');
        Route::get('/create',              [RegulationController::class, 'create'])->name('create');
        Route::post('/',                   [RegulationController::class, 'store'])->name('store');
        Route::get('/{regulation}',        [RegulationController::class, 'show'])->name('show');
        Route::get('/{regulation}/edit',   [RegulationController::class, 'edit'])->name('edit');
        Route::put('/{regulation}',        [RegulationController::class, 'update'])->name('update');
        Route::delete('/{regulation}',     [RegulationController::class, 'destroy'])->name('destroy');
    });

    // Compliance Management — Regulatory / AML / QA / Culture
    Route::prefix('kepatuhan')->name('compliance.')->group(function () {
        Route::get('/',         [ComplianceController::class, 'index'])->name('index');
        Route::get('/aml',      [ComplianceController::class, 'aml'])->name('aml');
        Route::get('/qa',       [ComplianceController::class, 'qa'])->name('qa');
        Route::get('/culture',  [ComplianceController::class, 'culture'])->name('culture');
    });

    // Settings
    Route::prefix('pengaturan')->name('settings.')->group(function () {
        Route::get('/',      [SystemSettingController::class, 'index'])->name('index');
        Route::put('/{key}', [SystemSettingController::class, 'update'])->name('update');
    });

    // AI Assistant — full-page chat
    Route::prefix('ai-assistant')->name('ai-assistant.')->group(function () {
        Route::get('/',                  [AiAssistantController::class, 'index'])->name('index');
        Route::post('/',                 [AiAssistantController::class, 'store'])->name('store');
        Route::post('/{thread}/message', [AiAssistantController::class, 'sendMessage'])->name('send');
        Route::delete('/{thread}',       [AiAssistantController::class, 'destroy'])->name('destroy');
    });

    // AI Document Ingestion
    Route::prefix('ingest')->name('ingest.')->group(function () {
        Route::get('/',             [IngestController::class, 'index'])->name('index');
        Route::get('/create',       [IngestController::class, 'create'])->name('create');
        Route::post('/',            [IngestController::class, 'store'])->name('store');
        Route::get('/{job}',        [IngestController::class, 'show'])->name('show');
        Route::post('/{job}/approve', [IngestController::class, 'approve'])->name('approve');
        Route::post('/{job}/reject',  [IngestController::class, 'reject'])->name('reject');
    });
});
