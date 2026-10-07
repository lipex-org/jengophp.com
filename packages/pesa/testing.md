# Testing Payments

`jengo/pesa` includes a dedicated `fake` driver designed specifically for unit testing, CI pipelines, and local environments where live payment gateway credentials or tunnels are unavailable.

---

## 1. Configuring the Fake Gateway

In your `phpunit.xml.dist` or within individual test `setUp()` methods:

```php
use Jengo\Pesa\Config\Pesa as PesaConfig;

// Set default driver to fake
config('Pesa')->default = 'fake';
```

---

## 2. Testing STK Push & Queries

```php
use Jengo\Pesa\DTO\StkRequest;
use Jengo\Pesa\Pesa;

public function testStkPushFlow(): void
{
    $request = new StkRequest(
        phone: '0712345678',
        amount: 500,
        accountReference: 'INV-1002',
        transactionDesc: 'Test payment'
    );

    $response = Pesa::gateway('fake')->stkPush($request);

    $this->assertTrue($response->successful);
    $this->assertTrue($response->isPending());
    $this->assertStringStartsWith('ws_FAKE_', $response->checkoutRequestId);

    // Query transaction status
    $status = Pesa::gateway('fake')->queryStkStatus($response->checkoutRequestId);

    $this->assertTrue($status->isSuccessful());
    $this->assertStringStartsWith('RC_FAKE_', $status->receiptNumber);
}
```

---

## 3. Testing Hosted Checkouts & B2C Payouts

```php
use Jengo\Pesa\DTO\CheckoutRequest;
use Jengo\Pesa\DTO\DisbursementRequest;
use Jengo\Pesa\Pesa;

public function testHostedCheckoutAndDisbursement(): void
{
    // Test hosted checkout
    $checkout = Pesa::gateway('fake')->checkout(new CheckoutRequest(
        amount: 2500,
        currency: 'KES',
        description: 'Order #1',
        callbackUrl: 'https://example.com/callback'
    ));

    $this->assertTrue($checkout->successful);
    $this->assertStringContainsString('fake-gateway.local', $checkout->redirectUrl);

    // Test B2C disbursement
    $payout = Pesa::gateway('fake')->disburse(new DisbursementRequest(
        phone: '0712345678',
        amount: 1000,
        commandId: 'BusinessPayment',
        remarks: 'Test Payout'
    ));

    $this->assertTrue($payout->successful);
    $this->assertStringStartsWith('B2C_FAKE_', $payout->conversationId);
}
```

---

## 4. Testing Webhook Controllers & Events

Simulate an incoming webhook to verify event dispatching and ledger updates:

```php
use CodeIgniter\Events\Events;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\FeatureTestTrait;

class WebhookTest extends CIUnitTestCase
{
    use FeatureTestTrait;

    public function testWebhookDispatchesPaymentSucceeded(): void
    {
        $eventFired = false;

        Events::on('pesa.payment_succeeded', function ($event) use (&$eventFired) {
            $eventFired = true;
        });

        // Trigger fake webhook endpoint
        $result = $this->post('/pesa/webhook/fake', [
            'ref' => 'ws_FAKE_TEST123',
        ]);

        $result->assertStatus(200);
        $this->assertTrue($eventFired);
    }
}
```
