# Attaching Filters & the `onFilter` Handler

Attach filters using `->withFilters()` and define a reactive callback via `->onFilter()`. The callback receives the submitted filter values array and the `PdfDocument` instance, giving you full control to mutate data, orientation, watermarks, or styling dynamically:

```php
use Jengo\Pdf\Pdf;
use Jengo\Pdf\PdfDocument;
use Jengo\Pdf\Support\Filter;

return Pdf::view('reports/sales_summary', ['records' => $initialRecords])
    ->withFilters([
        Filter::search('query', 'Search Records'),
        Filter::select('region', 'Sales Region', [
            'all'   => 'All Regions',
            'emea'  => 'EMEA',
            'apac'  => 'APAC',
            'na'    => 'North America',
        ]),
        Filter::dateRange('period', 'Reporting Period'),
    ])
    ->onFilter(function (array $filters, PdfDocument $doc): void {
        $query = model('SalesModel');

        if (!empty($filters['query'])) {
            $query->like('description', $filters['query']);
        }

        if (!empty($filters['region']) && $filters['region'] !== 'all') {
            $query->where('region', $filters['region']);
        }

        if (!empty($filters['period']['from'])) {
            $query->where('created_at >=', $filters['period']['from'] . ' 00:00:00');
        }

        if (!empty($filters['period']['to'])) {
            $query->where('created_at <=', $filters['period']['to'] . ' 23:59:59');
        }

        $records = $query->findAll();

        // Mutate document view data
        $doc->viewData(['records' => $records]);

        // Dynamically adjust orientation or watermark based on filter selections
        if (count($records) > 50) {
            $doc->landscape();
        }
    })
    ->preview();
```

> [!NOTE]
> When `onFilter()` returns an associative array, the array is automatically merged into `$doc->viewData()`. You can either mutate `$doc` directly or return the updated data array.
