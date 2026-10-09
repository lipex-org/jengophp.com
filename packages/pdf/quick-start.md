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

// Save directly to local filesystem
Pdf::view('reports/monthly', $data)->save(WRITEPATH . 'reports/october.pdf');

// Save to Jengo Storage disk (e.g. S3, local, memory)
Pdf::view('reports/monthly', $data)->store('reports/october.pdf', disk: 's3');

// Render and store in background queue asynchronously via jengo/queues
Pdf::view('reports/monthly', $data)->storeAsync('reports/october.pdf', disk: 's3');
```
