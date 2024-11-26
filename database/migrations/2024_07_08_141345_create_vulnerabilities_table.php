<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vulnerabilities', function (Blueprint $table) {
            $table->id();
            $table->string('error_level');
            $table->text('description');
            $table->text('source_links');
            $table->text('name');
            $table->text('remediation_measures');
            $table->timestamps();

            $table->unique([
                'error_level',
                'description',
                'source_links',
                'name',
                'remediation_measures'
            ], 'vuln_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vulnerabilities');
    }
};
