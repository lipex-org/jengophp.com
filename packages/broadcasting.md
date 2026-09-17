# jengo/broadcasting

> [!WARNING]
> **DEVELOPMENT / EXPERIMENTAL STATUS**
> This package and its built-in pure-PHP WebSocket daemon (`php spark broadcast:serve`) are currently in **active development and experimental status**.
> **THIS PACKAGE IS NOT PRODUCTION READY.**
> - The built-in WebSocket daemon is provided strictly for **local development**, **rapid prototyping**, and **experimental testing**.
> - It has not undergone formal security audits, multi-process clustering hardening, or long-term socket leak stress tests.
> - Do not deploy or rely on this package in production or mission-critical environments.

---

## Overview

`jengo/broadcasting` is a real-time event broadcasting subsystem for **CodeIgniter 4** and the **Jengo Framework**. It bridges server-side PHP domain events to frontend client interfaces over WebSockets and Server-Sent Events (SSE), enabling instantaneous UI updates without client polling.

---

## Key Capabilities

- **Multi-Driver Architecture**: Pusher Channels, Soketi, Laravel Reverb, Server-Sent Events (SSE), Redis Pub/Sub, Ably, Log, and Null drivers.
- **Pure-PHP Server-Sent Events (SSE)**: Built-in, zero-daemon streaming engine delivering real-time events directly through standard PHP-FPM web workers without requiring background Node.js or WebSocket processes.
- **Built-in Development WebSocket Daemon**: Native RFC 6455 and Pusher Protocol v7 WebSocket server (`php spark broadcast:serve`) built with PHP `stream_select` for zero-dependency local development and testing.
- **Channel Hierarchy**: Standard public (`Channel`), private (`PrivateChannel`), and presence (`PresenceChannel`) value objects.
- **Declarative Channel Authorization**: Define channel rules via `Broadcast::channel('orders.{id}', fn($user, $id) => ...)` with wildcard parameter binding.
- **Event-Driven & Fluent Broadcasting**: Broadcast domain events implementing `ShouldBroadcast` or dispatch ad-hoc payloads via `Broadcast::on('orders')->as('OrderPlaced')->send()`.
- **Wire-Compatible with Laravel Echo & Pusher JS**: Integrates directly with standard frontend WebSocket client libraries.
- **Sender Exclusion (`toOthers()`)**: Exclude the initiating client's socket ID from receiving their own broadcast to prevent duplicate renders and interface stutter.
- **Zero-Cost Test Double (`Broadcast::fake()`)**: In-memory test double with comprehensive assertions (`assertBroadcasted`, `assertBroadcastedTo`, `assertNotBroadcasted`).

---

## Installation

Install via Composer:

```bash
composer require jengo/broadcasting
```

Publish configuration files into your application:

```bash
php spark jengo:install broadcasting
```

---

## Configuration

### 1. Connection Definitions (`app/Config/Broadcasting.php`)

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

### 2. Channel Authorization (`app/Config/Channels.php`)

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

---

## The Broadcasting Mental Model

In standard web applications, communication is strictly client-pull:
- **Client Pull (HTTP Request-Response)**: The browser asks, and the server answers. If something changes on the server, the browser cannot know unless it polls (`setInterval(fetch, 2000)`), wasting bandwidth, CPU, and database queries.
- **Server Push (Broadcasting)**: A lightweight pipeline (WebSocket or SSE) remains connected. The instant an event occurs in PHP, calling `broadcast(new Event())` pushes the payload to all subscribed browsers in milliseconds.

```
[ PHP Backend Action ]
        │
        ▼ (triggers event)
broadcast(new OrderStatusUpdated($id, 'Cooking'))
        │
        ▼ (driver sends payload)
[ Broadcaster Engine: SSE or WebSocket ]
        │
        ▼ (pushes frame over open socket)
[ Client Browser Frontend ]
        │
        ▼ (receives event within ~10ms)
DOM updates without page reload
```

---

## Practical Application Guides

Below are five practical patterns to build and test real-time features from scratch.

### 1. Live Order / Delivery Tracker (Public Channels)

**Scenario**: Customer views a tracking screen. When kitchen staff or delivery drivers update status, the progress bar and status notes advance live.

#### The Event (`app/Events/OrderStatusUpdated.php`)
```php
namespace App\Events;

use Jengo\Broadcasting\Channels\Channel;
use Jengo\Broadcasting\Contracts\ShouldBroadcast;

class OrderStatusUpdated implements ShouldBroadcast
{
    public function __construct(
        public string $orderId,
        public string $status,
        public string $description,
        public int $progressPercent
    ) {}

    public function broadcastOn(): Channel
    {
        return new Channel('orders.' . $this->orderId);
    }

    public function broadcastAs(): string
    {
        return 'StatusUpdated';
    }

    public function broadcastWith(): array
    {
        return [
            'order_id'         => $this->orderId,
            'status'           => $this->status,
            'description'      => $this->description,
            'progress_percent' => $this->progressPercent,
            'updated_at'       => date('H:i:s'),
        ];
    }
}
```

#### The Controller Trigger
```php
public function updateStatus()
{
    $orderId = $this->request->getPost('order_id');
    $event = new OrderStatusUpdated($orderId, 'Cooking', 'Chef started preparing your meal.', 50);
    broadcast($event);

    return $this->response->setJSON(['status' => 'success']);
}
```

#### The Frontend Listener (Native WebSocket)
```javascript
const orderId = "101";
const ws = new WebSocket("ws://127.0.0.1:6001");

ws.onopen = () => {
    ws.send(JSON.stringify({
        event: "pusher:subscribe",
        data: { channel: "orders." + orderId }
    }));
};

ws.onmessage = (event) => {
    const frame = JSON.parse(event.data);
    if (frame.event === "StatusUpdated") {
        const data = typeof frame.data === "string" ? JSON.parse(frame.data) : frame.data;
        document.getElementById("progressBar").style.width = data.progress_percent + "%";
        document.getElementById("statusText").textContent = data.status + ": " + data.description;
    }
};
```

---

### 2. Heavy Background Job & Export Progress Bar (Private Channels)

**Scenario**: User clicks "Export 100,000 Transactions (CSV)". The server queues the export and streams progress (10% -> 50% -> 100%) privately to that user.

#### The Event (`app/Events/ExportProgressUpdated.php`)
```php
namespace App\Events;

use Jengo\Broadcasting\Channels\PrivateChannel;
use Jengo\Broadcasting\Contracts\ShouldBroadcast;

class ExportProgressUpdated implements ShouldBroadcast
{
    public function __construct(
        public int $userId,
        public int $percent,
        public string $statusMessage,
        public ?string $downloadUrl = null
    ) {}

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('users.' . $this->userId);
    }

    public function broadcastAs(): string
    {
        return 'ExportProgress';
    }

    public function broadcastWith(): array
    {
        return [
            'percent'      => $this->percent,
            'message'      => $this->statusMessage,
            'download_url' => $this->downloadUrl,
        ];
    }
}
```

#### The Chunked Worker Dispatch
```php
for ($p = 25; $p <= 100; $p += 25) {
    usleep(500000);
    $url = ($p === 100) ? '/downloads/report.csv' : null;
    $msg = ($p === 100) ? 'Ready for download!' : "Processing {$p}%...";
    broadcast(new ExportProgressUpdated($userId, $p, $msg, $url));
}
```

---

### 3. Collaborative Kanban Board (`toOthers()` Pattern)

**Scenario**: User A drags a task card from "In Progress" to "Done". User B's screen sees the card move immediately, but User A does not receive their own echo, preventing UI stutter.

```php
public function moveTask()
{
    $taskId   = (string) $this->request->getPost('task_id');
    $toColumn = (string) $this->request->getPost('to_column');
    $socketId = $this->request->getHeaderLine('X-Socket-ID');

    Broadcast::on('board.engineering')
        ->as('TaskMoved')
        ->with(['task_id' => $taskId, 'to_column' => $toColumn])
        ->toOthers($socketId)
        ->send();

    return $this->response->setJSON(['status' => 'success']);
}
```

Client extracts `socket_id` on connection and passes it in headers:
```javascript
let currentSocketId = null;

ws.onmessage = (e) => {
    const frame = JSON.parse(e.data);
    if (frame.event === "pusher:connection_established") {
        currentSocketId = JSON.parse(frame.data).socket_id;
    }
    if (frame.event === "TaskMoved") {
        moveCardInDOM(frame.data.task_id, frame.data.to_column);
    }
};

fetch("/tasks/move", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-Socket-ID": currentSocketId
    },
    body: JSON.stringify({ task_id: 12, to_column: "done" })
});
```

---

### 4. Flash Sale Stock Counter (High-Frequency Public Channel)

**Scenario**: Flash sale inventory ticker. All shoppers see available stock update live the moment any user completes a purchase.

```php
$remainingStock = $productModel->decrementStock($productId, 1);

broadcast(new StockUpdated($productId, $remainingStock));
```

```javascript
ws.onmessage = (e) => {
    const frame = JSON.parse(e.data);
    if (frame.event === "StockUpdated") {
        document.getElementById("stockCounter").textContent = frame.data.stock + " left";
        if (frame.data.stock <= 0) {
            document.getElementById("buyBtn").disabled = true;
            document.getElementById("buyBtn").textContent = "Sold Out";
        }
    }
};
```

---

### 5. Live Interactive Polling Room (Presence Channels)

**Scenario**: Real-time quiz or poll. Shows who is currently online in the room and tallies poll results in real time.

```php
// In app/Config/Channels.php
Broadcast::channel('poll.{id}', function ($user, string $id): array|false {
    if (! $user) return false;
    return ['id' => (string) $user->id, 'name' => (string) $user->name];
});
```

---

## Local Development WebSocket Server

Start the built-in development daemon:

```bash
# Default host 0.0.0.0, port 6001
php spark broadcast:serve

# Custom options
php spark broadcast:serve --host=127.0.0.1 --port=8080
```

> [!NOTE]
> The built-in daemon is designed strictly as a zero-dependency local development and testing convenience. It eliminates the need for Node.js, Docker, or external cloud accounts during local feature development. It is **not** intended for production environments.

---

## Frontend Client (`@jengo/broadcasting`)

`@jengo/broadcasting` is the official client library for Jengo and CodeIgniter 4, providing unified real-time event subscriptions over Server-Sent Events (SSE) and WebSockets, with built-in deduplication, automatic reconnection, and reactive hooks for React and Vue.

### Installation

```bash
npm install @jengo/broadcasting
```

### Server-Sent Events (SSE) Setup

Zero-daemon streaming directly through CodeIgniter 4's SSE controller:

```ts
import JengoBroadcaster from '@jengo/broadcasting';

const broadcaster = new JengoBroadcaster({
    broadcaster: 'sse',
    endpoint: '/broadcasting/sse',
    authEndpoint: '/broadcasting/auth',
});

// Subscribe to a public channel
broadcaster.channel('orders')
    .listen('OrderCreated', (event) => {
        console.log('New Order:', event);
    });
```

### WebSockets (Soketi / Pusher / Jengo WS) Setup

```ts
import JengoBroadcaster from '@jengo/broadcasting';

const broadcaster = new JengoBroadcaster({
    broadcaster: 'ws',
    key: 'jengo-app-key',
    wsHost: window.location.hostname,
    wsPort: 6001,
    forceTLS: false,
    authEndpoint: '/broadcasting/auth',
});

// Private channel with automatic CI4 CSRF handshake
broadcaster.private('chat.123')
    .listen('NewMessage', (message) => {
        console.log('Message:', message);
    });

// Presence channel
broadcaster.join('room.lobby')
    .here((users) => console.log('Active users:', users))
    .joining((user) => console.log('Joined:', user))
    .leaving((user) => console.log('Left:', user));
```

### React Integration

Import hooks directly from `@jengo/broadcasting/react`:

```tsx
import { BroadcastingProvider, useChannel, usePresence } from '@jengo/broadcasting/react';

export function ChatRoom({ roomId }: { roomId: string }) {
    useChannel(`chat.${roomId}`, 'NewMessage', (message) => {
        console.log('Incoming:', message);
    });

    const { members } = usePresence(`room.${roomId}`);

    return <div>Online Users: {members.length}</div>;
}
```

### Vue 3 Integration

Import composables directly from `@jengo/broadcasting/vue`:

```vue
<script setup lang="ts">
import { useChannel, usePresence } from '@jengo/broadcasting/vue';

useChannel('orders', 'OrderCreated', (order) => {
    console.log('New order:', order);
});

const { members } = usePresence('room.lobby');
</script>
```

---

## Testing with `Broadcast::fake()`

Use the built-in test fake to assert events without dispatching over sockets:

```php
use App\Events\OrderStatusUpdated;
use CodeIgniter\Test\CIUnitTestCase;
use Jengo\Broadcasting\Broadcast;

final class OrderBroadcastTest extends CIUnitTestCase
{
    public function testOrderBroadcastsOnUpdate(): void
    {
        $fake = Broadcast::fake();

        // Perform application logic
        $this->post('/orders/update-status', ['order_id' => '101', 'status' => 'cooking']);

        // Assert event was broadcasted
        $fake->assertBroadcasted(OrderStatusUpdated::class);
        $fake->assertBroadcastedTo('orders.101', 'StatusUpdated');
    }
}
```

---

## Production Readiness Roadmap

The following engineering milestones are required before `jengo/broadcasting` can be considered for production workloads:

1. **Security & Input Auditing**: Strict packet framing boundaries, protection against slowloris socket exhaustion, and buffer length controls.
2. **Process Supervision**: Multi-process worker management and graceful signal recycling.
3. **Socket Leak & Memory Stability Tests**: 48-hour continuous stress tests under 1,000+ connect/disconnect cycles per minute.
4. **Horizontal Multi-Node Clustering**: Redis Pub/Sub adapter to synchronize events across multiple server instances.
5. **TLS/WSS Termination**: Direct SSL stream context handling without requiring an external reverse proxy.
