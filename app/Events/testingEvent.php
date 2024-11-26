<?php

// app/Events/TestingEvent.php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TestingEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $videoData;
    public $teacherId;

    /**
     * Create a new event instance.
     */
    public function __construct($videoData, $teacherId)
    {
        $this->videoData = $videoData; // Base64 video data
        $this->teacherId = $teacherId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('testChannel.' . $this->teacherId), // Send to teacher's channel
        ];
    }

    /**
     * Broadcast the data.
     *
     * @return array
     */
    public function broadcastWith(): array
    {
        return [
            'videoData' => $this->videoData, // Send base64 video data
        ];
    }
}
