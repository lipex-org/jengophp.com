# Delivery Note & Dispatch Slip

The `DeliveryNote` document builder creates dispatch manifests, package consignment notes, and logistics delivery acknowledgments.

```php
use Jengo\Pdf\Pdf;

return Pdf::deliveryNote('DN-2026-9042')
    ->date('2026-09-29')
    ->orderNumber('ORD-8821')
    ->recipient(
        name: 'Mega Retail Store',
        address: 'Warehouse 4B, Industrial Area, Nairobi',
        contact: 'Samuel Driver',
        phone: '+254 700 000 000'
    )
    ->carrier(
        name: 'FastFreight Express',
        trackingNumber: 'TRK-990022',
        vehicleNo: 'KCA 123Z',
        driver: 'John Logistics'
    )
    ->addItem('Ergonomic Office Chair', qty: 10, sku: 'CHR-001', packageType: 'Crate', condition: 'Good')
    ->addItem('Standing Desk Frame', qty: 5, sku: 'DSK-002', packageType: 'Carton', condition: 'Pristine')
    ->instructions('Deliver to receiving dock 2. Inspect seal before signing.')
    ->preview();
```

---

## Fluent Configuration Options

| Method | Description |
| :--- | :--- |
| `->number(string $dnNumber)` | Delivery Note identifier. |
| `->date(string $date)` | Dispatch or delivery date. |
| `->orderNumber(string $orderNo)` | Associated sales or purchase order number. |
| `->recipient(...)` | Destination recipient details (`name`, `address`, `contact`, `phone`). |
| `->carrier(...)` | Logistics transporter details (`name`, `trackingNumber`, `vehicleNo`, `driver`). |
| `->addItem(...)` | Add package item (`name`, `qty`, `sku`, `packageType`, `condition`). |
| `->instructions(string $text)` | Special handling or delivery gate instructions. |
