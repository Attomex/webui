<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory;

    protected $fillable = ['file_path'];

    public function reportVulnerabilities()
    {
        return $this->belongsToMany(ReportVulnerability::class, 'report_vulnerability_files', 'file_id', 'report_vulnerability_id');
    }
}
