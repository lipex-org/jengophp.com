# Heavy Background Job & Export Progress Bar (Private Channels)

**Scenario**: User clicks "Export 100,000 Transactions (CSV)". The server queues the export and streams progress (10% -> 50% -> 100%) privately to that user.

## The Event (`app/Events/ExportProgressUpdated.php`)

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

## The Chunked Worker Dispatch

```php
for ($p = 25; $p <= 100; $p += 25) {
    usleep(500000);
    $url = ($p === 100) ? '/downloads/report.csv' : null;
    $msg = ($p === 100) ? 'Ready for download!' : "Processing {$p}%...";
    broadcast(new ExportProgressUpdated($userId, $p, $msg, $url));
}
```
