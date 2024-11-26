<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\Computer;
use Symfony\Component\HttpFoundation\Response;

class ViewController extends Controller
{
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
            ->with('identifiers') // Загружаем связанные идентификаторы
            ->get()
            ->map(function ($vulnerability, $index) {
                return [
                    'number' => $index + 1,
                    'identifiers' => $vulnerability->identifiers->pluck('number')->implode('; '), // Получаем массив идентификаторов
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
}
