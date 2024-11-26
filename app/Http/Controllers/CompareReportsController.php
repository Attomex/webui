<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\Computer;
use Symfony\Component\HttpFoundation\Response;


class CompareReportsController extends Controller
{
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
}
