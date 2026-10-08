# Real-Time Payments & Polling

Because mobile money payments (like M-Pesa STK Push) are asynchronous, your application needs a strategy to notify the user's browser or mobile app the moment funds are confirmed.

---

## Pattern 1: Polling with STK Query

For standard AJAX/Fetch web apps or simple SPAs, poll a backend endpoint every 3–5 seconds until the transaction resolves:

### Backend Controller Endpoint
```php
namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\HTTP\ResponseInterface;
use Jengo\Pesa\Models\PesaTransactionModel;
use Jengo\Pesa\Pesa;

class PaymentStatusController extends Controller
{
    public function checkStatus(string $checkoutRequestId): ResponseInterface
    {
        $model = new PesaTransactionModel();
        $tx = $model->findByGatewayReference('mpesa', $checkoutRequestId);

        // 1. Check if the webhook already updated the transaction in the ledger
        if ($tx && $tx->isSuccessful()) {
            return $this->response->setJSON([
                'status'  => 'successful',
                'receipt' => $tx->receipt_number,
                'amount'  => $tx->amount,
            ]);
        }

        if ($tx && $tx->isFailed()) {
            return $this->response->setJSON([
                'status' => 'failed',
                'reason' => $tx->failure_reason,
            ]);
        }

        // 2. If still pending after grace period, query Daraja directly
        $queryResult = Pesa::gateway('mpesa')->queryStkStatus($checkoutRequestId);

        if ($queryResult->isSuccessful()) {
            return $this->response->setJSON([
                'status'  => 'successful',
                'receipt' => $queryResult->receiptNumber,
            ]);
        }

        return $this->response->setJSON([
            'status' => 'pending',
            'desc'   => 'Waiting for user to enter PIN...',
        ]);
    }
}
```

### Frontend JavaScript Poller
```javascript
async function pollPaymentStatus(checkoutRequestId) {
    const maxAttempts = 15;
    let attempts = 0;

    const interval = setInterval(async () => {
        attempts++;
        const res = await fetch(`/payments/check-status/${checkoutRequestId}`);
        const data = await res.json();

        if (data.status === 'successful') {
            clearInterval(interval);
            window.location.href = `/orders/success?receipt=${data.receipt}`;
        } else if (data.status === 'failed') {
            clearInterval(interval);
            alert(`Payment failed: ${data.reason}`);
        } else if (attempts >= maxAttempts) {
            clearInterval(interval);
            alert('Payment timed out. Please check your phone or retry.');
        }
    }, 3500);
}
```

---

## Pattern 2: Real-Time WebSockets (`jengo/broadcasting`)

For instant, zero-latency payment screens without polling overhead, combine `jengo/pesa` with `jengo/broadcasting`:

### 1. Broadcast on Payment Success
In `app/Config/Events.php`:

```php
use CodeIgniter\Events\Events;
use Jengo\Broadcasting\Broadcast;
use Jengo\Pesa\Events\PaymentSucceeded;

Events::on('pesa.payment_succeeded', static function (PaymentSucceeded $event) {
    $tx = $event->transaction;

    // Broadcast instant event to private/public channel for this order
    Broadcast::channel("orders.{$tx->reference}")->send('PaymentConfirmed', [
        'order_id'       => $tx->reference,
        'receipt_number' => $tx->receipt_number,
        'amount'         => $tx->amount,
        'paid_at'        => $tx->completed_at,
    ]);
});
```

### 2. Frontend Real-Time Listener (Echo / Jengo Client)
```typescript
import { Echo } from '@jengo/broadcasting-client';

Echo.channel(`orders.${orderReference}`)
    .listen('.PaymentConfirmed', (data) => {
        showSuccessModal(`Payment received! Receipt: ${data.receipt_number}`);
        redirectToDashboard();
    });
```
