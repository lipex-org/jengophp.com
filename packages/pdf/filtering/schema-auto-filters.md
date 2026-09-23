# Schema Report Auto-Filters

Schema-driven reports can automatically discover and bind filter controls based on their declared columns using `->withAutoFilters()`:

```php
use Jengo\Pdf\Pdf;
use Jengo\Pdf\Schema\Column;

$dataset = model('OrderModel')->findAll();

return Pdf::fromSchema($dataset)
    ->title('Order Summary Report')
    ->columns([
        Column::make('order_num', 'Order #')->width('15%'),
        Column::make('customer', 'Customer Name')->width('30%'),
        Column::make('created_at', 'Order Date')->date('Y-m-d')->width('20%'),
        Column::make('status', 'Status')->badge([
            'completed' => 'success',
            'pending'   => 'warning',
            'cancelled' => 'danger',
        ])->width('15%'),
        Column::make('total', 'Total')->currency('USD')->sum()->width('20%'),
    ])
    ->withAutoFilters()
    ->preview();
```

## When `->withAutoFilters()` Is Called

1. A **Search** filter is automatically generated to query all scalar columns.
2. A **Date Range** filter is created for every column formatted as a date/datetime or named `created_at`, `updated_at`, `date`, etc.
3. A **Select** filter is created for every column that defines a `badge()` status mapping.
4. An in-memory filter callback is automatically registered to filter rows and recalculate column aggregates (sums, averages, counts, min, max) in real time.

You can still provide custom `->onFilter()` callbacks or combine explicit filters via `->withFilters([...])` with `->withAutoFilters()`.
