<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vulnerabilities_identifier', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vulnerability_id')->constrained()->onDelete('cascade');
            $table->foreignId('identifier_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['vulnerability_id', 'identifier_id'], 'vuln_ident');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vulnerabilities_identifier');
    }
};
