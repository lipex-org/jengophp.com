# Error Handling & Exceptions

`jengo/pesa` uses a structured exception hierarchy to ensure you can catch, inspect, and recover from payment failures, invalid parameters, or external gateway errors cleanly.

---

## 1. Exception Hierarchy

```text
\RuntimeException
 └── Jengo\Pesa\Exceptions\PesaException (Base Exception)
      ├── Jengo\Pesa\Exceptions\InvalidGatewayException
      ├── Jengo\Pesa\Exceptions\GatewayRequestException
      └── Jengo\Pesa\Exceptions\WebhookVerificationException
```

| Exception Class | When It's Thrown |
| :--- | :--- |
| `PesaException` | Base package exception thrown on configuration errors or general runtime failures. |
| `InvalidGatewayException` | Thrown when requesting an unregistered gateway name via `Pesa::gateway('unknown')`. |
| `GatewayRequestException` | Thrown when an HTTP request to an external provider fails (HTTP 4xx/5xx or network timeout). |
| `WebhookVerificationException` | Thrown when an incoming webhook contains an invalid signature or unauthorized payload. |

---

## 2. Catching Gateway Request Errors

When calling external payment APIs (`stkPush`, `checkout`, `disburse`, `queryStatus`), wrap calls in a `try...catch` block targeting `GatewayRequestException`.

`GatewayRequestException` provides the HTTP status code and parsed response payload returned by the provider:

```php
use Jengo\Pesa\DTO\StkRequest;
use Jengo\Pesa\Exceptions\GatewayRequestException;
use Jengo\Pesa\Exceptions\PesaException;
use Jengo\Pesa\Pesa;

try {
    $response = Pesa::gateway('mpesa')->stkPush(new StkRequest(
        phone: '0712345678',
        amount: 1500,
        accountReference: 'INV-1002',
        transactionDesc: 'Annual Subscription'
    ));

    if ($response->isPending()) {
        return response()->setJSON([
            'status'  => 'prompt_sent',
            'ref'     => $response->checkoutRequestId,
            'message' => 'Please enter your M-Pesa PIN on your phone.',
        ]);
    }

    // Provider accepted request but returned an application-level rejection
    return response()->setStatusCode(400)->setJSON([
        'status'  => 'rejected',
        'code'    => $response->responseCode,
        'message' => $response->customerMessage,
    ]);

} catch (GatewayRequestException $e) {
    // HTTP communication error or provider outage
    log_message('error', "M-Pesa API Request Failed: {$e->getMessage()} (HTTP {$e->statusCode})");

    // Inspect raw provider error payload
    $rawError = $e->responseBody;

    return response()->setStatusCode(502)->setJSON([
        'error'   => 'payment_gateway_unavailable',
        'message' => 'Unable to communicate with the payment provider. Please try again.',
    ]);

} catch (PesaException $e) {
    // Configuration or validation error
    log_message('critical', "Pesa configuration error: {$e->getMessage()}");

    return response()->setStatusCode(500)->setJSON([
        'error'   => 'configuration_error',
        'message' => 'Payment subsystem error. Contact support.',
    ]);
}
```

---

## 3. Webhook Exceptions & HTTP Responses

`PesaWebhookController` automatically wraps incoming webhook verification in `try...catch`:
- If signature verification fails (e.g. invalid `Stripe-Signature`), a `WebhookVerificationException` is caught.
- The controller automatically logs the failure and responds with **HTTP 400 Bad Request** to prevent malicious payload execution:

```json
{
  "error": true,
  "message": "Invalid Stripe webhook signature"
}
```
