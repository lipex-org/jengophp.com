# Transaction Ledger & Entities

`jengo/pesa` includes a built-in immutable transaction ledger powered by CodeIgniter 4 Models and Entities.

---

## 1. The `pesa_transactions` Table

When ledger tracking is enabled (`public bool $enableLedger = true;` in `Config/Pesa.php`), all payment dispatches, checkout redirects, and incoming webhooks are automatically logged.

### Schema Structure

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | Unique UUID primary key |
| `reference` | `VARCHAR(100)` | Internal merchant/order reference (e.g. `INV-1002`, `ORD-9042`) |
| `gateway` | `VARCHAR(50)` | Gateway identifier (`mpesa`, `pesapal`, `stripe`, `fake`) |
| `gateway_reference` | `VARCHAR(150)` | External provider tracking ID (`CheckoutRequestID`, `order_tracking_id`, `cs_test_...`) |
| `receipt_number` | `VARCHAR(100)` | Provider confirmation/receipt code (e.g., M-Pesa receipt `QKH7189XYZ`) |
| `type` | `VARCHAR(50)` | Transaction type (`stk_push`, `c2b_payment`, `b2c_disbursement`, `hosted_checkout`) |
| `status` | `VARCHAR(30)` | Current state (`pending`, `successful`, `failed`, `cancelled`, `reversed`) |
| `amount` | `DECIMAL(12,2)` | Transaction amount |
| `currency` | `VARCHAR(10)` | ISO-4217 Currency code (`KES`, `USD`, `EUR`, etc.) |
| `payer_phone` | `VARCHAR(30)` | Customer MSISDN phone number |
| `payer_name` | `VARCHAR(150)` | Customer full name |
| `payer_email` | `VARCHAR(150)` | Customer email address |
| `failure_reason` | `TEXT` | Detailed failure or cancellation error message from gateway |
| `raw_request` | `JSON` | Complete outgoing API request payload |
| `raw_response` | `JSON` | Complete incoming webhook/query payload |
| `completed_at` | `DATETIME` | Timestamp when payment was resolved or confirmed |
| `created_at` | `DATETIME` | Creation timestamp |
| `updated_at` | `DATETIME` | Last update timestamp |

---

## 2. Using `PesaTransactionModel`

Query the ledger directly in your controllers, services, or commands:

```php
use Jengo\Pesa\Models\PesaTransactionModel;

$model = new PesaTransactionModel();

// Find by external gateway reference (e.g. CheckoutRequestID or Stripe Session ID)
$transaction = $model->findByGatewayReference('mpesa', $checkoutRequestId);

// Find by internal merchant reference
$transaction = $model->findByReference('ORD-9042');

// Find all successful transactions for a phone number
$history = $model->where('payer_phone', '254712345678')
    ->where('status', 'successful')
    ->orderBy('created_at', 'DESC')
    ->findAll();
```

---

## 3. Working with `PesaTransaction` Entity

The `PesaTransaction` entity provides helper methods and automatic JSON casting:

```php
use Jengo\Pesa\Entities\PesaTransaction;

/** @var PesaTransaction $tx */
if ($tx->isSuccessful()) {
    echo "Receipt: " . $tx->receipt_number;
    echo "Paid at: " . $tx->completed_at->toLocalizedString();
}

if ($tx->isPending()) {
    // Transaction awaiting customer PIN or redirect callback
}

if ($tx->isFailed()) {
    echo "Failed reason: " . $tx->failure_reason;
}

// Access raw gateway payloads (auto-cast to PHP array)
$mpesaMetadata = $tx->raw_response['Body']['stkCallback']['CallbackMetadata']['Item'] ?? [];
```

---

## 4. Idempotency Protection

`jengo/pesa` protects your application from duplicate webhook calls:
- If a gateway retries delivering a `successful` callback for a transaction that is already marked as `successful`, `PesaWebhookController` logs the receipt, skips redundant database updates, and prevents duplicate event triggers.
