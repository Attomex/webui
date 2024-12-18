<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\Computer;
use App\Models\ReportVulnerability;
use Symfony\Component\HttpFoundation\Response;

class ViewController extends Controller
{
    // public function view(Request $request)
    // {
    //     // Получаем данные из запроса
    //     $computerIdentifier = $request->input('computer_identifier');
    //     $reportNumber = $request->input('report_number');
    //     $date = $request->input('report_date');

    //     // Находим компьютер по идентификатору
    //     $computer = Computer::where('identifier', $computerIdentifier)->first();
    //     if (!$computer) {
    //         return response()->json(['error' => 'Компьютер не найден', 'status' => '400'], Response::HTTP_BAD_REQUEST);
    //     }

    //     // Ищем отчёт для этого компьютера
    //     $report = Report::where('computer_id', $computer->id)
    //         ->where('report_number', $reportNumber)
    //         ->where('report_date', $date)
    //         ->first();

    //     if (!$report) {
    //         return response()->json(['error' => 'Отчёт не найден', 'status' => '400'], Response::HTTP_BAD_REQUEST);
    //     }

    //     try {
    //         // Получаем все уязвимости через промежуточную таблицу report_vulnerability
    //         $reportVulnerabilities = ReportVulnerability::where('report_id', $report->id)
    //             ->with(['files', 'identifiers', 'vulnerability']) // Загружаем файлы, идентификаторы и сами уязвимости
    //             ->get();

    //         // Преобразуем данные в нужный формат
    //         $vulnerabilities = $reportVulnerabilities->map(function ($reportVuln, $index) {
    //             return [
    //                 'number' => $index + 1,
    //                 'identifiers' => $reportVuln->identifiers->pluck('number')->implode('; '), // Собираем идентификаторы
    //                 'error_level' => $reportVuln->vulnerability->error_level,
    //                 'name' => $reportVuln->vulnerability->name,
    //                 'description' => $reportVuln->vulnerability->description,
    //                 'remediation_measures' => $reportVuln->vulnerability->remediation_measures,
    //                 'source_links' => explode(',', $reportVuln->vulnerability->source_links),
    //                 'files' => $reportVuln->files->pluck('file_path')->toArray(), // Пути к файлам
    //             ];
    //         });

    //         $jsonString = json_encode($vulnerabilities, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    //         $filePath = storage_path('\\app\\reports\\' . uniqid() . '.json');
    //         file_put_contents($filePath, $jsonString);

    //         return response()->json([
    //             'vulnerabilities' => $vulnerabilities,
    //             'message' => 'Успешно получены уязвимости',
    //         ]);
    //     } catch (\Exception $e) {
    //         \Log::error('Ошибка при получении уязвимостей: ' . $e->getMessage());
    //         return response()->json(['error' => 'Произошла ошибка при получении уязвимостей', 'status' => '500'], Response::HTTP_INTERNAL_SERVER_ERROR);
    //     }
    // }
    public function view(Request $request)
    {
        // Получаем данные из запроса
        $computerIdentifier = $request->input('computer_identifier');
        $reportNumber = $request->input('report_number');
        $date = $request->input('report_date');

        // Находим компьютер по идентификатору
        $computer = Computer::where('identifier', $computerIdentifier)->first();
        if (!$computer) {
            return response()->json(['error' => 'Компьютер не найден', 'status' => '400'], Response::HTTP_BAD_REQUEST);
        }

        // Ищем отчёт для этого компьютера
        $report = Report::where('computer_id', $computer->id)
            ->where('report_number', $reportNumber)
            ->where('report_date', $date)
            ->first();

        if (!$report) {
            return response()->json(['error' => 'Отчёт не найден', 'status' => '400'], Response::HTTP_BAD_REQUEST);
        }

        try {
            // Получаем все уязвимости через промежуточную таблицу report_vulnerability
            $reportVulnerabilities = ReportVulnerability::where('report_id', $report->id)
                ->with(['files', 'identifiers', 'vulnerability']) // Загружаем файлы, идентификаторы и сами уязвимости
                ->get();

            // Создаем массив для хранения данных
            $filesData = [];

            // Обрабатываем каждую уязвимость
            foreach ($reportVulnerabilities as $reportVuln) {
                $vulnerabilityData = [
                    'identifiers' => $reportVuln->identifiers->pluck('number')->implode('; '), // Собираем идентификаторы
                    'error_level' => $reportVuln->vulnerability->error_level,
                    'name' => $reportVuln->vulnerability->name,
                    'description' => $reportVuln->vulnerability->description,
                    'remediation_measures' => $reportVuln->vulnerability->remediation_measures,
                    'source_links' => explode(',', $reportVuln->vulnerability->source_links),
                ];

                // Добавляем уязвимость в соответствующий файл
                foreach ($reportVuln->files as $file) {
                    $filePath = $file->file_path;
                    if (!isset($filesData[$filePath])) {
                        $filesData[$filePath] = [];
                    }
                    $filesData[$filePath][] = $vulnerabilityData;
                }
            }
            $jsonString = json_encode($filesData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            $filePath = storage_path('\\app\\reports\\' . uniqid() . '.json');
            file_put_contents($filePath, $jsonString);
            return response()->json([
                'vulnerabilities' => $filesData,
                'message' => 'Успешно получены уязвимости',
            ]);
        } catch (\Exception $e) {
            \Log::error('Ошибка при получении уязвимостей: ' . $e->getMessage());
            return response()->json(['error' => 'Произошла ошибка при получении уязвимостей', 'status' => '500'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}