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
        Schema::create('dashboard_datas', function (Blueprint $table) {
            $table->id();
            $table->string('link_presensi');
            $table->text('capaian_pembelajaran');
            $table->text('tujuan_pembelajaran');
            $table->text('identitas_pembelajaran');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dashboard_datas');
    }
};
