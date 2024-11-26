<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;

class DestroyController extends Controller
{
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
