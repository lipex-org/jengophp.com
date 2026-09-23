# Quotation / Project Proposal

```php
use Jengo\Pdf\Pdf;

return Pdf::quotation('QUO-8802')
    ->client(['name' => 'Starlight Studios', 'email' => 'contact@starlight.io'])
    ->addItem('Custom Web Application MVP', 1, 8000.00)
    ->addItem('Inertia.js Frontend Integration', 1, 2500.00)
    ->validUntil(new DateTime('+30 days'))
    ->preview();
```
