<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('user_id')->constrained(); // Foreign key to users table
            $table->string('path'); // Halaman yang dikunjungi
            $table->timestamp('start_time')->nullable(); // Waktu mulai aktivitas
            $table->timestamp('end_time')->nullable(); // Waktu selesai aktivitas
            $table->integer('duration')->default(0); // Durasi kumulatif (detik)
            $table->timestamps(); // Kolom created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('activities');
    }
};
