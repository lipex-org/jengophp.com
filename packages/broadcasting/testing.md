# Testing with `Broadcast::fake()`

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
