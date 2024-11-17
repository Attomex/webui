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
    public function store(Request $request)
    {
        DB::beginTransaction();
    
        try {
            $parsedData = $request->json()->all();
    
            // Проверка на существование отчёта с таким номером
            $existingReport = Report::where('report_number', $parsedData['reportNumber'])->first();
            if ($existingReport) {
                return response()->json(['message' => "Отчёт с таким номером уже был загружен!", 'status' => '400'], Response::HTTP_BAD_REQUEST);
            }
    
            // Создание или получение компьютера
            $computer = Computer::firstOrCreate(['identifier' => $parsedData['computerIdentifier']]);
    
            // Создание отчёта
            $report = $computer->reports()->create([
                'report_date' => $parsedData['reportDate'],
                'report_number' => $parsedData['reportNumber'],
            ]);
    
            foreach ($parsedData["vulnerabilities"] as $vulnerabilityData) {
                // Создание или получение идентификатора
                $identifier = Identifier::firstOrCreate(['number' => $vulnerabilityData['id']]);
    
                // Проверка на существование уязвимости с такими же значениями всех полей
                $vulnerability = Vulnerability::where('error_level', $vulnerabilityData['error_level'])
                    ->where('description', $vulnerabilityData['description'])
                    ->where('source_links', implode(',', $vulnerabilityData['references']))
                    ->where('name', $vulnerabilityData['title'])
                    ->where('remediation_measures', $vulnerabilityData['measures'])
                    ->where('identifiers_id', $identifier->id)
                    ->first();
    
                if (!$vulnerability) {
                    // Создание новой уязвимости, если её нет
                    $vulnerability = Vulnerability::create([
                        'error_level' => $vulnerabilityData['error_level'],
                        'description' => $vulnerabilityData['description'],
                        'source_links' => implode(',', $vulnerabilityData['references']),
                        'name' => $vulnerabilityData['title'],
                        'remediation_measures' => $vulnerabilityData['measures'],
                        'identifiers_id' => $identifier->id,
                    ]);
                }
    
                // Присоединение уязвимости к отчёту
                $report->vulnerabilities()->attach($vulnerability->id);
            }
    
            // Преобразуем массив в JSON-строку
            $jsonString = json_encode($parsedData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            // Определяем путь для сохранения файла
            $filePath = storage_path('\\app\\reports\\' . uniqid() . '.json');
            // Сохраняем JSON-строку в файл
            file_put_contents($filePath, $jsonString);
    
            DB::commit();
    
            return response()->json(['message' => "Отчет успешно загружен"]);
        } catch(Exception $e) {
            DB::rollBack();
    
            // Логирование ошибки
            // \Log::error('Ошибка при загрузке отчета: ' . $e->getMessage());
    
            return response()->json(['message' => "Произошла ошибка при загрузке отчета", 'status' => '500'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    public function view(Request $request)
    {
        $computerIdentifier = $request->input('computer_identifier');
        $reportNumber = $request->input('report_number');
        $date = $request->input('report_date');

        $computer = Computer::where('identifier', $computerIdentifier)->first();
        if (!$computer) {
            return response()->json(['error' => 'Компьютер не найден', 'status' => '400'], Response::HTTP_BAD_REQUEST);
        }

        $report = Report::where('computer_id', $computer->id)
            ->where('report_number', $reportNumber)
            ->where('report_date', $date)
            ->first();

        if (!$report) {
            return response()->json(['error' => 'Отчет не найден', 'status' => '400'], Response::HTTP_BAD_REQUEST);
        }

        $vulnerabilities = $report->vulnerabilities()
            ->with('identifier')
            ->get()
            ->map(function ($vulnerability, $index) {
                return [
                    'number' => $index + 1,
                    'identifier' => $vulnerability->identifier->number,
                    'error_level' => $vulnerability->error_level,
                    'name' => $vulnerability->name,
                    'description' => $vulnerability->description,
                    'remediation_measures' => $vulnerability->remediation_measures,
                    'source_links' => explode(',', $vulnerability->source_links),
                ];
            });

        return response()->json([
            'vulnerabilities' => $vulnerabilities,
            'message' => 'Успешно получены уязвимости',
        ]);
    }

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
            $reports = Report::with('computer', 'vulnerabilities')->get();

            $reports->each(function ($report) {
                $report->criticalErrors = $report->vulnerabilities->where('error_level', 'Критический')->count();
                $report->highErrors = $report->vulnerabilities->where('error_level', 'Высокий')->count();
                $report->mediumErrors = $report->vulnerabilities->where('error_level', 'Средний')->count();
                $report->lowErrors = $report->vulnerabilities->where('error_level', 'Низкий')->count();
                unset($report->vulnerabilities); // Убираем уязвимости, чтобы не передавать лишние данные
            });
            return response()->json($reports);

        } catch (Exception $e) {
            return response()->json(['error' => "Не удалось получить отчеты"], Response::HTTP_METHOD_NOT_ALLOWED);
        }

    }

    public function compareReports(Request $request)
    {
        $newReportNumber = $request->input('new_report_number');
        $newReportDate = $request->input('new_report_date');
        $oldReportNumber = $request->input('old_report_number');
        $oldReportDate = $request->input('old_report_date');
        $computerIdentifier = $request->input('computer_identifier');

        $computer = Computer::where('identifier', $computerIdentifier)->first();
        if (!$computer) {
            return response()->json(['error' => 'Компьютер не найден', 'status' => '400'], Response::HTTP_BAD_REQUEST);
        }

        $newReport = Report::where('computer_id', $computer->id)
            ->where('report_number', $newReportNumber)
            ->where('report_date', $newReportDate)
            ->first();

        $oldReport = Report::where('computer_id', $computer->id)
            ->where('report_number', $oldReportNumber)
            ->where('report_date', $oldReportDate)
            ->first();

        if (!$newReport || !$oldReport) {
            return response()->json(['error' => 'Один из отчётов не найден', 'status' => '400'], Response::HTTP_BAD_REQUEST);
        }

        $newVulnerabilities = $newReport->vulnerabilities()
            ->with('identifier')
            ->get()
            ->map(function ($vulnerability, $index) {
                return [
                    'number' => $index + 1,
                    'id' => $vulnerability->id,
                    'identifier' => $vulnerability->identifier->number,
                    'error_level' => $vulnerability->error_level,
                    'name' => $vulnerability->name,
                    'description' => $vulnerability->description,
                    'remediation_measures' => $vulnerability->remediation_measures,
                    'source_links' => explode(',', $vulnerability->source_links),
                ];
            })
            ->keyBy('identifier') // Используем identifier для ключа
            ->toArray();

        $oldVulnerabilities = $oldReport->vulnerabilities()
            ->with('identifier')
            ->get()
            ->map(function ($vulnerability, $index) {
                return [
                    'number' => $index + 1,
                    'id' => $vulnerability->id,
                    'identifier' => $vulnerability->identifier->number,
                    'error_level' => $vulnerability->error_level,
                    'name' => $vulnerability->name,
                    'description' => $vulnerability->description,
                    'remediation_measures' => $vulnerability->remediation_measures,
                    'source_links' => explode(',', $vulnerability->source_links),
                ];
            })
            ->keyBy('identifier') // Используем identifier для ключа
            ->toArray();

        $appearedVulnerabilities = array_diff_key($newVulnerabilities, $oldVulnerabilities);
        $remainingVulnerabilities = array_intersect_key($newVulnerabilities, $oldVulnerabilities);
        $fixedVulnerabilities = array_diff_key($oldVulnerabilities, $newVulnerabilities);

        return response()->json([
            'appeared_vulnerabilities' => array_values($appearedVulnerabilities),
            'remaining_vulnerabilities' => array_values($remainingVulnerabilities),
            'fixed_vulnerabilities' => array_values($fixedVulnerabilities),
            'message' => 'Успешно сравнены отчёты',
        ]);
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


    public function destroy(Request $request)
    {
        $reportNumber = $request->input('report_number');
        $reportDate = $request->input('report_date');

        // Найти отчет по номеру и дате
        $report = Report::where('report_number', $reportNumber)
            ->where('report_date', $reportDate)
            ->first();

        if ($report) {

            // $vulnerabilitys = DB::table('report_vulnerability')->where('report_id', $report->id)->pluck('vulnerability_id');
            // if ($vulnerabilitys->count() > 0) {
            //     Vulnerability::whereIn('id', $vulnerabilitys)->delete();
            // }
            $report->vulnerabilities()->detach(); // Удаление связанных записей в промежуточной таблице
            $report->delete();

            return response()->json(['message' => 'Отчет успешно удален.'], 200);
        } else {
            return response()->json(['error' => 'Отчет не найден.'], 404);
        }
    }
}