# Webhooks & Events

`jengo/pesa` includes an auto-routed, CSRF-exempt webhook controller accessible at `/pesa/webhook/{gateway}` to process asynchronous gateway notifications.

---

## 1. Automatic Webhook Routing

When you install `jengo/pesa`, the following route is automatically registered via `Jengo\Pesa\Config\Routes`:

```php
$routes->match(['post', 'get'], 'pesa/webhook/(:segment)', '\Jengo\Pesa\Controllers\PesaWebhookController::handle/$1', [
    'as'   => 'pesa.webhook',
    'csrf' => false, // Exempt from CSRF protection for external API servers
]);
```

You can generate dynamic callback URLs anywhere in your code using CodeIgniter's reverse routing:

```php
$mpesaCallbackUrl    = route_to('pesa.webhook', 'mpesa');    // https://myapp.com/pesa/webhook/mpesa
$pesapalCallbackUrl  = route_to('pesa.webhook', 'pesapal');  // https://myapp.com/pesa/webhook/pesapal
$stripeWebhookUrl    = route_to('pesa.webhook', 'stripe');   // https://myapp.com/pesa/webhook/stripe
```

---

## 2. Webhook Security & Verification

Each gateway driver implements a dedicated `WebhookHandlerInterface`:

- **M-Pesa**: Parses Safaricom `stkCallback`, C2B confirmation, and B2C queue payloads.
- **Pesapal v3**: Verifies IPN notifications and queries the transaction status endpoint using the authenticated bearer token.
- **Stripe**: Verifies `Stripe-Signature` HMAC signatures using your configured `webhook_secret`. Throws `WebhookVerificationException` on forged requests.

---

## 3. Strongly-Typed Payment Events

All payment state changes emit standard CodeIgniter events. Register listeners in `app/Config/Events.php`:

```php
use CodeIgniter\Events\Events;
use Jengo\Pesa\Events\PaymentInitiated;
use Jengo\Pesa\Events\PaymentSucceeded;
use Jengo\Pesa\Events\PaymentFailed;
use Jengo\Pesa\Events\PaymentReversed;

// 1. Payment Initiated
Events::on('pesa.payment_initiated', static function (PaymentInitiated $event) {
    $transaction = $event->transaction;
    log_message('info', "Payment initiated for reference: {$transaction->reference}");
});

// 2. Payment Succeeded
Events::on('pesa.payment_succeeded', static function (PaymentSucceeded $event) {
    $tx = $event->transaction;
    
    $receipt = $tx->receipt_number; // e.g. QKH7189XYZ
    $amount  = $tx->amount;
    $ref     = $tx->reference;
    $phone   = $tx->payer_phone;
    
    // Fulfill order, provision account, or send confirmation SMS
});

// 3. Payment Failed
Events::on('pesa.payment_failed', static function (PaymentFailed $event) {
    $tx = $event->transaction;
    $reason = $event->reason; // e.g. "Request cancelled by user."
    
    // Notify customer or unlock reserved cart inventory
});

// 4. Payment Reversed
Events::on('pesa.payment_reversed', static function (PaymentReversed $event) {
    $tx = $event->transaction;
    
    // Handle customer refund or revoke subscription
});
```

---

## 4. Webhook Acknowledgment Responses

`PesaWebhookController` automatically returns the exact HTTP response format required by each provider:
- **M-Pesa**: `{"ResultCode": 0, "ResultDesc": "Success"}`
- **Pesapal**: `{"status": "200", "message": "OK"}`
- **Stripe**: `{"received": true}`
