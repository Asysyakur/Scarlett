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
        Schema::create('materis', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // Title of the materi
            $table->text('description')->nullable(); // Description of the materi
            $table->text('content'); // Link to the materi
            $table->string('image')->nullable(); // Image of the materi
            $table->string('video')->nullable(); // Video of the materi
            $table->string('file')->nullable(); // File of the materi
            $table->boolean('dnd')->default(false);
            $table->boolean('studikasus')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materis');
    }
};
