# M-Pesa Daraja Workflows

The `mpesa` driver provides a unified interface for Safaricom Daraja 3.0 operations.

---

## 1. STK Push (Lipa Na M-Pesa Online)

Trigger an instant PIN prompt on the customer's phone:

```php
use Jengo\Pesa\DTO\StkRequest;
use Jengo\Pesa\Pesa;

$response = Pesa::gateway('mpesa')->stkPush(new StkRequest(
    phone: '0712345678', // Auto-normalized to 254712345678
    amount: 1500,
    accountReference: 'INV-1002',
    transactionDesc: 'Annual Subscription',
    callbackUrl: route_to('pesa.webhook', 'mpesa')
));

if ($response->isPending()) {
    $checkoutRequestId = $response->checkoutRequestId; // ws_CO_...
    // Prompt dispatched to user phone!
}
```

---

## 2. STK Status Query

Query the status of an ongoing or completed STK push transaction:

```php
$status = Pesa::gateway('mpesa')->queryStkStatus($checkoutRequestId);

if ($status->isSuccessful()) {
    echo $status->receiptNumber; // e.g. QKH7189XYZ
}
```

---

## 3. B2C Disbursements & Payouts

Send funds from your Paybill or B2C working account directly to a customer's phone (e.g. salary payments, withdrawals, dividend payouts):

```php
use Jengo\Pesa\DTO\DisbursementRequest;

$payout = Pesa::gateway('mpesa')->disburse(new DisbursementRequest(
    phone: '0712345678',
    amount: 2500,
    commandId: 'BusinessPayment', // BusinessPayment | SalaryPayment | PromotionPayment
    remarks: 'Monthly Payout',
    occasion: 'Dividend Q3',
    reference: 'PAY-881'
));

if ($payout->successful) {
    echo $payout->conversationId;
}
```

---

## 4. C2B URL Registration

Register validation and confirmation URLs for your Paybill or Till number using the Spark CLI command or programmatically:

```php
$result = Pesa::gateway('mpesa')->registerC2BUrls(
    shortCode: '600999',
    responseType: 'Completed',
    validationUrl: 'https://myapp.com/pesa/webhook/mpesa',
    confirmationUrl: 'https://myapp.com/pesa/webhook/mpesa'
);
```
