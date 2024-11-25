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
        Schema::create('erd_relations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('materi_id')->constrained('materis')->onDelete('cascade');
            $table->foreignId('from')->constrained('erd_tables')->onDelete('cascade');
            $table->foreignId('to')->constrained('erd_tables')->onDelete('cascade');
            $table->enum('type', ['one-to-one', 'one-to-many', 'many-to-one', 'many-to-many']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('erd_relations');
    }
};
