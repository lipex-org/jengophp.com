# Webhooks & Events

`jengo/pesa` includes an auto-routed webhook controller accessible at `/pesa/webhook/{gateway}` (CSRF exempt).

---

## 1. Webhook Lifecycle & Ledger Idempotency

When a payment gateway delivers a callback or IPN notification:
1. The driver parses the payload and verifies authenticity (signatures, tokens, or result structures).
2. The transaction is updated in `pesa_transactions` (`pending` &rarr; `successful` | `failed` | `reversed`).
3. If a webhook with a successful state arrives for an already `successful` transaction, processing is skipped (idempotent guard).
4. Strongly-typed CodeIgniter events are triggered with the transaction entity and raw payload.

---

## 2. Listening to Payment Events

Register listeners in `app/Config/Events.php`:

```php
use CodeIgniter\Events\Events;
use Jengo\Pesa\Events\PaymentSucceeded;
use Jengo\Pesa\Events\PaymentFailed;
use Jengo\Pesa\Events\PaymentReversed;

// Payment Succeeded Event
Events::on('pesa.payment_succeeded', static function (PaymentSucceeded $event) {
    $transaction = $event->transaction;
    
    $receipt = $transaction->receipt_number; // e.g. QKH7189XYZ
    $amount  = $transaction->amount;
    $ref     = $transaction->reference;
    $phone   = $transaction->payer_phone;
    
    // Fulfill order, provision account, or send confirmation SMS
});

// Payment Failed Event
Events::on('pesa.payment_failed', static function (PaymentFailed $event) {
    $transaction = $event->transaction;
    $reason = $event->reason;
    
    // Notify user of cancellation or insufficient balance
});

// Payment Reversed Event
Events::on('pesa.payment_reversed', static function (PaymentReversed $event) {
    $transaction = $event->transaction;
    
    // Handle refund or reversal
});
```
