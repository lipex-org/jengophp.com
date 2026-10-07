# Hosted Checkouts (Pesapal & Stripe)

For card payments, bank transfers, or international multi-currency checkouts, `jengo/pesa` provides drivers for **Pesapal v3** and **Stripe Checkout**.

---

## 1. Pesapal v3 Hosted Checkout

Create an order and redirect the customer to Pesapal's secure checkout (supporting M-Pesa, Airtel Money, Visa, and Mastercard):

```php
use Jengo\Pesa\DTO\CheckoutRequest;
use Jengo\Pesa\Pesa;

$checkout = Pesa::gateway('pesapal')->checkout(new CheckoutRequest(
    amount: 4500,
    currency: 'KES',
    description: 'Order #442',
    callbackUrl: site_url('/orders/442/verify'),
    email: 'customer@example.com',
    phone: '254712345678',
    reference: 'ORD-442'
));

if ($checkout->successful) {
    return redirect()->to($checkout->redirectUrl);
}
```

---

## 2. Stripe Checkout Sessions

Create a Stripe Checkout Session with support for international cards:

```php
use Jengo\Pesa\DTO\CheckoutRequest;
use Jengo\Pesa\Pesa;

$checkout = Pesa::gateway('stripe')->checkout(new CheckoutRequest(
    amount: 50.00,
    currency: 'USD',
    description: 'Pro Plan Subscription',
    callbackUrl: site_url('/billing/success'),
    cancelUrl: site_url('/billing/cancel'),
    email: 'customer@example.com',
    reference: 'SUB-991'
));

if ($checkout->successful) {
    return redirect()->to($checkout->redirectUrl);
}
```
