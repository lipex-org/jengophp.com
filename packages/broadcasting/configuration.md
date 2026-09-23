# Configuration

## 1. Connection Definitions (`app/Config/Broadcasting.php`)

```php
namespace Config;

use Jengo\Broadcasting\Config\Broadcasting as BaseBroadcasting;

class Broadcasting extends BaseBroadcasting
{
    /**
     * Default broadcasting connection.
     * Supported: 'sse', 'soketi', 'pusher', 'redis', 'ably', 'log', 'null'
     */
    public string $default = 'sse';

    public array $connections = [
        // Pure-PHP Server-Sent Events (Zero daemon required)
        'sse' => [
            'driver'       => 'sse',
            'heartbeat'    => 15,
            'cache_prefix' => 'jengo_sse_events',
            'ttl'          => 300,
            'retry'        => 3000,
        ],

        // Built-in development WebSocket server / Soketi
        'soketi' => [
            'driver'  => 'pusher',
            'key'     => 'app-key',
            'secret'  => 'app-secret',
            'app_id'  => 'app-id',
            'options' => [
                'host'    => '127.0.0.1',
                'port'    => 6001,
                'scheme'  => 'http',
                'useTLS'  => false,
            ],
        ],

        // Managed Pusher Channels
        'pusher' => [
            'driver'  => 'pusher',
            'key'     => env('PUSHER_APP_KEY', ''),
            'secret'  => env('PUSHER_APP_SECRET', ''),
            'app_id'  => env('PUSHER_APP_ID', ''),
            'options' => [
                'cluster' => env('PUSHER_APP_CLUSTER', 'mt1'),
                'useTLS'  => true,
            ],
        ],
    ];
}
```

## 2. Channel Authorization (`app/Config/Channels.php`)

Register authorization callbacks for private and presence channels:

```php
use Jengo\Broadcasting\Broadcast;

// Private user channel: users.{id}
Broadcast::channel('users.{id}', static function ($user, int $id): bool {
    $userId = is_object($user) ? ($user->id ?? 0) : ($user['id'] ?? 0);
    return (int) $userId === (int) $id;
});

// Private order tracking channel: orders.{id}
Broadcast::channel('orders.{id}', static function ($user, int $id): bool {
    return true; // Authorized for demonstration
});

// Presence chat channel: chat.{room}
Broadcast::channel('chat.{room}', static function ($user, string $room): array|false {
    if (! $user) {
        return false;
    }

    return [
        'id'   => (string) ($user->id ?? 1),
        'name' => (string) ($user->name ?? 'User'),
        'room' => $room,
    ];
});
```
