# Testing with `Pdf::fake()`

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

## Optional Test Case Trait

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
