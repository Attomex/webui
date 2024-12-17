<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Report;
use App\Models\Computer;
use App\Models\Identifier;
use App\Models\Vulnerability;
use App\Models\ReportVulnerability;
use App\Models\File;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class UploadController extends Controller
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
                'total_critical' => $parsedData['totalCritical'],
                'total_high' => $parsedData['totalHigh'],
                'total_medium' => $parsedData['totalMedium'],
                'total_low' => $parsedData['totalLow']
            ]);

            foreach ($parsedData["vulnerabilities"] as $vulnerabilityData) {
                // Разделение идентификаторов
                $identifierNumbers = explode('; ', $vulnerabilityData['id']);

                // Проверка и создание уязвимости
                $vulnerability = Vulnerability::firstOrCreate([
                    'error_level' => $vulnerabilityData['error_level'],
                    'description' => $vulnerabilityData['description'],
                    'source_links' => implode(',', $vulnerabilityData['references']),
                    'name' => $vulnerabilityData['title'],
                    'remediation_measures' => $vulnerabilityData['measures'],
                ]);

                // Создание промежуточной записи report_vulnerability
                $reportVulnerability = ReportVulnerability::firstOrCreate([
                    'report_id' => $report->id,
                    'vulnerability_id' => $vulnerability->id
                ]);

                // Обработка идентификаторов и их связи
                foreach ($identifierNumbers as $number) {
                    $identifier = Identifier::firstOrCreate(['number' => $number]);
                    DB::table('report_vulnerability_identifiers')->updateOrInsert([
                        'report_vulnerability_id' => $reportVulnerability->id,
                        'identifier_id' => $identifier->id
                    ]);
                }

                // Обработка файлов и их связи
                foreach ($vulnerabilityData['files'] as $filePath) {
                    if ($filePath) {
                        $file = File::firstOrCreate(['file_path' => $filePath]);
                        DB::table('report_vulnerability_files')->updateOrInsert([
                            'report_vulnerability_id' => $reportVulnerability->id,
                            'file_id' => $file->id
                        ]);
                    }
                }
            }

            // Сохранение исходного JSON в файл
            $jsonString = json_encode($parsedData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            $filePath = storage_path('\\app\\reports\\' . uniqid() . '.json');
            file_put_contents($filePath, $jsonString);

            DB::commit();

            return response()->json(['message' => "Отчет успешно загружен"]);
        } catch (Exception $e) {
            DB::rollBack();
            \Log::error('Ошибка при загрузке отчета: ' . $e->getMessage());

            return response()->json(['message' => "Произошла ошибка при загрузке отчета: " . $e->getMessage(), 'status' => '500'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}