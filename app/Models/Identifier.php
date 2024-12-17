<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Identifier extends Model
{
    use HasFactory;

    protected $fillable = ['number'];

    public function reportVulnerabilities()
    {
        return $this->belongsToMany(ReportVulnerability::class, 'report_vulnerability_identifiers', 'identifier_id', 'report_vulnerability_id');
    }

}
