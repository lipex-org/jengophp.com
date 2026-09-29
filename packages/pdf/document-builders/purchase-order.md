# Purchase Order

The `PurchaseOrder` builder generates procurement orders sent to vendors with line item calculations, delivery terms, and shipping addresses.

```php
use Jengo\Pdf\Pdf;

return Pdf::purchaseOrder('PO-2026-0044')
    ->date('2026-09-29')
    ->expectedDate('2026-10-15')
    ->vendor(
        name: 'Silicon Components Inc',
        contact: 'Alice Sales',
        address: '100 Silicon Way, Tech Park',
        email: 'sales@silicon.com',
        phone: '+1 555 0199'
    )
    ->shipTo(
        name: 'Hardware Assembly Facility',
        address: '77 Industrial Road, Dock 3',
        contact: 'Bob Inventory',
        phone: '+1 555 0188'
    )
    ->addItem('Microcontroller Unit MCU-32', price: 4.50, qty: 1000, sku: 'MCU-32-SMD')
    ->addItem('Power Management IC PMIC-05', price: 1.20, qty: 2000, sku: 'PMIC-05-SOIC')
    ->taxRate(8.5)
    ->shipping(150.00)
    ->paymentTerms('Net 30 Days')
    ->shippingMethod('Air Express Courier')
    ->deliveryTerms('FOB Destination')
    ->download('PO-2026-0044.pdf');
```

---

## Fluent Configuration Options

| Method | Description |
| :--- | :--- |
| `->number(string $poNumber)` | Purchase Order number. |
| `->date(string $date)` | Order issuance date. |
| `->expectedDate(string $date)` | Target delivery fulfillment date. |
| `->vendor(...)` | Vendor supplier information (`name`, `contact`, `address`, `email`, `phone`). |
| `->shipTo(...)` | Destination receiving address and warehouse contact. |
| `->addItem(...)` | Add line item with price, quantity, and SKU. Total is auto-calculated. |
| `->taxRate(float $rate)` | Applied tax percentage. |
| `->shipping(float $amount)` | Shipping/freight cost. |
| `->paymentTerms(string $terms)` | Payment terms (e.g. `Net 30 Days`, `Prepaid`). |
| `->shippingMethod(string $method)` | Logistics carrier or transport method. |
| `->deliveryTerms(string $terms)` | Incoterms / delivery terms (e.g. `FOB Destination`). |
