<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel(('MonitoringChannel.user.{id}'), function ($user, $id) {
    return $user->id === $id;
});
