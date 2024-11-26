<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Identifier extends Model
{
    use HasFactory;

    protected $fillable = ['number'];

    public function vulnerabilities()
    {
        return $this->belongsToMany(Vulnerability::class, 'vulnerabilities_identifier')->withTimestamps();
    }
}
