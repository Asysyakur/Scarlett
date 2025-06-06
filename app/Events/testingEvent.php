<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TestingEvent implements ShouldBroadcast
{
    public $studentId;
    public $peerId;
    public $name;
    public $from;

    public function __construct($studentId, $peerId, $name, $from)
    {
        $this->studentId = $studentId;
        $this->peerId = $peerId;
        $this->name = $name;
        $this->from = $from;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('test-monitoring'),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'studentId' => $this->studentId,
            'peerId' => $this->peerId,
            'name' => $this->name,
            'from' => $this->from,
        ];
    }

    public function broadcastAs()
    {
        return 'screen-share-started';  // Nama event yang dipancarkan
    }
}
