<?php

namespace App\Http\Controllers;

use Exception;
use Inertia\Inertia;
use App\Models\Report;
use App\Models\Computer;
use App\Models\Vulnerability;
use App\Models\Identifier;
use Illuminate\Http\Request;
use League\CommonMark\Node\Block\Document;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Symfony\Component\DomCrawler\Crawler;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Illuminate\Support\Facades\Log;

class AdminGraphs extends Controller
{
    public function allErrors(){
        $errorLevels = ['Критический', 'Высокий', 'Средний', 'Низкий'];

        $counts = [];

        foreach ($errorLevels as $level) {
            $counts[$level] = Vulnerability::where('error_level', $level)->count();
        }

        return response()->json([
            'error_levels_count' => $counts,
            'message' => 'Успешно получены количества ошибок по уровням',
        ]);
    }
}
