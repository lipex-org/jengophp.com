# M-Pesa Daraja Workflows

The `mpesa` driver provides a unified interface for Safaricom Daraja 3.0 operations, including STK Push (Lipa Na M-Pesa Online), C2B (Customer to Business), B2C (Business to Customer payouts), and status queries.

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

### Automatic Phone Sanitization
`StkRequest` automatically normalizes common Kenyan phone number formats (`07XXXXXXXX`, `01XXXXXXXX`, `+2547XXXXXXXX`, `2547XXXXXXXX`) to standard international MSISDN format (`2547XXXXXXXX`).

---

## 2. STK Status Query

Query the status of an ongoing or completed STK push transaction in real time:

```php
$status = Pesa::gateway('mpesa')->queryStkStatus($checkoutRequestId);

if ($status->isSuccessful()) {
    echo $status->receiptNumber; // e.g. QKH7189XYZ
} elseif ($status->isFailed()) {
    echo $status->resultDesc;    // e.g. "Request cancelled by user."
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

### Security Credential Encryption
For live B2C operations, Safaricom requires encrypting the initiator plaintext password with Safaricom's X509 public certificate. `jengo/pesa` handles this automatically:

```php
// In app/Config/Pesa.php:
'mpesa' => [
    'initiator_name'     => 'api_initiator',
    'initiator_password' => 'PlaintextPassword123',
    'cert_path'          => WRITEPATH . 'certs/ProductionCertificate.cer',
    // Or supply pre-encrypted credential directly:
    // 'security_credential' => 'EncryptedBase64String...',
]
```

---

## 4. C2B URL Registration & Instant Confirmation

Register validation and confirmation URLs for your Paybill or Till number so Safaricom posts transactions directly to your app:

### Via Spark CLI
```bash
php spark jengo:pesa mpesa register-c2b --shortcode=600999
```

### Programmatically
```php
$result = Pesa::gateway('mpesa')->registerC2BUrls(
    shortCode: '600999',
    responseType: 'Completed',
    validationUrl: route_to('pesa.webhook', 'mpesa'),
    confirmationUrl: route_to('pesa.webhook', 'mpesa')
);
```

### Direct C2B Paybill Ingest
When a customer pays via Paybill/Till directly (without prior STK Push), `PesaWebhookController` automatically catches the callback, registers the new transaction record in `pesa_transactions` with `type: 'c2b_payment'`, and fires `PaymentSucceeded`.

---

## 5. Automatic OAuth Token Caching

The `MpesaAuthenticator` retrieves OAuth 2.0 Bearer tokens from Safaricom Daraja 3.0 (`/oauth/v1/generate?grant_type=client_credentials`) and caches them securely in CodeIgniter 4's cache store for 55 minutes, avoiding rate limiting and reducing API latency.
