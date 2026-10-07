# Custom Gateways & Extensibility

`jengo/pesa` is architected around clean interfaces and manager-driven resolution, making it easy to create and register custom payment gateway drivers (e.g. Flutterwave, Paystack, DPO Group, Bank APIs).

---

## 1. Creating a Gateway Driver

Extend `Jengo\Pesa\Drivers\AbstractGateway` and implement the capability interfaces your gateway supports:

- `StkPushInterface`: For synchronous mobile money prompts (STK push, USSD push).
- `HostedCheckoutInterface`: For hosted redirect payment flows.
- `B2CInterface`: For payouts and business-to-customer disbursements.
- `C2BInterface`: For customer-to-business URL registration.

```php
<?php

namespace App\Gateways;

use Jengo\Pesa\Contracts\HostedCheckoutInterface;
use Jengo\Pesa\Contracts\WebhookHandlerInterface;
use Jengo\Pesa\Drivers\AbstractGateway;
use Jengo\Pesa\DTO\CheckoutRequest;
use Jengo\Pesa\DTO\CheckoutResponse;
use Jengo\Pesa\Exceptions\GatewayRequestException;

class FlutterwaveGateway extends AbstractGateway implements HostedCheckoutInterface
{
    protected ?FlutterwaveWebhookHandler $webhookHandler = null;

    public function getName(): string
    {
        return 'flutterwave';
    }

    public function getWebhookHandler(): WebhookHandlerInterface
    {
        if ($this->webhookHandler === null) {
            $this->webhookHandler = new FlutterwaveWebhookHandler($this->config['secret_hash'] ?? '');
        }
        return $this->webhookHandler;
    }

    public function checkout(CheckoutRequest $request): CheckoutResponse
    {
        $secretKey = (string) ($this->config['secret_key'] ?? '');
        $merchantRef = $request->reference ?? ('FLW-' . uniqid());

        $payload = [
            'tx_ref'          => $merchantRef,
            'amount'          => $request->amount,
            'currency'        => $request->currency,
            'redirect_url'    => $request->callbackUrl,
            'customer' => [
                'email'        => $request->email,
                'phonenumber'  => $request->phone,
            ],
            'customizations' => [
                'title'       => $request->description,
            ],
        ];

        try {
            $response = $this->getHttpClient()->post('https://api.flutterwave.com/v3/payments', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $secretKey,
                    'Content-Type'  => 'application/json',
                ],
                'json' => $payload,
            ]);

            $data = json_decode((string) $response->getBody(), true);
            $redirectUrl = $data['data']['link'] ?? '';

            if ($response->getStatusCode() === 200 && ! empty($redirectUrl)) {
                // Record in ledger
                $this->recordPendingTransaction(
                    gatewayReference: $merchantRef,
                    type: 'hosted_checkout',
                    amount: $request->amount,
                    currency: $request->currency,
                    reference: $merchantRef,
                    email: $request->email,
                    rawRequest: $payload
                );

                return new CheckoutResponse(
                    successful: true,
                    redirectUrl: $redirectUrl,
                    gatewayReference: $merchantRef,
                    reference: $merchantRef,
                    raw: $data
                );
            }

            return new CheckoutResponse(successful: false, raw: $data);
        } catch (\Throwable $e) {
            throw new GatewayRequestException('Flutterwave error: ' . $e->getMessage(), 0, [], $e);
        }
    }
}
```

---

## 2. Implementing the Webhook Handler

Implement `WebhookHandlerInterface` to parse and verify incoming HTTP notifications:

```php
<?php

namespace App\Gateways;

use CodeIgniter\HTTP\IncomingRequest;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;
use Jengo\Pesa\Contracts\WebhookHandlerInterface;
use Jengo\Pesa\DTO\WebhookPayload;
use Jengo\Pesa\Exceptions\WebhookVerificationException;

class FlutterwaveWebhookHandler implements WebhookHandlerInterface
{
    public function __construct(protected string $secretHash) {}

    public function handle(IncomingRequest $request): WebhookPayload
    {
        $signature = $request->getHeaderLine('verif-hash');

        if ($signature !== $this->secretHash) {
            throw new WebhookVerificationException('Invalid Flutterwave webhook signature header.');
        }

        $rawBody = (string) $request->getBody();
        $data = json_decode($rawBody, true) ?? [];

        $status = strtolower($data['data']['status'] ?? '');
        $isSuccess = ($status === 'successful');

        return new WebhookPayload(
            gateway: 'flutterwave',
            event: $isSuccess ? 'payment.success' : 'payment.failed',
            gatewayReference: (string) ($data['data']['tx_ref'] ?? ''),
            reference: (string) ($data['data']['tx_ref'] ?? ''),
            receiptNumber: (string) ($data['data']['flw_ref'] ?? ''),
            amount: (float) ($data['data']['amount'] ?? 0.0),
            currency: (string) ($data['data']['currency'] ?? 'USD'),
            payerEmail: (string) ($data['data']['customer']['email'] ?? ''),
            raw: $data
        );
    }

    public function createAcknowledgmentResponse(WebhookPayload $payload): ResponseInterface
    {
        return Services::response()->setStatusCode(200)->setJSON(['status' => 'acknowledged']);
    }
}
```

---

## 3. Registering the Driver with `PesaManager`

Register your custom gateway driver during application bootstrap (e.g. in `app/Config/Events.php` on `pre_system` or in a Service Provider):

```php
use App\Gateways\FlutterwaveGateway;
use CodeIgniter\Events\Events;
use Jengo\Pesa\Pesa;

Events::on('pre_system', static function () {
    Pesa::getManager()->extend('flutterwave', static function ($config, $pesaConfig) {
        $flwConfig = $pesaConfig->gateways['flutterwave'] ?? [];
        return new FlutterwaveGateway($flwConfig, $pesaConfig);
    });
});
```

Now you can invoke your custom gateway anywhere in your application:

```php
$checkout = Pesa::gateway('flutterwave')->checkout($request);
```

And webhooks will be automatically routed and verified at `/pesa/webhook/flutterwave`!
