# Live Order / Delivery Tracker (Public Channels)

**Scenario**: Customer views a tracking screen. When kitchen staff or delivery drivers update status, the progress bar and status notes advance live.

## The Event (`app/Events/OrderStatusUpdated.php`)

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

## The Controller Trigger

```php
public function updateStatus()
{
    $orderId = $this->request->getPost('order_id');
    $event = new OrderStatusUpdated($orderId, 'Cooking', 'Chef started preparing your meal.', 50);
    broadcast($event);

    return $this->response->setJSON(['status' => 'success']);
}
```

## The Frontend Listener (Native WebSocket)

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
