# Commercial Invoice

```php
use Jengo\Pdf\Pdf;

return Pdf::invoice('INV-2026-001')
    ->date(new DateTime('2026-03-15'))
    ->dueDate(new DateTime('2026-04-15'))
    ->company([
        'name'    => 'Acme Technologies Ltd',
        'address' => '100 Innovation Way, Nairobi, Kenya',
        'email'   => 'billing@acme.com',
        'vat_number' => 'P051234567Z',
    ])
    ->client([
        'name'    => 'Globex Corporation',
        'address' => '450 Westlands Blvd, Nairobi',
        'email'   => 'accounts@globex.com',
    ])
    ->addItem('Enterprise Cloud Architecture', 1, 3500.00)
    ->addItem('Security Audit & Penetration Testing', 2, 1200.00)
    ->tax(16.0)      // 16% VAT
    ->discount(10.0) // 10% Discount
    ->notes('Payment is due within 30 days. Thank you for your business!')
    ->paid(false)
    ->preview(); // or ->download()
```
