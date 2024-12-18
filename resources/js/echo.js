import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Ensure that Pusher is correctly set up in the global window object
window.Pusher = Pusher;

// Create a new Echo instance and pass the necessary configuration
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,  // This should match the key in your .env
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,  // This should match the cluster in your .env
    forceTLS: true,
    encrypted: true,
    wsHost: window.location.hostname,
    wsPort: 6001,  // Default port for Pusher
    wssPort: 6001,  // Default WSS port for Pusher
    disableStats: true,
});
