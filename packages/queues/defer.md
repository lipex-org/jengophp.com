# Deferring Work (`defer()`)

`jengo/queues` provides a zero-boilerplate `defer()` helper function to offload tasks, closures, or callables to the background queue without having to write dedicated Job classes.

---

## 1. Why Use `defer()`?

In web request flows (such as processing payment webhooks, sending transactional emails, or firing external HTTP webhooks), doing heavy computation synchronously forces the client or payment gateway to wait, causing request latency and third-party timeouts.

With `defer()`, you execute the task on the default queue immediately, freeing up the HTTP request and responding to the client in milliseconds.

---

## 2. Basic Usage

Call `defer()` anywhere in your controllers, services, or events passing an anonymous closure:

```php
// In a Controller
public function register()
{
    $user = $this->createUser();

    // Defer sending welcome email and onboarding analytics to background queue
    defer(function () use ($user) {
        $mailer = service('mailer');
        $mailer->sendWelcomeEmail($user->email, $user->id);
    });

    return $this->response->setJSON(['status' => 'user_registered']);
}
```

---

## 3. Webhook Acknowledgment Pattern

A prime use-case is payment webhook processing (such as in `jengo/pesa`):

```php
public function handleWebhook(string $gateway)
{
    $gatewayDriver = Pesa::gateway($gateway);
    $handler = $gatewayDriver->getWebhookHandler();
    
    // 1. Verify signatures synchronously (< 5ms)
    $payload = $handler->handle($this->request);

    // 2. Defer heavy database ledger writes, order fulfillment, and event emission
    defer(function () use ($gateway, $payload) {
        $this->processLedgerState($gateway, $payload);
    });

    // 3. Immediately return HTTP 200 to Safaricom/Stripe/Pesapal
    return $handler->createAcknowledgmentResponse($payload);
}
```

---

## 4. Passing Parameters & Callables

You can pass arguments to `defer()` as trailing parameters or supply PHP callables (methods, static functions, invokables):

```php
// Passing parameters to closure
defer(function ($orderId, $customerEmail) {
    OrderService::fulfill($orderId, $customerEmail);
}, $order->id, $order->customer_email);

// Passing callable array
defer([OrderService::class, 'fulfill'], $order->id, $order->customer_email);
```

---

## 5. Behind the Scenes

When you call `defer()`, `jengo/queues`:
1. Wraps the closure and arguments using `Laravel\SerializableClosure` inside a `DeferredCallbackJob`.
2. Pushes the job to your default configured queue driver (Redis, Database, or Sync).
3. The background worker daemon (`php spark jengo:queue work`) picks up the job and executes the closure inside an isolated try/catch boundary.
