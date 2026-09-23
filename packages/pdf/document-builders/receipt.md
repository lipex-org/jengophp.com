# Payment Receipt & Voucher

```php
use Jengo\Pdf\Pdf;

return Pdf::receipt('REC-4901')
    ->client(['name' => 'Jane Doe'])
    ->amount(1500.00, 'USD')
    ->paymentMethod('M-Pesa Express')
    ->reference('QHD7823LK9')
    ->for('Quarterly Co-working Space Subscription')
    ->download('receipt-4901.pdf');
```
