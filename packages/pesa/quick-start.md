# Quick Start

Get up and running with payment processing using `jengo/pesa` in minutes.

---

## 1. Triggering an M-Pesa STK Push

Prompt a user's phone for an instant M-Pesa PIN payment:

```php
use Jengo\Pesa\DTO\StkRequest;
use Jengo\Pesa\Pesa;

// Trigger STK Push to a Kenyan phone number
$response = Pesa::gateway('mpesa')->stkPush(new StkRequest(
    phone: '0712345678', // Auto-normalized to 254712345678
    amount: 1500,
    accountReference: 'INV-1002',
    transactionDesc: 'Annual Subscription',
    callbackUrl: route_to('pesa.webhook', 'mpesa')
));

if ($response->isPending()) {
    $checkoutRequestId = $response->checkoutRequestId; // e.g. ws_CO_07102026...
    
    // Store checkoutRequestId in your session or return to frontend for polling
    return response()->setJSON([
        'status'  => 'prompt_sent',
        'ref'     => $checkoutRequestId,
        'message' => 'Please enter your M-Pesa PIN on your phone.'
    ]);
}
```

---

## 2. Using Global Helper Functions

`jengo/pesa` auto-loads convenient global helpers:

```php
// Format phone numbers to E.164 (2547XXXXXXXX)
$phone = pesa_format_phone('0712 345 678'); // "254712345678"

// Invoke gateways fluently via helper
$payout = pesa('mpesa')->disburse($disbursementRequest);
$checkout = pesa('pesapal')->checkout($checkoutRequest);
```

---

## 3. Creating Hosted Checkout Sessions

Redirect customers to secure hosted checkout pages (Pesapal or Stripe):

```php
use Jengo\Pesa\DTO\CheckoutRequest;
use Jengo\Pesa\Pesa;

$checkout = Pesa::gateway('pesapal')->checkout(new CheckoutRequest(
    amount: 3500,
    currency: 'KES',
    description: 'Order #9042',
    callbackUrl: site_url('/orders/9042/verify'),
    email: 'customer@example.com',
    phone: '254712345678',
    reference: 'ORD-9042'
));

if ($checkout->successful) {
    return redirect()->to($checkout->redirectUrl);
}
```

---

## 4. Handling Payment Results

Listen for verified webhook notifications in `app/Config/Events.php`:

```php
use CodeIgniter\Events\Events;
use Jengo\Pesa\Events\PaymentSucceeded;

Events::on('pesa.payment_succeeded', static function (PaymentSucceeded $event) {
    $tx = $event->transaction;

    // Transaction is verified and updated in pesa_transactions
    $orderRef = $tx->reference;
    $receipt  = $tx->receipt_number; // e.g. QKH7189XYZ
    $amount   = $tx->amount;

    // Fulfill order, activate subscription, send receipt email
});
```
