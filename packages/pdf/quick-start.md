# Quick Start

## 1. Simple View or HTML Rendering

```php
use Jengo\Pdf\Pdf;

// Render a CodeIgniter view to PDF and stream download to browser
return Pdf::view('invoices/receipt_template', ['order' => $order])
    ->filename('receipt-1042.pdf')
    ->download();

// Render raw HTML string inline in browser
return Pdf::html('<h1>Hello Jengo</h1>')->inline('welcome.pdf');

// Save directly to disk or cloud storage
Pdf::view('reports/monthly', $data)->save(WRITEPATH . 'reports/october.pdf');
```
