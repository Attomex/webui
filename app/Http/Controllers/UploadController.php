<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Report;
use App\Models\Computer;
use App\Models\Identifier;
use App\Models\Vulnerability;
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

                // Создание или получение каждого идентификатора
                $identifiers = [];
                foreach ($identifierNumbers as $number) {
                    $identifier = Identifier::firstOrCreate(['number' => $number]);
                    if ($identifier instanceof Identifier) {
                        $identifiers[] = $identifier->id; // Используем идентификаторы, а не объекты
                    } else {
                        throw new Exception("Не удалось создать или получить идентификатор: $number");
                    }
                }

                // Проверка на существование уязвимости с такими же значениями всех полей
                $vulnerability = Vulnerability::where('error_level', $vulnerabilityData['error_level'])
                    ->where('description', $vulnerabilityData['description'])
                    ->where('source_links', implode(',', $vulnerabilityData['references']))
                    ->where('name', $vulnerabilityData['title'])
                    ->where('remediation_measures', $vulnerabilityData['measures'])
                    ->first();

                if (!$vulnerability) {
                    // Создание новой уязвимости, если её нет
                    $vulnerability = Vulnerability::create([
                        'error_level' => $vulnerabilityData['error_level'],
                        'description' => $vulnerabilityData['description'],
                        'source_links' => implode(',', $vulnerabilityData['references']),
                        'name' => $vulnerabilityData['title'],
                        'remediation_measures' => $vulnerabilityData['measures'],
                    ]);
                }

                // Присоединение идентификаторов к уязвимости
                $vulnerability->identifiers()->sync($identifiers);

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
            \Log::error('Ошибка при загрузке отчета: ' . $e->getMessage());
            
            return response()->json(['message' => "Произошла ошибка при загрузке отчета" . $e, 'status' => '500'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
