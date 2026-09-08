# jengo/pdf

> **Status:** Production Ready &bull; **Version:** `v1.2.0`

`jengo/pdf` is a high-performance, dual-driver PDF generation, document templating, schema reporting, and interactive browser preview engine for **CodeIgniter 4** and the **Jengo Framework**.

---

## Key Capabilities

- **Dual Driver Engine**: Seamlessly switch between **Dompdf** (pure PHP, zero system dependencies) and **Chromium** (Headless Chrome for pixel-perfect modern CSS Grid, Flexbox, Tailwind CSS, JavaScript charts, and WebFonts).
- **Pre-Built Document Builders**: Fluent, type-safe builders with beautiful templates for commercial **Invoices**, **Quotations**, **Receipts**, **Delivery Notes**, **Payslips**, **Purchase Orders**, and **Certificates**.
- **Schema-Driven Data Reports**: Automatically generate multi-page business reports from database queries, CI4 models, or entity arrays with repeating table headers, aggregates, and 7 built-in design themes.
- **Interactive In-Browser Preview**: Fullscreen canvas with dark-mode toolbar, paper format badge, live zoom controls, fit-to-width, continuous vs paginated view toggles, keyboard shortcuts, and instant print/download triggers.
- **Smart DOM Pagination**: Intelligent client-side page break and table splitting engine dividing large tables cleanly across physical millimeter sheet frames with repeating headers and footers.
- **Multi-Page Watermarks**: Render angled, centered, multi-page repeating watermarks (defaults to `'JENGO'`) across templates or custom views.
- **Zero-Dependency Vector Utilities**: Pure PHP SVG & PNG QR code and Code 128 barcode generators, plus international currency formatters.
- **Zero-Cost Testing Double (`Pdf::fake()`)**: Decoupled in-memory testing double with comprehensive assertions (`assertRendered`, `assertDownloaded`, `assertSaved`, `assertViewData`, `assertSee`).

---

## Installation

Install via Composer:

```bash
composer require jengo/pdf
```

Publish the configuration file using the Jengo Spark CLI:

```bash
php spark jengo:install pdf
```

This publishes `app/Config/Pdf.php`.

---

## Configuration (`app/Config/Pdf.php`)

```php
namespace Config;

use Jengo\Pdf\Config\Pdf as BasePdf;

class Pdf extends BasePdf
{
    /**
     * Default driver ('dompdf' or 'chromium')
     */
    public string $driver = 'dompdf';

    /**
     * Default paper format ('A4', 'Letter', 'Legal', 'A3', 'A5')
     */
    public string $paperFormat = 'A4';

    /**
     * Default orientation ('portrait' or 'landscape')
     */
    public string $orientation = 'portrait';

    /**
     * Default watermark text or configuration
     */
    public string|bool $watermark = 'JENGO';

    /**
     * Chromium driver settings
     */
    public array $chromium = [
        'binary'   => 'google-chrome-stable', // or 'chromium', 'chromium-browser'
        'timeout'  => 30,
        'temp_dir' => WRITEPATH . 'temp/pdf',
    ];
}
```

---

## Quick Start

### 1. Simple View or HTML Rendering

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

---

## Pre-Built Document Builders

`jengo/pdf` includes ready-to-use, professionally styled business documents out of the box.

### Commercial Invoice

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

### Quotation / Project Proposal

```php
return Pdf::quotation('QUO-8802')
    ->client(['name' => 'Starlight Studios', 'email' => 'contact@starlight.io'])
    ->addItem('Custom Web Application MVP', 1, 8000.00)
    ->addItem('Inertia.js Frontend Integration', 1, 2500.00)
    ->validUntil(new DateTime('+30 days'))
    ->preview();
```

### Payment Receipt & Voucher

```php
return Pdf::receipt('REC-4901')
    ->client(['name' => 'Jane Doe'])
    ->amount(1500.00, 'USD')
    ->paymentMethod('M-Pesa Express')
    ->reference('QHD7823LK9')
    ->for('Quarterly Co-working Space Subscription')
    ->download('receipt-4901.pdf');
```

### Employee Payslip

```php
return Pdf::payslip('March 2026')
    ->employee([
        'id'         => 'EMP-042',
        'name'       => 'Ian Ochieng',
        'department' => 'Engineering',
        'designation'=> 'Lead Architect',
    ])
    ->addEarning('Basic Salary', 6500.00)
    ->addEarning('House Allowance', 1200.00)
    ->addDeduction('PAYE Tax', 1450.00)
    ->addDeduction('Health Insurance (SHIF)', 220.00)
    ->download();
```

---

## Schema-Driven Data Reports

Transform database queries, CI4 models, entity collections, or arrays into formatted multi-page business reports:

```php
use Jengo\Pdf\Pdf;
use Jengo\Pdf\Schema\Column;
use Jengo\Pdf\Schema\ReportTheme;

$usersQuery = model('UserModel')->where('status', 'active');

return Pdf::fromSchema($usersQuery)
    ->title('Active System Users Report')
    ->subtitle('Generated for Q1 Audit')
    ->theme('emerald') // 'modern-blue', 'emerald', 'crimson', 'amber', 'indigo', 'slate', 'minimal-dark'
    ->columns([
        Column::make('id', '#')->width('8%')->align('center'),
        Column::make('name', 'Full Name')->width('32%'),
        Column::make('email', 'Email Address')->width('30%'),
        Column::make('created_at', 'Registered')->date('M d, Y')->width('15%'),
        Column::make('balance', 'Balance')->currency('USD')->sum()->align('right')->width('15%'),
    ])
    ->watermark('CONFIDENTIAL')
    ->preview();
```

### Custom Report Themes

```php
$customTheme = ReportTheme::make('Corporate')
    ->primary('#0f172a')
    ->secondary('#3b82f6')
    ->zebra('#f8fafc')
    ->font('Plus Jakarta Sans');

return Pdf::fromSchema($data)->theme($customTheme)->preview();
```

---

## Interactive Browser Preview

Call `->preview()` on any document, schema report, or view to render an interactive in-browser preview toolbar:

```php
return Pdf::invoice('INV-001')->preview();
```

Features included in the preview canvas:
- **Dark Mode Toolbar**: Live page navigation and status counters.
- **Smart DOM Pagination**: Dynamic splitting of tables and content into physical millimeter sheet frames.
- **Zoom Controls**: Zoom in/out, 100% reset, and Fit-to-Width.
- **Display Modes**: Toggle between multi-page sheet view and continuous scrolling.
- **Keyboard Shortcuts**:
  - `Ctrl + P` / `Cmd + P`: Instant print.
  - `Ctrl + S` / `Cmd + S`: Direct PDF download.
  - `+` / `-`: Zoom in / Zoom out.
  - `0`: Reset Zoom.

---

## Vector Utilities

### QR Codes

```php
// Pure PHP vector QR code SVG
$qrSvg = pdf_qr_code('https://jengophp.com', size: 140);

// Base64 PNG data URI for <img> tags
$qrUri = pdf_qr_data_uri('https://jengophp.com');
```

### Barcodes (Code 128)

```php
// Pure PHP vector Barcode
$barcodeSvg = pdf_barcode('INV-2026-9901', height: 45);

// Base64 PNG data URI
$barcodeUri = pdf_barcode_data_uri('INV-2026-9901');
```

### Watermarks

```php
// Custom view watermark tag
echo pdf_watermark('CONFIDENTIAL', opacity: 0.08, color: '#dc2626', angle: -35);
```

---

## Testing with `Pdf::fake()`

Test PDF controllers without generating physical files or launching headless browsers:

```php
use Jengo\Pdf\Pdf;
use Tests\TestCase;

class InvoiceControllerTest extends TestCase
{
    public function testInvoiceDownload(): void
    {
        // 1. Activate in-memory testing fake
        $fake = Pdf::fake();

        // 2. Perform controller action
        $this->get('/invoices/101/download');

        // 3. Assertions
        $fake->assertDownloaded('invoice-101.pdf');
        $fake->assertCount(1);
    }
}
```

### Optional Test Case Trait

```php
use Jengo\Pdf\Testing\Concerns\PdfTestAssertionsTrait;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use PdfTestAssertionsTrait;

    public function testMonthlyReport(): void
    {
        $this->pdfFake();

        $this->get('/reports/monthly');

        $this->assertPdfRendered('reports/monthly_template');
        $this->assertPdfViewData('period', 'October 2026');
        $this->assertPdfCount(1);
    }
}
```

---

## Global Helper

```php
// Start document builder fluently
return pdf()->invoice('INV-001')->download();

// Render view
return pdf('invoices/receipt', $data)->inline();
```
