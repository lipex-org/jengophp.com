# Webhooks & Callbacks

`jengo/pesa` includes an auto-routed, CSRF-exempt webhook controller accessible at `/pesa/webhook/{gateway}` to process asynchronous gateway notifications and IPN callbacks.

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

## 3. Webhook Acknowledgment Responses

`PesaWebhookController` automatically returns the exact HTTP response format required by each provider:
- **M-Pesa**: `{"ResultCode": 0, "ResultDesc": "Success"}`
- **Pesapal**: `{"status": "200", "message": "OK"}`
- **Stripe**: `{"received": true}`

---

## 4. Dispatched Events

Upon processing a webhook, `jengo/pesa` updates the transaction ledger and dispatches corresponding events (`pesa.payment_succeeded`, `pesa.payment_failed`, `pesa.payment_reversed`).

See the [Events & Listeners](/packages/pesa/events) guide for full event signatures and examples.
