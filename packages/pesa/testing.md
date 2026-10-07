# Testing with Fake Gateway

For automated unit tests and CI/CD pipelines where you don't have live API keys or tunnel URLs, use the `fake` driver.

---

## 1. Setting Default Driver to Fake

In your test configuration or `phpunit.xml`:

```php
config('Pesa')->default = 'fake';
```

---

## 2. Testing Payment Workflows

```php
use Jengo\Pesa\DTO\StkRequest;
use Jengo\Pesa\Pesa;

public function testStkPaymentWorkflow(): void
{
    $response = Pesa::gateway('fake')->stkPush(new StkRequest(
        phone: '0712345678',
        amount: 500,
        accountReference: 'INV-100'
    ));

    $this->assertTrue($response->successful);
    $this->assertTrue($response->isPending());

    // Query status
    $status = Pesa::gateway('fake')->queryStkStatus($response->checkoutRequestId);
    $this->assertTrue($status->isSuccessful());
    $this->assertNotNull($status->receiptNumber);
}
```
