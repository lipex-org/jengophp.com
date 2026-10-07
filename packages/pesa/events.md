# Events & Listeners

`jengo/pesa` dispatches strongly-typed CodeIgniter 4 events throughout the payment lifecycle. You can listen to these events to fulfill orders, activate subscriptions, dispatch asynchronous background jobs (e.g. via `jengo/queues`), broadcast real-time status updates to frontends (via `jengo/broadcasting`), or send SMS and email receipts.

---

## 1. Summary of Emitted Events

| Event Name | Event Class | Trigger Condition |
| :--- | :--- | :--- |
| `pesa.payment_initiated` | [`Jengo\Pesa\Events\PaymentInitiated`](#1-paymentinitiated) | Dispatched when a payment request (STK push, hosted checkout, B2C disbursement) is initialized and written to the ledger. |
| `pesa.payment_succeeded` | [`Jengo\Pesa\Events\PaymentSucceeded`](#2-paymentsucceeded) | Dispatched when an incoming callback or webhook verifies that funds have been successfully received and settled. |
| `pesa.payment_failed` | [`Jengo\Pesa\Events\PaymentFailed`](#3-paymentfailed) | Dispatched when a payment fails, expires, has insufficient balance, or is cancelled by the user. |
| `pesa.payment_reversed` | [`Jengo\Pesa\Events\PaymentReversed`](#4-paymentreversed) | Dispatched when a previously completed transaction is reversed or refunded. |

---

## 2. Event Class Reference

All event classes inherit from `Jengo\Pesa\Events\BasePaymentEvent` and provide direct access to the `PesaTransaction` entity and raw gateway response metadata.

### 1. `PaymentInitiated`
- **Class**: `Jengo\Pesa\Events\PaymentInitiated`
- **Properties**:
  - `$event->transaction`: `PesaTransaction` (Status: `pending`)
  - `$event->metadata`: `array` (Raw gateway initiation response)

```php
use CodeIgniter\Events\Events;
use Jengo\Pesa\Events\PaymentInitiated;

Events::on('pesa.payment_initiated', static function (PaymentInitiated $event) {
    $tx = $event->transaction;

    log_message('info', "Payment initiated: Gateway [{$tx->gateway}] Ref [{$tx->reference}] Amount [{$tx->amount} {$tx->currency}]");
});
```

---

### 2. `PaymentSucceeded`
- **Class**: `Jengo\Pesa\Events\PaymentSucceeded`
- **Properties**:
  - `$event->transaction`: `PesaTransaction` (Status: `successful`)
  - `$event->metadata`: `array` (Raw gateway callback payload, including M-Pesa CallbackMetadata items)

```php
use CodeIgniter\Events\Events;
use Jengo\Pesa\Events\PaymentSucceeded;

Events::on('pesa.payment_succeeded', static function (PaymentSucceeded $event) {
    $tx = $event->transaction;

    $orderId       = $tx->reference;
    $receiptNumber = $tx->receipt_number; // e.g. QKH7189XYZ
    $amountPaid    = $tx->amount;
    $phone         = $tx->payer_phone;
    $email         = $tx->payer_email;

    // 1. Mark internal order as paid
    $orders = model('OrderModel');
    $orders->where('reference', $orderId)->set(['status' => 'paid', 'receipt' => $receiptNumber])->update();

    // 2. Broadcast real-time payment confirmation to frontend (jengo/broadcasting)
    // Broadcast::channel("orders.{$orderId}")->send('OrderPaid', ['receipt' => $receiptNumber]);
});
```

---

### 3. `PaymentFailed`
- **Class**: `Jengo\Pesa\Events\PaymentFailed`
- **Properties**:
  - `$event->transaction`: `PesaTransaction` (Status: `failed`)
  - `$event->reason`: `string` (Human-readable error or cancellation reason, e.g. "Request cancelled by user")
  - `$event->metadata`: `array` (Raw failure payload)

```php
use CodeIgniter\Events\Events;
use Jengo\Pesa\Events\PaymentFailed;

Events::on('pesa.payment_failed', static function (PaymentFailed $event) {
    $tx     = $event->transaction;
    $reason = $event->reason;

    log_message('warning', "Payment failed for Ref [{$tx->reference}]. Reason: {$reason}");

    // Release reserved inventory items or alert customer
});
```

---

### 4. `PaymentReversed`
- **Class**: `Jengo\Pesa\Events\PaymentReversed`
- **Properties**:
  - `$event->transaction`: `PesaTransaction` (Status: `reversed`)
  - `$event->metadata`: `array` (Raw reversal callback)

```php
use CodeIgniter\Events\Events;
use Jengo\Pesa\Events\PaymentReversed;

Events::on('pesa.payment_reversed', static function (PaymentReversed $event) {
    $tx = $event->transaction;

    // Revoke access or mark invoice as refunded
    log_message('notice', "Transaction reversed: Receipt [{$tx->receipt_number}] Ref [{$tx->reference}]");
});
```

---

## 3. Registering Event Listeners

Register your event listeners inside `app/Config/Events.php` or inside a dedicated service subscriber.

```php
<?php

namespace Config;

use CodeIgniter\Events\Events;
use Jengo\Pesa\Events\PaymentSucceeded;
use Jengo\Pesa\Events\PaymentFailed;

// Register listeners
Events::on('pesa.payment_succeeded', [App\Subscribers\PaymentSubscriber::class, 'onSuccess']);
Events::on('pesa.payment_failed', [App\Subscribers\PaymentSubscriber::class, 'onFailure']);
```
