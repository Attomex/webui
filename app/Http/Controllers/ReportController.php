<?php

namespace App\Http\Controllers;

use Exception;
use Inertia\Inertia;
use App\Models\Report;
use App\Models\Computer;
use App\Models\Vulnerability;
use App\Models\Identifier;
use App\Models\User;
use Illuminate\Http\Request;
use League\CommonMark\Node\Block\Document;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Symfony\Component\DomCrawler\Crawler;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Illuminate\Support\Facades\Log;

class ReportController extends Controller
{
    
    public function getComputersIdentifiers()
    {
        try {
            $start = microtime(true);
            $identifiers = Computer::all();
            $executionTime = microtime(true) - $start;
            \Log::info("Execution time for getComputersIdentifiers query: {$executionTime} seconds");

            $startResponse = microtime(true);
            $response = response()->json($identifiers);
            $responseTime = microtime(true) - $startResponse;
            \Log::info("Execution time for creating response: {$responseTime} seconds");

            return $response;
        } catch (Exception $e) {
            return response()->json(['error' => "Не удалось получить идентификаторы компьютеров"], Response::HTTP_METHOD_NOT_ALLOWED);
        }
    }


    public function getReportsByComputer(Request $request)
    {
        $computerIdentifier = $request->query('computer_identifier');
        $reportDate = $request->query('report_date');

        $computer = Computer::where('identifier', $computerIdentifier)->first();

        if (!$computer) {
            return response()->json(['error' => 'Computer not found'], 404);
        }

        $query = Report::where('computer_id', $computer->id);

        if ($reportDate) {
            $query->where('report_date', $reportDate);
        }

        $reports = $query->get();

        return response()->json($reports);
    }

    public function index()
    {
        try {
            $reports = Report::with('computer')->get();

            $reports->each(function ($report) {
                $report->criticalErrors = $report->total_critical;
                $report->highErrors = $report->total_high;
                $report->mediumErrors = $report->total_medium;
                $report->lowErrors = $report->total_low;
            });

            return response()->json($reports);

        } catch (Exception $e) {
            return response()->json(['error' => "Не удалось получить отчеты"], Response::HTTP_METHOD_NOT_ALLOWED);
        }

    }

    public function getUsers()
    {
        $users = User::where('role', '=', 'Admin')->get();

        return response()->json($users);
    }

    public function deleteAdminUser($id)
    {
        $user = User::findOrFail($id);

        if ($user) {
            $user->delete();
            return response()->json(['message' => 'Администратор успешно удален.'], 200);
        }
    }
}